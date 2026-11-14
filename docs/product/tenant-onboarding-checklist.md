# 📋 New Pharma Tenant Onboarding Questionnaire
### Enterprise Platform Provisioning & Setup Form

> **Instructions for the Client / Tenant**:  
> Please complete this questionnaire with your organization's details. The information provided here will be used by our Super Admin team to provision and configure your dedicated workspace, sovereign compliance settings, role permissions, and root administrative credentials.

---

## 1. Organization & Brand Identity

| Field | Description | Client Response |
| :--- | :--- | :--- |
| **Company Trade Name** *(Required)* | Common name used across mobile app & web console *(e.g., Alleviare Life Sciences)* | |
| **Full Legal Registered Name** *(Required)* | Official registered legal entity *(e.g., Alleviare Life Sciences Private Limited)* | |
| **Preferred Workspace Slug / Subdomain** | Preferred URL prefix *(e.g., `alleviare` for `alleviare.alleviare.com`)* | `__________.alleviare.com` |
| **Industry Segment** | Select: Pharmaceuticals / Generic Formulations / Medical Devices / Biotechnology / Ayurvedic / Veterinary | |
| **Company Classification** | Select: Enterprise / Mid-Market / Regional Distributor / Emerging Startup | |
| **Tax ID / Corporate Registration No.** | GSTIN (India) / VAT No. / Tax ID / Corporate Registration No. | |
| **Official Corporate Website** | Website URL *(e.g., `https://www.company.com`)* | |
| **Brand Primary Color (#HEX)** | Primary theme color for mobile app & dashboards *(e.g., `#0284c7` Blue, `#059669` Green)* | |
| **Corporate Logo Attachment** | High-resolution PNG or SVG on transparent background *(Recommended: 512x512px or SVG)* | `[Attach image file / provide URL]` |

---

## 2. Regional & Sovereign Governance
*(Note: Selecting your sovereign country automatically synchronizes default timezones, currency, and statutory schemes).*

| Field | Description | Client Response |
| :--- | :--- | :--- |
| **Headquarters Sovereign Country** *(Required)* | Select country *(e.g., India 🇮🇳, Vietnam 🇻🇳, UAE 🇦🇪, USA 🇺🇸, Cambodia 🇰🇭, etc.)* | |
| **Operational Timezone** | Primary business timezone *(e.g., `Asia/Kolkata` IST +5:30, `Asia/Ho_Chi_Minh` ICT +7:00, `Asia/Dubai` GST +4:00)* | |
| **Operational & Billing Currency** | Base operational currency *(e.g., INR ₹, VND ₫, USD $, EUR €, AED د.إ)* | |
| **Standard Date Format** | Select: `DD/MM/YYYY` (Standard) / `MM/DD/YYYY` / `YYYY-MM-DD` (ISO) | |
| **Fiscal Year Starting Month** | Select: `April` (Standard India/UK) / `January` (Calendar Year) / `July` / `October` | |
| **Statutory Tax & Withholding Scheme** | Local statutory tax scheme *(e.g., GST 18%, VAT 10%, PIT Slab)* | |
| **Statutory Social Security / Care Scheme** | Applicable social security fund *(e.g., EPFO + ESIC, NSSF, SSO)* | |
| **Data Residency Cloud Region** | Select: AWS Mumbai (India Sovereign) / AWS Singapore (ASEAN) / AWS Frankfurt (EU GDPR) / AWS N. Virginia (US) | |
| **Compliance Standards Needed** | Select all applicable: <br>☐ FDA 21 CFR Part 11 (Audit trails & e-signatures)<br>☐ GxP Good Practice Guidelines<br>☐ HIPAA (Patient Health Privacy)<br>☐ GDPR (EU Data Protection)<br>☐ ISO 27001 | |

---

## 3. Commercial Subscription & Capacity Quotas

| Field | Description | Client Response |
| :--- | :--- | :--- |
| **Subscription Plan Tier** | Select: <br>☐ Free Trial (14 days evaluation)<br>☐ Starter Tier ($100/mo)<br>☐ Growth Tier ($450/mo)<br>☐ Professional Tier ($1,000/mo)<br>☐ Enterprise Sovereign ($2,500/mo)<br>☐ Custom Contract | |
| **Billing Frequency** | Select: Monthly / Quarterly / Annually (Annual contracts receive 15% discount) | |
| **Purchase Order (PO) / Contract No.** | Optional client internal purchase order reference | |
| **Payment Terms** | Select: Net 15 / Net 30 / Advance / Net 60 | |
| **Total User Licenses Needed** *(Required)* | Total user accounts needed across field reps, managers, and admins *(e.g., 50, 150, 500, 1,000+)* | |
| **Cloud Document & Media Storage** | Estimated storage for chemist bills, doctor photos, visual aids *(e.g., 25 GB, 50 GB, 100 GB, 500 GB)* | |
| **API Rate Limit (Requests/Min)** | Expected API traffic if connecting external ERP/SAP systems *(Default: 600 req/min)* | |

---

## 4. Role Modules & Functional Capabilities
*Please indicate which of the 7 enterprise modules and functional capabilities your organization requires:*

### A. 🛡️ Admin Module (Master Governance)
- [ ] **User Provisioning & Licensing**: Create, lock, assign and manage employee licenses across divisions.
- [ ] **RBAC & Permission Matrices**: Configure granular role-based permissions and regional hierarchies.
- [ ] **Master HCP & Chemist Database**: Central repository of verified doctors, clinics, hospitals, and stockists.
- [ ] **Product Catalog & Price Lists**: Manage pharmaceutical formulations, SKUs, batches, and price lists.
- [ ] **Security & Audit Trail Logs**: Immutable login logs and 21 CFR Part 11 electronic records tracking.
- [ ] **API Keys & ERP Integrations**: Webhooks and REST APIs to sync with SAP, Oracle, Tally, or warehouse ERPs.

### B. 💼 Director Module (Executive Leadership)
- [ ] **Executive KPI & Revenue Dashboards**: Real-time sales revenue, margin analysis, and nationwide growth trends.
- [ ] **Territory Market Penetration**: Zonal market share, competitor intelligence, and doctor reach rates.
- [ ] **AI Predictive Forecasting & Churn**: Machine-learning models for demand forecasting and inventory risks.
- [ ] **Commercial Strategy Approvals**: High-value distributor credit lines, annual budgets, and policy sign-offs.
- [ ] **Governance & Board Packs**: One-click export of statutory compliance and quarterly performance decks.

### C. 🧮 Accountant Module (Finance & Claims)
- [ ] **Field Expense Claims (TA / DA)**: Audit mileage, GPS journey validation, daily allowances, and hotel bills.
- [ ] **Stockist Invoicing & POB Billing**: Generate GST-compliant invoices and track outstanding receivables.
- [ ] **Sample & Gift Inventory Audit**: Track batch dispatch, physician gift distributions, and sample registers.
- [ ] **Sales Incentive Payouts**: Automated calculation of field force target-linked monthly commission payouts.
- [ ] **Tax Ledgers & ERP Sync**: Export journal entries to Tally, SAP, and general ledger systems.

### D. 🏢 Manager Module (Regional Field Operations)
- [ ] **Zonal Operations Cockpit**: Monitor multi-state team field presence, call volume, and doctor coverage.
- [ ] **Team Performance Scorecards**: Rank sales reps, supervisors, and areas by KPI achievement velocity.
- [ ] **Leave & Tour Plan Escalations**: Approve medical leave, tour budget escalations, and territory exceptions.
- [ ] **Territory Reallocation Workflows**: Reassign doctors, routes, and stockists between sales divisions.
- [ ] **Doctor Coverage Frequency Audit**: Identify core vs. non-core physician frequency compliance.

### E. 📈 Sales Manager Module (Secondary Sales Ops)
- [ ] **Secondary Order Booking & Approvals**: Review orders placed by MRs with stockists, apply discounts and dispatch.
- [ ] **Target vs. Achievement Analytics**: Track monthly brand-wise, rep-wise, and territory-wise sales targets.
- [ ] **Stockist Credit & Outstanding Ledgers**: Monitor payment recovery, credit limits, and overdue balance alerts.
- [ ] **Sales Hierarchy Distribution**: Configure Area Business Managers, reps, and product division assignments.
- [ ] **Product Performance & Fast-Moving SKUs**: Track product lifecycle, newly launched molecules, and sales velocity.

### F. 🧭 MR Supervisor Module (Field Supervision)
- [ ] **Real-time Field GPS Telemetry**: Track live rep locations, battery telemetry, and route breadcrumbs.
- [ ] **DCR Review & Electronic Verification**: Verify doctor call logs, chemist visits, and field photos in real-time.
- [ ] **Joint Field Work & Accompaniment Calls**: Record coaching feedback and dual visits to high-prescribing KOL doctors.
- [ ] **Route Deviation & Geo-Fencing Alerts**: Instant notifications when calls are logged outside verified clinic coordinates.
- [ ] **Monthly Tour Program Approvals**: Review, modify, and approve next month's proposed rep travel calendars.

### G. 🩺 MR (Medical Representative) Module (Field Execution)
- [ ] **Daily Call Reporting (DCR)**: Instant logging of doctor discussions, chemist visits, and stockist interactions.
- [ ] **Monthly Tour Program (MTP) Submission**: Advance monthly route calendar and travel plan submission.
- [ ] **Doctor / HCP CRM Directory**: Physician profiles, specialties, prescribing habits, and visit history.
- [ ] **Chemist POB Order Booking**: Collect and book secondary product orders directly from retail chemists.
- [ ] **Digital E-Detailing & Visual Aids**: Interactive tablet slides, medical animations, and molecule studies.
- [ ] **Sample & Gift Distribution Log**: Physician sample delivery records with batch numbers and digital signatures.
- [ ] **Offline Mobile Sync Engine**: Continue logging calls and orders without internet connectivity; auto-syncs when online.

---

## 5. Primary Root Company Administrator Account
*This account will receive root super-user administrative access to your dedicated company portal:*

| Field | Description | Client Response |
| :--- | :--- | :--- |
| **Administrator Full Name** *(Required)* | Full name of appointed corporate admin *(e.g., Dr. Rajesh Sharma)* | |
| **Corporate Email Address** *(Required)* | Official corporate email for login *(e.g., `admin@alleviare.com`)* | |
| **Mobile / Contact Phone** *(Required)* | Direct mobile number for OTP alerts and critical notices | |
| **Initial Password Preference** | Temporary password (minimum 8 characters, with uppercase, number, symbol) or auto-generate secure password | |
| **Mandatory Two-Factor Auth (2FA)** | Require 2FA (TOTP Authenticator app or SMS) for all company admins? *(Yes / No)* | |

---

## 6. Security, Session & Audit Policies

| Field | Description | Client Response |
| :--- | :--- | :--- |
| **Idle Session Timeout** | Automatic logout after inactivity *(Options: 15 min / 30 min / 60 min / 120 min)* | |
| **Authorized Corporate IP CIDRs** *(Optional)* | Restrict admin login strictly to specific office network IP addresses *(e.g., `103.21.144.0/24`)* | |
| **Audit Trail Retention Period** | Regulatory audit log retention *(Default: 7 Years for Pharma GxP compliance)* | |

---

### Sign-off & Submission
- **Submitted By**: ___________________________________________
- **Designation / Title**: ___________________________________________
- **Date**: ___________________________________________
- **Contact Email / Phone**: ___________________________________________
