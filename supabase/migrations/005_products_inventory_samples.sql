-- ============================================================================
-- MIGRATION 005: Products, Divisions, Inventory, Samples & Promo Materials
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS public.product_divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id),
  division_id UUID REFERENCES public.product_divisions(id),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  composition TEXT,
  pack_size VARCHAR(50),
  mrp NUMERIC(10,2) NOT NULL,
  ptr NUMERIC(10,2) NOT NULL, -- Price to Retailer
  pts NUMERIC(10,2) NOT NULL, -- Price to Stockist
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, sku)
);

CREATE TABLE IF NOT EXISTS public.sample_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  batch_number VARCHAR(100) NOT NULL,
  expiry_date DATE NOT NULL,
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sample_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sample_product_id UUID NOT NULL REFERENCES public.sample_products(id),
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  allocated_qty INT NOT NULL DEFAULT 0,
  remaining_qty INT NOT NULL DEFAULT 0,
  allocated_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.promotional_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'LEAFLET', -- LEAFLET, CATCH_COVER, GIFT, VISUAL_AID
  unit_cost NUMERIC(10,2) DEFAULT 0.00,
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.product_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  batch_number VARCHAR(100) NOT NULL,
  manufacture_date DATE,
  expiry_date DATE NOT NULL,
  quantity_available INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, product_id, batch_number)
);

CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  market_share_est VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.competitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  brand_name VARCHAR(255) NOT NULL,
  composition TEXT,
  pack_size VARCHAR(50),
  mrp NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sample_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sample_product_id UUID NOT NULL REFERENCES public.sample_products(id) ON DELETE CASCADE,
  warehouse_location VARCHAR(100),
  quantity_on_hand INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sample_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  sample_product_id UUID NOT NULL REFERENCES public.sample_products(id),
  quantity_given INT NOT NULL DEFAULT 1,
  distributed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_company ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_division ON public.products(division_id);
CREATE INDEX IF NOT EXISTS idx_sample_allocations_employee ON public.sample_allocations(employee_id);
CREATE INDEX IF NOT EXISTS idx_competitors_company ON public.competitors(company_id);
CREATE INDEX IF NOT EXISTS idx_sample_distributions_employee ON public.sample_distributions(employee_id);
