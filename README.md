# Alleviare SFA & Orvexa Multi-Tenant Platform Monorepo

Enterprise Field Sales Force Automation (SFA) & Global SaaS Multi-Tenant Governance Platform built for Pharmaceutical Field Force Management.

## 🌐 System Architecture & Deployments

| Application | Location | Azure Endpoint / Dev Port | Description |
|---|---|---|---|
| **Super Admin Console** | `frontend/superadmin` | `https://happy-sea-0ee625c00.3.azurestaticapps.net/` (Port `5174`) | Executive Board & Global SaaS Governance (SUPER_ADMIN) |
| **Staff & Field Portal** | `frontend/web` | `https://happy-hill-0e8076300.1.azurestaticapps.net/` (Port `3000`) | Multi-Role Enterprise Portal (ADMIN, DIRECTOR, ACCOUNTANT, MANAGER, SALES_MANAGER, MR_SUPERVISOR, MR) |
| **Mobile App** | `frontend/mobile` | Expo / React Native | Medical Representative (MR) Field Mobile Application |
| **Backend API Core** | `backend` | Node.js Express REST API + WebSockets (`5000`) | Enterprise Core Services, JWT Auth, RBAC & Single-Session Enforcement |
| **Database** | `supabase/migrations` | PostgreSQL / Supabase | Normalized schema with Row-Level Security (RLS) policies |

---

## 🚀 Quick Start Guide

### 1. Run Backend API
```bash
npm run dev:backend
```

### 2. Run Super Admin Console
```bash
npm run dev:superadmin
# Accessible at http://localhost:5174
```

### 3. Run Staff Portal
```bash
npm run dev:web
# Accessible at http://localhost:3000
```

### 4. Run Backend & Security Tests
```bash
node backend/tests/run_tests.js
```

### 5. Build Production Bundles
```bash
npm run build:all
```

---

## 🔐 Role Hierarchy & Access Matrix

- **SUPER_ADMIN**: Platform Governance across all tenants.
- **ADMIN**: Full operational control within a single company.
- **DIRECTOR**: Strategic sales analytics and executive approvals.
- **ACCOUNTANT**: TA/DA expense claim verification, limits, and reimbursements.
- **MANAGER**: Team monitoring, attendance, DCR approvals for assigned hierarchy.
- **SALES_MANAGER**: Target tracking, POB order management, and sales velocity analytics.
- **MR_SUPERVISOR**: Direct MR field monitoring, visit audits, and beat routing.
- **MR**: Field visits, Daily Call Reporting (DCR), POB orders, and expense claims.
