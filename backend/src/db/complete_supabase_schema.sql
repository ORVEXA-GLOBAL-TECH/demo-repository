-- ==============================================================================
-- ALLEVIARE PHARMA SFA ENTERPRISE - COMPLETE SUPABASE PRODUCTION SCHEMA
-- Master Architecture with Multi-Tenancy & Sovereign Governance
-- Single Master Super Admin: Akshyatraj Pati (akshatrajpati@gmail.com)
--
-- Instructions: Paste this ENTIRE script into Supabase SQL Editor & click "Run"
-- ==============================================================================

-- 1. RESET SCHEMA & PERMISSIONS
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 2. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 3. SOVEREIGN COUNTRY & COMPLIANCE REGISTRY
-- ==============================================================================
CREATE TABLE sovereign_countries (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    currency_code VARCHAR(20) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    fx_rate_to_usd NUMERIC(14,4) DEFAULT 1.0000,
    primary_timezone VARCHAR(64) NOT NULL,
    calling_code VARCHAR(10) NOT NULL,
    tax_scheme VARCHAR(100) NOT NULL,
    social_security VARCHAR(100),
    fiscal_year VARCHAR(50) NOT NULL,
    regulatory_body VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. SAAS SUBSCRIPTION PLANS (Super Admin Configurable Tiers)
-- ==============================================================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier VARCHAR(50) NOT NULL DEFAULT 'STARTER',
    price_monthly NUMERIC(12,2) NOT NULL DEFAULT 100.00,
    price_yearly NUMERIC(12,2) DEFAULT 1000.00,
    trial_days INT DEFAULT 14,
    grace_period_days INT DEFAULT 7,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_code ON subscription_plans(code);
CREATE INDEX idx_plans_tier ON subscription_plans(tier);

-- Seed Default Enterprise Plans
INSERT INTO subscription_plans (id, code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active, is_custom)
VALUES 
('00000000-0000-0000-0000-000000000101', 'FREE_TRIAL', 'Free Trial / Demo', 'Pilot evaluation with full feature access for a configurable trial period.', 'FREE_TRIAL', 0.00, 0.00, 14, 7, '["Unlimited Users & Admins", "Field DCR & GPS Tracking", "Chemist & Doctor Directories", "Configurable Start & End Dates", "Full Analytics Suite"]'::jsonb, true, false),
('00000000-0000-0000-0000-000000000102', 'STARTER', 'Starter Tier', 'Entry-level pharma distribution for growing teams and regional distributors.', 'STARTER', 100.00, 1000.00, 14, 7, '["Unlimited Field Users & Admins", "Core MR Daily Call Reports", "Chemist Order Booking (POB)", "Product Catalog & Samples", "Email Support"]'::jsonb, true, false),
('00000000-0000-0000-0000-000000000103', 'PROFESSIONAL', 'Professional Tier', 'Complete operational powerhouse for regional pharma manufacturers.', 'PROFESSIONAL', 1000.00, 10000.00, 14, 7, '["Unlimited Field Reps & Managers", "Tour Plans (MTP) & Approvals", "TA / DA Smart Expense Claims", "Statutory Payroll & Compliance", "Live Geo-Tracking & Hierarchy"]'::jsonb, true, false),
('00000000-0000-0000-0000-000000000104', 'ENTERPRISE', 'Enterprise Tier', 'For multinational pharmaceutical conglomerates requiring sovereign multi-region compliance.', 'ENTERPRISE', 2500.00, 25000.00, 30, 14, '["Unlimited Field Reps & Executive GMs", "Multi-Country Sovereign Isolation", "AI Prescription OCR & Studio", "Automated SAP/Oracle ERP Sync", "24/7 Dedicated SLA Support"]'::jsonb, true, false),
('00000000-0000-0000-0000-000000000105', 'CUSTOM', 'Custom Enterprise Tier', 'Tailored contract terms, bespoke pricing, and custom SLAs as per client requirements.', 'CUSTOM', 0.00, 0.00, 14, 14, '["Unlimited Users & Custom Limits", "Custom USD Rate & Contract Terms", "Flexible Billing Schedules", "Bespoke ERP Integration & On-Premises Option", "Dedicated Solutions Architect"]'::jsonb, true, true)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- 5. TENANTS / PHARMA COMPANIES
-- ==============================================================================
CREATE TABLE tenants_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    default_timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    currency_code VARCHAR(20) NOT NULL DEFAULT 'USD',
    plan VARCHAR(50) NOT NULL DEFAULT 'STARTER',
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'Monthly',
    monthly_rate NUMERIC(12,2) DEFAULT 100.00,
    is_custom_pricing BOOLEAN DEFAULT false,
    custom_rate NUMERIC(12,2) DEFAULT 0.00,
    trial_start_at TIMESTAMP WITH TIME ZONE,
    trial_end_at TIMESTAMP WITH TIME ZONE,
    subscription_start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_end_at TIMESTAMP WITH TIME ZONE,
    grace_period_days INT DEFAULT 7,
    auto_suspend_after_grace BOOLEAN DEFAULT true,
    last_renewed_at TIMESTAMP WITH TIME ZONE,
    renewal_count INT DEFAULT 0,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_country ON tenants_companies(country_code);
CREATE INDEX idx_tenants_status ON tenants_companies(status);

-- ==============================================================================
-- 6. TENANT SUBSCRIPTIONS & LEDGER
-- ==============================================================================
CREATE TABLE tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP WITH TIME ZONE,
    grace_period_days INT DEFAULT 7,
    auto_suspend_after_grace BOOLEAN DEFAULT true,
    is_trial BOOLEAN DEFAULT false,
    renewed_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    invoice_currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    amount_billed NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'Monthly',
    payment_method VARCHAR(50) DEFAULT 'Bank Wire / ACH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_tenant ON tenant_subscriptions(tenant_id);

-- ==============================================================================
-- 6. USERS & ACCESS CONTROL (Akshyatraj Pati as Master Super Admin)
-- ==============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    territory VARCHAR(100),
    phone VARCHAR(50),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    is_locked BOOLEAN DEFAULT false,
    lock_reason TEXT,
    token_version INT DEFAULT 0,
    permissions JSONB DEFAULT '{"manage_users": true, "manage_products": true, "manage_orders": true, "manage_doctors": true, "manage_dcr": true, "view_analytics": true, "export_data": true, "system_settings": false}'::jsonb,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_users_global_or_tenant 
ON users (COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'::UUID), email);

CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX idx_users_email ON users(email);

-- ==============================================================================
-- 7. DOCTOR SPECIALTIES
-- ==============================================================================
CREATE TABLE doctor_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- ==============================================================================
-- 8. DOCTORS & HEALTHCARE PROFESSIONALS (HCPs)
-- ==============================================================================
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100),
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    clinic_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(30),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    phone VARCHAR(50),
    email VARCHAR(255),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    visit_frequency VARCHAR(20) DEFAULT 'Bi-Weekly',
    category VARCHAR(10) DEFAULT 'A',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doctors_tenant ON doctors(tenant_id);
CREATE INDEX idx_doctors_city ON doctors(tenant_id, city);
CREATE INDEX idx_doctors_specialty ON doctors(tenant_id, specialty);

-- ==============================================================================
-- 9. CHEMISTS & PHARMACIES
-- ==============================================================================
CREATE TABLE chemists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    drug_license_no VARCHAR(100),
    gst_vat_no VARCHAR(100),
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(30),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chemists_tenant ON chemists(tenant_id);
CREATE INDEX idx_chemists_city ON chemists(tenant_id, city);

-- ==============================================================================
-- 10. STOCKISTS & DISTRIBUTORS
-- ==============================================================================
CREATE TABLE stockists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    agency_name VARCHAR(255) NOT NULL,
    drug_license_no VARCHAR(100),
    gst_vat_no VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    credit_limit NUMERIC(14,2) DEFAULT 100000.00,
    credit_days INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stockists_tenant ON stockists(tenant_id);

-- ==============================================================================
-- 11. PRODUCT CATEGORIES & PRODUCTS
-- ==============================================================================
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand VARCHAR(100),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    dosage_form VARCHAR(50),
    composition TEXT,
    pack_size VARCHAR(50),
    mrp NUMERIC(12,2) NOT NULL,
    pts NUMERIC(12,2) NOT NULL,
    ptr NUMERIC(12,2) NOT NULL,
    gst_rate NUMERIC(5,2) DEFAULT 12.00,
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    is_sample BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_brand ON products(tenant_id, brand);

-- ==============================================================================
-- 12. DAILY CALL REPORTS (DCR)
-- ==============================================================================
CREATE TABLE daily_call_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    chemist_id UUID REFERENCES chemists(id) ON DELETE SET NULL,
    stockist_id UUID REFERENCES stockists(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    visit_time TIME,
    call_type VARCHAR(50) NOT NULL,
    ppo_amount NUMERIC(12,2) DEFAULT 0.00,
    samples_given JSONB DEFAULT '[]'::jsonb,
    gifts_given JSONB DEFAULT '[]'::jsonb,
    doctor_feedback TEXT,
    remarks TEXT,
    gps_lat NUMERIC(10, 7),
    gps_lng NUMERIC(10, 7),
    gps_accuracy NUMERIC(8,2),
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'Approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dcr_tenant_date ON daily_call_reports(tenant_id, visit_date);
CREATE INDEX idx_dcr_mr_date ON daily_call_reports(mr_id, visit_date);

-- ==============================================================================
-- 13. ORDERS
-- ==============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    order_no VARCHAR(64) NOT NULL,
    chemist_id UUID REFERENCES chemists(id) ON DELETE SET NULL,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stockist_id UUID REFERENCES stockists(id) ON DELETE SET NULL,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    payment_terms VARCHAR(50) DEFAULT 'Credit 30 Days',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    remarks TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_order_no UNIQUE (tenant_id, order_no)
);

CREATE INDEX idx_orders_tenant_date ON orders(tenant_id, order_date);
CREATE INDEX idx_orders_mr ON orders(tenant_id, mr_id);

-- ==============================================================================
-- 14. EXPENSE CLAIMS
-- ==============================================================================
CREATE TABLE expense_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    exchange_rate NUMERIC(12,6) DEFAULT 1.000000,
    origin_city VARCHAR(100),
    destination_city VARCHAR(100),
    distance_km NUMERIC(8,2) DEFAULT 0.00,
    receipt_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_tenant_mr ON expense_claims(tenant_id, mr_id);
CREATE INDEX idx_expense_date ON expense_claims(tenant_id, claim_date);

-- ==============================================================================
-- 15. TOUR PLANS
-- ==============================================================================
CREATE TABLE tour_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2020),
    plan_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approval_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mr_tour_month UNIQUE (tenant_id, mr_id, month, year)
);

