-- ============================================================================
-- MIGRATION 016: Role -> permission mapping (data-driven RBAC)
-- The API reads these rows at runtime; edit them to change what a role may do.
-- SUPER_ADMIN is handled in code as a wildcard and has no rows here.
-- ============================================================================

INSERT INTO public.permissions (code, module, description) VALUES
  ('dashboard.view', 'dashboard', 'View dashboards'),
  ('tour.view', 'tour', 'View tour plans'),
  ('tour.create', 'tour', 'Create tour plans'),
  ('tour.approve', 'tour', 'Approve tour plans'),
  ('data.company_wide', 'scope', 'See every record of the company (roles without it only see their own)'),
  ('leave.view', 'leave', 'View leave balances'),
  ('leave.create', 'leave', 'Request leave'),
  ('leave.approve', 'leave', 'Approve leave'),
  ('attendance.view', 'attendance', 'View attendance'),
  ('attendance.create', 'attendance', 'Punch in and out'),
  ('stockist.create', 'stockist', 'Add stockists'),
  ('chemist.create', 'chemist', 'Add chemists'),
  ('doctor.delete', 'doctor', 'Remove doctors'),
  ('order.approve', 'order', 'Approve orders'),
  ('dcr.approve', 'dcr', 'Approve call reports'),
  ('expense.approve', 'expense', 'Approve expense claims'),
  ('user.manage', 'user', 'Create and manage login accounts'),
  ('employee.create', 'employee', 'Create employee records')
ON CONFLICT (code) DO NOTHING;

WITH grants(role_code, permission_code) AS (VALUES
  -- Company-wide visibility for every role except MR
  ('ADMIN','data.company_wide'),('DIRECTOR','data.company_wide'),('ACCOUNTANT','data.company_wide'),
  ('MANAGER','data.company_wide'),('SALES_MANAGER','data.company_wide'),('MR_SUPERVISOR','data.company_wide'),
  -- ADMIN: everything operational
  ('ADMIN','dashboard.view'),('ADMIN','employee.view'),('ADMIN','employee.create'),('ADMIN','user.manage'),
  ('ADMIN','doctor.view'),('ADMIN','doctor.create'),('ADMIN','doctor.update'),('ADMIN','doctor.delete'),
  ('ADMIN','chemist.view'),('ADMIN','chemist.create'),('ADMIN','product.view'),('ADMIN','product.create'),
  ('ADMIN','product.update'),('ADMIN','stockist.create'),('ADMIN','order.view'),('ADMIN','order.approve'),
  ('ADMIN','expense.view'),('ADMIN','expense.approve'),('ADMIN','dcr.view'),('ADMIN','dcr.approve'),
  ('ADMIN','attendance.view'),('ADMIN','tour.view'),('ADMIN','tour.approve'),('ADMIN','leave.view'),
  ('ADMIN','leave.approve'),('ADMIN','reports.view'),('ADMIN','audit.view'),('ADMIN','settings.view'),
  ('ADMIN','settings.update'),
  -- DIRECTOR: read-only plus order approval
  ('DIRECTOR','dashboard.view'),('DIRECTOR','employee.view'),('DIRECTOR','doctor.view'),('DIRECTOR','chemist.view'),
  ('DIRECTOR','product.view'),('DIRECTOR','order.view'),('DIRECTOR','order.approve'),('DIRECTOR','expense.view'),
  ('DIRECTOR','dcr.view'),('DIRECTOR','attendance.view'),('DIRECTOR','tour.view'),('DIRECTOR','leave.view'),
  ('DIRECTOR','reports.view'),('DIRECTOR','audit.view'),
  -- ACCOUNTANT: finance
  ('ACCOUNTANT','dashboard.view'),('ACCOUNTANT','employee.view'),('ACCOUNTANT','order.view'),
  ('ACCOUNTANT','expense.view'),('ACCOUNTANT','expense.approve'),('ACCOUNTANT','reports.view'),('ACCOUNTANT','audit.view'),
  -- MANAGER: team oversight and approvals
  ('MANAGER','dashboard.view'),('MANAGER','employee.view'),('MANAGER','doctor.view'),('MANAGER','chemist.view'),
  ('MANAGER','product.view'),('MANAGER','order.view'),('MANAGER','order.approve'),('MANAGER','expense.view'),
  ('MANAGER','expense.approve'),('MANAGER','dcr.view'),('MANAGER','dcr.approve'),('MANAGER','attendance.view'),
  ('MANAGER','tour.view'),('MANAGER','tour.approve'),('MANAGER','leave.view'),('MANAGER','leave.approve'),
  ('MANAGER','reports.view'),
  -- SALES_MANAGER: commercial
  ('SALES_MANAGER','dashboard.view'),('SALES_MANAGER','employee.view'),('SALES_MANAGER','doctor.view'),
  ('SALES_MANAGER','chemist.view'),('SALES_MANAGER','product.view'),('SALES_MANAGER','product.create'),
  ('SALES_MANAGER','product.update'),('SALES_MANAGER','stockist.create'),('SALES_MANAGER','order.view'),
  ('SALES_MANAGER','order.create'),('SALES_MANAGER','order.approve'),('SALES_MANAGER','expense.view'),
  ('SALES_MANAGER','dcr.view'),('SALES_MANAGER','dcr.approve'),('SALES_MANAGER','attendance.view'),
  ('SALES_MANAGER','tour.view'),('SALES_MANAGER','leave.view'),('SALES_MANAGER','reports.view'),
  -- MR_SUPERVISOR: first-line supervision
  ('MR_SUPERVISOR','dashboard.view'),('MR_SUPERVISOR','employee.view'),('MR_SUPERVISOR','doctor.view'),
  ('MR_SUPERVISOR','doctor.create'),('MR_SUPERVISOR','doctor.update'),('MR_SUPERVISOR','chemist.view'),
  ('MR_SUPERVISOR','chemist.create'),('MR_SUPERVISOR','product.view'),('MR_SUPERVISOR','order.view'),
  ('MR_SUPERVISOR','expense.view'),('MR_SUPERVISOR','expense.approve'),('MR_SUPERVISOR','dcr.view'),
  ('MR_SUPERVISOR','dcr.approve'),('MR_SUPERVISOR','attendance.view'),('MR_SUPERVISOR','tour.view'),
  ('MR_SUPERVISOR','tour.create'),('MR_SUPERVISOR','tour.approve'),('MR_SUPERVISOR','leave.view'),
  ('MR_SUPERVISOR','leave.approve'),('MR_SUPERVISOR','reports.view'),
  -- MR: own field work
  ('MR','dashboard.view'),('MR','doctor.view'),('MR','doctor.create'),('MR','doctor.update'),('MR','chemist.view'),
  ('MR','chemist.create'),('MR','product.view'),('MR','order.view'),('MR','order.create'),('MR','expense.view'),
  ('MR','expense.create'),('MR','dcr.view'),('MR','dcr.create'),('MR','attendance.view'),('MR','attendance.create'),
  ('MR','tour.view'),('MR','tour.create'),('MR','leave.view'),('MR','leave.create')
)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM grants g
  JOIN public.roles r ON r.code = g.role_code
  JOIN public.permissions p ON p.code = g.permission_code
ON CONFLICT (role_id, permission_id) DO NOTHING;
