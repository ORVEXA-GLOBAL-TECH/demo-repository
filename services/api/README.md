# Alleviare Platform API (Spring Boot)

Java 21, Spring Boot 3.5, Spring Security (JWT), JDBC on PostgreSQL. Schema: `../../supabase/migrations`.

```
src/main/java/com/alleviare/
  auth/      login, first-run bootstrap, development seeding
  common/    security filter chain, JWT, config properties, DB-backed permissions, scope (tenant / own-records), errors
  org/       employees, login accounts
  field/     orders, expenses, call reports (DCR), attendance & leave, tour plans, dashboard
  catalog/   doctors, products, chemists, stockists
src/main/resources/application.yml   every setting, overridable by environment variable
src/test/    integration tests (embedded PostgreSQL built from the repo migrations)
```

## Configuration

Required: `DATABASE_URL` (JDBC), `DATABASE_USER`, `DATABASE_PASSWORD`, `JWT_SECRET` (at least 32 bytes). The app refuses to start without them.

| Variable | Purpose | Default |
|---|---|---|
| `CORS_ALLOWED_ORIGINS` | Comma-separated browser origins | none |
| `WEB_ONLY_ROLES` | Roles barred from the mobile app | none (all roles may use it) |
| `MIN_PASSWORD_LENGTH` | Password policy | 10 |
| `JWT_TTL_MINUTES` | Token lifetime | 480 |
| `EXPENSE_DEFAULT_DAILY_ALLOWANCE`, `EXPENSE_DEFAULT_RATE_PER_KM` | Applied when a claim omits them | 0 |
| `BOOTSTRAP_ENABLED` + `BOOTSTRAP_COMPANY_CODE/NAME/CURRENCY/TIMEZONE` + `BOOTSTRAP_ADMIN_EMAIL/PASSWORD` | Create the first company and administrator on an empty database (idempotent) | off |
| `DEV_SEED_ENABLED`, `DEV_SEED_PASSWORD`, `DEV_SEED_USERS` (`email:ROLE,...`) | Development only | off |

Leave types and quotas are in `application.yml` (`app.leave.defaults`).

## Run / test

```bash
mvn spring-boot:run     # needs the variables above
mvn test                # self-contained, no database required
```

## Endpoints (`/api/v1`)

`POST auth/login`, `GET auth/me` | `GET dashboard/summary` | `GET|POST employees` | `GET|POST users`, `PATCH users/{id}/status`, `POST users/{id}/password` | `GET|POST doctors, products, chemists, stockists` | `GET|POST orders`, `PATCH orders/{id}/status` | `GET|POST expenses`, `PATCH expenses/{id}/status` | `GET|POST dcr`, `PATCH dcr/{id}/status` | `GET|POST tour-plans` | `GET attendance`, `POST attendance/punch-in|punch-out`, `GET attendance/leave/summary`, `POST attendance/leave/requests`, `PATCH attendance/leave/requests/{id}` | `GET /actuator/health`, OpenAPI at `/v3/api-docs`, UI at `/swagger-ui.html`.

## Not done yet

Row-Level Security policies keyed on the tenant (isolation is enforced in the API, ADR-0002), audit-log writes, refresh tokens, MFA/SSO, and all ERP/HR/quality/messaging/AI domains.
