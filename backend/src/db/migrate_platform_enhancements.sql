-- ==============================================================================
-- 🚀 ORVEXA / ALLEVIARE PLATFORM ENHANCEMENTS & GLOBAL CONFIGURATION MIGRATION
-- Safe & Idempotent SQL Migration (Can be run multiple times without errors)
-- Run this in your Supabase SQL Editor or PostgreSQL Console
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PLATFORM GLOBAL CONFIGURATION (platform_settings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global_default',
    date_format VARCHAR(20) NOT NULL DEFAULT 'YYYY-MM-DD',
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    default_working_days JSONB NOT NULL DEFAULT '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb,
    notification_settings JSONB NOT NULL DEFAULT '{"email": true, "in_app": true, "sms": false, "push": true, "weekly_digest": true, "critical_alerts": true}'::jsonb,
    security_policy JSONB NOT NULL DEFAULT '{"enforce_2fa": false, "max_login_attempts": 5, "lockout_duration_minutes": 15, "allow_multiple_sessions": true}'::jsonb,
    password_policy JSONB NOT NULL DEFAULT '{"min_length": 8, "require_uppercase": true, "require_numbers": true, "require_special_chars": true, "expiry_days": 90}'::jsonb,
    session_timeout_minutes INT NOT NULL DEFAULT 60,
    file_limits JSONB NOT NULL DEFAULT '{"max_file_size_mb": 25, "allowed_file_types": ["pdf", "jpg", "png", "xlsx", "csv", "docx"]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed global settings if not existing
INSERT INTO platform_settings (
    id, date_format, timezone, currency, language, default_working_days, session_timeout_minutes
) VALUES (
    'global_default', 'YYYY-MM-DD', 'UTC', 'USD', 'en', '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb, 60
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. RBAC ROLE TEMPLATES & PERMISSIONS MATRIX (role_templates)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS role_templates (
    role_key VARCHAR(50) PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_immutable BOOLEAN DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Standard Platform Role Templates
INSERT INTO role_templates (role_key, role_name, description, is_system_immutable, permissions)
VALUES 
(
    'SUPER_ADMIN',
    'Super Admin (Master Platform Authority)',
    'Supreme root authority with absolute control over all companies, platform configuration, billing, security, and role templates.',
    true,
    '{"platform.view_all_tenants": true, "platform.manage_tenants": true, "platform.global_settings": true, "platform.role_templates": true, "platform.emergency_killswitch": true, "platform.view_audit_logs": true, "platform.manage_billing": true, "platform.impersonate_admin": true, "users.create_admin": true, "users.edit_admin": true, "users.toggle_status": true, "users.reset_password": true, "users.force_logout": true, "users.lock_unlock": true, "users.change_permissions": true, "plans.create": true, "plans.edit": true, "plans.delete": true, "subscriptions.assign": true, "subscriptions.upgrade_downgrade": true}'::jsonb
),
(
    'COMPANY_ADMIN',
    'Company Admin (Tenant Executive)',
    'Full administrative control within their assigned pharmaceutical company. Strictly restricted from modifying Super Admin or global settings.',
    false,
    '{"company.view_profile": true, "company.edit_profile": true, "company.manage_overrides": true, "company.view_invoices": true, "users.create_user": true, "users.edit_user": true, "users.toggle_status": true, "catalog.manage": true, "doctors.manage": true, "chemists.manage": true, "dcr.view_all": true, "orders.view_all": true, "field_tracking.view_live": true, "platform.global_settings": false, "platform.role_templates": false}'::jsonb
),
(
    'AREA_MANAGER',
    'Area / Regional Sales Manager',
    'Regional supervisor managing Medical Representatives, reviewing field DCR reports, and approving sales orders.',
    false,
    '{"team.view_members": true, "doctors.view": true, "chemists.view": true, "dcr.view_team": true, "dcr.approve_reject": true, "orders.view_team": true, "orders.approve_reject": true, "field_tracking.view_team": true}'::jsonb
),
(
    'MEDICAL_REP',
    'Medical Representative (Field Sales Rep)',
    'Field executive logging daily doctor/chemist call visits, taking POB orders, recording attendance, and syncing GPS telemetry.',
    false,
    '{"dcr.create": true, "dcr.view_own": true, "orders.create": true, "orders.view_own": true, "doctors.view": true, "chemists.view": true, "catalog.view": true, "attendance.mark": true, "gps.send_telemetry": true}'::jsonb
),
(
    'AUDITOR',
    'Compliance & Audit Inspector',
    'Read-only compliance officer reviewing audit logs, system access history, and regulatory sales compliance.',
    false,
    '{"audit.view_logs": true, "login_history.view": true, "reports.view_compliance": true, "reports.export": true}'::jsonb
)
ON CONFLICT (role_key) DO NOTHING;

-- ==============================================================================
-- 4. ENHANCE USERS TABLE (Security & Session Controls)
-- ==============================================================================
ALTER TABLE IF EXISTS users 
    ADD COLUMN IF NOT EXISTS token_version INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS lock_reason TEXT,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"manage_users": true, "manage_products": true, "manage_orders": true, "manage_doctors": true, "manage_dcr": true, "view_analytics": true, "export_data": true, "manage_settings": true}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_users_token_version ON users(id, token_version);
CREATE INDEX IF NOT EXISTS idx_users_is_locked ON users(is_locked);

-- ==============================================================================
-- 5. ENHANCE TENANTS_COMPANIES TABLE (Overrides & Lifecycle)
-- ==============================================================================
ALTER TABLE IF EXISTS tenants_companies 
    ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS default_timezone VARCHAR(64) DEFAULT 'UTC',
    ADD COLUMN IF NOT EXISTS currency_code VARCHAR(20) DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS trial_start_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS trial_end_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS subscription_end_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS grace_period_days INT DEFAULT 7,
    ADD COLUMN IF NOT EXISTS auto_suspend_after_grace BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS last_renewed_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS renewal_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_custom_pricing BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS custom_rate NUMERIC(12,2) DEFAULT 0.00;

-- ==============================================================================
-- 6. ADMIN LOGIN HISTORY & DEVICE TELEMETRY (admin_login_history)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    device_info VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SUCCESS',
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON admin_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON admin_login_history(email);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON admin_login_history(created_at DESC);

-- ==============================================================================
-- 7. SAAS SUBSCRIPTION PLANS (subscription_plans)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier VARCHAR(50) NOT NULL,
    price_monthly NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    price_yearly NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    trial_days INT NOT NULL DEFAULT 14,
    grace_period_days INT NOT NULL DEFAULT 7,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Core Subscription Plans
INSERT INTO subscription_plans (code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active, is_custom)
VALUES
('FREE_TRIAL', '14-Day Full Access Trial', 'Zero upfront cost trial with all features enabled.', 'FREE_TRIAL', 0.00, 0.00, 14, 7, '["Unlimited Field Users", "Chemist Order Booking", "MR Daily Call Reports", "Product Catalog Access"]'::jsonb, true, false),
('STARTER', 'Starter Pharma Growth Plan', 'Entry tier for single-country field operations.', 'STARTER', 100.00, 1000.00, 14, 7, '["Unlimited Field Users", "Chemist Order Booking", "MR Daily Call Reports", "Standard GPS Tracking"]'::jsonb, true, false),
('PROFESSIONAL', 'Professional Enterprise Scale Plan', 'Advanced multi-territory tracking and analytics.', 'PROFESSIONAL', 1000.00, 10000.00, 14, 7, '["Unlimited Field Users", "AI Route Optimization", "Doctor Call Telemetry", "Priority API Access", "Custom Analytics Export"]'::jsonb, true, false),
('ENTERPRISE', 'Sovereign Global Enterprise Plan', 'Multi-national pharma tier with full compliance audit.', 'ENTERPRISE', 2500.00, 25000.00, 30, 14, '["Dedicated Sovereign Database", "Global FX & Tax Compliance", "Unlimited Admins & Users", "24/7 Dedicated SLA Support", "Full Impersonation Audit Trail"]'::jsonb, true, false),
('CUSTOM', 'Custom Sovereign Tier', 'Bespoke enterprise contract with custom negotiated rate.', 'CUSTOM', 0.00, 0.00, 14, 7, '["Custom Terms", "Tailored Feature Modules", "Enterprise Custom SLA"]'::jsonb, true, true)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- 8. GRANT ACCESS & DISABLE RLS FOR FRONTEND/SUPABASE COMPATIBILITY
-- ==============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

ALTER TABLE IF EXISTS platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS role_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_login_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tenants_companies DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 9. VERIFICATION QUERY OUTPUT
-- ==============================================================================
SELECT '🎉 Database successfully updated with all Global Configuration, RBAC, and User Management enhancements!' as migration_status,
       (SELECT count(*) FROM platform_settings) as platform_settings_count,
       (SELECT count(*) FROM role_templates) as role_templates_count,
       (SELECT count(*) FROM subscription_plans) as subscription_plans_count,
       (SELECT count(*) FROM users) as total_users;
