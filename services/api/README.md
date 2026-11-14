# Alleviare Platform API (Spring Boot)

Java 21 bytecode, Spring Boot 3.5, Spring Security (JWT), PostgreSQL (Supabase schema from `../../supabase/migrations`).

## Configuration (environment variables, no defaults for secrets)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/alleviare_sfa` |
| `DATABASE_USER`, `DATABASE_PASSWORD` | DB credentials |
| `JWT_SECRET` | Required, at least 32 bytes. The app refuses to start without it |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allow-list (default: localhost:3000, 3001) |
| `DEV_SEED_ENABLED=true`, `DEV_SEED_PASSWORD` | Development only: creates logins for the seeded demo employees |

## Run

```bash
../../.tools/apache-maven-3.9.9/bin/mvn spring-boot:run
```

## Test

```bash
../../.tools/apache-maven-3.9.9/bin/mvn test
```

Tests start a real embedded PostgreSQL, apply the repo migrations, and check: login, wrong password, platform rules, role permissions, and cross-tenant isolation.

## Endpoints (v1)

- `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- `GET|POST /api/v1/doctors` (tenant-scoped, permission-guarded)
- `GET /actuator/health`, OpenAPI at `/v3/api-docs`, UI at `/swagger-ui.html`

## Not done yet

Row-Level Security policies keyed on `app.company_id` (ADR-0002), orders / expenses / DCR / attendance modules, refresh tokens, MFA, audit log writes.
