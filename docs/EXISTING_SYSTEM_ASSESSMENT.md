# Alleviare Platform: Existing System Assessment (Phase 0)

Scope: repository at `demo-repository-main` as of 2026-11-14. This is a code-level audit by static inspection plus the runs noted in "Verified". It is not a regulatory or penetration-test report.

## 1. Technology inventory

| Layer | Actual | Master prompt's recommendation |
|---|---|---|
| Backend | Node.js 22+, Express 4, socket.io, pg, JWT, bcryptjs | Java 21 / Spring Boot |
| Web (staff portal) | React + Vite (JSX, no TypeScript) | React + TypeScript + Next.js |
| Web (Super Admin) | React + Vite (JSX) | same |
| Mobile | Expo / React Native 0.74 (5 screens) | Flutter / Dart |
| Database | PostgreSQL schema in `supabase/migrations` (001-015) plus legacy SQL in `backend/src/db` | PostgreSQL |
| Cache | ioredis (optional) | Redis |
| Cloud | Azure Static Web Apps workflows, Dockerfile, docker-compose | Azure |
| VCS | None in this copy (no `.git`) | GitHub with protected branches |

**Stack decision needed.** The recommended stack (Java, Next.js, Flutter) would be a rewrite of about 13k lines of backend and about 15k lines of web code. It is not an extension of what exists. See Section 7.

## 2. Feature completion matrix

Legend: **V** verified working, **P** partial, **D** implemented but defective or demo-grade, **M** missing.

| Area | Status | Evidence / notes |
|---|---|---|
| Auth: login, JWT, single-session | P | Password and platform checks added. Directory (demo) login uses one shared password. DB path verified only on a test DB. |
| RBAC: route guards | P | `requirePermission` on catalog, orders, expenses, DCR, tour, attendance, dashboard. Not on the other ~20 route files. |
| Multi-tenant isolation | D | Two competing models: `tenants_companies` (legacy) and `companies` (migrations). RLS enabled but policies use stubbed `auth.uid()` outside Supabase. Many routes assume a single company. |
| Field transactions (orders, expenses, DCR, tour, attendance, leave) | V | 38 write-endpoint checks passed against a real Postgres. Mock fallback retained. |
| Catalog (products, doctors, chemists, stockists) | V | Same checks. |
| Dashboard | P | Admin view reads the DB. Director, accountant, manager, sales manager, supervisor and MR views are mostly hard-coded figures. |
| Live tracking | M | No table; mock only. |
| AI routes | D | Mock-driven route optimiser. No gateway, RAG or audit. |
| Notifications, tickets, billing, subscriptions, FX, countries, settings, audit, system-health | P / D | Largely in-memory or hard-coded in a ~1,000-line route file. Not audited in depth. |
| Web UI | P | 22 pages. Navbar rebuilt. Table overflow at narrow widths remains. No i18n (strings hard-coded). |
| Mobile app | D | 5 screens, no login, no role awareness, no offline sync, no GPS. APK built but never run on a device. |
| ERP: finance, procurement, inventory, manufacturing, HRMS | M | Only samples and expenses exist. |
| Quality, regulatory, pharmacovigilance | M | None. |
| WhatsApp, Telegram, email, SMS | M | None (notification routes are in-app only). |
| Omnichannel, subscriptions billing engine | P | Plans and invoices CRUD exist. No payment gateway or usage metering. |
| i18n, RTL, multi-currency ledger, time zones | P | FX rates and country tables exist. No ledger, no translation layer, no per-user time zones. |

## 3. Security findings (highest risk first)

1. **Default JWT secret** in `config/index.js` (`alleviare_jwt_secret_default_key`) is used when `JWT_SECRET` is unset. Anyone can forge tokens. Fix: fail startup in production without a strong secret.
2. **Demo passwords** (`Staff@2026!Secure`, `SuperAdmin@2026`) are defaults in code and on the login page. Remove before any real deployment.
3. **Unauthenticated routes.** Most of the ~20 route files not yet guarded (users, tenants, billing, settings, tickets, notifications and others) are reachable without a token. Verify each.
4. **CORS reflects any origin with credentials** (`origin: (o, cb) => cb(null, true)`).
5. **Cleartext HTTP in the Android build** (`usesCleartextTraffic`), acceptable for a LAN demo only.
6. **Tenant context is not enforced** in queries outside the new repositories. Cross-tenant reads are plausible.
7. **`.env.example` ships a real-looking DB password and JWT secret** (`postgrespassword2026`).
8. No rate limiting beyond a global 1,000/15 min on `/api`. No per-login throttling.