CREATE INDEX idx_tour_tenant_period ON tour_plans(tenant_id, year, month);

-- ==============================================================================
-- 16. ATTENDANCE LOGS
-- ==============================================================================
CREATE TABLE attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    punch_in TIMESTAMP WITH TIME ZONE,
    punch_out TIMESTAMP WITH TIME ZONE,
    punch_in_lat NUMERIC(10, 7),
    punch_in_lng NUMERIC(10, 7),
    punch_out_lat NUMERIC(10, 7),
    punch_out_lng NUMERIC(10, 7),
    total_hours NUMERIC(6,2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'Present',
    battery_level INT,
    device_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_work_date UNIQUE (tenant_id, user_id, work_date)
);

CREATE INDEX idx_att_tenant_date ON attendance_logs(tenant_id, work_date);

-- ==============================================================================
-- 17. GPS TELEMETRY & LIVE TRACKING PINGS
-- ==============================================================================
CREATE TABLE gps_tracking_pings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(8,2),
    speed NUMERIC(8,2),
    altitude NUMERIC(8,2),
    battery_level INT,
    is_mock_location BOOLEAN DEFAULT false,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gps_user_time ON gps_tracking_pings(user_id, recorded_at DESC);
CREATE INDEX idx_gps_tenant_time ON gps_tracking_pings(tenant_id, recorded_at DESC);

