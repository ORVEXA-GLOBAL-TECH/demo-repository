-- ============================================================================
-- MIGRATION 008: Targets, Sales, Orders & Distributors
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  gstin VARCHAR(50),
  address TEXT,
  territory_id UUID REFERENCES public.territories(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

CREATE TABLE IF NOT EXISTS public.targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  target_calls INT DEFAULT 0,
  target_new_doctors INT DEFAULT 0,
  achieved_amount NUMERIC(12,2) DEFAULT 0.00,
  achieved_calls INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id, month, year)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  chemist_id UUID REFERENCES public.chemists(id),
  distributor_id UUID REFERENCES public.distributors(id),
  order_number VARCHAR(100) NOT NULL,
  order_date DATE DEFAULT CURRENT_DATE,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, SHIPPED, DELIVERED, REJECTED
  approved_by_id UUID REFERENCES public.employees(id),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, order_number)
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.target_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.targets(id) ON DELETE CASCADE,
  assigned_by_id UUID NOT NULL REFERENCES public.employees(id),
  assigned_to_id UUID NOT NULL REFERENCES public.employees(id),
  assigned_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  sales_date DATE NOT NULL,
  gross_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) DEFAULT 0.00,
  net_amount NUMERIC(12,2) NOT NULL,
  invoice_number VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_targets_company ON public.targets(company_id);
CREATE INDEX IF NOT EXISTS idx_targets_employee ON public.targets(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_company ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_employee ON public.orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_chemist ON public.orders(chemist_id);
CREATE INDEX IF NOT EXISTS idx_sales_company ON public.sales(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_employee ON public.sales(employee_id);
