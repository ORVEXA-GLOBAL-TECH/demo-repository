-- ==============================================================================
-- COMPREHENSIVE USERS, SESSIONS & CREDENTIALS TABLE FOR SUPABASE
-- Single-Session Enforcement (Concurrent Login Prevention)
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Comprehensive Users Table
CREATE TABLE IF NOT EXISTS public.users (
    -- Primary Identifier
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NULL,

    -- Identity & Profile Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    country_code VARCHAR(10) DEFAULT '+91',
    avatar_url TEXT,
    gender VARCHAR(20),
    date_of_birth DATE,

    -- Authentication & Credentials
    password_hash TEXT NOT NULL,
    salt VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    recovery_codes JSONB DEFAULT '[]'::jsonb,

    -- Role & Privileges (SUPER_ADMIN, COMPANY_ADMIN, MANAGER, USER, etc.)
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_superadmin BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '[]'::jsonb,

    -- Organization & Workspace
    company_name VARCHAR(200),
    department VARCHAR(150),
    designation VARCHAR(150),
    employee_id VARCHAR(100),
    territory VARCHAR(150) DEFAULT 'Global HQ',

    -- Status & Verification
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended', 'Pending'
    is_verified BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,

    -- Session & Security Tracking
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMPTZ,
    refresh_token TEXT,

    -- Custom Metadata & User Preferences
    preferences JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Audit Timestamps & Soft Deletion
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ NULL
);

-- 3. Automatic updated_at Trigger for Users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- 4. Convenient View "user" (handles queries against both "user" and "users")
CREATE OR REPLACE VIEW public."user" AS 
SELECT * FROM public.users;

-- 5. User Sessions Table (Strict Single-Session & Concurrent Login Tracking)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    invalidated_reason VARCHAR(100), -- 'CONCURRENT_LOGIN_DETECTED', 'USER_LOGOUT', 'EXPIRED', 'ADMIN_REVOKED'
    expires_at TIMESTAMPTZ NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(lower(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(user_id, is_active);

-- 7. Supabase Row Level Security (RLS) & Permissions
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access to public users table" ON public.users;
CREATE POLICY "Allow full access to public users table"
ON public.users
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access to user_sessions" ON public.user_sessions;
CREATE POLICY "Allow full access to user_sessions"
ON public.user_sessions
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 8. Grant Permissions
GRANT ALL ON TABLE public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public."user" TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_sessions TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- 9. INITIALIZE SUPER ADMIN CREDENTIALS
-- ==============================================================================
-- Email: superadmin@alleviare.com
-- Password: SuperAdmin@2026!
-- ==============================================================================
INSERT INTO public.users (
    id,
    first_name,
    last_name,
    email,
    phone,
    country_code,
    password_hash,
    role,
    is_superadmin,
    designation,
    department,
    territory,
    status,
    is_verified,
    permissions,
    preferences,
    metadata
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Super',
    'Admin',
    'superadmin@alleviare.com',
    '+91 9876543210',
    '+91',
    '$2b$10$glkNKABGtY2G6BpDniMDPu9iAAs0VdXE5/LFzySAREHwqV7u6oy9G',
    'SUPER_ADMIN',
    TRUE,
    'Master Platform Super Administrator',
    'Executive Administration',
    'Global HQ',
    'Active',
    TRUE,
    '["ALL_ACCESS", "MANAGE_TENANTS", "MANAGE_USERS", "SYSTEM_SETTINGS", "BILLING_ACCESS", "SECURITY_ADMIN"]'::jsonb,
    '{"theme": "dark", "notifications": true, "emailAlerts": true}'::jsonb,
    '{"notes": "Primary master super admin account"}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- 10. Seed Initial Active Super Admin Session
INSERT INTO public.user_sessions (
    id,
    user_id,
    session_token,
    ip_address,
    user_agent,
    device_info,
    is_active,
    expires_at,
    last_active_at
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'initial_superadmin_token_2026',
    '127.0.0.1 (Local Host)',
    'Chrome / Windows (Super Admin Primary Console)',
    '{"browser": "Chrome", "os": "Windows 11", "platform": "Web Console"}'::jsonb,
    TRUE,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

