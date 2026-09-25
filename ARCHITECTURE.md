# Platform System Architecture

## Architecture Overview

The Alleviare SFA & Orvexa SaaS Platform is built on a modular monorepo architecture featuring multi-tenant isolation, role-based access control (RBAC), and dual frontend deployment topology.

```
+-------------------------------------------------------------------------------+
|                            CLIENT LAYER (Deployments)                          |
|                                                                               |
|  [Super Admin Console]           [Staff & Field Portal]      [Field Mobile]  |
|  (frontend/superadmin)           (frontend/web)              (frontend/mobile)|
|  Azure SWA #1                    Azure SWA #2                Expo / iOS / Android |
+-----------------------+-----------------------+-------------------------------+
                        |                       |
                        v                       v
+-------------------------------------------------------------------------------+
|                             API GATEWAY & BACKEND                             |
|                                                                               |
|  Node.js / Express REST Engine + Socket.IO WebSockets                         |
|  Middleware: JWT Verification, Single Session Guard, RBAC Guard, Rate Limiter |
+-------------------------------------------------------------------------------+
                        |                       |
                        v                       v
+-----------------------+-----------------------+-------------------------------+
|                       DATABASE & STORAGE LAYER                                |
|                                                                               |
|  PostgreSQL / Supabase Database               ImageKit Media CDN             |
|  Row-Level Security (RLS) Tenant Isolation    Receipt & Document Storage     |
+-------------------------------------------------------------------------------+
```

## Multi-Tenancy Design
1. Every domain table contains a mandatory `company_id` foreign key referencing `public.companies(id)`.
2. Server-side middleware validates the `tenant_id` associated with the JWT payload.
3. Supabase Row Level Security (RLS) policies enforce database-level row filtering using `auth.get_auth_company_id()`.
