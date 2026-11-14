-- ============================================================================
-- DEVELOPMENT / DEMO DATA ONLY. Never run against production.
-- Loaded by local dev scripts and the API integration tests.
-- ============================================================================

-- Seed Default Demo Companies
INSERT INTO public.companies (id, code, name, legal_name, country_code, currency, brand_primary_color, status) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'alleviare', 'Alleviare Health Sciences', 'Alleviare Pharma Pvt Ltd', 'IN', 'INR', '#2563eb', 'ACTIVE'),
  ('b2222222-2222-2222-2222-222222222222', 'novis', 'Novis Life Sciences', 'Novis Lifesciences Global Corp', 'US', 'USD', '#0d9488', 'ACTIVE'),
  ('c3333333-3333-3333-3333-333333333333', 'apex', 'Apex Therapeutics', 'Apex Pharma India Ltd', 'IN', 'INR', '#7c3aed', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Employees for Alleviare Health Sciences
INSERT INTO public.employees (company_id, employee_code, first_name, last_name, email, phone, status) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-001', 'Dr. Rajesh', 'Sharma', 'admin@alleviare.com', '+91 98765 43210', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-002', 'V.', 'Singhania', 'director@alleviare.com', '+91 98765 43211', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-003', 'Rameshwar', 'Gupta', 'accountant@alleviare.com', '+91 98765 43212', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-004', 'M.', 'Sundaram', 'manager@alleviare.com', '+91 98765 43213', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-005', 'Priya', 'Mukherjee', 'salesmanager@alleviare.com', '+91 98765 43214', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-HQ-006', 'Suresh', 'Raina', 'salessupervisor@alleviare.com', '+91 98765 43215', 'ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'EMP-MR-101', 'Amit', 'Verma', 'mr@alleviare.com', '+91 98765 43216', 'ACTIVE')
ON CONFLICT DO NOTHING;
