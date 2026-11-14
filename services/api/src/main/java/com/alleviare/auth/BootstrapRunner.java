package com.alleviare.auth;

import com.alleviare.common.AppProperties;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * First-run provisioning (BOOTSTRAP_ENABLED=true): creates the company and its first administrator, so a fresh
 * database is usable without hand-written SQL. Idempotent: does nothing if that administrator already exists.
 */
@Component
@ConditionalOnProperty(name = "app.bootstrap.enabled", havingValue = "true")
public class BootstrapRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(BootstrapRunner.class);

    private final JdbcClient db;
    private final PasswordEncoder encoder;
    private final AppProperties.Bootstrap cfg;
    private final int minPassword;

    public BootstrapRunner(JdbcClient db, PasswordEncoder encoder, AppProperties props) {
        this.db = db;
        this.encoder = encoder;
        this.cfg = props.bootstrap();
        this.minPassword = props.auth().minPasswordLength();
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        require(cfg.companyCode(), "BOOTSTRAP_COMPANY_CODE");
        require(cfg.companyName(), "BOOTSTRAP_COMPANY_NAME");
        require(cfg.adminEmail(), "BOOTSTRAP_ADMIN_EMAIL");
        if (cfg.adminPassword() == null || cfg.adminPassword().length() < minPassword) {
            throw new IllegalStateException("BOOTSTRAP_ADMIN_PASSWORD must be at least " + minPassword + " characters");
        }
        boolean exists = db.sql("SELECT count(*) FROM public.users WHERE lower(email) = lower(:e)")
            .param("e", cfg.adminEmail()).query(Integer.class).single() > 0;
        if (exists) {
            log.info("Bootstrap skipped: {} already exists", cfg.adminEmail());
            return;
        }
        UUID company = db.sql("""
                INSERT INTO public.companies (code, name, currency, timezone) VALUES (:code, :name, :cur, :tz)
                ON CONFLICT (code) DO UPDATE SET name = public.companies.name RETURNING id
                """).param("code", cfg.companyCode().toLowerCase()).param("name", cfg.companyName())
            .param("cur", cfg.currency()).param("tz", cfg.timezone()).query(UUID.class).single();
        db.sql("""
                INSERT INTO public.employees (company_id, employee_code, first_name, last_name, email, status)
                VALUES (:c, 'ADMIN-001', :f, :l, :e, 'ACTIVE') ON CONFLICT (email) DO NOTHING
                """).param("c", company).param("f", cfg.adminFirstName()).param("l", cfg.adminLastName())
            .param("e", cfg.adminEmail()).update();
        db.sql("""
                INSERT INTO public.users (email, password_hash, first_name, last_name, role, status, tenant_id)
                VALUES (:e, :h, :f, :l, 'ADMIN', 'Active', :c)
                """).param("e", cfg.adminEmail()).param("h", encoder.encode(cfg.adminPassword()))
            .param("f", cfg.adminFirstName()).param("l", cfg.adminLastName()).param("c", company).update();
        log.warn("Bootstrap created company '{}' and administrator {}. Change the password and disable BOOTSTRAP_ENABLED.",
            cfg.companyCode(), cfg.adminEmail());
    }

    private static void require(String v, String name) {
        if (v == null || v.isBlank()) throw new IllegalStateException(name + " is required when BOOTSTRAP_ENABLED=true");
    }
}
