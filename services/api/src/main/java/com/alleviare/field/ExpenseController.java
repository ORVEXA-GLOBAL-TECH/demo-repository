package com.alleviare.field;

import com.alleviare.common.ApiException;
import com.alleviare.common.AppProperties;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
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
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    record ClaimRequest(LocalDate date, BigDecimal travelKm, BigDecimal fareRatePerKm, BigDecimal dailyAllowance,
                        BigDecimal hotelCharges, BigDecimal miscCharges, String description) {}

    record DecisionRequest(@NotNull String status, String remarks) {}

    private static final Set<String> DECISIONS = Set.of("APPROVED", "REJECTED");

    private final JdbcClient db;
    private final Scope scope;
    private final AppProperties props;

    public ExpenseController(JdbcClient db, Scope scope, AppProperties props) {
        this.db = db;
        this.scope = scope;
        this.props = props;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('expense.view') or hasAuthority('*')")
    public Map<String, Object> list(@RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = db.sql("""
                SELECT x.id, x.claim_number AS "claimNumber", to_char(x.claim_date, 'YYYY-MM-DD') AS date,
                       x.total_amount AS "totalClaimAmount", x.status, x.rejection_reason AS "managerRemarks",
                       x.metadata AS "details", e.first_name || ' ' || e.last_name AS "mrName"
                  FROM public.expense_claims x JOIN public.employees e ON e.id = x.employee_id
                 WHERE x.company_id = :c
                   AND (CAST(:emp AS uuid) IS NULL OR x.employee_id = CAST(:emp AS uuid))
                   AND (CAST(:s AS text) IS NULL OR x.status = CAST(:s AS text))
                 ORDER BY x.created_at DESC
                """)
            .param("c", scope.companyId()).param("emp", scope.filterEmployee())
            .param("s", status == null || status.equals("ALL") ? null : status)
            .query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    private static BigDecimal or0(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @PreAuthorize("hasAuthority('expense.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody ClaimRequest r) {
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();
        BigDecimal rate = r.fareRatePerKm() == null ? props.expense().defaultRatePerKm() : r.fareRatePerKm();
        Map<String, BigDecimal> parts = new LinkedHashMap<>();
        parts.put("TRAVEL", or0(r.travelKm()).multiply(rate));
        parts.put("DAILY_ALLOWANCE", r.dailyAllowance() == null ? props.expense().defaultDailyAllowance() : r.dailyAllowance());
        parts.put("HOTEL", or0(r.hotelCharges()));
        parts.put("MISC", or0(r.miscCharges()));
        parts.values().forEach(v -> {
            if (v.signum() < 0) throw new ApiException(400, "NEGATIVE_AMOUNT", "Amounts cannot be negative");
        });
        BigDecimal total = parts.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.signum() == 0) throw new ApiException(400, "EMPTY_CLAIM", "A claim needs at least one amount");
        LocalDate date = r.date() == null ? LocalDate.now() : r.date();

        String number = "EXP-" + date.getYear() + "-" + ThreadLocalRandom.current().nextInt(100000, 1000000);
        UUID id = db.sql("""
                INSERT INTO public.expense_claims (company_id, employee_id, claim_number, claim_date, total_amount, status, metadata)
                VALUES (:c, :e, :n, :d, :t, 'SUBMITTED',
                        jsonb_build_object('travelKm', CAST(:km AS numeric), 'fareRatePerKm', CAST(:rate AS numeric),
                                           'description', CAST(:desc AS text)))
                RETURNING id
                """)
            .param("c", company).param("e", employee).param("n", number).param("d", date).param("t", total)
            .param("km", or0(r.travelKm())).param("rate", rate).param("desc", r.description()).query(UUID.class).single();

        for (var part : parts.entrySet()) {
            if (part.getValue().signum() == 0) continue;
            UUID category = db.sql("""
                    INSERT INTO public.expense_categories (company_id, code, name) VALUES (:c, :code, :name)
                    ON CONFLICT (company_id, code) DO UPDATE SET name = public.expense_categories.name RETURNING id
                    """)
                .param("c", company).param("code", part.getKey()).param("name", part.getKey().replace('_', ' '))
                .query(UUID.class).single();
            db.sql("INSERT INTO public.expense_items (claim_id, category_id, expense_date, amount) VALUES (:cl,:cat,:d,:a)")
                .param("cl", id).param("cat", category).param("d", date).param("a", part.getValue()).update();
        }
        return Map.of("success", true, "data", Map.of("id", id, "claimNumber", number, "totalClaimAmount", total, "status", "SUBMITTED"));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    @PreAuthorize("hasAuthority('expense.approve') or hasAuthority('*')")
    public Map<String, Object> decide(@PathVariable UUID id, @Valid @RequestBody DecisionRequest r) {
        if (!DECISIONS.contains(r.status())) throw new ApiException(400, "BAD_STATUS", "Status must be APPROVED or REJECTED");
        UUID approver = scope.employeeId();
        UUID claimant = db.sql("SELECT employee_id FROM public.expense_claims WHERE id = :id AND company_id = :c")
            .param("id", id).param("c", scope.companyId()).query(UUID.class).optional()
            .orElseThrow(() -> new ApiException(404, "NOT_FOUND", "Expense claim not found"));
        if (approver != null && approver.equals(claimant)) {
            throw new ApiException(403, "SELF_APPROVAL", "You cannot approve your own claim.");
        }
        db.sql("""
                UPDATE public.expense_claims
                   SET status = :s, approved_by_id = :a, updated_at = now(),
                       approved_amount = CASE WHEN CAST(:s AS text) = 'APPROVED' THEN total_amount ELSE 0 END,
                       rejection_reason = CASE WHEN CAST(:s AS text) = 'REJECTED' THEN CAST(:rem AS text) ELSE rejection_reason END
                 WHERE id = :id
                """).param("s", r.status()).param("a", approver).param("rem", r.remarks()).param("id", id).update();
        if (approver != null) {
            db.sql("""
                    INSERT INTO public.expense_approvals (claim_id, approver_id, action, approved_amount, remarks)
                    SELECT id, :a, :s, CASE WHEN CAST(:s AS text) = 'APPROVED' THEN total_amount END, :rem
                      FROM public.expense_claims WHERE id = :id
                    """).param("a", approver).param("s", r.status()).param("rem", r.remarks()).param("id", id).update();
        }
        return Map.of("success", true, "data", Map.of("id", id, "status", r.status()));
    }
}
