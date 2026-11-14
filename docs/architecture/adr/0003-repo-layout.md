# ADR-0003: Repository layout

Status: Accepted (revised 2026-11-14)

```
apps/
  web/            Next.js + TypeScript staff portal
  mobile/         Expo React Native + TypeScript field app (Android / iOS)
  superadmin/     LEGACY Vite/React Super Admin console, awaiting a rebuild on the new API
services/
  api/            Spring Boot modular monolith (Java 21, Maven)
packages/
  api-client/     Shared TypeScript API client, types and role/module model (web + mobile)
supabase/
  migrations/     Schema and reference data, applied in filename order (production-safe)
  seed/           Development / demo data only
  local/          Stand-ins for Supabase objects, for plain PostgreSQL (dev, CI, Azure PG)
infra/
  azure/          Bicep templates (Container Apps, ACR, Key Vault, Log Analytics)
scripts/          Developer tooling (embedded dev database)
docs/
  architecture/   ADRs (decision records)
  deployment/     Environment and deployment guides
  product/        Specification and product checklists
  assessment/     Point-in-time audits
.github/workflows CI (tests) and deployment
docker-compose.yml  Local stack: PostgreSQL + API + web
.tools/           Local JDK/Maven/dev database data (git-ignored)
```

API packages under `com.alleviare`: `auth` (login, bootstrap, dev seeding), `common` (security, config, errors, permissions), `org` (employees, logins), `field` (orders, expenses, call reports, attendance and leave, tour plans, dashboard), `catalog` (doctors, products, chemists, stockists). New business domains (inventory, finance, HR, quality...) get their own package with its own controllers and migrations.

Rules: apps never import from each other (only from `packages/`); the API is the only component that talks to the database; schema changes are always a new numbered file in `supabase/migrations`.
