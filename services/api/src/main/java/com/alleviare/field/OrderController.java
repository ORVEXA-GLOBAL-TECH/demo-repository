package com.alleviare.field;

import com.alleviare.common.ApiException;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    record Line(@NotNull UUID productId, @Min(1) int qty) {}

    record OrderRequest(UUID chemistId, UUID stockistId, BigDecimal discountPercent, String remarks,
                        @NotEmpty List<@Valid Line> items) {}

    record StatusRequest(@NotNull String status) {}

    static final Set<String> STATUSES = Set.of("PENDING_APPROVAL", "APPROVED", "REJECTED", "SHIPPED", "DELIVERED");

    private final JdbcClient db;
    private final Scope scope;

    public OrderController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('order.view') or hasAuthority('*')")
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String search) {
        List<Map<String, Object>> rows = db.sql("""
                SELECT o.id, o.order_number AS "orderNumber", to_char(o.order_date, 'YYYY-MM-DD') AS "orderDate",
                       o.total_amount AS "netAmount", o.status, o.remarks,
                       e.first_name || ' ' || e.last_name AS "mrName",
                       c.name AS "chemistName", s.name AS "stockistName"
                  FROM public.orders o
                  JOIN public.employees e ON e.id = o.employee_id
                  LEFT JOIN public.chemists c ON c.id = o.chemist_id
                  LEFT JOIN public.distributors s ON s.id = o.distributor_id
                 WHERE o.company_id = :company
                   AND (CAST(:emp AS uuid) IS NULL OR o.employee_id = CAST(:emp AS uuid))
                   AND (CAST(:status AS text) IS NULL OR o.status = CAST(:status AS text))
                   AND (CAST(:q AS text) IS NULL OR o.order_number ILIKE CAST(:q AS text) OR c.name ILIKE CAST(:q AS text)
                        OR s.name ILIKE CAST(:q AS text))
                 ORDER BY o.created_at DESC
                """)
            .param("company", scope.companyId())
            .param("emp", scope.filterEmployee())
            .param("status", status == null || status.equals("ALL") ? null : status)
            .param("q", search == null || search.isBlank() ? null : "%" + search.trim() + "%")
            .query().listOfRows();
        List<Map<String, Object>> data = attachItems(rows);
        return Map.of("success", true, "count", data.size(), "data", data);
    }

    private List<Map<String, Object>> attachItems(List<Map<String, Object>> orders) {
        if (orders.isEmpty()) return orders;
        UUID[] ids = orders.stream().map(o -> (UUID) o.get("id")).toArray(UUID[]::new);
        List<Map<String, Object>> items = db.sql("""
                SELECT i.order_id AS "orderId", i.product_id AS "productId", p.name AS "productName",
                       i.quantity AS qty, i.unit_price AS ptr, i.total_price AS amount
                  FROM public.order_items i JOIN public.products p ON p.id = i.product_id
                 WHERE i.order_id = ANY(:ids) ORDER BY i.created_at
                """).param("ids", ids).query().listOfRows();
        Map<Object, List<Map<String, Object>>> byOrder = new HashMap<>();
        for (var i : items) byOrder.computeIfAbsent(i.get("orderId"), k -> new ArrayList<>()).add(i);
        List<Map<String, Object>> out = new ArrayList<>();
        for (var o : orders) {
            Map<String, Object> copy = new HashMap<>(o);
            copy.put("items", byOrder.getOrDefault(copy.get("id"), List.of()));
            out.add(copy);
        }
        return out;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @PreAuthorize("hasAuthority('order.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody OrderRequest r) {
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();

        // Prices always come from the product master, never from the client.
        BigDecimal gross = BigDecimal.ZERO;
        List<Object[]> lines = new ArrayList<>();
        for (Line l : r.items()) {
            BigDecimal ptr = db.sql("SELECT ptr FROM public.products WHERE id = :id AND company_id = :c AND is_active")
                .param("id", l.productId()).param("c", company).query(BigDecimal.class).optional()
                .orElseThrow(() -> new ApiException(400, "UNKNOWN_PRODUCT", "Unknown product: " + l.productId()));
            BigDecimal total = ptr.multiply(BigDecimal.valueOf(l.qty()));
            gross = gross.add(total);
            lines.add(new Object[] {l.productId(), l.qty(), ptr, total});
        }
        BigDecimal discount = r.discountPercent() == null ? BigDecimal.ZERO : r.discountPercent();
        if (discount.signum() < 0 || discount.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ApiException(400, "BAD_DISCOUNT", "discountPercent must be between 0 and 100");
        }
        BigDecimal net = gross.subtract(gross.multiply(discount).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
            .setScale(2, RoundingMode.HALF_UP);

        checkOwned("chemists", r.chemistId(), company);
        checkOwned("distributors", r.stockistId(), company);

        String prefix = db.sql("SELECT upper(code) FROM public.companies WHERE id = :c").param("c", company).query(String.class).single();
        String number = prefix + "-" + java.time.Year.now() + "-" + ThreadLocalRandom.current().nextInt(100000, 1000000);
        UUID id = db.sql("""
                INSERT INTO public.orders (company_id, employee_id, chemist_id, distributor_id, order_number,
                                           total_amount, status, remarks, metadata)
                VALUES (:c, :e, :chem, :stk, :num, :net, 'PENDING_APPROVAL', :rem,
                        jsonb_build_object('grossAmount', CAST(:gross AS numeric), 'discountPercent', CAST(:disc AS numeric)))
                RETURNING id
                """)
            .param("c", company).param("e", employee).param("chem", r.chemistId()).param("stk", r.stockistId())
            .param("num", number).param("net", net).param("rem", r.remarks()).param("gross", gross).param("disc", discount)
            .query(UUID.class).single();
        for (Object[] l : lines) {
            db.sql("INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (:o,:p,:q,:u,:t)")
                .param("o", id).param("p", l[0]).param("q", l[1]).param("u", l[2]).param("t", l[3]).update();
        }
        return Map.of("success", true, "data", Map.of("id", id, "orderNumber", number, "netAmount", net,
            "grossAmount", gross, "status", "PENDING_APPROVAL"));
    }

    private void checkOwned(String table, UUID id, UUID company) {
        if (id == null) return;
        boolean ok = db.sql("SELECT count(*) FROM public." + table + " WHERE id = :id AND company_id = :c")
            .param("id", id).param("c", company).query(Integer.class).single() > 0;
        if (!ok) throw new ApiException(400, "UNKNOWN_REFERENCE", "Unknown " + table + " id");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('order.approve') or hasAuthority('*')")
    public Map<String, Object> setStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest r) {
        if (!STATUSES.contains(r.status())) throw new ApiException(400, "BAD_STATUS", "Unknown status " + r.status());
        int n = db.sql("UPDATE public.orders SET status = :s, approved_by_id = :a, updated_at = now() WHERE id = :id AND company_id = :c")
            .param("s", r.status()).param("a", scope.employeeId()).param("id", id).param("c", scope.companyId()).update();
        if (n == 0) throw new ApiException(404, "NOT_FOUND", "Order not found");
        return Map.of("success", true, "data", Map.of("id", id, "status", r.status()));
    }
}
