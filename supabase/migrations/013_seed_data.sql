-- ============================================================================
-- MIGRATION 013: Demo Seed Data for Multi-Tenant Platform & All Roles
-- ============================================================================

-- Seed Default Platform Roles
INSERT INTO public.roles (code, name, description) VALUES
  ('SUPER_ADMIN', 'Super Administrator', 'Global SaaS platform owner with access to all tenants and infrastructure.'),
  ('ADMIN', 'Company Administrator', 'Tenant organization administrator with company-wide control.'),
  ('DIRECTOR', 'Managing Director', 'Strategic business executive with company-wide analytical visibility.'),
  ('ACCOUNTANT', 'Chief Accountant', 'Financial officer managing TA/DA expenses, reimbursements, and verification.'),
  ('MANAGER', 'Operations Manager', 'Hierarchy team manager supervising operational performance.'),
  ('SALES_MANAGER', 'Sales Manager', 'Regional sales leader overseeing quota targets and order fulfillment.'),
  ('MR_SUPERVISOR', 'Area Sales Supervisor', 'Field supervisor monitoring Medical Representatives.'),
  ('MR', 'Medical Representative', 'Field representative logging DCR visits, doctor feedback, and POB orders.')
ON CONFLICT (code) DO NOTHING;

-- Seed Default Granular Permissions
INSERT INTO public.permissions (code, module, description) VALUES
  ('dashboard.view', 'dashboard', 'View executive and operational dashboards'),
  ('company.view', 'company', 'View company profile and settings'),
  ('company.create', 'company', 'Create new tenant company'),
  ('company.update', 'company', 'Update tenant company settings'),
  ('company.suspend', 'company', 'Suspend tenant company access'),
  ('employee.view', 'employee', 'View employee directory'),
  ('employee.create', 'employee', 'Create employee record'),
  ('employee.update', 'employee', 'Update employee details'),
  ('employee.delete', 'employee', 'Delete/deactivate employee'),
  ('doctor.view', 'doctor', 'View doctor directory'),
  ('doctor.create', 'doctor', 'Add new doctor'),
  ('doctor.update', 'doctor', 'Edit doctor profile'),
  ('doctor.delete', 'doctor', 'Remove doctor entry'),
  ('chemist.view', 'chemist', 'View chemist directory'),
  ('chemist.create', 'chemist', 'Add chemist entry'),
  ('chemist.update', 'chemist', 'Edit chemist entry'),
  ('hospital.view', 'hospital', 'View hospital directory'),
  ('product.view', 'product', 'View catalog products'),
  ('product.create', 'product', 'Add new product SKU'),
  ('product.update', 'product', 'Update product pricing and details'),
  ('visit.view', 'visit', 'View doctor/chemist visits'),
  ('visit.create', 'visit', 'Log field visit'),
  ('visit.approve', 'visit', 'Approve field visits'),
  ('dcr.view', 'dcr', 'View Daily Call Reports'),
  ('dcr.create', 'dcr', 'Create DCR entry'),
  ('dcr.submit', 'dcr', 'Submit DCR for approval'),
  ('dcr.approve', 'dcr', 'Approve submitted DCR'),
  ('dcr.reject', 'dcr', 'Reject DCR entry'),
  ('attendance.view', 'attendance', 'View attendance logs'),
  ('attendance.create', 'attendance', 'Check-in / Check-out field attendance'),
  ('leave.view', 'leave', 'View leave requests'),
  ('leave.create', 'leave', 'Submit leave request'),
  ('leave.approve', 'leave', 'Approve leave request'),
  ('target.view', 'target', 'View sales and call targets'),
  ('target.create', 'target', 'Assign sales targets'),
  ('sales.view', 'sales', 'View sales performance analytics'),
  ('order.view', 'order', 'View chemist POB order bookings'),
  ('order.create', 'order', 'Create POB order booking'),
  ('order.approve', 'order', 'Approve order for shipment'),
  ('expense.view', 'expense', 'View TA/DA expense claims'),
  ('expense.create', 'expense', 'Submit expense claim with receipt'),
  ('expense.approve', 'expense', 'Approve or reject expense claim'),
  ('reports.view', 'reports', 'View analytics and compliance reports'),
  ('reports.export', 'reports', 'Export reports to CSV/XLSX'),
  ('audit.view', 'audit', 'View audit logs'),
  ('settings.view', 'settings', 'View platform settings'),
  ('settings.update', 'settings', 'Update platform settings')
ON CONFLICT (code) DO NOTHING;

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
