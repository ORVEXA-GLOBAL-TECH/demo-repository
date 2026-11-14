package com.alleviare.common;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** All tunable values live here and in application.yml / environment variables. */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Cors cors, Auth auth, Expense expense, Leave leave, Bootstrap bootstrap, DevSeed devSeed) {
    public record Jwt(String secret, long ttlMinutes) {}

    public record Cors(List<String> allowedOrigins) {}

    /** Roles listed here may only sign in on the web portal (empty = every role may use the mobile app). */
    public record Auth(List<String> webOnlyRoles, int minPasswordLength) {}

    public record Expense(BigDecimal defaultDailyAllowance, BigDecimal defaultRatePerKm) {}

    /** Annual leave quota per leave-type code (CL, SL, PL...), applied when a company has no leave types yet. */
    public record Leave(Map<String, Quota> defaults) {
        public record Quota(String name, int days) {}
    }

    /** First-run provisioning of an empty database: creates the company and its first administrator. */
    public record Bootstrap(boolean enabled, String companyCode, String companyName, String currency, String timezone,
                            String adminEmail, String adminFirstName, String adminLastName, String adminPassword) {}

    /** Development only: creates logins for already-seeded employees. Entries are "email:ROLE". */
    public record DevSeed(boolean enabled, String password, List<String> users) {}
}