-- ==============================================================================
-- 18. PLATFORM AUDIT LOGS
-- ==============================================================================
CREATE TABLE platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tenant_time ON platform_audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_action ON platform_audit_logs(action);

-- ==============================================================================
-- 19. SYSTEM ALERTS
-- ==============================================================================
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'Info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_tenant_unread ON system_alerts(tenant_id, is_read, created_at DESC);

-- ==============================================================================
-- 20. ADMIN LOGIN HISTORY & SECURITY ACCESS AUDIT
-- ==============================================================================
CREATE TABLE admin_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    device_info VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Success',
    failure_reason TEXT,
    logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_history_user_time ON admin_login_history(user_id, logged_in_at DESC);
CREATE INDEX idx_login_history_email ON admin_login_history(email);

-- ==============================================================================
-- 21. MASTER SUPER ADMIN: Akshyatraj Pati (Single User)
-- Password: SuperAdmin@2026! (Cryptographically Verified Bcrypt Hash)
-- ==============================================================================
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
);

-- ==============================================================================
-- 21. PLATFORM GLOBAL SETTINGS & RBAC ROLE TEMPLATES
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

INSERT INTO platform_settings (id, date_format, timezone, currency, language, session_timeout_minutes)
VALUES ('global_default', 'YYYY-MM-DD', 'UTC', 'USD', 'en', 60)
ON CONFLICT (id) DO NOTHING;

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