## 4. Database assessment

- 74 tables on migrate. Two overlapping identity and tenancy models (`users` and `tenants_companies` against `employees` and `companies`). Linked today only by email.
- Migration 013 seeds demo data inside a schema migration. Seed data should be a separate step.
- Migrations are re-run in full each time with `IF NOT EXISTS`, no version table. Move to a real migration tool (Flyway, node-pg-migrate or similar).
- Supabase-specific grants and roles (`anon`, `authenticated`, `service_role`, `auth.uid()`) break on plain Postgres or Azure Database for PostgreSQL.
- Extras are stored in JSONB `metadata` columns (migration 015). That is acceptable for flexible fields, but money and status logic should not live there long term.

## 5. Technical debt register (top items)

| # | Item | Effort |
|---|---|---|
| 1 | Two tenancy and identity models | L |
| 2 | Mock data still compiled into every route as fallback; must be disabled in production | S |
| 3 | `settingsRoutes.js` (~1,000 lines), `tenantRoutes.js` (~1,260), `systemHealthRoutes.js` (~1,080): hard-coded logic, no tests | L |
| 4 | Automated tests: 6 unit-style checks only; no API, UI or mobile tests | M |
| 5 | Web `api.js` has a client-side offline store that can mask real server failures (partly fixed for auth) | M |
| 6 | No CI for tests; Azure workflows only deploy static apps | S |
| 7 | No TypeScript, no OpenAPI generated from code | M |

## 6. Reusability

- **Keep:** SQL schema (001-012), repositories (`catalogRepo`, `fieldRepo`), web role-based shell (sidebar, role dashboards), Super Admin console, RBAC permission map, Docker setup.
- **Refactor:** auth routes, tenant routes, dashboards (replace hard-coded data), mobile app (add auth and role navigation).
- **Replace if moving stacks:** Express backend, Expo app.

## 7. The decision that gates everything

The master prompt describes about 22 product domains, 46 documents and 22 phases, targeting Java, Next.js and Flutter. That is a multi-person, multi-year programme. It cannot be built in one session, and no part of it can be honestly called finished without the verification the prompt itself demands.

Options:

- **A. Extend the current stack (Node / React / Expo).** Fastest path to a working product. Deliver the SFA and CRM core to production quality first (auth, tenant isolation, role dashboards, mobile with login and offline), then add modules one at a time.
- **B. Re-platform to the recommended stack first.** Cleaner long term, but spends months before any user-visible gain, and discards working code.
- **C. Hybrid.** Keep Node for the existing SFA product, and build new ERP modules (finance, inventory, manufacturing) on the recommended stack behind the same Postgres. Higher operational complexity.

## 8. Proposed next increments (under option A)

1. **Security baseline:** mandatory secrets, CORS allow-list, guard every route, remove demo passwords from the production build.
2. **Single tenancy model:** consolidate on `companies` and `employees`; add tenant-isolation tests.
3. **Mobile app v2:** login with role-based tabs (MR vs manager), real data, GPS attendance, offline queue.
4. **Web fixes:** responsive tables, per-role dashboards on live data, i18n scaffolding.
5. **Inventory and sample ledger** (first ERP module; closest to existing tables).
6. **Messaging adapters** (WhatsApp Cloud API, Telegram Bot API, email) behind one outbound queue, consent-gated.

Each increment gets requirements, design, code, tests and a short doc update before the next begins.

## 9. Open questions that change the architecture

1. Which stack option (A, B or C)?
2. First production customer, country and legal entity (drives tax, currency, privacy and payroll scope)?
3. Is Azure confirmed as the first deployment target, and is Supabase to be kept or dropped in favour of plain Azure Database for PostgreSQL?
4. Which one module after the SFA core is most valuable to ship first?
