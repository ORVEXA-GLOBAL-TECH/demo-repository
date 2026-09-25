# Database Migration Guide

## Migration Files Location
All versioned SQL migrations are stored in: `supabase/migrations/`

## Execution Command
To apply database migrations automatically to PostgreSQL:

```bash
npm --prefix backend run migrate
```

## Migration Index

1. `001_initial_schema.sql`: Companies, Departments, Designations, Employees
2. `002_rbac_and_roles.sql`: Roles, Permissions, Role-Permission mappings
3. `003_hierarchy_territories.sql`: Zones, Regions, Areas, Territories
4. `004_customers_catalog.sql`: Doctors, Doctor Specialties, Chemists, Hospitals
5. `005_products_inventory_samples.sql`: Products, SKUs, Sample Inventory, Promo Materials
6. `006_visits_dcr_tour_plans.sql`: Visits, DCR Reports, Tour Plans (MTP)
7. `007_attendance_leave.sql`: Attendance, Check-in/out, Leave Requests, Holidays
8. `008_targets_sales_orders.sql`: Targets, POB Orders, Order Items, Distributors
9. `009_expenses.sql`: TA/DA Expense Claims, Expense Items, Verification
10. `010_training_announcements_tickets.sql`: Training Courses, Support Tickets
11. `011_audit_device_sessions_integrations.sql`: Audit Logs, Device Sessions, Feature Flags
12. `012_rls_policies_and_functions.sql`: Row-Level Security policies and helper functions
13. `013_seed_data.sql`: Seed data for demo tenants, roles, permissions, and employees
