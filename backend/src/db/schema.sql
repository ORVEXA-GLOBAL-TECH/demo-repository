-- ==============================================================================
-- ALLEVIARE PHARMA SFA ENTERPRISE RELATIONAL SCHEMA
-- Database: PostgreSQL 14+ / 16+
-- Multi-Tenant & Multi-Country Architecture with Row Level Isolation
-- ==============================================================================

-- Enable UUID extension for high-performance non-sequential identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. SOVEREIGN COUNTRY & COMPLIANCE REGISTRY (24 Sovereign Markets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sovereign_countries (
    code VARCHAR(3) PRIMARY KEY,              -- ISO 3166-1 alpha-2/3 (e.g., 'VN', 'KH', 'TH', 'IN')
    name VARCHAR(100) NOT NULL,              -- English Country Name
    native_name VARCHAR(100),                -- Local / Sovereign Script
    currency_code VARCHAR(5) NOT NULL,       -- ISO 4217 (VND, KHR, THB, INR, USD, etc.)
    currency_symbol VARCHAR(10) NOT NULL,    -- ₫, ៛, ฿, ₹, $, etc.
    primary_timezone VARCHAR(64) NOT NULL,   -- 'Asia/Bangkok', 'Asia/Kolkata', 'Asia/Dubai'
    calling_code VARCHAR(10) NOT NULL,       -- '+84', '+855', '+66', '+91'
    tax_scheme VARCHAR(50) NOT NULL,         -- 'VAT 8/10%', 'GST 4-Tier', 'VAT 7%'
    social_security VARCHAR(60),             -- 'VSS (Social/Health)', 'NSSF (Cambodia)', 'EPFO+ESIC'
    fiscal_year VARCHAR(30) NOT NULL,        -- 'Jan 01 - Dec 31' or 'Apr 01 - Mar 31'
    regulatory_body VARCHAR(100),            -- 'DAV (Vietnam)', 'MOH-DDF (Cambodia)', 'FDA Thailand'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. TENANTS / PHARMA COMPANIES (Multi-Tenant Master)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tenants_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,        -- Unique tenant identifier slug (e.g. 'pharma-corp-vn')
    name VARCHAR(255) NOT NULL,              -- Display Name
    legal_name VARCHAR(255),                 -- Official Registered Entity Name
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    default_timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    plan VARCHAR(50) NOT NULL DEFAULT 'Enterprise', -- 'Starter', 'Growth', 'Enterprise', 'Sovereign-Tier'
    status VARCHAR(30) NOT NULL DEFAULT 'Active',    -- 'Active', 'Trial', 'Suspended', 'Deactivated'
    max_mrs INT NOT NULL DEFAULT 50,
    max_admins INT NOT NULL DEFAULT 5,
    max_doctors INT NOT NULL DEFAULT 5000,
    max_storage_gb NUMERIC(8,2) NOT NULL DEFAULT 50.0,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'Monthly', -- 'Monthly', 'Annual'
    monthly_rate NUMERIC(12,2) DEFAULT 0.00,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    settings JSONB DEFAULT '{}'::jsonb,      -- Custom features, module toggles, color branding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tenants_country ON tenants_companies(country_code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants_companies(status);

-- ==============================================================================
-- 3. TENANT SUBSCRIPTIONS & LICENSES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active', -- 'Active', 'Past_Due', 'Cancelled', 'Trial'
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    invoice_currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    amount_billed NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'Monthly',
    payment_method VARCHAR(50) DEFAULT 'Bank Wire / ACH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sub_tenant ON tenant_subscriptions(tenant_id);

-- ==============================================================================
-- 4. USERS & ACCESS CONTROL (Multi-Tenant & Super Admin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE, -- NULL for platform superadmins
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,               -- 'SUPER_ADMIN', 'COMPANY_ADMIN', 'REGIONAL_MANAGER', 'MEDICAL_REP'
    territory VARCHAR(100),                  -- Assigned field territory or HQ zone
    phone VARCHAR(50),
    country_code VARCHAR(3) REFERENCES sovereign_countries(code),
    status VARCHAR(30) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended'
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==============================================================================
-- 5. DOCTORS & HEALTHCARE PROFESSIONALS (HCPs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100),            -- Medical Council License No.
    specialty VARCHAR(100) NOT NULL,         -- 'Cardiologist', 'Oncologist', 'General Physician'
    qualification VARCHAR(100),              -- 'MD, MBBS, DM'
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
    visit_frequency VARCHAR(20) DEFAULT 'Bi-Weekly', -- 'Weekly', 'Bi-Weekly', 'Monthly'
    category VARCHAR(10) DEFAULT 'A',                -- 'Core / Tier-1 (A)', 'Tier-2 (B)', 'Tier-3 (C)'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctors_tenant ON doctors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(tenant_id, city);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(tenant_id, specialty);

-- ==============================================================================
-- 6. CHEMISTS & PHARMACIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS chemists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,              -- Owner / Pharmacist Name
    shop_name VARCHAR(255) NOT NULL,         -- Pharmacy / Store Name
    drug_license_no VARCHAR(100),            -- State / Sovereign Pharmacy License
    gst_vat_no VARCHAR(100),                 -- Tax Identification
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

CREATE INDEX IF NOT EXISTS idx_chemists_tenant ON chemists(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chemists_city ON chemists(tenant_id, city);

-- ==============================================================================
-- 7. STOCKISTS & DISTRIBUTORS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS stockists (
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

CREATE INDEX IF NOT EXISTS idx_stockists_tenant ON stockists(tenant_id);

-- ==============================================================================
-- 8. PRODUCT CATEGORIES & PHARMA PRODUCT CATALOG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand VARCHAR(100),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    dosage_form VARCHAR(50),                 -- 'Tablet', 'Syrup', 'Capsule', 'Injectable', 'Ointment'
    composition TEXT,                        -- Active Pharmaceutical Ingredients (API)
    pack_size VARCHAR(50),                   -- '10x10 Tablets', '100ml Bottle'
    mrp NUMERIC(12,2) NOT NULL,              -- Maximum Retail Price
    pts NUMERIC(12,2) NOT NULL,              -- Price To Stockist
    ptr NUMERIC(12,2) NOT NULL,              -- Price To Retailer
    gst_rate NUMERIC(5,2) DEFAULT 12.00,     -- Tax Percentage
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    is_sample BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(tenant_id, brand);

-- ==============================================================================
-- 9. DAILY CALL REPORTS (DCR - Core Field Activity)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS daily_call_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    chemist_id UUID REFERENCES chemists(id) ON DELETE SET NULL,
    stockist_id UUID REFERENCES stockists(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    visit_time TIME,
    call_type VARCHAR(50) NOT NULL,          -- 'Doctor Call', 'Chemist POB', 'Stockist Followup', 'RCPA'
    ppo_amount NUMERIC(12,2) DEFAULT 0.00,   -- Personal Order Booking Amount
    samples_given JSONB DEFAULT '[]'::jsonb, -- Array of [{ productId, qty, batchNo }]
    gifts_given JSONB DEFAULT '[]'::jsonb,
    doctor_feedback TEXT,
    remarks TEXT,
    gps_lat NUMERIC(10, 7),
    gps_lng NUMERIC(10, 7),
    gps_accuracy NUMERIC(8,2),
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'Approved', -- 'Submitted', 'Approved', 'Rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dcr_tenant_date ON daily_call_reports(tenant_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_dcr_mr_date ON daily_call_reports(mr_id, visit_date);

-- ==============================================================================
-- 10. ORDERS (Chemist & Stockist Booking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
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
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Invoiced', 'Dispatched', 'Delivered', 'Cancelled'
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Items array with SKU, Qty, PTR, Discount
    remarks TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_order_no UNIQUE (tenant_id, order_no)
);

CREATE INDEX IF NOT EXISTS idx_orders_tenant_date ON orders(tenant_id, order_date);
CREATE INDEX IF NOT EXISTS idx_orders_mr ON orders(tenant_id, mr_id);

-- ==============================================================================
-- 11. EXPENSE CLAIMS (Travel, Fuel, Lodging, Daily Allowance)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS expense_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,           -- 'Daily Allowance (DA)', 'Travel (TA)', 'Fuel', 'Hotel', 'Miscellaneous'
    amount NUMERIC(12,2) NOT NULL,
    currency_code VARCHAR(5) NOT NULL DEFAULT 'USD',
    exchange_rate NUMERIC(12,6) DEFAULT 1.000000,
    origin_city VARCHAR(100),
    destination_city VARCHAR(100),
    distance_km NUMERIC(8,2) DEFAULT 0.00,
    receipt_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Reimbursed'
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expense_tenant_mr ON expense_claims(tenant_id, mr_id);
CREATE INDEX IF NOT EXISTS idx_expense_date ON expense_claims(tenant_id, claim_date);

-- ==============================================================================
-- 12. TOUR PLANS (Monthly Medical Rep Route Schedule)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tour_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants_companies(id) ON DELETE CASCADE,
    mr_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2020),
    plan_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of daily route nodes
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Draft'
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approval_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mr_tour_month UNIQUE (tenant_id, mr_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_tour_tenant_period ON tour_plans(tenant_id, year, month);

-- ==============================================================================
-- 13. ATTENDANCE LOGS & GEO-PUNCH
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendance_logs (
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
    status VARCHAR(30) NOT NULL DEFAULT 'Present', -- 'Present', 'Half-Day', 'Leave', 'Holiday'
    battery_level INT,
    device_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_work_date UNIQUE (tenant_id, user_id, work_date)
);

CREATE INDEX IF NOT EXISTS idx_att_tenant_date ON attendance_logs(tenant_id, work_date);

-- ==============================================================================
-- 14. GPS TELEMETRY & LIVE TRACKING PINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS gps_tracking_pings (
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

CREATE INDEX IF NOT EXISTS idx_gps_user_time ON gps_tracking_pings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_gps_tenant_time ON gps_tracking_pings(tenant_id, recorded_at DESC);

-- ==============================================================================
-- 15. PLATFORM AUDIT LOGS (SOC-2 & 21 CFR Part 11 Compliance)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,            -- 'TENANT_CREATED', 'ROLE_CHANGED', 'DATA_EXPORT', 'DCR_MODIFIED'
    target_entity VARCHAR(100) NOT NULL,     -- 'tenants_companies', 'users', 'daily_call_reports'
    entity_id VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_time ON platform_audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON platform_audit_logs(action);

-- ==============================================================================
-- 16. SYSTEM ALERTS & EVENT BROADCASTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,               -- 'SECURITY', 'EXPIRATION', 'COMPLIANCE', 'SYSTEM'
    severity VARCHAR(20) NOT NULL DEFAULT 'Info', -- 'Info', 'Warning', 'Critical'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_tenant_unread ON system_alerts(tenant_id, is_read, created_at DESC);
