-- ============================================================================
-- MIGRATION 015: API metadata columns
-- The REST API exposes richer, denormalised records than the normalised core
-- columns capture (e.g. doctor visiting days, order discount %, expense km
-- rates, DCR samples/inputs). Those extras live in a JSONB `metadata` column
-- and are merged back into the API response by backend/src/data/repositories.js.
-- ============================================================================

ALTER TABLE public.doctors          ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.chemists         ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.products         ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.distributors     ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.orders           ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.expense_claims   ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.visits           ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.tour_plan_items  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.attendance       ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Each field call (visit) carries its own review status in the DCR API.
ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'SUBMITTED';
