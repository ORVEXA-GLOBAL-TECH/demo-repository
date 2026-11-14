package com.alleviare.auth;

import com.alleviare.common.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Development only (DEV_SEED_ENABLED=true). For each "email:ROLE" in DEV_SEED_USERS, creates a login for the
 * matching existing employee using DEV_SEED_PASSWORD. Nothing is hard-coded and nothing runs unless enabled.
 */
@Component
@ConditionalOnProperty(name = "app.dev-seed.enabled", havingValue = "true")
public class DevDataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final JdbcClient db;
    private final PasswordEncoder encoder;
    private final AppProperties props;

    public DevDataSeeder(JdbcClient db, PasswordEncoder encoder, AppProperties props) {
        this.db = db;
        this.encoder = encoder;
        this.props = props;
    }

    @Override
    public void run(ApplicationArguments args) {
        String pw = props.devSeed().password();
        if (pw == null || pw.length() < props.auth().minPasswordLength()) {
            throw new IllegalStateException("DEV_SEED_PASSWORD must be at least " + props.auth().minPasswordLength() + " characters");
        }
        String hash = encoder.encode(pw);
        int created = 0;
        for (String entry : props.devSeed().users()) {
            String[] parts = entry.split(":");
            if (parts.length != 2) throw new IllegalStateException("DEV_SEED_USERS entries must look like email:ROLE");
            created += db.sql("""
                    INSERT INTO public.users (email, password_hash, first_name, last_name, role, status, tenant_id)
                    SELECT e.email, :hash, e.first_name, e.last_name, :role, 'Active', e.company_id
                      FROM public.employees e WHERE lower(e.email) = lower(:email)
                    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, status = 'Active'
                    """)
                .param("hash", hash).param("role", parts[1].trim()).param("email", parts[0].trim()).update();
        }
        log.warn("DEV seed enabled: {} logins created/updated. Never enable in production.", created);
    }
}
