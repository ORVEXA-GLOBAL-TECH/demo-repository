# AZURE STATIC WEB APPS (100% FREE PLAN) - STEP-BY-STEP DEPLOYMENT GUIDE

This guide provides the exact configuration to deploy your **Super Admin Web Portal** and **Unified Staff Web Portal** on Microsoft Azure Static Web Apps for **$0/month forever**.

---

## 1. Deploying the Super Admin Web Portal on Azure

### Step 1: Open Azure Portal
1. Go to [https://portal.azure.com](https://portal.azure.com) and log in.
2. In the top search bar, type **Static Web Apps** and select it.
3. Click **+ Create** (or **Create static web app**).

### Step 2: Fill in Basics
- **Subscription**: Your Azure Subscription (Free / Pay-As-You-Go)
- **Resource Group**: Click *Create new* $\rightarrow$ Name it `rg-alleviare-prod`
- **Name**: `alleviare-superadmin`
- **Plan type**: Select **Free: For hobby or personal projects ($0/month)**
- **Region**: Choose closest region (e.g. *Central US*, *East Asia*, or *West Europe*)

### Step 3: Deployment Details (GitHub Integration)
- **Deployment source**: Select **GitHub**
- Click **Sign in with GitHub** and authorize Azure.
- **Organization**: `ORVEXA-GLOBAL-TECH`
- **Repository**: `Alleviare_demo1`
- **Branch**: `main`

### Step 4: Build Details
- **Build Presets**: Select **Next.js**
- **App location**: `/frontend/web/super-admin`
- **Api location**: *(Leave blank)*
- **Output location**: `out` *(or `.next`)*

### Step 5: Click "Review + Create" $\rightarrow$ "Create"
Azure will automatically:
1. Provision your free web app with a free global HTTPS URL (e.g., `https://calm-sea-012345.azurestaticapps.net`).
2. Commit a GitHub Action workflow into your repository: `.github/workflows/azure-static-web-apps-*.yml`.
3. Auto-build and auto-deploy every time you push code changes to GitHub!

---

## 2. Deploying the Unified Staff Web Portal on Azure

Repeat the same 2-minute process for the Staff Portal:

1. Click **+ Create** in **Static Web Apps**.
2. **Name**: `alleviare-staff-portal`
3. **Plan type**: **Free ($0/month)**
4. **Repository**: `ORVEXA-GLOBAL-TECH/Alleviare_demo1`
5. **Branch**: `main`
6. **Build Presets**: **Next.js**
7. **App location**: `/frontend/web/staff-portal`
8. Click **Review + Create** $\rightarrow$ **Create**.

---

## 3. How Auto-Refresh (CI/CD) Works on Azure

```mermaid
flowchart LR
    Dev[You make code changes in IDE] -->|git push| GH[GitHub: ORVEXA-GLOBAL-TECH/Alleviare_demo1]
    GH -->|Triggers| Action[Azure GitHub Actions Workflow]
    Action -->|Auto Build & Deploy| Azure[Azure Static Web App (Live)]
    Azure -->|Auto Refreshed in ~60s| User[Live Users see new version]
```

---

## 4. Live Login Testing Matrix

Once deployed, test all roles using default password: `Alleviare@123`

| Portal | Test Account | Expected Behavior |
| :--- | :--- | :--- |
| **Super Admin Portal** | `superadmin` / `superadmin@alleviare.com` | ✅ Full access to 21 CFR governance, drug batch cold-chain IoT, and company registration. |
| **Super Admin Portal** | `director` / `director@alleviare.com` | ❌ Blocked: Error banner displays *Access Denied: Exclusively reserved for Super Admin*. |
| **Staff Portal** | `director` / `director@alleviare.com` | ✅ Managing Director Executive Dashboard (Revenue ₹4.82 Cr, Prescriber KPIs). |
| **Staff Portal** | `accountant` / `accounts@alleviare.com` | ✅ Accounts Dashboard (Pending TA/DA claims ₹1.42 Lakhs, Bank settlements). |
| **Staff Portal** | `salesmanager` / `salesmanager@alleviare.com` | ✅ Sales Dashboard (Field GPS attendance, 284 doctor visits, POB orders ₹18.6 Lakhs). |
| **Staff Portal** | `admin` / `admin@alleviare.com` | ✅ System Admin Dashboard (4,280 Doctor directory, Stockist/Chemist outlets). |
