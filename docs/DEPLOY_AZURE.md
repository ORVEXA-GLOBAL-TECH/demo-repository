# Deploying Alleviare Platform to Azure (and installing the mobile app)

**Honest status.** The API, web app and mobile app are built and tested locally (10 API integration tests against a real PostgreSQL; web and mobile type-check and build). The Dockerfiles, `infra/main.bicep` and `.github/workflows/deploy-azure.yml` have **not been run**: there was no Docker daemon or Azure access where they were written. Expect small fixes on the first deployment; the steps below are written so you can find them quickly.

## Architecture

```
Phones (APK)  /  Browsers
        |  HTTPS
Azure Container Apps (managed TLS)
   alleviare-web (Next.js)      alleviare-api (Spring Boot, Java 21)
                                      | JDBC + TLS
                               PostgreSQL on Supabase (ADR-0001)
Azure Container Registry (images) | Key Vault (secrets) | Log Analytics (logs)
```

Users never talk to the database. Everyone, on web or phone, signs in against the API.

## 1. One-time setup

1. **Tools:** Azure CLI (`az`), a GitHub repository containing this code, a Supabase project.
2. **Database (Supabase):** open the SQL editor and run every file in `supabase/migrations/` in order (`000_users.sql` ... `016_role_permissions.sql`). Do **not** run `supabase/seed/` (demo data) or `supabase/local/` (stand-ins Supabase already has). Collect:
   - `DATABASE_URL`: `jdbc:postgresql://<host>:5432/postgres?sslmode=require` (use the *session pooler* host from Supabase, Settings, Database)
   - `DATABASE_PASSWORD`: the database password
3. **Resource group:**
   ```bash
   az login
   az group create -n alleviare-prod -l centralindia
   ```
4. **Let GitHub deploy without stored passwords (OIDC):**
   ```bash
   az ad app create --display-name alleviare-github        # note the appId
   az ad sp create --id <appId>
   az ad app federated-credential create --id <appId> --parameters '{"name":"prod","issuer":"https://token.actions.githubusercontent.com","subject":"repo:ORVEXA-GLOBAL-TECH/demo-repository:environment:production","audiences":["api://AzureADTokenExchange"]}'
   az role assignment create --assignee <appId> --role Contributor --scope /subscriptions/<sub>/resourceGroups/alleviare-prod
   az role assignment create --assignee <appId> --role "User Access Administrator" --scope /subscriptions/<sub>/resourceGroups/alleviare-prod
   ```
   (User Access Administrator is needed because the template assigns AcrPull and Key Vault roles.)
5. **GitHub, Settings, Environments:** create an environment named `production` (add yourself as a required reviewer if you want an approval gate).
6. **GitHub, Settings, Secrets and variables, Actions:**

   | Kind | Name | Value |
   |---|---|---|
   | Secret | `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` | from step 4 / `az account show` |
   | Secret | `JWT_SECRET` | `openssl rand -base64 48` |
   | Secret | `DATABASE_URL`, `DATABASE_PASSWORD` | from step 2 |
   | Secret | `BOOTSTRAP_ADMIN_PASSWORD` | a long password for your first administrator |
   | Variable | `AZURE_RESOURCE_GROUP` | `alleviare-prod` |
   | Variable | `AZURE_PREFIX` | e.g. `alleviare` (3-12 lowercase letters) |
   | Variable | `BOOTSTRAP_COMPANY_CODE`, `BOOTSTRAP_COMPANY_NAME` | e.g. `orvexa`, `Orvexa Pharma` |
   | Variable | `BOOTSTRAP_CURRENCY`, `BOOTSTRAP_TIMEZONE` | e.g. `INR`, `Asia/Kolkata` (IANA name) |
   | Variable | `BOOTSTRAP_ADMIN_EMAIL` | your admin email |
   | Variable | `WEB_ORIGIN` | leave empty for the first run |
   | Variable | `WEB_ONLY_ROLES` | empty = every role may use the mobile app |

## 2. First deployment

1. Push to `main` (or run the workflow from the Actions tab). It runs the tests, creates the Azure resources from `infra/main.bicep`, builds both images in ACR, rolls them out, and smoke-tests `/actuator/health`.
2. On its first start the API creates your company and administrator from the `BOOTSTRAP_*` values (nothing happens if they already exist).
3. Find the URLs in the workflow log (`webUrl`, `apiUrl`) or with `az deployment group show -g alleviare-prod -n main --query properties.outputs`.
4. Set the GitHub variable `WEB_ORIGIN` to the `webUrl` and run the workflow again. This lets browsers call the API (CORS allow-list). Then clear the variable `BOOTSTRAP_ADMIN_EMAIL` so bootstrap stays off.
5. Open `webUrl`, sign in as the administrator, open **Logins**, and for each person: add the employee, then create their login and pick a role. Everyone then signs in with their email and password on web or mobile.

## 3. Getting the app onto phones

The phone talks to the **public API URL**, so build the app after step 2.

1. `cd apps/mobile`, `npm install`, `npx eas-cli login` (a free Expo account is enough).
2. Tell Expo where your API is (stored in Expo, not in the repository), then build an installable APK:
   ```bash
   npx eas-cli env:create --name EXPO_PUBLIC_API_URL --value https://<apiUrl-from-step-2> --environment production --visibility plaintext
   npx eas-cli build -p android --profile production
   ```
   Do **not** create `ALLOW_CLEARTEXT` for production: it only exists to let test builds talk to a plain-HTTP server on a local network. EAS prints a download link (and QR code) when the build finishes.
3. Each user opens that link on their Android phone, downloads the APK and installs it (allow "install unknown apps" for the browser once). They sign in with the login the administrator created.
4. For the Play Store or iPhones you need a Google Play developer account or an Apple developer account respectively; the same build profile is the starting point.

Updating the app later means building a new APK and sharing the new link. (Over-the-air updates via `expo-updates` are not set up.)

## 4. Before real users

- Custom domains and managed certificates on both Container Apps; then update `WEB_ORIGIN` and rebuild the APK with the new API URL.
- Supabase: enable daily backups / point-in-time recovery and restrict database network access if your plan allows.
- Rotate `JWT_SECRET` periodically (everyone must sign in again).
- Azure Monitor alerts on API 5xx rate and container restarts.
- Run a small load test against `/api/v1/orders` before onboarding many users.
- Costs (check the Azure pricing page for your region): two small always-on Container Apps, a Basic container registry, Log Analytics and Key Vault. Supabase is billed separately.

## 5. Rollback

```bash
az containerapp revision list -g alleviare-prod -n alleviare-api -o table
az containerapp ingress traffic set -g alleviare-prod -n alleviare-api --revision-weight <previous-revision>=100
```

## Known gaps

No password self-service or MFA/SSO yet (administrators reset passwords in the Logins screen); no audit-log writes; tenant row-level-security policies are not in place (isolation is enforced in the API); the legacy Super Admin console in `frontend/superadmin` has no working backend. Finance, HR, manufacturing, quality, messaging and AI modules are not built. See `docs/EXISTING_SYSTEM_ASSESSMENT.md`.
