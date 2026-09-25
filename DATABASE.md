# Database Schema Documentation

## Database Technology
* **Database Engine**: PostgreSQL / Supabase
* **Migration Directory**: `supabase/migrations/`
* **Isolation Pattern**: Multi-Tenant Foreign Key Scoping + Row-Level Security (RLS)

## Core Tables

| Table Name | Description | Key Indexes |
|---|---|---|
| `public.companies` | Tenant organization master records | `status` |
| `public.employees` | Staff & Field MR employee directory | `company_id`, `manager_id`, `email` |
| `public.roles` | System and custom RBAC roles | `code` |
| `public.permissions` | Granular permission definitions | `module` |
| `public.user_roles` | Mapping of users to roles & companies | `user_id`, `company_id` |
| `public.doctors` | Healthcare Professional (HCP) directory | `company_id`, `territory_id`, `assigned_mr_id` |
| `public.chemists` | Chemist & Pharmacy directory | `company_id`, `territory_id` |
| `public.hospitals` | Hospital & Clinic institution directory | `company_id` |
| `public.products` | Master SKU catalog with MRP/PTR/PTS | `company_id`, `sku`, `division_id` |
| `public.visits` | Doctor, Chemist, and Hospital call logs | `company_id`, `employee_id`, `visit_date`, `doctor_id` |
| `public.dcr_reports` | Daily Call Reports (DCR) | `company_id`, `employee_id`, `dcr_date` |
| `public.attendance` | GPS Check-in / Check-out attendance | `company_id`, `employee_id`, `date` |
| `public.leave_requests` | Employee leave application workflow | `employee_id` |
| `public.orders` | Chemist POB order bookings | `company_id`, `employee_id`, `chemist_id` |
| `public.expense_claims` | TA/DA travel expense reimbursement claims | `company_id`, `employee_id`, `status` |
| `public.audit_logs` | Platform audit trails | `company_id`, `action` |
