-- ==============================================================================
-- ALLEVIARE / ORVEXA SFA - COMPREHENSIVE PLATFORM ENHANCEMENTS MIGRATION SCRIPT
-- ==============================================================================
-- Run this script in the Supabase SQL Editor or via psql.
-- All statements are 100% idempotent and safe to run multiple times without data loss.

-- 1. TENANT COMPANIES (Subscription Dates, Custom Pricing, Grace Period & Overrides)
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS trial_start_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS trial_end_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS subscription_end_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS grace_period_days INT DEFAULT 7;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS auto_suspend_after_grace BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS last_renewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS renewal_count INT DEFAULT 0;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS monthly_rate NUMERIC(12,2) DEFAULT 100.00;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS is_custom_pricing BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS custom_rate NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE IF EXISTS tenants_companies ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Backfill legacy companies subscription dates if null
UPDATE tenants_companies
SET subscription_start_at = COALESCE(subscription_start_at, created_at, NOW()),
    subscription_end_at = COALESCE(subscription_end_at, NOW() + INTERVAL '1 year')
WHERE subscription_end_at IS NULL AND plan != 'FREE_TRIAL';

-- 2. USERS (Lock state, Force Logout Token Version, Granular Permissions)
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS lock_reason TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS token_version INT DEFAULT 0;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"manage_users": true, "manage_products": true, "manage_orders": true, "manage_doctors": true, "manage_dcr": true, "view_analytics": true, "export_data": true, "manage_settings": true}'::jsonb;

-- 3. TENANT SUBSCRIPTIONS (Ledger enhancements)
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS end_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS grace_period_days INT DEFAULT 7;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS auto_suspend_after_grace BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS renewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS amount_billed NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS invoice_currency VARCHAR(5) DEFAULT 'USD';
ALTER TABLE IF EXISTS tenant_subscriptions ADD COLUMN IF NOT EXISTS billing_interval VARCHAR(20) DEFAULT 'Monthly';

-- 4. PLATFORM GLOBAL CONFIGURATION
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

INSERT INTO platform_settings (id, date_format, timezone, currency, language, session_timeout_minutes)
VALUES ('global_default', 'YYYY-MM-DD', 'UTC', 'USD', 'en', 60)
ON CONFLICT (id) DO NOTHING;

-- 5. ROLE TEMPLATES & RBAC PERMISSION MATRIX
CREATE TABLE IF NOT EXISTS role_templates (
    role_key VARCHAR(50) PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_immutable BOOLEAN DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO role_templates (role_key, role_name, description, is_system_immutable, permissions)
VALUES 
('SUPER_ADMIN', 'Super Admin (Master Platform Authority)', 'Supreme root authority with absolute control over all companies, platform configuration, billing, security, and role templates.', true, '{"platform.view_all_tenants": true, "platform.manage_tenants": true, "platform.global_settings": true, "platform.role_templates": true, "platform.emergency_killswitch": true, "platform.view_audit_logs": true, "platform.manage_billing": true, "platform.impersonate_admin": true, "users.create_admin": true, "users.edit_admin": true, "users.toggle_status": true, "users.reset_password": true, "users.force_logout": true, "users.lock_unlock": true, "users.change_permissions": true, "plans.create": true, "plans.edit": true, "plans.delete": true, "subscriptions.assign": true, "subscriptions.upgrade_downgrade": true}'::jsonb),
('COMPANY_ADMIN', 'Company Admin (Tenant Executive)', 'Full administrative control within their assigned pharmaceutical company. Strictly restricted from modifying Super Admin or global settings.', false, '{"company.view_profile": true, "company.edit_profile": true, "company.manage_overrides": true, "company.view_invoices": true, "users.create_user": true, "users.edit_user": true, "users.toggle_status": true, "catalog.manage": true, "doctors.manage": true, "chemists.manage": true, "dcr.view_all": true, "orders.view_all": true, "field_tracking.view_live": true, "platform.global_settings": false, "platform.role_templates": false}'::jsonb),
('AREA_MANAGER', 'Area / Regional Sales Manager', 'Regional supervisor managing Medical Representatives, reviewing field DCR reports, and approving sales orders.', false, '{"team.view_members": true, "doctors.view": true, "chemists.view": true, "dcr.view_team": true, "dcr.approve_reject": true, "orders.view_team": true, "orders.approve_reject": true, "field_tracking.view_team": true}'::jsonb),
('MEDICAL_REP', 'Medical Representative (Field Sales Rep)', 'Field executive logging daily doctor/chemist call visits, taking POB orders, recording attendance, and syncing GPS telemetry.', false, '{"dcr.create": true, "dcr.view_own": true, "orders.create": true, "orders.view_own": true, "doctors.view": true, "chemists.view": true, "catalog.view": true, "attendance.mark": true, "gps.send_telemetry": true}'::jsonb),
('AUDITOR', 'Compliance & Audit Inspector', 'Read-only compliance officer reviewing audit logs, system access history, and regulatory sales compliance.', false, '{"audit.view_logs": true, "login_history.view": true, "reports.view_compliance": true, "reports.export": true}'::jsonb)
ON CONFLICT (role_key) DO NOTHING;

-- 6. SAAS SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier VARCHAR(50) NOT NULL DEFAULT 'STARTER',
    price_monthly NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    price_yearly NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    trial_days INT NOT NULL DEFAULT 14,
    grace_period_days INT NOT NULL DEFAULT 7,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscription_plans (code, name, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active)
VALUES 
('TRIAL_14D', 'Free Trial (14 Days)', 'FREE_TRIAL', 0.00, 0.00, 14, 7, '["Unlimited Users", "Full DCR Access", "POB Order Capture"]'::jsonb, true),
('STARTER_MONTHLY', 'Starter Growth Plan', 'STARTER', 100.00, 1000.00, 14, 7, '["Core Daily Call Reports", "Chemist Order Booking", "Standard Territory Mgmt"]'::jsonb, true),
('PRO_ENTERPRISE', 'Professional Tier', 'PROFESSIONAL', 1000.00, 10000.00, 14, 14, '["Live GPS Telemetry", "Advanced AI Analytics", "Automated Tour Plans"]'::jsonb, true),
('ENTERPRISE_CUSTOM', 'Global Enterprise Sovereign', 'ENTERPRISE', 2500.00, 25000.00, 30, 30, '["Dedicated Sovereign Cloud", "Multi-Jurisdiction FX", "24/7 SLA Priority Support"]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;

-- 7. ADMIN LOGIN HISTORY & DEVICE TELEMETRY
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

CREATE INDEX IF NOT EXISTS idx_login_history_user_time ON admin_login_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON admin_login_history(email);

-- 8. GRANT ALL PERMISSIONS & DISABLE RLS FOR CLIENT API ACCESS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sovereign_countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tenants_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tenant_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS role_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_login_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_alerts DISABLE ROW LEVEL SECURITY;
