# @alleviare/api-client

Dependency-free TypeScript client for the API, shared by `apps/web` and `apps/mobile`. It is imported by path (see `tsconfig.json` paths, `next.config.mjs` `externalDir`, `metro.config.js`), not published.

- `createClient(baseUrl, tokenStore, onUnauthorized)` returns typed methods for every endpoint.
- Types for every response (`Order`, `Expense`, `Dcr`, `User`, ...).
- `MODULES`, `visibleModules(user)`, `can(user, permission)`, `canApprove(user, kind)`: the permission-to-screen model both apps use.
- `setCurrency(code)` / `fmtMoney(n)`: money formatting in the company's currency.

Adding an endpoint: add the types and one method here, then use it from both apps.
