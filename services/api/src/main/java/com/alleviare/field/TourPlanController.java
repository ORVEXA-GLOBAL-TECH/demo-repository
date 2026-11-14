package com.alleviare.field;

import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tour-plans")
public class TourPlanController {

    record PlanRequest(@NotNull LocalDate date, @NotBlank String route, String objective, Integer targetDoctors) {}

    private final JdbcClient db;
    private final Scope scope;

    public TourPlanController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('tour.view') or hasAuthority('*')")
    public Map<String, Object> list() {
        List<Map<String, Object>> rows = db.sql("""
                SELECT i.id, to_char(i.plan_date, 'YYYY-MM-DD') AS date, i.route_name AS route, i.objective,
                       i.target_doctor_count AS "targetDoctors", p.status, p.month, p.year,
                       e.first_name || ' ' || e.last_name AS "mrName"
                  FROM public.tour_plan_items i
                  JOIN public.tour_plans p ON p.id = i.tour_plan_id
                  JOIN public.employees e ON e.id = p.employee_id
                 WHERE p.company_id = :c AND (CAST(:emp AS uuid) IS NULL OR p.employee_id = CAST(:emp AS uuid))
                 ORDER BY i.plan_date DESC
                """).param("c", scope.companyId()).param("emp", scope.filterEmployee()).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @PreAuthorize("hasAuthority('tour.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody PlanRequest r) {
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();
        UUID plan = db.sql("""
                INSERT INTO public.tour_plans (company_id, employee_id, month, year, status)
                VALUES (:c, :e, :m, :y, 'SUBMITTED')
                ON CONFLICT (company_id, employee_id, month, year) DO UPDATE SET updated_at = now() RETURNING id
                """).param("c", company).param("e", employee).param("m", r.date().getMonthValue())
            .param("y", r.date().getYear()).query(UUID.class).single();
        UUID item = db.sql("""
                INSERT INTO public.tour_plan_items (tour_plan_id, plan_date, route_name, objective, target_doctor_count)
                VALUES (:p, :d, :route, :o, :t) RETURNING id
                """).param("p", plan).param("d", r.date()).param("route", r.route().trim()).param("o", r.objective())
            .param("t", r.targetDoctors() == null ? 0 : r.targetDoctors()).query(UUID.class).single();
        return Map.of("success", true, "data", Map.of("id", item, "date", r.date().toString(), "status", "SUBMITTED"));
    }
}
