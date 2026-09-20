-- ==============================================================================
-- MASTER SUPER ADMIN PROVISIONING SQL SCRIPT
-- Paste and run this in Supabase SQL Editor
-- ==============================================================================

-- 1. Ensure permissions are granted
GRANT USAGE ON SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- 2. Insert / Update Master Super Admin User: Akshyatraj Pati
-- Email: akshatrajpati@gmail.com
-- Password: SuperAdmin@2026! (Verified 100% Bcrypt Hash)
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
    'akshatrajpati@gmail.com',
    '$2b$10$iLnSstcyGdqjimZNg.l4ieQE./UBw1oqHoCbLwpgJtWoJvwJFbWHK',
    'Akshyatraj',
    'Pati',
    'SUPER_ADMIN',
    'Active',
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = 'SUPER_ADMIN',
    status = 'Active',
    updated_at = CURRENT_TIMESTAMP;

-- 3. Verify Super Admin Record
SELECT id, email, first_name, last_name, role, status, created_at 
FROM users 
WHERE email = 'akshatrajpati@gmail.com';
