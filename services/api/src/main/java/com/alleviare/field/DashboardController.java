package com.alleviare.field;

import com.alleviare.common.Current;
import com.alleviare.common.Scope;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * KPI summary computed live from the database. The audience is decided by the caller's token:
 * an MR sees personal numbers, every other role sees company-wide numbers.
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final JdbcClient db;
    private final Scope scope;

    public DashboardController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('dashboard.view') or hasAuthority('*')")
    public Map<String, Object> summary() {
        UUID company = scope.companyId();
        UUID emp = scope.filterEmployee();

        Map<String, Object> m = new HashMap<>(db.sql("""
                SELECT
                  (SELECT count(*) FROM public.doctors WHERE company_id = :c) AS "doctors",
                  (SELECT count(*) FROM public.chemists WHERE company_id = :c) AS "chemists",
                  (SELECT count(*) FROM public.orders WHERE company_id = :c AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "orders",
                  (SELECT count(*) FROM public.orders WHERE company_id = :c AND status = 'PENDING_APPROVAL'
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "pendingOrders",
                  (SELECT COALESCE(sum(total_amount), 0) FROM public.orders WHERE company_id = :c AND status <> 'REJECTED'
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "revenue",
                  (SELECT count(*) FROM public.expense_claims WHERE company_id = :c AND status = 'SUBMITTED'
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "pendingExpenses",
                  (SELECT count(*) FROM public.visits WHERE company_id = :c AND status = 'SUBMITTED'
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "pendingDcr",
                  (SELECT count(*) FROM public.visits WHERE company_id = :c
                        AND date_trunc('month', visit_date) = date_trunc('month', CURRENT_DATE)
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "callsThisMonth",
                  (SELECT count(*) FROM public.attendance WHERE company_id = :c AND date = CURRENT_DATE
                        AND (CAST(:e AS uuid) IS NULL OR employee_id = CAST(:e AS uuid))) AS "presentToday",
                  (SELECT count(*) FROM public.employees WHERE company_id = :c AND status = 'ACTIVE') AS "activeEmployees"
                """).param("c", company).param("e", emp).query().singleRow());

        List<Map<String, Object>> recentOrders = db.sql("""
                SELECT o.order_number AS "orderNumber", o.total_amount AS "netAmount", o.status, c.name AS "chemistName"
                  FROM public.orders o LEFT JOIN public.chemists c ON c.id = o.chemist_id
                 WHERE o.company_id = :c AND (CAST(:e AS uuid) IS NULL OR o.employee_id = CAST(:e AS uuid))
                 ORDER BY o.created_at DESC LIMIT 5
                """).param("c", company).param("e", emp).query().listOfRows();

        return Map.of("success", true, "role", Current.principal().role(), "scope", emp == null ? "COMPANY" : "SELF",
            "metrics", m, "recentOrders", recentOrders);
    }
}
