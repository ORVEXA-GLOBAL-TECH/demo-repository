package com.alleviare.common;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

/** Role to permission lookup backed by public.role_permissions, cached briefly. */
@Service
public class PermissionService {
    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String COMPANY_WIDE = "data.company_wide";
    private static final long TTL_MS = 60_000;

    private record Entry(Set<String> perms, long at) {}

    private final JdbcClient db;
    private final ConcurrentHashMap<String, Entry> cache = new ConcurrentHashMap<>();

    public PermissionService(JdbcClient db) {
        this.db = db;
    }

    public Set<String> forRole(String role) {
        if (SUPER_ADMIN.equals(role)) return Set.of("*");
        Entry e = cache.get(role);
        if (e != null && System.currentTimeMillis() - e.at < TTL_MS) return e.perms;
        Set<String> perms = Set.copyOf(db.sql("""
                SELECT p.code FROM public.role_permissions rp
                  JOIN public.roles r ON r.id = rp.role_id
                  JOIN public.permissions p ON p.id = rp.permission_id
                 WHERE r.code = :role
                """).param("role", role).query(String.class).list());
        cache.put(role, new Entry(perms, System.currentTimeMillis()));
        return perms;
    }

    public boolean roleExists(String role) {
        return db.sql("SELECT count(*) FROM public.roles WHERE code = :r").param("r", role).query(Integer.class).single() > 0;
    }
}
