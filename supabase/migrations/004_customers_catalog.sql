-- ============================================================================
-- MIGRATION 004: Customer Directory (Doctors, Specialties, Chemists, Hospitals)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.doctor_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS public.doctor_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL, -- A+, A, B, C
  name VARCHAR(100) NOT NULL,
  min_monthly_visits INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'PRIVATE', -- PRIVATE, GOVERNMENT, TRUST
  bed_capacity INT DEFAULT 50,
  address TEXT,
  city VARCHAR(100),
  territory_id UUID REFERENCES public.territories(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  qualification VARCHAR(100),
  specialty_id UUID REFERENCES public.doctor_specialties(id),
  category_id UUID REFERENCES public.doctor_categories(id),
  hospital_id UUID REFERENCES public.hospitals(id),
  territory_id UUID REFERENCES public.territories(id),
  assigned_mr_id UUID REFERENCES public.employees(id),
  email VARCHAR(255),
  phone VARCHAR(50),
  clinic_address TEXT,
  city VARCHAR(100),
  potential_tier VARCHAR(20) DEFAULT 'HIGH',
  visit_frequency INT DEFAULT 2, -- Monthly target visits
  last_visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.chemists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  drug_license_no VARCHAR(100),
  gstin VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  territory_id UUID REFERENCES public.territories(id),
  assigned_mr_id UUID REFERENCES public.employees(id),
  preferred_stockist VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctors_company ON public.doctors(company_id);
CREATE INDEX IF NOT EXISTS idx_doctors_territory ON public.doctors(territory_id);
CREATE INDEX IF NOT EXISTS idx_doctors_mr ON public.doctors(assigned_mr_id);
CREATE INDEX IF NOT EXISTS idx_chemists_company ON public.chemists(company_id);
CREATE INDEX IF NOT EXISTS idx_chemists_territory ON public.chemists(territory_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_company ON public.hospitals(company_id);
