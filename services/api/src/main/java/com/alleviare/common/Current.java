package com.alleviare.common;

import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;

/** Access to the caller. Tenant id always comes from the verified token, never from request input. */
public final class Current {
    private Current() {}

    public static Principal principal() {
        return (Principal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static UUID companyId() {
        UUID id = principal().companyId();
        if (id == null) throw new ApiException(403, "NO_TENANT", "This account is not attached to a company.");
        return id;
    }
}
