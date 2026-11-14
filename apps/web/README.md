# Web portal (Next.js + TypeScript)

```
app/          Next.js App Router (page.tsx = login + role-based shell)
components/   One file per module screen (Orders, Expenses, Visits, Attendance, Tours, Catalog, Logins, Dashboard) + ui.tsx
lib/          auth.tsx (session, API client), useLoad.ts (data loading)
```

Navigation and buttons come from the signed-in user's permissions (`packages/api-client`); the API enforces the same rules.

```bash
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL
npm install && npm run dev     # http://localhost:3001
npm run typecheck && npm run build
```
