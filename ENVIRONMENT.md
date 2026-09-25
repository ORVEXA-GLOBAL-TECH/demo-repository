# Environment Variables Reference

## Backend Environment Variables (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Node.js Express server port | `5000` |
| `NODE_ENV` | Application environment | `production` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-jwt-key` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/alleviaresfa` |
| `SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (Server-only) | `eyJhbGciOi...` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_3Cv7nDdS19aOSeTY88SAlJvpW0k=` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key (Server-only) | `private_xxxx=` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit media CDN URL | `https://ik.imagekit.io/bc9nnctkf` |

## Frontend Environment Variables (`frontend/web/.env` and `frontend/superadmin/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | API base URL | `https://alleviare-sfa-api-2026.azurewebsites.net/api` |
| `VITE_SOCKET_URL` | WebSocket server URL | `https://alleviare-sfa-api-2026.azurewebsites.net` |
