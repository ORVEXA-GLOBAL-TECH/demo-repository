package com.alleviare.field;

import com.alleviare.common.ApiException;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
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

/** Daily Call Reports. Each call is a row in visits, grouped under one dcr_report per employee per day. */
@RestController
@RequestMapping("/api/v1/dcr")
public class DcrController {

    record CallRequest(@NotNull String targetType, @NotNull UUID targetId, LocalDate date, String purpose,
                       String feedback, BigDecimal lat, BigDecimal lng, List<UUID> productIds) {}

    record StatusRequest(@NotNull String status, String remarks) {}

    private static final Set<String> STATUSES = Set.of("SUBMITTED", "APPROVED", "REJECTED");

    private final JdbcClient db;
    private final Scope scope;

    public DcrController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('dcr.view') or hasAuthority('*')")
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String targetType,
                                    @RequestParam(required = false) LocalDate date) {
        List<Map<String, Object>> rows = db.sql("""
                SELECT v.id, to_char(v.visit_date, 'YYYY-MM-DD') AS date, v.visit_type AS "targetType",
                       COALESCE(d.name, c.name) AS "targetName", v.purpose, v.remarks AS feedback, v.status,
                       v.latitude AS lat, v.longitude AS lng, e.first_name || ' ' || e.last_name AS "mrName"
                  FROM public.visits v
                  JOIN public.employees e ON e.id = v.employee_id
                  LEFT JOIN public.doctors d ON d.id = v.doctor_id
                  LEFT JOIN public.chemists c ON c.id = v.chemist_id
                 WHERE v.company_id = :c
                   AND (CAST(:emp AS uuid) IS NULL OR v.employee_id = CAST(:emp AS uuid))
                   AND (CAST(:s AS text) IS NULL OR v.status = CAST(:s AS text))
                   AND (CAST(:t AS text) IS NULL OR v.visit_type = CAST(:t AS text))
                   AND (CAST(:d AS date) IS NULL OR v.visit_date = CAST(:d AS date))
                 ORDER BY v.visit_date DESC, v.visit_time DESC
                """)
            .param("c", scope.companyId()).param("emp", scope.filterEmployee())
            .param("s", status == null || status.equals("ALL") ? null : status)
            .param("t", targetType == null || targetType.equals("ALL") ? null : targetType)
            .param("d", date)
            .query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @PreAuthorize("hasAuthority('dcr.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody CallRequest r) {
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();
        String type = r.targetType().toUpperCase();
        if (!type.equals("DOCTOR") && !type.equals("CHEMIST")) throw new ApiException(400, "BAD_TARGET", "targetType must be DOCTOR or CHEMIST");
        String table = type.equals("DOCTOR") ? "doctors" : "chemists";
        boolean exists = db.sql("SELECT count(*) FROM public." + table + " WHERE id = :id AND company_id = :c")
            .param("id", r.targetId()).param("c", company).query(Integer.class).single() > 0;
        if (!exists) throw new ApiException(400, "UNKNOWN_TARGET", "Unknown " + type.toLowerCase());
        LocalDate date = r.date() == null ? LocalDate.now() : r.date();

        UUID report = db.sql("""
                INSERT INTO public.dcr_reports (company_id, employee_id, dcr_date, total_calls, status)
                VALUES (:c, :e, :d, 1, 'SUBMITTED')
                ON CONFLICT (company_id, employee_id, dcr_date)
                DO UPDATE SET total_calls = public.dcr_reports.total_calls + 1, updated_at = now()
                RETURNING id
                """).param("c", company).param("e", employee).param("d", date).query(UUID.class).single();

        UUID visit = db.sql("""
                INSERT INTO public.visits (company_id, employee_id, dcr_report_id, doctor_id, chemist_id, visit_type,
                                           visit_date, latitude, longitude, purpose, remarks, status)
                VALUES (:c, :e, :r, :doc, :chem, :t, :d, :lat, :lng, :p, :f, 'SUBMITTED') RETURNING id
                """)
            .param("c", company).param("e", employee).param("r", report)
            .param("doc", type.equals("DOCTOR") ? r.targetId() : null)
            .param("chem", type.equals("CHEMIST") ? r.targetId() : null)
            .param("t", type).param("d", date).param("lat", r.lat()).param("lng", r.lng())
            .param("p", r.purpose()).param("f", r.feedback()).query(UUID.class).single();

        if (r.productIds() != null) {
            for (UUID p : r.productIds()) {
                db.sql("""
                        INSERT INTO public.visit_products (visit_id, product_id)
                        SELECT :v, id FROM public.products WHERE id = :p AND company_id = :c
                        """).param("v", visit).param("p", p).param("c", company).update();
            }
        }
        return Map.of("success", true, "data", Map.of("id", visit, "date", date.toString(), "status", "SUBMITTED"));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    @PreAuthorize("hasAuthority('dcr.approve') or hasAuthority('*')")
    public Map<String, Object> setStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest r) {
        if (!STATUSES.contains(r.status())) throw new ApiException(400, "BAD_STATUS", "Unknown status " + r.status());
        UUID report = db.sql("UPDATE public.visits SET status = :s, updated_at = now() WHERE id = :id AND company_id = :c RETURNING dcr_report_id")
            .param("s", r.status()).param("id", id).param("c", scope.companyId())
            .query(UUID.class).optional().orElseThrow(() -> new ApiException(404, "NOT_FOUND", "DCR record not found"));
        db.sql("""
                UPDATE public.dcr_reports SET status = :s, updated_at = now()
                 WHERE id = :r AND NOT EXISTS (SELECT 1 FROM public.visits WHERE dcr_report_id = :r AND status <> :s)
                """).param("s", r.status()).param("r", report).update();
        return Map.of("success", true, "data", Map.of("id", id, "status", r.status()));
    }
}
