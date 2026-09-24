-- ==============================================================================
-- COMPREHENSIVE BILLING, INVOICING, PAYMENTS & PLANS SCHEMA FOR SUPABASE / POSTGRESQL
-- ==============================================================================

-- 1. Ensure Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SaaS Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.saas_subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tier VARCHAR(64) NOT NULL DEFAULT 'STARTER', -- FREE_TRIAL, STARTER, GROWTH, PROFESSIONAL, ENTERPRISE, ENTERPRISE_SOVEREIGN, CUSTOM
    price_monthly NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    price_yearly NUMERIC(14, 2) NOT NULL DEFAULT 1000.00,
    currency VARCHAR(10) DEFAULT 'USD',
    trial_days INTEGER DEFAULT 14,
    grace_period_days INTEGER DEFAULT 7,
    max_users INTEGER DEFAULT 100,
    max_storage_gb INTEGER DEFAULT 25,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Billing Invoices Table
CREATE TABLE IF NOT EXISTS public.platform_billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES public.tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    plan_tier VARCHAR(64) DEFAULT 'ENTERPRISE',
    billing_cycle VARCHAR(32) DEFAULT 'Monthly', -- Monthly, Quarterly, Annual
    amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(14, 2) DEFAULT 0.00,
    discount_amount NUMERIC(14, 2) DEFAULT 0.00,
    net_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PAID, PENDING, OVERDUE, FAILED, REFUNDED, CANCELLED
    issued_date DATE DEFAULT CURRENT_DATE NOT NULL,
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days') NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(64) DEFAULT 'CREDIT_CARD', -- CREDIT_CARD, WIRE_TRANSFER, ACH, STRIPE, RAZORPAY
    pdf_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Billing Payments Table
CREATE TABLE IF NOT EXISTS public.platform_billing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(64) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES public.platform_billing_invoices(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_gateway VARCHAR(64) DEFAULT 'STRIPE', -- STRIPE, RAZORPAY, WIRE_TRANSFER, ACH, PAYPAL
    gateway_transaction_id VARCHAR(128),
    payment_method VARCHAR(64) DEFAULT 'VISA **** 4242',
    status VARCHAR(32) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, PENDING, FAILED, REFUNDED
    failure_reason TEXT,
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Billing Refunds Table
CREATE TABLE IF NOT EXISTS public.platform_billing_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_number VARCHAR(64) UNIQUE NOT NULL,
    payment_id UUID REFERENCES public.platform_billing_payments(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES public.platform_billing_invoices(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    reason VARCHAR(255) DEFAULT 'Customer Request / Cancellation',
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, PROCESSING, REJECTED
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Add-Ons Catalog Table
CREATE TABLE IF NOT EXISTS public.saas_subscription_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) DEFAULT 'AI_AND_STORAGE', -- AI_AND_STORAGE, SECURITY, API, COMPLIANCE
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    price_yearly NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
    currency VARCHAR(10) DEFAULT 'USD',
    unit_label VARCHAR(64) DEFAULT 'per pack',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Platform Audit Logs Table
CREATE TABLE IF NOT EXISTS public.platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL DEFAULT 'SUPER_ADMIN',
    action VARCHAR(128) NOT NULL,
    target_entity VARCHAR(128) NOT NULL,
    entity_id VARCHAR(128),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64) DEFAULT '127.0.0.1',
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Enable RLS and Add Permissive Policies
ALTER TABLE public.saas_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_billing_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_billing_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_subscription_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access on saas_subscription_plans" ON public.saas_subscription_plans;
CREATE POLICY "Allow all access on saas_subscription_plans" ON public.saas_subscription_plans FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on platform_billing_invoices" ON public.platform_billing_invoices;
CREATE POLICY "Allow all access on platform_billing_invoices" ON public.platform_billing_invoices FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on platform_billing_payments" ON public.platform_billing_payments;
CREATE POLICY "Allow all access on platform_billing_payments" ON public.platform_billing_payments FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on platform_billing_refunds" ON public.platform_billing_refunds;
CREATE POLICY "Allow all access on platform_billing_refunds" ON public.platform_billing_refunds FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on saas_subscription_addons" ON public.saas_subscription_addons FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on saas_subscription_addons" ON public.saas_subscription_addons FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on platform_audit_logs" ON public.platform_audit_logs;
CREATE POLICY "Allow all access on platform_audit_logs" ON public.platform_audit_logs FOR ALL TO public, anon, authenticated, service_role USING (true) WITH CHECK (true);

-- 9. Grant Permissions
GRANT ALL ON TABLE public.saas_subscription_plans TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.platform_billing_invoices TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.platform_billing_payments TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.platform_billing_refunds TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.saas_subscription_addons TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.platform_audit_logs TO postgres, service_role, anon, authenticated;

-- 10. Seed Default Master Reference Plans
INSERT INTO public.saas_subscription_plans (code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, max_users, max_storage_gb, features, is_active, is_custom)
VALUES
('FREE_TRIAL', 'Free Trial / Evaluation', 'Full feature access evaluation for 14 to 30 days.', 'FREE_TRIAL', 0, 0, 14, 7, 50, 10, '["Full DCR Reporting", "GPS Live Punch", "Chemist Orders", "Doctor 360° Catalog"]'::jsonb, true, false),
('STARTER', 'Starter Tier', 'Standard SFA deployment for small regional pharma distributors.', 'STARTER', 100, 1000, 14, 7, 100, 25, '["Core Field Reporting", "Chemist Orders (POB)", "Product Catalog", "Standard Analytics", "Email Support"]'::jsonb, true, false),
('GROWTH', 'Growth Tier', 'Mid-market pharma manufacturers scaling regional sales teams.', 'GROWTH', 450, 4500, 14, 7, 250, 50, '["Smart Expense Claims", "Tour Plans (MTP)", "Real-time Telemetry", "Priority Support"]'::jsonb, true, false),
('PROFESSIONAL', 'Professional Tier', 'Enterprise-grade sales force automation with advanced analytics.', 'PROFESSIONAL', 1000, 10000, 14, 7, 500, 100, '["AI Prescription OCR", "Custom Beat Routing", "ERP Sync Ready", "Audit Retention"]'::jsonb, true, false),
('ENTERPRISE', 'Enterprise Sovereign', 'Dedicated sovereign isolation and custom compliance frameworks.', 'ENTERPRISE', 2500, 25000, 30, 14, 2500, 500, '["Sovereign Isolation", "21 CFR Part 11", "Custom ERP Connectors", "Dedicated Account GM", "24/7 SLA"]'::jsonb, true, false)
ON CONFLICT (code) DO NOTHING;
