-- ============================================================================
-- MIGRATION 012: Supabase Row Level Security (RLS) Policies & Helper Functions
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

-- Helper Function to resolve current user's company ID safely
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

-- Helper Function to check if user is SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'role') = 'SUPER_ADMIN',
    FALSE
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR COMPANIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Super Admins can view all companies"
  ON public.companies FOR SELECT
  USING (public.is_super_admin() OR id = public.get_auth_company_id());

CREATE POLICY "Super Admins can manage companies"
  ON public.companies FOR ALL
  USING (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR EMPLOYEES
-- ----------------------------------------------------------------------------
CREATE POLICY "Tenant Isolation: Employees Select"
  ON public.employees FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: Employees Modify"
  ON public.employees FOR ALL
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR DOCTORS & CHEMISTS & HOSPITALS
-- ----------------------------------------------------------------------------
CREATE POLICY "Tenant Isolation: Doctors Select"
  ON public.doctors FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: Doctors Insert/Update"
  ON public.doctors FOR ALL
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: Chemists Select"
  ON public.chemists FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: Hospitals Select"
  ON public.hospitals FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR VISITS & DCR
-- ----------------------------------------------------------------------------
CREATE POLICY "Tenant Isolation: Visits Select"
  ON public.visits FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: DCR Reports Select"
  ON public.dcr_reports FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR ORDERS & EXPENSES
-- ----------------------------------------------------------------------------
CREATE POLICY "Tenant Isolation: Orders Select"
  ON public.orders FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());

CREATE POLICY "Tenant Isolation: Expense Claims Select"
  ON public.expense_claims FOR SELECT
  USING (public.is_super_admin() OR company_id = public.get_auth_company_id());
