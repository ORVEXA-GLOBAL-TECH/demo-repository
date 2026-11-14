# Alleviare Platform

Pharmaceutical field-force (SFA) platform: Java API, Next.js web portal and React Native mobile app, on PostgreSQL.

## Repository layout

```
.
├── apps/
│   ├── web/            Next.js + TypeScript staff portal
│   ├── mobile/         Expo React Native + TypeScript field app (APK / iOS)
│   └── superadmin/     LEGACY Super Admin console (no working backend, see its README)
├── services/
│   └── api/            Spring Boot API (Java 21, Maven), integration tests included
├── packages/
│   └── api-client/     Shared TypeScript client, types and permission model
├── supabase/
│   ├── migrations/     Schema + reference data (all environments)
│   ├── seed/           Demo data (development only)
│   └── local/          Supabase stand-ins for plain PostgreSQL
├── infra/azure/        Bicep template: Container Apps, ACR, Key Vault, Log Analytics
├── scripts/            Developer tooling (embedded dev database)
├── docs/               architecture/adr, deployment, product, assessment
├── .github/workflows/  ci.yml (tests), deploy-azure.yml, superadmin static-web-app deploy
├── docker-compose.yml  Local stack: PostgreSQL + API + web
└── .env.example        Variables for docker-compose
```

Each folder has its own README. Start with `docs/README.md`.

## What works

Sign-in with roles from the database; role-based menus on web and mobile; orders (server-side pricing, approval), expense claims (no self-approval), daily call reports, attendance (punch in/out) and leave, tour plans, doctors, chemists, products, stockists, employees, dashboards; administrators create employees and logins from the web portal. Each company only sees its own data; medical representatives only see their own records.

Not built yet: finance, procurement, manufacturing, HR/payroll, quality, pharmacovigilance, messaging (WhatsApp/Telegram/SMS/email), AI, billing, translations, SSO/MFA, tenant row-level-security policies. See `docs/assessment/existing-system-assessment.md`.

## Run locally

Containers (needs Docker): copy `.env.example` to `.env`, fill it in, `docker compose up --build`.

Without containers:

1. Database: `cd scripts && npm install embedded-postgres pg && DEV_DB_PASSWORD=<pw> DEV_DB_SEED=true node dev-db.mjs` (or any PostgreSQL with `supabase/local/supabase_stubs.sql` and then `supabase/migrations/*.sql` applied).
2. API (JDK 21+, Maven): see `services/api/README.md` for the variables, then `mvn spring-boot:run`.
3. Web: `cd apps/web && cp .env.example .env.local && npm install && npm run dev` (http://localhost:3001).
4. Mobile: `cd apps/mobile && npm install && EXPO_PUBLIC_API_URL=http://<LAN-IP>:8080 npx expo start`.

Checks: `npm run typecheck` (web + mobile), `npm run test:api`, `npm run build:web`.

## Deploy

`docs/deployment/azure.md` (infrastructure, first administrator, installing the app on phones).

## History

The earlier Node/Express backend and Vite/Expo apps were replaced by this stack. They remain in git history and under the tag `legacy-snapshot`.
