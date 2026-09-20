-- ==============================================================================
-- MASTER SUPER ADMIN PROVISIONING SQL SCRIPT
-- Paste and run this in Supabase SQL Editor, Azure Query Editor, or pgAdmin
-- ==============================================================================

-- 1. Create default master super admin user (tenant_id = NULL for global platform scope)
-- Password: SuperAdmin@2026! (Bcrypt hashed with 12 salt rounds)
INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    created_at
)
VALUES (
    NULL,
    'superadmin@alleviaresfa.com',
    '$2b$12$e5k5m7mGy41.6qUv6fEZcOzU9d24lKskP1sIe877B5iKk5e6P6WKG',
    'System',
    'SuperAdmin',
    'SUPER_ADMIN',
    'Active',
    CURRENT_TIMESTAMP
)
ON CONFLICT (tenant_id, email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'SUPER_ADMIN',
    status = 'Active',
    updated_at = CURRENT_TIMESTAMP;

-- 2. Log Super Admin Provisioning in platform audit trail
INSERT INTO platform_audit_logs (
    actor_email,
    actor_role,
    action,
    target_entity,
    entity_id,
    details
)
VALUES (
    'superadmin@alleviaresfa.com',
    'SUPER_ADMIN',
    'SUPERADMIN_INIT_SQL',
    'users',
    (SELECT id::text FROM users WHERE email = 'superadmin@alleviaresfa.com' AND tenant_id IS NULL),
    '{"event": "Master Super Admin Initialized", "provider": "Supabase/Azure"}'::jsonb
);

-- 3. Verify Super Admin User
SELECT id, email, first_name, last_name, role, status, created_at 
FROM users 
WHERE role = 'SUPER_ADMIN';
