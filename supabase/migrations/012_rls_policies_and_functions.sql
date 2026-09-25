-- ============================================================================
-- MIGRATION 012: Supabase Row Level Security (RLS) & Hierarchical Data Scoping
-- ============================================================================

-- Enable RLS on core application tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chemists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dcr_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SECURITY DEFINER HELPER FUNCTIONS FOR AUTH CONTEXT & SCOPING
-- ----------------------------------------------------------------------------

-- Helper 1: Resolve authenticated user's company ID
CREATE OR REPLACE FUNCTION public.get_auth_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT company_id 
    FROM public.employees 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper 2: Resolve authenticated user's employee ID
CREATE OR REPLACE FUNCTION public.get_auth_employee_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM public.employees 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper 3: Resolve authenticated user's role code
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role',
    'MR'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper 4: Check if current user is SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    public.get_auth_role() = 'SUPER_ADMIN',
    FALSE
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- HIERARCHICAL DATA SCOPING RLS POLICIES FOR VISITS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Tenant Isolation: Visits Select" ON public.visits;

CREATE POLICY "Hierarchical Scoping: Visits Select"
  ON public.visits FOR SELECT
  USING (
    -- 1. SUPER_ADMIN sees all tenants
    public.is_super_admin()
    OR (
      -- Must belong to the same tenant company
      company_id = public.get_auth_company_id()
      AND (
        -- 2. ADMIN / DIRECTOR / ACCOUNTANT see company-wide records
        public.get_auth_role() IN ('ADMIN', 'DIRECTOR', 'ACCOUNTANT')
        -- 3. MANAGER / SALES_MANAGER / MR_SUPERVISOR see assigned team/hierarchy
        OR (
          public.get_auth_role() IN ('MANAGER', 'SALES_MANAGER', 'MR_SUPERVISOR', 'RSM', 'ASM')
          AND employee_id IN (
            SELECT id FROM public.employees 
            WHERE manager_id = public.get_auth_employee_id() OR id = public.get_auth_employee_id()
          )
        )
        -- 4. MR sees own records only
        OR (employee_id = public.get_auth_employee_id())
      )
    )
  );

-- ----------------------------------------------------------------------------
-- HIERARCHICAL DATA SCOPING RLS POLICIES FOR DCR REPORTS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Tenant Isolation: DCR Reports Select" ON public.dcr_reports;

CREATE POLICY "Hierarchical Scoping: DCR Reports Select"
  ON public.dcr_reports FOR SELECT
  USING (
    public.is_super_admin()
    OR (
      company_id = public.get_auth_company_id()
      AND (
        public.get_auth_role() IN ('ADMIN', 'DIRECTOR', 'ACCOUNTANT')
        OR (
          public.get_auth_role() IN ('MANAGER', 'SALES_MANAGER', 'MR_SUPERVISOR', 'RSM', 'ASM')
          AND employee_id IN (
            SELECT id FROM public.employees 
            WHERE manager_id = public.get_auth_employee_id() OR id = public.get_auth_employee_id()
          )
        )
        OR (employee_id = public.get_auth_employee_id())
      )
    )
  );

-- ----------------------------------------------------------------------------
-- HIERARCHICAL DATA SCOPING RLS POLICIES FOR EXPENSE CLAIMS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Tenant Isolation: Expense Claims Select" ON public.expense_claims;

CREATE POLICY "Hierarchical Scoping: Expense Claims Select"
  ON public.expense_claims FOR SELECT
  USING (
    public.is_super_admin()
    OR (
      company_id = public.get_auth_company_id()
      AND (
        public.get_auth_role() IN ('ADMIN', 'DIRECTOR', 'ACCOUNTANT')
        OR (
          public.get_auth_role() IN ('MANAGER', 'SALES_MANAGER', 'MR_SUPERVISOR', 'RSM', 'ASM')
          AND employee_id IN (
            SELECT id FROM public.employees 
            WHERE manager_id = public.get_auth_employee_id() OR id = public.get_auth_employee_id()
          )
        )
        OR (employee_id = public.get_auth_employee_id())
      )
    )
  );

-- ----------------------------------------------------------------------------
-- HIERARCHICAL DATA SCOPING RLS POLICIES FOR ORDERS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Tenant Isolation: Orders Select" ON public.orders;

CREATE POLICY "Hierarchical Scoping: Orders Select"
  ON public.orders FOR SELECT
  USING (
    public.is_super_admin()
    OR (
      company_id = public.get_auth_company_id()
      AND (
        public.get_auth_role() IN ('ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'ACCOUNTANT')
        OR (
          public.get_auth_role() IN ('MANAGER', 'MR_SUPERVISOR', 'RSM', 'ASM')
          AND employee_id IN (
            SELECT id FROM public.employees 
            WHERE manager_id = public.get_auth_employee_id() OR id = public.get_auth_employee_id()
          )
        )
        OR (employee_id = public.get_auth_employee_id())
      )
    )
  );
