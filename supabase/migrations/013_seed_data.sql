-- ============================================================================
-- MIGRATION 013: Reference data (platform roles and permission catalogue)
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
