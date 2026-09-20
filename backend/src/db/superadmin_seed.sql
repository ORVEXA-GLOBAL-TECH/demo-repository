-- ==============================================================================
-- MASTER SUPER ADMIN PROVISIONING SQL SCRIPT
-- Paste and run this in Supabase SQL Editor, Azure Query Editor, or pgAdmin
-- ==============================================================================

-- 1. Create / Upsert Master Super Admin User: Akshyatraj Pati
-- Email: akshyatrajpaati@gmail.com
-- Default Password: SuperAdmin@2026! (Bcrypt 12 Rounds)
INSERT INTO users (
    id,
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
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'akshyatrajpaati@gmail.com',
    '$2b$12$e5k5m7mGy41.6qUv6fEZcOzU9d24lKskP1sIe877B5iKk5e6P6WKG',
    'Akshyatraj',
    'Pati',
    'SUPER_ADMIN',
    'Active',
    CURRENT_TIMESTAMP
)
ON CONFLICT (tenant_id, email) DO UPDATE SET
    id = EXCLUDED.id,
    password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
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
    'akshyatrajpaati@gmail.com',
    'SUPER_ADMIN',
    'SUPERADMIN_INITIALIZED',
    'users',
    '00000000-0000-0000-0000-000000000001',
    '{"event": "Master Super Admin Initialized for Akshyatraj Pati", "userId": "001"}'::jsonb
);

-- 3. Verify Super Admin Record
SELECT id, email, first_name, last_name, role, status, created_at 
FROM users 
WHERE email = 'akshyatrajpaati@gmail.com';
