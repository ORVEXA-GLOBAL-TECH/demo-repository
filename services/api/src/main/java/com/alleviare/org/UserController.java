package com.alleviare.org;

import com.alleviare.common.ApiException;
import com.alleviare.common.AppProperties;
import com.alleviare.common.Current;
import com.alleviare.common.PermissionService;
import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Login accounts for employees of the caller's company. */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    record CreateUser(@NotBlank @Email String email, @NotBlank String password, @NotBlank String role) {}

    record SetStatus(@NotBlank String status) {}

    record SetPassword(@NotBlank String password) {}

    private final JdbcClient db;
    private final Scope scope;
    private final PasswordEncoder encoder;
    private final PermissionService permissions;
    private final AppProperties props;

    public UserController(JdbcClient db, Scope scope, PasswordEncoder encoder, PermissionService permissions, AppProperties props) {
        this.db = db;
        this.scope = scope;
        this.encoder = encoder;
        this.permissions = permissions;
        this.props = props;
    }

    private void checkPassword(String pw) {
        if (pw.length() < props.auth().minPasswordLength()) {
            throw new ApiException(400, "WEAK_PASSWORD", "Password must be at least " + props.auth().minPasswordLength() + " characters.");
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user.manage') or hasAuthority('*')")
    public Map<String, Object> list() {
        List<Map<String, Object>> rows = db.sql("""
                SELECT u.id, u.email, u.first_name || ' ' || u.last_name AS name, u.role, u.status,
                       to_char(u.last_login_at, 'YYYY-MM-DD HH24:MI') AS "lastLogin"
                  FROM public.users u JOIN public.employees e ON lower(e.email) = lower(u.email)
                 WHERE e.company_id = :c AND u.deleted_at IS NULL ORDER BY u.email
                """).param("c", scope.companyId()).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('user.manage') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody CreateUser r) {
        checkPassword(r.password());
        if (PermissionService.SUPER_ADMIN.equals(r.role()) || !permissions.roleExists(r.role())) {
            throw new ApiException(400, "BAD_ROLE", "Unknown or reserved role: " + r.role());
        }
        var emp = db.sql("SELECT first_name, last_name FROM public.employees WHERE company_id = :c AND lower(email) = lower(:e)")
            .param("c", scope.companyId()).param("e", r.email().trim()).query().listOfRows().stream().findFirst()
            .orElseThrow(() -> new ApiException(400, "NO_EMPLOYEE", "Create the employee record first; no employee has this email."));
        boolean taken = db.sql("SELECT count(*) FROM public.users WHERE lower(email) = lower(:e)")
            .param("e", r.email().trim()).query(Integer.class).single() > 0;
        if (taken) throw new ApiException(409, "EXISTS", "A login for this email already exists.");
        UUID id = db.sql("""
                INSERT INTO public.users (email, password_hash, first_name, last_name, role, status, tenant_id)
                VALUES (:e, :h, :f, :l, :role, 'Active', :c) RETURNING id
                """).param("e", r.email().trim()).param("h", encoder.encode(r.password()))
            .param("f", emp.get("first_name")).param("l", emp.get("last_name")).param("role", r.role())
            .param("c", scope.companyId()).query(UUID.class).single();
        return Map.of("success", true, "data", Map.of("id", id, "email", r.email().trim(), "role", r.role()));
    }

    private void requireInCompany(UUID id) {
        boolean ok = db.sql("""
                SELECT count(*) FROM public.users u JOIN public.employees e ON lower(e.email) = lower(u.email)
                 WHERE u.id = :id AND e.company_id = :c
                """).param("id", id).param("c", scope.companyId()).query(Integer.class).single() > 0;
        if (!ok) throw new ApiException(404, "NOT_FOUND", "User not found");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('user.manage') or hasAuthority('*')")
    public Map<String, Object> setStatus(@PathVariable UUID id, @Valid @RequestBody SetStatus r) {
        if (!r.status().equals("Active") && !r.status().equals("Inactive")) {
            throw new ApiException(400, "BAD_STATUS", "Status must be Active or Inactive");
        }
        if (id.equals(Current.principal().userId())) throw new ApiException(400, "SELF", "You cannot change your own status.");
        requireInCompany(id);
        db.sql("UPDATE public.users SET status = :s, updated_at = now() WHERE id = :id").param("s", r.status()).param("id", id).update();
        return Map.of("success", true, "data", Map.of("id", id, "status", r.status()));
    }

    @PostMapping("/{id}/password")
    @PreAuthorize("hasAuthority('user.manage') or hasAuthority('*')")
    public Map<String, Object> resetPassword(@PathVariable UUID id, @Valid @RequestBody SetPassword r) {
        checkPassword(r.password());
        requireInCompany(id);
        db.sql("UPDATE public.users SET password_hash = :h, updated_at = now() WHERE id = :id")
            .param("h", encoder.encode(r.password())).param("id", id).update();
        return Map.of("success", true);
    }
}
