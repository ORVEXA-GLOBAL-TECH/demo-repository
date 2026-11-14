# Alleviare Platform

Pharmaceutical field-force (SFA) platform: Java API, Next.js web portal and React Native mobile app, on PostgreSQL.

| Part | Path | Stack |
|---|---|---|
| API | `services/api` | Java 21, Spring Boot 3.5, Spring Security (JWT), JDBC |
| Web portal | `apps/web` | Next.js, React, TypeScript |
| Mobile app | `apps/mobile` | React Native (Expo), TypeScript |
| Shared client and types | `packages/api-client` | TypeScript |
| Database | `supabase/migrations` (schema), `supabase/seed` (dev data only) | PostgreSQL |
| Cloud | `infra/`, `.github/workflows/deploy-azure.yml` | Azure Container Apps, Bicep |
| Super Admin console | `frontend/superadmin` | Legacy React/Vite app, not yet ported (see below) |
| Docs | `docs/` | ADRs, assessment, Azure guide |

## What works

Sign-in with roles from the database; role-based menus on web and mobile; orders (server-side pricing, approval), expense claims (no self-approval), daily call reports, attendance (punch in/out) and leave, tour plans, doctors, chemists, products, stockists, employees, dashboards; administrators create employees and logins from the web portal. Each company only sees its own data, and medical representatives only see their own records.

Not built yet: finance, procurement, manufacturing, HR/payroll, quality, pharmacovigilance, messaging (WhatsApp/Telegram/SMS/email), AI, billing, translations, SSO/MFA, row-level security policies keyed on the tenant. See `docs/EXISTING_SYSTEM_ASSESSMENT.md`.

## Run locally

1. A PostgreSQL database with the migrations applied (`supabase/migrations/*.sql` in order). On plain PostgreSQL create the Supabase stand-ins first: roles `anon`, `authenticated`, `service_role` and a function `auth.uid()`. `scripts/dev-db.mjs` does all of this with an embedded PostgreSQL.
2. API (needs JDK 21+ and Maven):
   ```bash
   cd services/api
   export DATABASE_URL=jdbc:postgresql://localhost:5432/alleviare DATABASE_USER=... DATABASE_PASSWORD=...
   export JWT_SECRET=$(openssl rand -base64 48) CORS_ALLOWED_ORIGINS=http://localhost:3001
   export BOOTSTRAP_ENABLED=true BOOTSTRAP_COMPANY_CODE=acme BOOTSTRAP_COMPANY_NAME="Acme Pharma" \
          BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_PASSWORD='choose-a-long-password'
   mvn spring-boot:run
   ```
3. Web: `cd apps/web && cp .env.example .env.local && npm install && npm run dev` (http://localhost:3001).
4. Mobile: `cd apps/mobile && npm install && EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:8080 npx expo start`.
5. Tests: `cd services/api && mvn test` (starts its own embedded PostgreSQL).

Or everything in containers: copy `.env.example` to `.env`, fill it in, `docker compose up --build`.

## Deploy

See `docs/DEPLOY_AZURE.md`.

## History

The earlier Node/Express backend and Vite/Expo apps were replaced by this stack. They remain in git history and under the tag `legacy-snapshot`. The legacy Super Admin console in `frontend/superadmin` talked to that Node backend and therefore has no working API until it is rebuilt on the new one.
