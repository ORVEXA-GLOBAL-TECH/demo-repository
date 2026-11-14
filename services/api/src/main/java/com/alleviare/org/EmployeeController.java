package com.alleviare.org;

import com.alleviare.common.ApiException;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    record NewEmployee(@NotBlank String code, @NotBlank String firstName, @NotBlank String lastName,
                       @NotBlank @Email String email, String phone, String headquarters, UUID managerId) {}

    private final JdbcClient db;
    private final Scope scope;

    public EmployeeController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('employee.view') or hasAuthority('*')")
    public Map<String, Object> list() {
        List<Map<String, Object>> rows = db.sql("""
                SELECT e.id, e.employee_code AS "code", e.first_name || ' ' || e.last_name AS name, e.email, e.phone,
                       e.headquarters, e.status, m.first_name || ' ' || m.last_name AS "manager"
                  FROM public.employees e LEFT JOIN public.employees m ON m.id = e.manager_id
                 WHERE e.company_id = :c ORDER BY e.employee_code
                """).param("c", scope.companyId()).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('employee.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody NewEmployee r) {
        UUID company = scope.companyId();
        if (r.managerId() != null && db.sql("SELECT count(*) FROM public.employees WHERE id = :m AND company_id = :c")
                .param("m", r.managerId()).param("c", company).query(Integer.class).single() == 0) {
            throw new ApiException(400, "UNKNOWN_MANAGER", "Unknown manager");
        }
        try {
            Map<String, Object> row = db.sql("""
                    INSERT INTO public.employees (company_id, employee_code, first_name, last_name, email, phone, headquarters, manager_id)
                    VALUES (:c, :code, :f, :l, :e, :p, :h, :m) RETURNING id, employee_code AS code, email
                    """).param("c", company).param("code", r.code().trim()).param("f", r.firstName().trim())
                .param("l", r.lastName().trim()).param("e", r.email().trim()).param("p", r.phone())
                .param("h", r.headquarters()).param("m", r.managerId()).query().singleRow();
            return Map.of("success", true, "data", row);
        } catch (DuplicateKeyException e) {
            throw new ApiException(409, "EXISTS", "An employee with this code or email already exists.");
        }
    }
}
