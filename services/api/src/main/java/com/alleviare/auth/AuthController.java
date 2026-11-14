package com.alleviare.auth;

import com.alleviare.common.ApiException;
import com.alleviare.common.Current;
import com.alleviare.common.JwtService;
import com.alleviare.common.Principal;
import com.alleviare.common.AppProperties;
import com.alleviare.common.PermissionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    record LoginRequest(@NotBlank String email, @NotBlank String password, String platform) {}

    private final JdbcClient db;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final PermissionService permissions;
    private final AppProperties props;

    public AuthController(JdbcClient db, PasswordEncoder encoder, JwtService jwt, PermissionService permissions, AppProperties props) {
        this.db = db;
        this.encoder = encoder;
        this.jwt = jwt;
        this.permissions = permissions;
        this.props = props;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest req) {
        String platform = req.platform() == null ? "web" : req.platform();
        var row = db.sql("""
                SELECT id, email, password_hash, first_name, last_name, role, status
                  FROM public.users WHERE lower(email) = lower(:email) AND deleted_at IS NULL
                """)
            .param("email", req.email().trim())
            .query().listOfRows().stream().findFirst().orElse(null);

        // Same message for unknown user and wrong password, so accounts cannot be enumerated.
        if (row == null || row.get("password_hash") == null
                || !encoder.matches(req.password(), (String) row.get("password_hash"))) {
            throw new ApiException(401, "BAD_CREDENTIALS", "Invalid credentials.");
        }
        if (!"active".equalsIgnoreCase(String.valueOf(row.get("status")))) {
            throw new ApiException(403, "ACCOUNT_INACTIVE", "This account is not active.");
        }

        String role = (String) row.get("role");
        if ("app".equals(platform) && props.auth().webOnlyRoles().contains(role)) {
            throw new ApiException(403, "PLATFORM_NOT_ALLOWED",
                role.replace('_', ' ') + " accounts cannot sign in on the mobile app.");
        }

        UUID companyId = db.sql("SELECT company_id FROM public.employees WHERE lower(email) = lower(:e) LIMIT 1")
            .param("e", req.email().trim()).query(UUID.class).optional().orElse(null);
        if (companyId == null && !"SUPER_ADMIN".equals(role)) {
            throw new ApiException(403, "NO_TENANT", "This account is not attached to a company.");
        }

        String name = (row.get("first_name") + " " + row.get("last_name")).trim();
        Principal p = new Principal((UUID) row.get("id"), (String) row.get("email"), name, role, companyId,
            permissions.forRole(role));
        return Map.of("success", true, "token", jwt.issue(p), "user", view(p));
    }

    @GetMapping("/me")
    public Map<String, Object> me() {
        return Map.of("success", true, "user", view(Current.principal()));
    }

    private Map<String, Object> view(Principal p) {
        String currency = p.companyId() == null ? null
            : db.sql("SELECT currency FROM public.companies WHERE id = :id").param("id", p.companyId())
                .query(String.class).optional().orElse(null);
        Map<String, Object> m = new java.util.HashMap<>(Map.of("id", p.userId(), "email", p.email(), "name", p.name(),
            "role", p.role(), "tenantId", String.valueOf(p.companyId()), "permissions", p.permissions()));
        if (currency != null) m.put("currency", currency);
        return m;
    }
}
