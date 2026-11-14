# ADR-0001: Target stack for the re-platformed Alleviare Platform

Status: Accepted by product owner (2026-11-14)

## Decision

| Layer | Choice |
|---|---|
| Backend | Java 21, Spring Boot 3.x, Spring Security (JWT), Spring Data JDBC/JPA, OpenAPI |
| Web | TypeScript, React, Next.js (App Router) |
| Mobile | TypeScript, React Native (Expo). Replaces the earlier Flutter recommendation at the owner's request |
| Database | PostgreSQL on Supabase. Existing `supabase/migrations` remain the source of truth |
| Legacy | `backend/` (Node/Express), `frontend/web` and `frontend/mobile` were replaced by the new stack and archived under the git tag `legacy-snapshot`; `frontend/superadmin` moved to `apps/superadmin` until it is rebuilt |

## Consequences

- Two backends run in parallel during migration. New work goes to `services/api`; the Node API is frozen except for security fixes.
- Because mobile stays on React Native, web and mobile can share one TypeScript API client and type package (`packages/api-types`).
- Supabase-specific objects (`auth.uid()`, `anon`/`authenticated` roles) are allowed. Tenant isolation does not depend on them; see ADR-0002.

## Migration rule

No legacy file is deleted until the replacement passes its tests and the owner approves the removal.
