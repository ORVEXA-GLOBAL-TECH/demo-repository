# ALLEVIARE PHARMA PLATFORM - PRODUCTION DEPLOYMENT GUIDE (DAY 4)

This guide provides the exact, copy-paste steps to deploy the entire system for **100% Free** with automatic CI/CD refresh on every git push.

---

## 1. Web Portals Deployment (Vercel - 100% Free & Instant)

### Portal 1: Super Admin Portal
1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select the repository: **`ORVEXA-GLOBAL-TECH/Alleviare_demo1`**.
4. In the configuration screen:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click *Edit* and select **`frontend/web/super-admin`**.
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: `https://your-api-gateway-domain.com/api/v1` (or `http://localhost:8080/api/v1` for dev)
5. Click **Deploy**.
6. **Result**: Your Super Admin portal is live (e.g., `https://alleviare-superadmin.vercel.app`) with free SSL. Every time you push code changes to GitHub, Vercel rebuilds and updates the live site in ~45 seconds.

---

### Portal 2: Unified Staff & Management Portal
1. In Vercel, click **Add New...** $\rightarrow$ **Project**.
2. Select the same repository: **`ORVEXA-GLOBAL-TECH/Alleviare_demo1`**.
3. In the configuration screen:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click *Edit* and select **`frontend/web/staff-portal`**.
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: `https://your-api-gateway-domain.com/api/v1`
4. Click **Deploy**.
5. **Result**: Your Unified Staff portal is live (e.g., `https://alleviare-staff.vercel.app`).

---

## 2. Backend Microservices Deployment (100% Free Options)

### Option A: Oracle Cloud Always Free VM (Recommended - 24GB RAM $0 Forever)
1. Create a free account at [https://cloud.oracle.com](https://cloud.oracle.com).
2. Create an **Ampere A1 Compute Instance** (4 OCPUs, 24 GB RAM, Ubuntu 22.04).
3. Connect via SSH:
   ```bash
   ssh ubuntu@your-oracle-vm-ip
   ```
4. Install Docker & Git:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose git
   sudo usermod -aG docker ubuntu
   ```
5. Clone your repository:
   ```bash
   git clone https://github.com/ORVEXA-GLOBAL-TECH/Alleviare_demo1.git
   cd Alleviare_demo1/backend
   ```
6. Copy environment file and start all microservices:
   ```bash
   cp .env.example .env
   # Verify your Supabase credentials are in .env
   docker-compose up -d --build
   ```
7. Verify all services are running:
   ```bash
   docker ps
   curl http://localhost:8080/actuator/health
   ```

---

### Option B: Render.com / Koyeb (Single-Click Web Container)
1. Go to [https://render.com](https://render.com).
2. Create a new **Web Service** $\rightarrow$ Connect `ORVEXA-GLOBAL-TECH/Alleviare_demo1`.
3. Set root directory to `backend/api-gateway`.
4. Add environment variables for Supabase database.
5. Deploy.

---

## 3. Live Role Verification Matrix

Test all accounts using the seed password: `Alleviare@123`

| Test Case | User / Role | Portal / App | Expected Result |
| :--- | :--- | :--- | :--- |
| **1. Super Admin Auth** | `superadmin` | Super Admin Web Portal | ✅ Success: Enters 21 CFR command center, company governance, batch IoT telemetry. |
| **2. Super Admin Isolation** | `director` | Super Admin Web Portal | ❌ Blocked: Error banner displays *Access Denied: Exclusively reserved for Super Admin*. |
| **3. Managing Director Auth** | `director` | Staff Web Portal | ✅ Success: Displays Executive revenue (₹4.82 Cr), Prescriber coverage (94.8%), Territory KPIs. |
| **4. Accounts Manager Auth** | `accountant` | Staff Web Portal | ✅ Success: Displays Pending TA/DA claims (₹1.42 Lakhs), Bank settlements, DSO aging. |
| **5. Sales Leadership Auth** | `salesmanager` / `manager` | Staff Web Portal | ✅ Success: Displays Live MR GPS attendance, DCR visits, POB orders (₹18.6 Lakhs). |
| **6. Field MR Mobile App** | `mr_rahul` | Flutter Mobile App | ✅ Success: Biometric fingerprint / Email login, Geofenced doctor punch-in, Offline sync. |
