# Security Architecture & Policies

## Core Security Enforcements

1. **Database Row Level Security (RLS)**:
   - All domain tables in PostgreSQL enforce RLS policy `company_id = public.get_auth_company_id()`.
   - Direct database access by client keys cannot bypass tenant isolation.

2. **Single-Session Enforcement**:
   - `verifyAuth` middleware verifies active session tokens against `public.user_sessions`.
   - Logging in from another browser window or device invalidates prior session tokens.

3. **Media & Image Storage**:
   - Private ImageKit API keys (`IMAGEKIT_PRIVATE_KEY`) are kept strictly server-side.
   - Frontend clients fetch short-lived signatures via `GET /api/upload/auth`.

4. **HTTP Security Headers**:
   - Helmet enforces Security Headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security).
   - Cookies use `HttpOnly` and `SameSite=Lax` settings.
