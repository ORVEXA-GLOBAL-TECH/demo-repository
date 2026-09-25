-- ============================================================================
-- MIGRATION 009: Expense Management (TA/DA, Claims, Verification, Approvals)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL, -- TRAVEL, DAILY_ALLOWANCE, HOTEL, FUEL, PROMO
  name VARCHAR(100) NOT NULL,
  max_limit_per_day NUMERIC(10,2) DEFAULT 1000.00,
  requires_receipt BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

CREATE TABLE IF NOT EXISTS public.expense_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  claim_number VARCHAR(100) NOT NULL,
  claim_date DATE DEFAULT CURRENT_DATE,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  approved_amount NUMERIC(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, APPROVED, PARTIALLY_APPROVED, REJECTED, REIMBURSED
  approved_by_id UUID REFERENCES public.employees(id),
  rejection_reason TEXT,
  reimbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, claim_number)
);

CREATE TABLE IF NOT EXISTS public.expense_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES public.expense_claims(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.expense_categories(id),
  expense_date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  approved_amount NUMERIC(10,2),
  receipt_url TEXT, -- ImageKit URL
  receipt_file_id VARCHAR(100), -- ImageKit File ID
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.expense_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  designation_id UUID REFERENCES public.designations(id),
  category_id UUID NOT NULL REFERENCES public.expense_categories(id),
  daily_allowance_cap NUMERIC(10,2) DEFAULT 500.00,
  mileage_rate_per_km NUMERIC(6,2) DEFAULT 5.00,
  hotel_allowance_cap NUMERIC(10,2) DEFAULT 2000.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.expense_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES public.expense_claims(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES public.employees(id),
  action VARCHAR(20) NOT NULL, -- APPROVED, REJECTED, PARTIALLY_APPROVED
  approved_amount NUMERIC(10,2),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expense_claims_company ON public.expense_claims(company_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_employee ON public.expense_claims(employee_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_status ON public.expense_claims(status);
