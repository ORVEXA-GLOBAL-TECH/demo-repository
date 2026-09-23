-- ==============================================================================
-- COMPREHENSIVE TENANTS & COMPANIES TABLE FOR SUPABASE / POSTGRESQL
-- Enterprise Multi-Tenant Pharma Governance Schema
-- ==============================================================================

-- 1. Ensure Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create tenants_companies Table
CREATE TABLE IF NOT EXISTS public.tenants_companies (
    -- Unique Identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,                       -- Unique tenant slug / code (e.g., 'novartis-in')
    name VARCHAR(255) NOT NULL,                              -- Commercial brand name (e.g., 'Novartis India')
    legal_name VARCHAR(255),                                 -- Registered corporate entity name
    industry_segment VARCHAR(64) DEFAULT 'PHARMACEUTICALS',  -- PHARMACEUTICALS, BIOTECH, MEDICAL_DEVICES, etc.
    company_type VARCHAR(64) DEFAULT 'ENTERPRISE',           -- ENTERPRISE, MID_MARKET, STARTUP, CDMO_CRO
    tax_id VARCHAR(64),                                      -- Tax / VAT / GSTIN registration number

    -- Branding & Custom Domains
    logo_url TEXT,
    favicon_url TEXT,
    brand_primary_color VARCHAR(32) DEFAULT '#0284c7',
    website_url TEXT,
    subdomain VARCHAR(100) UNIQUE,                           -- e.g. 'novartis.alleviare.com'
    custom_domain VARCHAR(255),                              -- e.g. 'portal.novartis.com'

    -- Regional & Compliance Governance
    country_code VARCHAR(10) DEFAULT 'IN',
    operating_countries JSONB DEFAULT '["IN"]'::jsonb,       -- Operating sovereign territories array
    default_timezone VARCHAR(64) DEFAULT 'Asia/Kolkata',
    currency_code VARCHAR(10) DEFAULT 'INR',
    date_format VARCHAR(32) DEFAULT 'DD/MM/YYYY',
    fiscal_year_start VARCHAR(16) DEFAULT 'APRIL',
    compliance_frameworks JSONB DEFAULT '["21_CFR_PART_11", "GXP", "ISO_27001"]'::jsonb,
    data_residency_region VARCHAR(64) DEFAULT 'ap-south-1',

    -- Subscription & Commercial Terms
    plan VARCHAR(64) NOT NULL DEFAULT 'STARTER',             -- FREE_TRIAL, STARTER, GROWTH, PROFESSIONAL, ENTERPRISE_SOVEREIGN, CUSTOM
    billing_cycle VARCHAR(32) DEFAULT 'Monthly',             -- Monthly, Quarterly, Annual, Multi-Year
    monthly_rate NUMERIC(12,2) DEFAULT 100.00,
    annual_contract_value NUMERIC(14,2) DEFAULT 1200.00,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_terms VARCHAR(64) DEFAULT 'NET_30',
    po_number VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'Active',            -- Active, Trial, Suspended, Deactivated
    trial_start_at TIMESTAMPTZ,
    trial_end_at TIMESTAMPTZ,
    subscription_start_at TIMESTAMPTZ,
    subscription_end_at TIMESTAMPTZ,
    grace_period_days INTEGER DEFAULT 14,
    auto_renew BOOLEAN DEFAULT TRUE,

    -- Capacity Quotas & Limits
    max_users INTEGER DEFAULT 100,                           -- Total user licenses/seats
    max_storage_gb INTEGER DEFAULT 25,                       -- Storage allocation in GB
    api_rate_limit_per_min INTEGER DEFAULT 600,              -- API throughput quota

    -- Module & Feature Entitlements
    settings JSONB DEFAULT '{
      "modules": {
        "mrReporting": true,
        "dcr": true,
        "tourPlan": true,
        "gpsLiveTracking": true,
        "doctorManagement": true,
        "chemistStockist": true,
        "orderManagement": true,
        "expenseManagement": true,
        "sampleDistribution": false,
        "visualAids": true,
        "aiAnalytics": false,
        "whatsappAlerts": true,
        "offlineSync": true
      }
    }'::jsonb,

    -- Primary Root Admin & Contact
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(64),
    admin_user_id UUID NULL,

    -- Security & Governance Policies
    mfa_enforced BOOLEAN DEFAULT FALSE,
    session_timeout_minutes INTEGER DEFAULT 15,
    ip_whitelist JSONB DEFAULT '[]'::jsonb,
    audit_retention_years INTEGER DEFAULT 7,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ NULL
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_code ON public.tenants_companies(code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON public.tenants_companies(status);
CREATE INDEX IF NOT EXISTS idx_tenants_country ON public.tenants_companies(country_code);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON public.tenants_companies(plan);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON public.tenants_companies(contact_email);
CREATE INDEX IF NOT EXISTS idx_tenants_created_at ON public.tenants_companies(created_at DESC);

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION update_tenants_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tenants_companies_updated_at ON public.tenants_companies;
CREATE TRIGGER trg_tenants_companies_updated_at
BEFORE UPDATE ON public.tenants_companies
FOR EACH ROW
EXECUTE FUNCTION update_tenants_companies_updated_at();

-- 5. Foreign Key from users.tenant_id to tenants_companies.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_users_tenant'
    ) THEN
        ALTER TABLE public.users 
        ADD CONSTRAINT fk_users_tenant 
        FOREIGN KEY (tenant_id) 
        REFERENCES public.tenants_companies(id) 
        ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Foreign key could not be applied or already exists: %', SQLERRM;
END $$;

-- 6. Grant Access for Public & Authenticated Roles in Supabase
GRANT ALL ON TABLE public.tenants_companies TO postgres, service_role, anon, authenticated;
