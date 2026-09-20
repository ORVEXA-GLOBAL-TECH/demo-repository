# Alleviare SFA & Orvexa Multi-Tenant Platform Monorepo

This repository contains two standalone static web applications (consoles) alongside the backend microservices and mobile application:

## 🌐 Applications Overview

| Application | Path | Dev Port | Description |
|---|---|---|---|
| **Staff SFA Portal** | `frontend/web` | `3000` / `5173` | Corporate Staff & Field Operations (Admin, Director, Managers, Supervisors, Accountants) |
| **Super Admin Console** | `frontend/superadmin` | `5174` | Executive Board & Global Multi-Tenant SaaS Governance (Orvexa Global HQ) |
| **Backend API** | `backend` | `5000` | Express REST API & Socket.IO Real-time WebSocket Server |
| **Mobile App** | `frontend/mobile` | Expo | Field Medical Representative (MR) Application |

---

## 🚀 Quick Start Commands

### Run Consoles Locally

- **Run Backend API Server**:
  ```bash
  npm run dev:backend
  ```

- **Run Staff / SFA Operations Console**:
  ```bash
  npm run dev:web
  # or
  npm run dev:staff
  ```
  Access at `http://localhost:3000`

- **Run Super Admin SaaS Console**:
  ```bash
  npm run dev:superadmin
  ```
  Access at `http://localhost:5174`

- **Run Both Consoles (or All)**:
  Run each command in separate terminal tabs for development.

---

## 🏗️ Production Builds

- **Build Staff Portal**:
  ```bash
  npm run build:web
  ```
- **Build Super Admin Console**:
  ```bash
  npm run build:superadmin
  ```
- **Build All Frontends**:
  ```bash
  npm run build:all
  ```

---

## ☁️ Azure Static Web Apps Deployment

Separate GitHub Actions CI/CD workflows are provided for both static apps:
- Staff Portal: [`.github/workflows/azure-static-web-apps-happy-hill-0e8076300.yml`](.github/workflows/azure-static-web-apps-happy-hill-0e8076300.yml) (app_location: `frontend/web`)
- Super Admin Console: [`.github/workflows/azure-static-web-apps-superadmin.yml`](.github/workflows/azure-static-web-apps-superadmin.yml) (app_location: `frontend/superadmin`)
