# Deploying Alleviare Platform to Azure

Status of this guide: the application code is built and tested locally. The Docker images, the Bicep template and the GitHub workflow below have **not** been executed (no Docker daemon or Azure access was available), so treat the first deployment as a dry run and expect small fixes.

## Target architecture

```
Browser / Mobile app
        |
   HTTPS (Azure Container Apps ingress)
        |
  +-----+-------------------+
  | alleviare-web (Next.js) |   alleviare-api (Spring Boot, Java 21)
  +-------------------------+          |
                                       | JDBC + TLS
                              PostgreSQL (Supabase, ADR-0001)
Azure Container Registry (images) - Key Vault (secrets) - Log Analytics (logs)
```

Database: per ADR-0001 the database stays on **Supabase**. If you later prefer Azure Database for PostgreSQL Flexible Server, run the same migrations after creating the roles `anon`, `authenticated`, `service_role` and a stub `auth.uid()` function (see `.tools/pg/start.mjs` for the exact SQL).

## One-time setup

1. **Tools:** Azure CLI (`az`), a GitHub repository for this code, and a Supabase project.
2. **Database:** in Supabase, run the SQL in `backend/src/db/create_users_table.sql`, then `supabase/migrations/*.sql` in order (SQL editor, or `psql`). Copy the *session pooler* or direct connection details:
   - `DATABASE_URL` as JDBC: `jdbc:postgresql://<host>:5432/postgres?sslmode=require`
   - `DATABASE_PASSWORD`
3. **Create users:** there is no sign-up screen yet. Insert login rows into `public.users` (bcrypt hash of a strong password, `role` such as `ADMIN`, `MR`) for each employee email that exists in `public.employees`. Do **not** set `DEV_SEED_ENABLED` in production.
4. **Resource group:**
   ```bash
   az login
   az group create -n alleviare-prod -l centralindia
   ```
5. **Federated identity for GitHub (no stored passwords):**
   ```bash
   az ad app create --display-name alleviare-github
   # create a federated credential for repo:<owner>/<repo>:environment:production, then:
   az role assignment create --assignee <appId> --role Contributor --scope /subscriptions/<sub>/resourceGroups/alleviare-prod
   az role assignment create --assignee <appId> --role "User Access Administrator" --scope /subscriptions/<sub>/resourceGroups/alleviare-prod
   ```
   (The second role is needed because the template assigns AcrPull and Key Vault roles.)
6. **GitHub settings** (Settings, Secrets and variables, Actions):
   - Secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `JWT_SECRET` (`openssl rand -base64 48`), `DATABASE_URL`, `DATABASE_PASSWORD`
   - Variables: `AZURE_RESOURCE_GROUP=alleviare-prod`, `AZURE_PREFIX=alleviare` (3-12 lowercase chars), `WEB_ORIGIN` (leave empty for the first run)
   - Create an Environment named `production` (add required reviewers if you want an approval gate).

## First deployment

1. Push to `main` (or run the workflow manually). It runs tests, provisions the infrastructure with `infra/main.bicep`, builds both images in ACR, and rolls out the new revisions.
2. Read the outputs from the run (or `az deployment group show`): `webUrl` and `apiUrl`.
3. Set the GitHub variable `WEB_ORIGIN` to the `webUrl`, then re-run the workflow. This makes the API accept browser calls from the web app (CORS allow-list).
4. Open `webUrl` and sign in.

## Mobile app

1. Edit `apps/mobile/eas.json` and set `EXPO_PUBLIC_API_URL` to the `apiUrl`.
2. `cd apps/mobile && npx eas-cli login && npx eas-cli build -p android --profile production`
3. Install the APK from the link EAS prints. (iOS needs an Apple developer account.)

## Before real users

- Custom domain and managed certificate on both Container Apps; update `WEB_ORIGIN` and the mobile URL.
- Supabase: enable backups and point-in-time recovery; restrict network access if your plan allows.
- Rotate `JWT_SECRET` (all users must sign in again).
- Add alerts in Azure Monitor on API 5xx rate and restart count.
- Cost (rough, check the Azure pricing page for your region): two small Container Apps always on, Basic ACR, Log Analytics, Key Vault. Supabase is billed separately.

## Rollback

```bash
az containerapp revision list -g alleviare-prod -n alleviare-api -o table
az containerapp ingress traffic set -g alleviare-prod -n alleviare-api --revision-weight <previous-revision>=100
```

## Known gaps (not deployment problems)

Row-Level Security policies keyed on the tenant, audit-log writes, refresh tokens/MFA/SSO, and all ERP/HR/manufacturing/quality modules are not built yet. See `docs/EXISTING_SYSTEM_ASSESSMENT.md`.
