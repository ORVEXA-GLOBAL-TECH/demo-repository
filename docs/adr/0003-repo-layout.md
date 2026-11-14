# ADR-0003: Repository layout

```
services/api        Spring Boot modular monolith (Java 21, Maven)
apps/web            Next.js + TypeScript staff portal
apps/mobile         Expo React Native + TypeScript (MR / field app)
packages/api-types  Shared TypeScript types and API client (web + mobile)
supabase/migrations Database schema (unchanged, source of truth)
docs/               ADRs, assessments, specs
backend/ frontend/  LEGACY. Frozen; removed only with owner approval
.tools/             Local JDK / Maven (git-ignored)
```

API modules (packages under `com.alleviare`): `auth`, `tenant`, `org`, `field` (DCR, orders, expenses, attendance), `catalog`, `common` (security, errors).
