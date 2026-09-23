-- ==============================================================================
-- DEDICATED FX EXCHANGE RATES TABLE FOR POSTGRESQL / SUPABASE
-- Multi-Currency Real-Time Exchange Rates Schema
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.fx_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    to_currency VARCHAR(10) NOT NULL,
    rate NUMERIC(18, 6) NOT NULL,
    inverse_rate NUMERIC(18, 6) NOT NULL,
    provider VARCHAR(64) DEFAULT 'OpenExchangeRates',
    is_manual_override BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_currency_pair UNIQUE (from_currency, to_currency)
);

CREATE INDEX IF NOT EXISTS idx_fx_rates_pair ON public.fx_rates (from_currency, to_currency);
