package com.alleviare.common;

import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/** Resolves the caller's employee record and applies the "MRs only see their own data" rule. */
@Component
public class Scope {
    private final JdbcClient db;

    public Scope(JdbcClient db) {
        this.db = db;
    }

    public UUID companyId() {
        return Current.companyId();
    }

    /** The caller's employee row in their company, or null (e.g. a super admin). */
    public UUID employeeId() {
        Principal p = Current.principal();
        return db.sql("SELECT id FROM public.employees WHERE company_id = :c AND lower(email) = lower(:e) LIMIT 1")
            .param("c", companyId()).param("e", p.email()).query(UUID.class).optional().orElse(null);
    }

    /** Employee required for actions performed on behalf of someone (punch in, submit claim...). */
    public UUID requireEmployeeId() {
        UUID id = employeeId();
        if (id == null) throw new ApiException(403, "NO_EMPLOYEE", "Your account has no employee record in this company.");
        return id;
    }

    /** Roles without the company-wide data permission only see records they own. */
    public boolean ownRecordsOnly() {
        return !Current.principal().can(PermissionService.COMPANY_WIDE);
    }

    /** Employee id to filter by, or null when the caller may see the whole company. */
    public UUID filterEmployee() {
        return ownRecordsOnly() ? requireEmployeeId() : null;
    }
}
