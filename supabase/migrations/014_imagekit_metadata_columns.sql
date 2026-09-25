-- ============================================================================
-- MIGRATION 014: ImageKit Metadata Columns (file_id, thumbnail_url)
-- Ensures no binary image data is stored in PostgreSQL.
-- Only storing clean ImageKit CDN URLs, file IDs, and thumbnails.
-- ============================================================================

-- 1. Employees & Profiles
ALTER TABLE public.employees 
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_image_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS profile_image_thumbnail_url TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS avatar_thumbnail_url TEXT;

-- 2. Companies (Branding & Logo)
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS logo_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS logo_thumbnail_url TEXT;

-- 3. Expenses (Receipt Proofs)
ALTER TABLE public.expense_items
  ADD COLUMN IF NOT EXISTS receipt_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS receipt_thumbnail_url TEXT;

-- 4. Products (Catalog Images)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS image_thumbnail_url TEXT;

-- 5. Field Operations (Visits Selfie / Proof of Call)
ALTER TABLE public.visits
  ADD COLUMN IF NOT EXISTS selfie_url TEXT,
  ADD COLUMN IF NOT EXISTS selfie_file_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS selfie_thumbnail_url TEXT;
