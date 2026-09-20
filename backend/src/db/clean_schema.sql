-- ==============================================================================
-- ALLEVIARE PHARMA SFA ENTERPRISE - CLEAN PRODUCTION DATABASE SCHEMA
-- Pure DDL Structure (Zero Mock Data, Zero Hardcoded Values)
-- Single Master Super Admin: Akshyatraj Pati
-- ==============================================================================

-- 1. Reset / Clean Schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Enable UUID & Crypto Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. SOVEREIGN COUNTRY & COMPLIANCE REGISTRY
-- ==============================================================================
CREATE TABLE sovereign_countries (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    currency_code VARCHAR(5) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    primary_timezone VARCHAR(64) NOT NULL,
    calling_code VARCHAR(10) NOT NULL,
    tax_scheme VARCHAR(50) NOT NULL,
    social_security VARCHAR(60),
    fiscal_year VARCHAR(30) NOT NULL,
    regulatory_body VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. TENANTS / PHARMA COMPANIES
-- ==============================================================================
CREATE TABLE tenants_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    default_timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    plan VARCHAR(50) NOT NULL DEFAULT 'Enterprise',
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    max_mrs INT NOT NULL DEFAULT 50,
    max_admins INT NOT NULL DEFAULT 5,
    max_doctors INT NOT NULL DEFAULT 5000,
    max_storage_gb NUMERIC(8,2) NOT NULL DEFAULT 50.0,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'Monthly',
    monthly_rate NUMERIC(12,2) DEFAULT 0.00,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_country ON tenants_companies(country_code);
CREATE INDEX idx_tenants_status ON tenants_companies(status);

-- ==============================================================================
-- 3. TENANT SUBSCRIPTIONS & LICENSES
-- ==============================================================================
CREATE TABLE tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    invoice_currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    amount_billed NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'Monthly',
    payment_method VARCHAR(50) DEFAULT 'Bank Wire / ACH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_tenant ON tenant_subscriptions(tenant_id);

-- ==============================================================================
-- 4. USERS & ACCESS CONTROL
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
-- 5. DOCTOR SPECIALTIES
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
-- 6. DOCTORS & HEALTHCARE PROFESSIONALS (HCPs)
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
-- 7. CHEMISTS & PHARMACIES
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
-- 8. STOCKISTS & DISTRIBUTORS
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
-- 9. PRODUCT CATEGORIES & PHARMA PRODUCTS
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
-- 10. DAILY CALL REPORTS (DCR)
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
-- 11. ORDERS
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
-- 12. EXPENSE CLAIMS
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
-- 13. TOUR PLANS
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
-- 14. ATTENDANCE LOGS
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
-- 15. GPS TELEMETRY & LIVE TRACKING PINGS
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
-- 16. PLATFORM AUDIT LOGS
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
-- 17. SYSTEM ALERTS
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
-- 18. MASTER SUPER ADMIN: Akshyatraj Pati (Single User)
-- ==============================================================================
-- 18. ONLY 1 USER: Master Super Admin (Akshyatraj Pati - ID: 001)
-- Password: SuperAdmin@2026!
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

-- 19. GRANT PERMISSIONS TO SUPABASE ROLES
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Confirmation output
SELECT 'Clean database created successfully!' as status,
       (SELECT count(*) FROM users) as total_users;
