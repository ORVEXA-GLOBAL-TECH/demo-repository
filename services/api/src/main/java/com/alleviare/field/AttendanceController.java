package com.alleviare.field;

import com.alleviare.common.ApiException;
import com.alleviare.common.AppProperties;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    record PunchRequest(BigDecimal lat, BigDecimal lng, String locationName) {}

    record LeaveRequest(@NotNull String leaveType, @NotNull LocalDate fromDate, @NotNull LocalDate toDate, String reason) {}

    record LeaveDecision(@NotNull String status, String remarks) {}

    private static final String TZ = "COALESCE((SELECT timezone FROM public.companies WHERE id = a.company_id), 'UTC')";

    private final JdbcClient db;
    private final Scope scope;
    private final AppProperties props;

    public AttendanceController(JdbcClient db, Scope scope, AppProperties props) {
        this.db = db;
        this.scope = scope;
        this.props = props;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('attendance.view') or hasAuthority('*')")
    public Map<String, Object> list() {
        List<Map<String, Object>> rows = db.sql("""
                SELECT a.id, to_char(a.date, 'YYYY-MM-DD') AS date, a.status,
                       to_char(a.check_in_time AT TIME ZONE %1$s, 'HH12:MI AM') AS "punchInTime",
                       to_char(a.check_out_time AT TIME ZONE %1$s, 'HH12:MI AM') AS "punchOutTime",
                       a.total_hours AS "totalHours", a.metadata->>'locationIn' AS "punchInLocation",
                       a.metadata->>'locationOut' AS "punchOutLocation",
                       e.first_name || ' ' || e.last_name AS "mrName"
                  FROM public.attendance a JOIN public.employees e ON e.id = a.employee_id
                 WHERE a.company_id = :c AND (CAST(:emp AS uuid) IS NULL OR a.employee_id = CAST(:emp AS uuid))
                 ORDER BY a.date DESC, a.check_in_time DESC LIMIT 60
                """.formatted(TZ))
            .param("c", scope.companyId()).param("emp", scope.filterEmployee()).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping("/punch-in")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('attendance.create') or hasAuthority('*')")
    public Map<String, Object> punchIn(@RequestBody(required = false) PunchRequest r) {
        UUID employee = scope.requireEmployeeId();
        String loc = r == null || r.locationName() == null ? "Field location" : r.locationName();
        UUID id = db.sql("""
                INSERT INTO public.attendance (company_id, employee_id, date, status, check_in_time, check_in_lat, check_in_lng, metadata)
                VALUES (:c, :e, CURRENT_DATE, 'PRESENT_FIELD', now(), :lat, :lng, jsonb_build_object('locationIn', CAST(:loc AS text)))
                ON CONFLICT (company_id, employee_id, date) DO NOTHING RETURNING id
                """)
            .param("c", scope.companyId()).param("e", employee).param("lat", r == null ? null : r.lat())
            .param("lng", r == null ? null : r.lng()).param("loc", loc)
            .query(UUID.class).optional().orElseThrow(() -> new ApiException(409, "ALREADY_PUNCHED_IN", "Already punched in today"));
        return Map.of("success", true, "data", Map.of("id", id, "status", "PRESENT_FIELD"));
    }

    @PostMapping("/punch-out")
    @PreAuthorize("hasAuthority('attendance.create') or hasAuthority('*')")
    public Map<String, Object> punchOut(@RequestBody(required = false) PunchRequest r) {
        UUID employee = scope.requireEmployeeId();
        var row = db.sql("""
                UPDATE public.attendance
                   SET check_out_time = now(), check_out_lat = :lat, check_out_lng = :lng,
                       total_hours = round((extract(epoch FROM (now() - check_in_time)) / 3600)::numeric, 2),
                       metadata = metadata || jsonb_build_object('locationOut', CAST(:loc AS text)), updated_at = now()
                 WHERE company_id = :c AND employee_id = :e AND date = CURRENT_DATE AND check_out_time IS NULL
                RETURNING id, total_hours AS "totalHours"
                """)
            .param("c", scope.companyId()).param("e", employee).param("lat", r == null ? null : r.lat())
            .param("lng", r == null ? null : r.lng()).param("loc", r == null || r.locationName() == null ? "Field location" : r.locationName())
            .query().listOfRows().stream().findFirst()
            .orElseThrow(() -> new ApiException(409, "NO_OPEN_PUNCH_IN", "No open punch-in found for today"));
        return Map.of("success", true, "data", row);
    }

    // ---- leave ----

    private void ensureLeaveTypes(UUID company) {
        props.leave().defaults().forEach((code, q) ->
            db.sql("INSERT INTO public.leave_types (company_id, code, name, annual_quota) VALUES (:c,:code,:n,:q) ON CONFLICT (company_id, code) DO NOTHING")
                .param("c", company).param("code", code).param("n", q.name()).param("q", q.days()).update());
    }

    @GetMapping("/leave/summary")
    @PreAuthorize("hasAuthority('leave.view') or hasAuthority('*')")
    public Map<String, Object> leaveSummary() {
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();
        ensureLeaveTypes(company);
        List<Map<String, Object>> balances = db.sql("""
                SELECT lt.code, lt.name, lt.annual_quota AS total,
                       COALESCE(SUM(lr.total_days) FILTER (WHERE lr.status = 'APPROVED'
                         AND date_part('year', lr.start_date) = date_part('year', CURRENT_DATE)), 0)::int AS used
                  FROM public.leave_types lt
                  LEFT JOIN public.leave_requests lr ON lr.leave_type_id = lt.id AND lr.employee_id = :e
                 WHERE lt.company_id = :c GROUP BY lt.code, lt.name, lt.annual_quota ORDER BY lt.code
                """).param("c", company).param("e", employee).query().listOfRows();
        List<Map<String, Object>> requests = db.sql("""
                SELECT lr.id, lt.name AS "leaveType", to_char(lr.start_date, 'YYYY-MM-DD') AS "fromDate",
                       to_char(lr.end_date, 'YYYY-MM-DD') AS "toDate", lr.total_days AS days, lr.reason, lr.status
                  FROM public.leave_requests lr LEFT JOIN public.leave_types lt ON lt.id = lr.leave_type_id
                 WHERE lr.employee_id = :e ORDER BY lr.created_at DESC LIMIT 20
                """).param("e", employee).query().listOfRows();
        return Map.of("success", true, "balances", balances, "requests", requests);
    }

    @PostMapping("/leave/requests")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @PreAuthorize("hasAuthority('leave.create') or hasAuthority('*')")
    public Map<String, Object> requestLeave(@Valid @RequestBody LeaveRequest r) {
        if (r.toDate().isBefore(r.fromDate())) throw new ApiException(400, "BAD_DATES", "toDate cannot be before fromDate");
        UUID company = scope.companyId();
        UUID employee = scope.requireEmployeeId();
        ensureLeaveTypes(company);
        long days = ChronoUnit.DAYS.between(r.fromDate(), r.toDate()) + 1;
        UUID type = db.sql("SELECT id FROM public.leave_types WHERE company_id = :c AND (lower(code) = lower(:t) OR lower(name) = lower(:t))")
            .param("c", company).param("t", r.leaveType().trim()).query(UUID.class).optional()
            .orElseThrow(() -> new ApiException(400, "UNKNOWN_LEAVE_TYPE", "Unknown leave type: " + r.leaveType()));
        UUID id = db.sql("""
                INSERT INTO public.leave_requests (company_id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status)
                VALUES (:c, :e, :lt, :f, :t, :d, :r, 'PENDING') RETURNING id
                """).param("c", company).param("e", employee).param("lt", type).param("f", r.fromDate()).param("t", r.toDate())
            .param("d", (int) days).param("r", r.reason()).query(UUID.class).single();
        return Map.of("success", true, "data", Map.of("id", id, "days", days, "status", "PENDING"));
    }

    @PatchMapping("/leave/requests/{id}")
    @PreAuthorize("hasAuthority('leave.approve') or hasAuthority('*')")
    public Map<String, Object> decideLeave(@PathVariable UUID id, @Valid @RequestBody LeaveDecision d) {
        if (!d.status().equals("APPROVED") && !d.status().equals("REJECTED")) {
            throw new ApiException(400, "BAD_STATUS", "Status must be APPROVED or REJECTED");
        }
        UUID approver = scope.employeeId();
        int n = db.sql("""
                UPDATE public.leave_requests SET status = :s, approved_by_id = :a, rejection_reason = :rem, updated_at = now()
                 WHERE id = :id AND company_id = :c AND employee_id <> COALESCE(CAST(:a AS uuid), '00000000-0000-0000-0000-000000000000'::uuid)
                """).param("s", d.status()).param("a", approver).param("rem", d.remarks()).param("id", id)
            .param("c", scope.companyId()).update();
        if (n == 0) throw new ApiException(404, "NOT_FOUND", "Leave request not found (or it is your own)");
        return Map.of("success", true, "data", Map.of("id", id, "status", d.status()));
    }
}
