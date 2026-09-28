-- ==============================================================================
-- SOVEREIGN COUNTRIES COMPLIANCE TABLE FOR SUPABASE / POSTGRESQL
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.sovereign_countries (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    native_name VARCHAR(255),
    currency_code VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) DEFAULT '$',
    primary_timezone VARCHAR(64) DEFAULT 'UTC',
    calling_code VARCHAR(16) DEFAULT '+1',
    tax_scheme VARCHAR(128) DEFAULT 'Standard Tax',
    social_security VARCHAR(128) DEFAULT 'Statutory Social Care',
    fiscal_year VARCHAR(64) DEFAULT 'January - December',
    regulatory_body VARCHAR(255) DEFAULT 'Ministry of Health',
    is_active BOOLEAN DEFAULT TRUE,
    fx_rate_to_usd NUMERIC(14,6) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Seed Default Essential Countries if Empty
INSERT INTO public.sovereign_countries (code, name, native_name, currency_code, currency_symbol, calling_code) VALUES
('IN', 'India', 'भारत', 'INR', '₹', '+91'),
('US', 'United States', 'United States', 'USD', '$', '+1'),
('GB', 'United Kingdom', 'United Kingdom', 'GBP', '£', '+44'),
('DE', 'Germany', 'Deutschland', 'EUR', '€', '+49'),
('FR', 'France', 'France', 'EUR', '€', '+33'),
('JP', 'Japan', '日本', 'JPY', '¥', '+81'),
('CA', 'Canada', 'Canada', 'CAD', 'CA$', '+1'),
('AU', 'Australia', 'Australia', 'AUD', 'A$', '+61'),
('AE', 'United Arab Emirates', 'الإمارات', 'AED', 'AED', '+971'),
('SG', 'Singapore', 'Singapore', 'SGD', 'S$', '+65'),
('BR', 'Brazil', 'Brasil', 'BRL', 'R$', '+55'),
('ZA', 'South Africa', 'South Africa', 'ZAR', 'R', '+27')
ON CONFLICT (code) DO NOTHING;

GRANT ALL ON TABLE public.sovereign_countries TO postgres, service_role, anon, authenticated;
