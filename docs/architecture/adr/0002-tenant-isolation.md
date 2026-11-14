# ADR-0002: Tenant isolation

Status: Accepted

## Decision

Shared database, shared schema, `company_id` on every tenant-owned table, enforced two ways:

1. **Application layer:** every request resolves a `TenantContext` from the verified JWT (`tid` claim). Repositories always filter by it.
2. **Database layer (defence in depth):** Row-Level Security policies compare `company_id` to `current_setting('app.company_id')`. The API sets this per transaction (`SELECT set_config('app.company_id', ?, true)`).

Existing tables use `company_id` already (migrations 001-015). Legacy `tenants_companies` / `users` are bridged by email until retired.

## Per customer category

| Customer | Pattern |
|---|---|
| Standard SaaS tenants | Shared schema + RLS (this ADR) |
| Large / regulated tenants | Dedicated Supabase project (database-per-tenant), same code |
| On-premises | Same artifacts against customer PostgreSQL |

## Tests required

A tenant-A token must never read or write tenant-B rows through any endpoint (automated in `services/api` integration tests).