-- ==============================================================================
-- 22. GRANT ALL PERMISSIONS TO SUPABASE ROLES
-- ==============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- Disable Row Level Security (RLS) so web client has unrestricted read access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE chemists DISABLE ROW LEVEL SECURITY;
ALTER TABLE stockists DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_call_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE expense_claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE gps_tracking_pings DISABLE ROW LEVEL SECURITY;
ALTER TABLE platform_audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_login_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_templates DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 23. SECURITY GOVERNANCE & ACTIVE SESSIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    ip_address VARCHAR(64) NOT NULL,
    geo_location VARCHAR(255) DEFAULT 'Unknown',
    device_info VARCHAR(255) NOT NULL,
    browser VARCHAR(100),
    is_mfa_authenticated BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user ON platform_active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_status ON platform_active_sessions(status);

CREATE TABLE IF NOT EXISTS platform_security_threat_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(64),
    user_email VARCHAR(255),
    company_name VARCHAR(255),
    action_taken VARCHAR(255),
    status VARCHAR(50) DEFAULT 'UNRESOLVED',
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_threat_alerts_status ON platform_security_threat_alerts(status);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_severity ON platform_security_threat_alerts(severity);

-- ==============================================================================
-- 24. DATA MANAGEMENT & COLD ARCHIVES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS company_data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    export_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    data_scope VARCHAR(100) NOT NULL DEFAULT 'FULL_INSTANCE',
    format VARCHAR(20) NOT NULL DEFAULT 'ZIP_JSON',
    status VARCHAR(50) NOT NULL DEFAULT 'READY',
    file_size_mb NUMERIC(10,2) DEFAULT 45.20,
    download_url TEXT,
    download_expires_at TIMESTAMP WITH TIME ZONE,
    requested_by VARCHAR(255) NOT NULL,
    encryption_mode VARCHAR(50) DEFAULT 'AES-256',
    checksum VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_data_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    archive_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    storage_tier VARCHAR(50) NOT NULL DEFAULT 'GLACIER_DEEP_COLD',
    archive_reason VARCHAR(255) NOT NULL DEFAULT 'ANNUAL_COMPLIANCE_ARCHIVE',
    status VARCHAR(50) NOT NULL DEFAULT 'ARCHIVED',
    archive_size_gb NUMERIC(10,2) DEFAULT 12.40,
    archived_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_retention_policies (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL,
    auto_purge BOOLEAN DEFAULT true,
    archive_before_purge BOOLEAN DEFAULT true,
    legal_hold_exempt BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_restore_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    backup_snapshot_id VARCHAR(100) NOT NULL,
    point_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    target_environment VARCHAR(50) NOT NULL DEFAULT 'STAGING_SANDBOX',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    requested_by VARCHAR(255) NOT NULL,
    reviewed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    deletion_type VARCHAR(50) NOT NULL DEFAULT 'GDPR_RIGHT_TO_BE_FORGOTTEN',
    scope VARCHAR(100) NOT NULL DEFAULT 'DCR_GPS_AND_PERSONAL_DATA',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    verification_token VARCHAR(100) NOT NULL DEFAULT 'CONFIRM_PURGE',
    safety_grace_days INT DEFAULT 7,
    requested_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- 25. API MANAGEMENT & INTEGRATIONS GATEWAY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(50) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    tier VARCHAR(50) DEFAULT 'ENTERPRISE',
    scopes JSONB DEFAULT '["read:dcr", "write:orders", "read:inventory", "read:analytics"]'::jsonb,
    rate_limit_rpm INT DEFAULT 1200,
    daily_quota INT DEFAULT 500000,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_api_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_id VARCHAR(100) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    client_type VARCHAR(50) DEFAULT 'ENTERPRISE_ERP',
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    grant_types JSONB DEFAULT '["client_credentials", "authorization_code"]'::jsonb,
    redirect_uris JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    events JSONB DEFAULT '["order.created", "order.approved", "dcr.submitted", "user.lockout"]'::jsonb,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    secret_key VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    consecutive_failures INT DEFAULT 0,
    last_delivery_status INT DEFAULT 200,
    last_delivery_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_api_failed_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(100) UNIQUE NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(20) NOT NULL,
    status_code INT NOT NULL,
    client_id VARCHAR(100),
    company_name VARCHAR(255),
    error_reason TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    retry_count INT DEFAULT 0,
    resolved BOOLEAN DEFAULT false,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 26. NOTIFICATION MANAGEMENT & GLOBAL ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_global_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- MAINTENANCE | NEW_FEATURE | SECURITY | VERSION_UPDATE | PLATFORM_POLICY | TERMS_UPDATE
    category VARCHAR(100) DEFAULT 'GENERAL',
    priority VARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO | WARNING | CRITICAL | URGENT
    content TEXT NOT NULL,
    summary VARCHAR(500),
    target_audience VARCHAR(50) NOT NULL DEFAULT 'ALL_COMPANIES', -- ALL_COMPANIES | SPECIFIC_TENANTS | ADMINS_ONLY | FIELD_REPS_ONLY
    target_tenant_ids JSONB DEFAULT '[]'::jsonb,
    target_roles JSONB DEFAULT '[]'::jsonb,
    channels JSONB DEFAULT '["IN_APP_BANNER", "POPUP_MODAL"]'::jsonb, -- IN_APP_BANNER | POPUP_MODAL | EMAIL_BROADCAST | PUSH_NOTIFICATION
    is_pinned_banner BOOLEAN DEFAULT false,
    requires_acknowledgment BOOLEAN DEFAULT false,
    action_cta_text VARCHAR(100),
    action_cta_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED', -- DRAFT | SCHEDULED | PUBLISHED | ARCHIVED
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    total_sent INT DEFAULT 0,
    total_read INT DEFAULT 0,
    total_acknowledged INT DEFAULT 0,
    created_by VARCHAR(255) NOT NULL DEFAULT 'master.superadmin@orvexa.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_type ON platform_global_announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON platform_global_announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON platform_global_announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON platform_global_announcements(is_pinned_banner);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON platform_global_announcements(created_at DESC);

CREATE TABLE IF NOT EXISTS announcement_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES platform_global_announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    role VARCHAR(50),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    ip_address VARCHAR(64),
    user_agent TEXT,
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_announcement_user UNIQUE (announcement_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_ack_announcement ON announcement_acknowledgments(announcement_id);
CREATE INDEX IF NOT EXISTS idx_ack_tenant ON announcement_acknowledgments(tenant_id);

-- ==============================================================================
-- 27. DISABLE RLS ON NEW ENHANCEMENTS
-- ==============================================================================
ALTER TABLE IF EXISTS platform_active_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_security_threat_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_data_exports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_data_archives DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_retention_policies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_restore_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_deletion_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_failed_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_global_announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcement_acknowledgments DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- 28. CONFIRMATION & VERIFICATION OUTPUT
SELECT '🎉 Complete Supabase database schema and Super Admin provisioned!' as status,
       (SELECT count(*) FROM users) as total_users,
       (SELECT email FROM users WHERE role = 'SUPER_ADMIN') as super_admin_email;



