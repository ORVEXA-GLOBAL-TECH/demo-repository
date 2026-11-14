package com.alleviare.common;

import java.util.Set;
import java.util.UUID;

/** The authenticated caller, rebuilt from the signed JWT on every request. */
public record Principal(UUID userId, String email, String name, String role, UUID companyId, Set<String> permissions) {
    public boolean can(String permission) {
        return permissions.contains("*") || permissions.contains(permission);
    }
}
