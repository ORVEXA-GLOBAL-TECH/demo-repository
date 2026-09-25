-- ============================================================================
-- MIGRATION 006: Visits, Daily Call Reports (DCR) & Tour Plans (MTP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tour_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  status VARCHAR(20) DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, APPROVED, REJECTED
  approved_by_id UUID REFERENCES public.employees(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id, month, year)
);

CREATE TABLE IF NOT EXISTS public.tour_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_plan_id UUID NOT NULL REFERENCES public.tour_plans(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  route_name VARCHAR(255) NOT NULL,
  objective TEXT,
  target_doctor_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.dcr_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  dcr_date DATE NOT NULL,
  total_calls INT DEFAULT 0,
  work_type VARCHAR(50) DEFAULT 'FIELD', -- FIELD, NON_FIELD, LEAVE, MEETING
  status VARCHAR(20) DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, APPROVED, REJECTED, LOCKED
  approved_by_id UUID REFERENCES public.employees(id),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id, dcr_date)
);

CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  dcr_report_id UUID REFERENCES public.dcr_reports(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  chemist_id UUID REFERENCES public.chemists(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  visit_type VARCHAR(20) NOT NULL, -- DOCTOR, CHEMIST, HOSPITAL
  visit_date DATE NOT NULL,
  visit_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  duration_minutes INT DEFAULT 15,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  gps_accuracy_meters NUMERIC(6,2),
  purpose TEXT,
  remarks TEXT,
  next_followup_date DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.visit_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  samples_given_qty INT DEFAULT 0,
  promos_given_qty INT DEFAULT 0,
  feedback_rating INT DEFAULT 5,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.visit_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  feedback_category VARCHAR(50) DEFAULT 'GENERAL',
  rating INT DEFAULT 5,
  feedback_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.dcr_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dcr_report_id UUID NOT NULL REFERENCES public.dcr_reports(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) DEFAULT 'CALL',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visits_company ON public.visits(company_id);
CREATE INDEX IF NOT EXISTS idx_visits_employee ON public.visits(employee_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON public.visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON public.visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_chemist ON public.visits(chemist_id);
CREATE INDEX IF NOT EXISTS idx_dcr_company ON public.dcr_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_dcr_employee ON public.dcr_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_dcr_date ON public.dcr_reports(dcr_date);
