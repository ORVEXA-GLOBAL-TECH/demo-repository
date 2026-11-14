# Database

PostgreSQL schema, managed as plain SQL.

| Folder | Purpose | Run where |
|---|---|---|
| `migrations/` | Tables, indexes, RLS, reference data (roles, permissions, role-permission grants). Apply in filename order. Idempotent (`IF NOT EXISTS`). | Every environment, including production |
| `seed/dev_seed.sql` | Demo companies and employees | Local development and tests only |
| `local/supabase_stubs.sql` | Creates the `anon` / `authenticated` / `service_role` roles and `auth.uid()` that Supabase provides | Plain PostgreSQL only (never on Supabase) |

Rules: never edit an applied migration; add the next number. Accounts are never created in SQL: use the API's first-run bootstrap (`BOOTSTRAP_*`) and the Logins screen.

Role permissions are data: change what a role may do by editing `role_permissions` (see `016_role_permissions.sql`), not code.
