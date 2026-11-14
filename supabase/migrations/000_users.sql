-- ==============================================================================
-- LOGIN ACCOUNTS (public.users)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(lower(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON public.users(tenant_id);

-- Credentials must never be readable through Supabase's public (anon / authenticated) API keys:
-- RLS is on and no policy grants access, so only the API's database role can read or write this table.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- No accounts are created here. Use BOOTSTRAP_* (first administrator) or POST /api/v1/users.
