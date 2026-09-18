import React, { useState } from 'react';
import {
  Building2,
  Globe2,
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Server,
  ShieldCheck,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  UserCog,
  FileText,
  ToggleLeft,
  ToggleRight,
  Database,
  Lock,
  Layers,
  Key,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Settings,
  HardDrive,
  HelpCircle,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Percent
} from 'lucide-react';

// ============================================================================
// DATA STORES FOR SAAS PLATFORM GOVERNANCE
// ============================================================================

const GLOBAL_SAAS_KPIS = {
  totalCompanies: 42,
  activeCompanies: 38,
  suspendedCompanies: 2,
  trialCompanies: 2,
  expiredCompanies: 0,
  totalCountries: 12,
  totalUsers: 18450,
  activeUsers: 16920,
  totalProducts: 8250,
  totalCompanyAdmins: 84,
  totalMRs: 14200,
  totalManagers: 2150,
  totalGMs: 82,
  activeSubscriptions: 40,
  expiringSubscriptions: 5,
  mrr: 125400,
  arr: 1504800,
  systemAlertsCount: 18
};

const INITIAL_COUNTRIES = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    language: 'English, Hindi',
    fiscalYear: 'April - March',
    activeCompanies: 18,
    taxConfig: 'GST (18%) + TDS',
    socialSecurity: 'EPFO (12%) + ESIC (0.75%)',
    holidaysCount: 14,
    status: 'ACTIVE'
  },
  {
    code: 'KH',
    name: 'Cambodia',
    flag: '🇰🇭',
    currency: 'USD ($) & KHR (៛)',
    timezone: 'Asia/Phnom_Penh (UTC+07:00)',
    language: 'Khmer, English',
    fiscalYear: 'January - December',
    activeCompanies: 8,
    taxConfig: 'Tax on Salary (0% - 20%)',
    socialSecurity: 'NSSF (Occupational Risk + Health Care 2.6%)',
    holidaysCount: 22,
    status: 'ACTIVE'
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    flag: '🇧🇩',
    currency: 'BDT (৳)',
    timezone: 'Asia/Dhaka (UTC+06:00)',
    language: 'Bengali, English',
    fiscalYear: 'July - June',
    activeCompanies: 6,
    taxConfig: 'Individual Tax Slab + 15% VAT',
    socialSecurity: 'Workers Welfare Foundation (WPPF 5%)',
    holidaysCount: 16,
    status: 'ACTIVE'
  },
  {
    code: 'NP',
    name: 'Nepal',
    flag: '🇳🇵',
    currency: 'NPR (रू)',
    timezone: 'Asia/Kathmandu (UTC+05:45)',
    language: 'Nepali, English',
    fiscalYear: 'July - June (Shrawan-Ashadh)',
    activeCompanies: 4,
    taxConfig: 'TDS (15%) + Social Security Tax (1%)',
    socialSecurity: 'SSF (Social Security Fund 31%)',
    holidaysCount: 18,
    status: 'ACTIVE'
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB (฿)',
    timezone: 'Asia/Bangkok (UTC+07:00)',
    language: 'Thai, English',
    fiscalYear: 'January - December',
    activeCompanies: 3,
    taxConfig: 'PIT (Personal Income Tax 5%-35%)',
    socialSecurity: 'SSO (Social Security 5% max 750 THB)',
    holidaysCount: 19,
    status: 'ACTIVE'
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    currency: 'VND (₫)',
    timezone: 'Asia/Ho_Chi_Minh (UTC+07:00)',
    language: 'Vietnamese, English',
    fiscalYear: 'January - December',
    activeCompanies: 3,
    taxConfig: 'PIT (Progressive 5%-35%)',
    socialSecurity: 'SHI + UI + SI (Total 32%)',
    holidaysCount: 11,
    status: 'ACTIVE'
  }
];

const INITIAL_COMPANIES = [
  {
    id: 'CMP-001',
    code: 'ALV-IN',
    name: 'Alleviare Life Sciences India',
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    fiscalYear: 'Apr - Mar',
    adminName: 'Dr. Rajesh Sharma',
    adminEmail: 'admin@alleviare.com',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    usersCount: 1850,
    mrsCount: 1450,
    managersCount: 220,
    gmsCount: 8,
    tenantId: 'TENANT-001',
    mrr: '$4,200',
    renewalDate: '2027-04-01',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: true,
      nssf: false,
      hrms: true,
      aiAnalytics: true,
      advancedReports: true
    }
  },
  {
    id: 'CMP-002',
    code: 'ABC-KH',
    name: 'ABC Pharma Cambodia Co., Ltd.',
    country: 'Cambodia',
    flag: '🇰🇭',
    currency: 'USD',
    timezone: 'Asia/Phnom_Penh',
    fiscalYear: 'Jan - Dec',
    adminName: 'Sokha Chan',
    adminEmail: 'admin@abcpharma.com.kh',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    usersCount: 850,
    mrsCount: 600,
    managersCount: 95,
    gmsCount: 4,
    tenantId: 'TENANT-002',
    mrr: '$3,400',
    renewalDate: '2027-09-30',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: true,
      nssf: true, // Cambodia NSSF active!
      hrms: true,
      aiAnalytics: false,
      advancedReports: true
    }
  },
  {
    id: 'CMP-003',
    code: 'SND-BD',
    name: 'Square BioPharma Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    fiscalYear: 'Jul - Jun',
    adminName: 'Tanvir Ahmed',
    adminEmail: 'admin@squarebiopharma.bd',
    plan: 'PRO',
    status: 'ACTIVE',
    usersCount: 1200,
    mrsCount: 950,
    managersCount: 140,
    gmsCount: 6,
    tenantId: 'TENANT-003',
    mrr: '$2,800',
    renewalDate: '2026-12-15',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: true,
      nssf: false,
      hrms: true,
      aiAnalytics: false,
      advancedReports: true
    }
  },
  {
    id: 'CMP-004',
    code: 'HML-NP',
    name: 'Himalayan HealthTech Nepal',
    country: 'Nepal',
    flag: '🇳🇵',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    fiscalYear: 'Jul - Jun',
    adminName: 'Bikash Shrestha',
    adminEmail: 'admin@himalayanhealth.np',
    plan: 'PRO',
    status: 'ACTIVE',
    usersCount: 420,
    mrsCount: 310,
    managersCount: 45,
    gmsCount: 2,
    tenantId: 'TENANT-004',
    mrr: '$1,200',
    renewalDate: '2026-11-20',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: true,
      nssf: false,
      hrms: false,
      aiAnalytics: false,
      advancedReports: true
    }
  },
  {
    id: 'CMP-005',
    code: 'BMA-TH',
    name: 'Bangkok MediPharm Siam',
    country: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    fiscalYear: 'Jan - Dec',
    adminName: 'Somchai Prasert',
    adminEmail: 'admin@bangkokmedipharm.co.th',
    plan: 'ENTERPRISE',
    status: 'TRIAL',
    usersCount: 190,
    mrsCount: 140,
    managersCount: 20,
    gmsCount: 1,
    tenantId: 'TENANT-005',
    mrr: '$0 (Trial)',
    renewalDate: '2026-10-15',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: false,
      nssf: false,
      hrms: false,
      aiAnalytics: true,
      advancedReports: false
    }
  },
  {
    id: 'CMP-006',
    code: 'VNT-VN',
    name: 'VinaCare Pharmaceutical Saigon',
    country: 'Vietnam',
    flag: '🇻🇳',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    fiscalYear: 'Jan - Dec',
    adminName: 'Nguyen Van Hai',
    adminEmail: 'admin@vinacarepharma.vn',
    plan: 'BASIC',
    status: 'SUSPENDED',
    usersCount: 320,
    mrsCount: 240,
    managersCount: 30,
    gmsCount: 2,
    tenantId: 'TENANT-006',
    mrr: '$950 (On Hold)',
    renewalDate: '2026-08-30',
    modules: {
      mrReporting: true,
      doctorManagement: true,
      sales: true,
      payroll: false,
      nssf: false,
      hrms: false,
      aiAnalytics: false,
      advancedReports: false
    }
  }
];

const INITIAL_COMPANY_ADMINS = [
  {
    id: 'ADM-01',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    company: 'Alleviare Life Sciences India',
    country: 'India',
    role: 'Company Admin',
    mfaEnabled: true,
    status: 'ACTIVE',
    lastLogin: 'Today, 09:12 AM',
    ipAddress: '103.21.144.10'
  },
  {
    id: 'ADM-02',
    name: 'Sokha Chan',
    email: 'admin@abcpharma.com.kh',
    company: 'ABC Pharma Cambodia Co., Ltd.',
    country: 'Cambodia',
    role: 'Company Admin',
    mfaEnabled: true,
    status: 'ACTIVE',
    lastLogin: 'Yesterday, 04:30 PM',
    ipAddress: '119.15.160.88'
  },
  {
    id: 'ADM-03',
    name: 'Tanvir Ahmed',
    email: 'admin@squarebiopharma.bd',
    company: 'Square BioPharma Bangladesh',
    country: 'Bangladesh',
    role: 'Company Admin',
    mfaEnabled: false,
    status: 'ACTIVE',
    lastLogin: '18 Sep, 08:22 AM',
    ipAddress: '103.230.106.12'
  },
  {
    id: 'ADM-04',
    name: 'Bikash Shrestha',
    email: 'admin@himalayanhealth.np',
    company: 'Himalayan HealthTech Nepal',
    country: 'Nepal',
    role: 'Company Admin',
    mfaEnabled: true,
    status: 'ACTIVE',
    lastLogin: '16 Sep, 11:45 AM',
    ipAddress: '202.79.40.15'
  },
  {
    id: 'ADM-05',
    name: 'Somchai Prasert',
    email: 'admin@bangkokmedipharm.co.th',
    company: 'Bangkok MediPharm Siam',
    country: 'Thailand',
    role: 'Company Admin',
    mfaEnabled: true,
    status: 'ACTIVE',
    lastLogin: '17 Sep, 02:10 PM',
    ipAddress: '171.96.180.22'
  },
  {
    id: 'ADM-06',
    name: 'Nguyen Van Hai',
    email: 'admin@vinacarepharma.vn',
    company: 'VinaCare Pharmaceutical Saigon',
    country: 'Vietnam',
    role: 'Company Admin',
    mfaEnabled: false,
    status: 'LOCKED',
    lastLogin: '28 Aug, 10:15 AM',
    ipAddress: '113.161.72.4'
  }
];

const TENANTS_LIST = [
  { id: 'TENANT-001', company: 'Alleviare India', schema: 'tenant_alleviare_in', country: 'India', status: 'ONLINE', storage: '48 GB / 100 GB', dbHealth: '99.99%', lastBackup: '2 hours ago' },
  { id: 'TENANT-002', company: 'ABC Pharma Cambodia', schema: 'tenant_abcpharma_kh', country: 'Cambodia', status: 'ONLINE', storage: '28 GB / 50 GB', dbHealth: '100%', lastBackup: '3 hours ago' },
  { id: 'TENANT-003', company: 'Square BioPharma', schema: 'tenant_square_bd', country: 'Bangladesh', status: 'ONLINE', storage: '34 GB / 50 GB', dbHealth: '99.95%', lastBackup: '2 hours ago' },
  { id: 'TENANT-004', company: 'Himalayan HealthTech', schema: 'tenant_himalayan_np', country: 'Nepal', status: 'ONLINE', storage: '12 GB / 25 GB', dbHealth: '100%', lastBackup: '5 hours ago' },
  { id: 'TENANT-005', company: 'Bangkok MediPharm', schema: 'tenant_bangkok_th', country: 'Thailand', status: 'ONLINE', storage: '5 GB / 25 GB', dbHealth: '100%', lastBackup: '4 hours ago' },
  { id: 'TENANT-006', company: 'VinaCare Saigon', schema: 'tenant_vinacare_vn', country: 'Vietnam', status: 'SUSPENDED', storage: '9 GB / 25 GB', dbHealth: 'STANDBY', lastBackup: '1 day ago' }
];

const SYSTEM_HEALTH_METRICS = [
  { service: 'Core API Gateway (Node/Express)', status: 'HEALTHY', latency: '42ms', uptime: '99.98%' },
  { service: 'PostgreSQL Multi-Tenant DB Cluster', status: 'HEALTHY', latency: '12ms', uptime: '99.99%' },
  { service: 'Redis Cache & Session Store', status: 'HEALTHY', latency: '3ms', uptime: '100%' },
  { service: 'Azure Blob Storage (Cloud Receipts)', status: 'HEALTHY', latency: '65ms', uptime: '99.95%' },
  { service: 'Email Provider (SendGrid Enterprise)', status: 'HEALTHY', latency: '180ms', uptime: '99.92%' },
  { service: 'SMS Gateway (Twilio / Local Telco)', status: 'HEALTHY', latency: '220ms', uptime: '99.88%' },
  { service: 'Push Notifications (FCM / APNs)', status: 'HEALTHY', latency: '95ms', uptime: '99.96%' },
  { service: 'Mapbox / Google Maps Geocoding API', status: 'DEGRADED', latency: '740ms', uptime: '98.40%', note: 'Occasional latency spikes in South Asia' }
];

export default function SuperAdminDashboard({ activeSubTab = 'saas-overview', setActiveSubTab }) {
  const [currentTab, setCurrentTab] = useState(activeSubTab || 'saas-overview');
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [countries] = useState(INITIAL_COUNTRIES);
  const [admins, setAdmins] = useState(INITIAL_COMPANY_ADMINS);
  const [tenants] = useState(TENANTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);

  // New Company Modal Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    code: '',
    country: 'Cambodia',
    currency: 'USD',
    timezone: 'Asia/Phnom_Penh',
    fiscalYear: 'Jan - Dec',
    adminName: '',
    adminEmail: '',
    plan: 'PRO'
  });

  const handleToggleModule = (companyId, moduleKey) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            modules: {
              ...c.modules,
              [moduleKey]: !c.modules[moduleKey]
            }
          };
        }
        return c;
      })
    );
  };

  const handleCreateCompany = (e) => {
    e.preventDefault();
    const created = {
      id: `CMP-00${companies.length + 1}`,
      code: newCompany.code || `CMP-${Date.now().toString().slice(-3)}`,
      name: newCompany.name,
      country: newCompany.country,
      flag: newCompany.country === 'Cambodia' ? '🇰🇭' : newCompany.country === 'India' ? '🇮🇳' : '🇧🇩',
      currency: newCompany.currency,
      timezone: newCompany.timezone,
      fiscalYear: newCompany.fiscalYear,
      adminName: newCompany.adminName,
      adminEmail: newCompany.adminEmail,
      plan: newCompany.plan,
      status: 'ACTIVE',
      usersCount: 1,
      mrsCount: 0,
      managersCount: 0,
      gmsCount: 0,
      tenantId: `TENANT-00${companies.length + 1}`,
      mrr: newCompany.plan === 'ENTERPRISE' ? '$3,500' : '$1,500',
      renewalDate: '2027-09-30',
      modules: {
        mrReporting: true,
        doctorManagement: true,
        sales: true,
        payroll: true,
        nssf: newCompany.country === 'Cambodia',
        hrms: true,
        aiAnalytics: newCompany.plan === 'ENTERPRISE',
        advancedReports: true
      }
    };

    setCompanies([created, ...companies]);
    setIsCreateCompanyOpen(false);
    alert(`✅ Company "${created.name}" created successfully as separate isolated tenant ${created.tenantId}!`);
  };

  const toggleCompanyStatus = (id) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="superadmin-suite-container">
      {/* Top Level SaaS Navigation Bar */}
      <div className="saas-header-strip">
        <div className="saas-header-left">
          <div className="saas-global-chip">
            <Globe2 size={15} />
            <span>ORVEXA GLOBAL TECH // MULTI-TENANT SAAS GOVERNANCE</span>
          </div>
          <h1 className="saas-header-title">Super Admin Platform Command Center</h1>
          <p className="saas-header-desc">
            Global SaaS Control Layer &bull; Tenant Isolation &bull; Country Configurations &bull; Company Administration
          </p>
        </div>

        <div className="saas-quick-stats-pills">
          <div className="header-stat-pill">
            <span className="pill-label">Total MRR</span>
            <span className="pill-value text-green">${GLOBAL_SAAS_KPIS.mrr.toLocaleString()}</span>
          </div>
          <div className="header-stat-pill">
            <span className="pill-label">ARR Run-Rate</span>
            <span className="pill-value text-purple">${GLOBAL_SAAS_KPIS.arr.toLocaleString()}</span>
          </div>
          <div className="header-stat-pill">
            <span className="pill-label">Tenants</span>
            <span className="pill-value">{GLOBAL_SAAS_KPIS.totalCompanies} Active</span>
          </div>
        </div>
      </div>

      {/* Governance Secondary Tabs */}
      <div className="saas-nav-tabs">
        <button
          className={`saas-tab-btn ${currentTab === 'saas-overview' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-overview')}
        >
          <Activity size={16} />
          <span>1. Global KPIs &amp; Overview</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-companies' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-companies')}
        >
          <Building2 size={16} />
          <span>2. Company Management</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-countries' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-countries')}
        >
          <Globe2 size={16} />
          <span>3. Country Management</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-admins' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-admins')}
        >
          <UserCog size={16} />
          <span>4. Company Admins</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-subscriptions' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-subscriptions')}
        >
          <CreditCard size={16} />
          <span>5. Subscriptions &amp; Billing</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-features' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-features')}
        >
          <Layers size={16} />
          <span>6. Feature / Module Toggles</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-tenants' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-tenants')}
        >
          <Database size={16} />
          <span>7. Tenant Isolation</span>
        </button>
        <button
          className={`saas-tab-btn ${currentTab === 'saas-system-health' ? 'active' : ''}`}
          onClick={() => setCurrentTab('saas-system-health')}
        >
          <Server size={16} />
          <span>8. System Health &amp; Security</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: GLOBAL SAAS KPIS & OVERVIEW
          ===================================================================== */}
      {currentTab === 'saas-overview' && (
        <div className="tab-pane-content">
          {/* Architecture Reminder Card */}
          <div className="arch-reminder-card">
            <div className="arch-card-icon">
              <ShieldCheck size={26} color="#fbbf24" />
            </div>
            <div>
              <div className="arch-card-title">Tenant Separation Principle Active</div>
              <div className="arch-card-desc">
                Super Admin governs the SaaS platform, subscription quotas, and tenant isolation. 
                Individual MRs, daily doctor visits, chemist bookings, and company-specific payroll records are managed exclusively by each Company Admin.
              </div>
            </div>
          </div>

          {/* KPI Row 1: High Level Totals */}
          <div className="kpi-banner-grid">
            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Companies</span>
                <Building2 size={20} className="kpi-icon blue" />
              </div>
              <div className="kpi-number">{GLOBAL_SAAS_KPIS.totalCompanies}</div>
              <div className="kpi-status-breakdown">
                <span className="dot-active">🟢 {GLOBAL_SAAS_KPIS.activeCompanies} Active</span>
                <span className="dot-trial">🟣 {GLOBAL_SAAS_KPIS.trialCompanies} Trial</span>
                <span className="dot-suspended">🟡 {GLOBAL_SAAS_KPIS.suspendedCompanies} Suspended</span>
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Countries Supported</span>
                <Globe2 size={20} className="kpi-icon cyan" />
              </div>
              <div className="kpi-number">{GLOBAL_SAAS_KPIS.totalCountries}</div>
              <div className="kpi-sub">
                🇮🇳 India &bull; 🇰🇭 Cambodia &bull; 🇧🇩 Bangladesh &bull; 🇳🇵 Nepal &bull; +8
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Global Users</span>
                <Users size={20} className="kpi-icon indigo" />
              </div>
              <div className="kpi-number">{GLOBAL_SAAS_KPIS.totalUsers.toLocaleString()}</div>
              <div className="kpi-sub">
                <strong className="text-green">{GLOBAL_SAAS_KPIS.activeUsers.toLocaleString()}</strong> Active This Month
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Global Catalog Products</span>
                <Sparkles size={20} className="kpi-icon purple" />
              </div>
              <div className="kpi-number">{GLOBAL_SAAS_KPIS.totalProducts.toLocaleString()}</div>
              <div className="kpi-sub">Pharma SKUs across all tenants</div>
            </div>
          </div>

          {/* KPI Row 2: Roles Hierarchy Distribution across Tenants */}
          <div className="section-title-sm">
            <span>Global Role Distribution Across All Companies</span>
          </div>

          <div className="roles-kpi-grid">
            <div className="role-summary-card">
              <div className="role-card-header">
                <UserCog size={18} color="#2563eb" />
                <span className="role-title">Company Admins</span>
              </div>
              <div className="role-count">{GLOBAL_SAAS_KPIS.totalCompanyAdmins}</div>
              <div className="role-desc">Assigned administrative managers for tenants</div>
            </div>

            <div className="role-summary-card">
              <div className="role-card-header">
                <ShieldCheck size={18} color="#7c3aed" />
                <span className="role-title">General Managers (GMs)</span>
              </div>
              <div className="role-count">{GLOBAL_SAAS_KPIS.totalGMs}</div>
              <div className="role-desc">Country / Regional enterprise directors</div>
            </div>

            <div className="role-summary-card">
              <div className="role-card-header">
                <Users size={18} color="#0d9488" />
                <span className="role-title">Sales Managers</span>
              </div>
              <div className="role-count">{GLOBAL_SAAS_KPIS.totalManagers.toLocaleString()}</div>
              <div className="role-desc">Area and regional territory managers</div>
            </div>

            <div className="role-summary-card">
              <div className="role-card-header">
                <Smartphone size={18} color="#059669" />
                <span className="role-title">Field Reps (MRs)</span>
              </div>
              <div className="role-count">{GLOBAL_SAAS_KPIS.totalMRs.toLocaleString()}</div>
              <div className="role-desc">Mobile app field sales representatives</div>
            </div>
          </div>

          {/* KPI Row 3: Subscriptions & System Alerts */}
          <div className="overview-split-row">
            <div className="sub-health-card">
              <h3 className="card-header-title">
                <CreditCard size={18} /> Subscriptions &amp; Financial Velocity
              </h3>
              <div className="sub-stats-inner">
                <div className="sub-stat-item">
                  <span className="sub-stat-lbl">Active Subscriptions</span>
                  <span className="sub-stat-val text-green">{GLOBAL_SAAS_KPIS.activeSubscriptions}</span>
                </div>
                <div className="sub-stat-item">
                  <span className="sub-stat-lbl">Expiring &le; 30 Days</span>
                  <span className="sub-stat-val text-amber">{GLOBAL_SAAS_KPIS.expiringSubscriptions}</span>
                </div>
                <div className="sub-stat-item">
                  <span className="sub-stat-lbl">MRR</span>
                  <span className="sub-stat-val text-blue">${GLOBAL_SAAS_KPIS.mrr.toLocaleString()}</span>
                </div>
                <div className="sub-stat-item">
                  <span className="sub-stat-lbl">ARR</span>
                  <span className="sub-stat-val text-purple">${GLOBAL_SAAS_KPIS.arr.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="alerts-summary-card">
              <div className="card-header-flex">
                <h3 className="card-header-title">
                  <AlertTriangle size={18} color="#ef4444" /> System Alerts (18 Active)
                </h3>
                <button
                  type="button"
                  className="link-btn-xs"
                  onClick={() => setCurrentTab('saas-system-health')}
                >
                  View All &rarr;
                </button>
              </div>
              <div className="alerts-mini-list">
                <div className="alert-mini-item critical">
                  <span className="alert-badge-red">CRITICAL</span>
                  <span>Mapbox Geocoding latency degraded in South Asia zone</span>
                </div>
                <div className="alert-mini-item warning">
                  <span className="alert-badge-amber">EXPIRING</span>
                  <span>ABC Pharma Cambodia enterprise license renewal in 12 days</span>
                </div>
                <div className="alert-mini-item info">
                  <span className="alert-badge-blue">SECURITY</span>
                  <span>Automated tenant backup completed for 42 companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: COMPANY MANAGEMENT (MOST IMPORTANT MODULE)
          ===================================================================== */}
      {currentTab === 'saas-companies' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div className="search-box-large">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search companies by name, code, country, or admin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
            <button
              type="button"
              className="primary-action-btn"
              onClick={() => setIsCreateCompanyOpen(true)}
            >
              <Plus size={16} />
              <span>Create New Company</span>
            </button>
          </div>

          {/* Companies Table */}
          <div className="saas-table-container">
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Company Name &amp; Code</th>
                  <th>Country &amp; Jurisdiction</th>
                  <th>Assigned Company Admin</th>
                  <th>Subscription Plan</th>
                  <th>Status</th>
                  <th>Tenancy</th>
                  <th>Users (MRs / GMs)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies
                  .filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.adminName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((company) => (
                    <tr key={company.id}>
                      <td>
                        <div className="comp-name-group">
                          <span className="comp-flag">{company.flag}</span>
                          <div>
                            <div className="comp-name-text">{company.name}</div>
                            <div className="comp-code-sub">{company.code} &bull; {company.fiscalYear}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="country-tag">
                          <span>{company.country}</span>
                          <span className="tz-note">{company.currency} &bull; {company.timezone.split('/')[1] || company.timezone}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-profile-cell">
                          <div className="admin-avatar">{company.adminName.charAt(0)}</div>
                          <div>
                            <div className="admin-name">{company.adminName}</div>
                            <div className="admin-email">{company.adminEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`plan-pill plan-${company.plan.toLowerCase()}`}>
                          {company.plan}
                        </span>
                      </td>
                      <td>
                        <span className={`status-tag status-${company.status.toLowerCase()}`}>
                          {company.status === 'ACTIVE' ? '🟢 Active' : company.status === 'TRIAL' ? '🟣 30-Day Trial' : '🟡 Suspended'}
                        </span>
                      </td>
                      <td>
                        <span className="tenant-id-pill">{company.tenantId}</span>
                      </td>
                      <td>
                        <div className="users-breakdown-cell">
                          <strong>{company.usersCount} Total</strong>
                          <span>{company.mrsCount} MRs &bull; {company.managersCount} MGRs &bull; {company.gmsCount} GMs</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => toggleCompanyStatus(company.id)}
                          >
                            {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn primary"
                            onClick={() => {
                              setCurrentTab('saas-features');
                            }}
                          >
                            Modules
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: COUNTRY MANAGEMENT
          ===================================================================== */}
      {currentTab === 'saas-countries' && (
        <div className="tab-pane-content">
          <div className="country-header-banner">
            <div>
              <h2 className="section-title">Supported Sovereign Jurisdictions</h2>
              <p className="section-desc">
                Super Admin configures currency, fiscal years, tax withholding, and statutory social security (e.g. NSSF in Cambodia, EPFO/GST in India, WPPF in Bangladesh).
              </p>
            </div>
            <button
              type="button"
              className="primary-action-btn"
              onClick={() => alert('Add Country Wizard: Enables setting up statutory fiscal year, tax withholding rates, and social security formulas.')}
            >
              <Plus size={16} />
              <span>Add Supported Country</span>
            </button>
          </div>

          <div className="countries-grid">
            {countries.map((c) => (
              <div key={c.code} className="country-card">
                <div className="country-card-header">
                  <div className="country-title-row">
                    <span className="country-big-flag">{c.flag}</span>
                    <div>
                      <h3 className="country-name">{c.name} ({c.code})</h3>
                      <span className="country-active-tag">{c.activeCompanies} Companies Onboarded</span>
                    </div>
                  </div>
                  <span className="status-badge-green">Operational</span>
                </div>

                <div className="country-details-list">
                  <div className="detail-item">
                    <span className="detail-key">Currency &amp; Symbol:</span>
                    <span className="detail-val">{c.currency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Timezone:</span>
                    <span className="detail-val">{c.timezone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Fiscal Year:</span>
                    <span className="detail-val">{c.fiscalYear}</span>
                  </div>
                  <div className="detail-item highlight-tax">
                    <span className="detail-key">Tax / Withholding:</span>
                    <span className="detail-val">{c.taxConfig}</span>
                  </div>
                  <div className="detail-item highlight-nssf">
                    <span className="detail-key">Social Security / Statutory:</span>
                    <span className="detail-val">{c.socialSecurity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Public Holiday Calendar:</span>
                    <span className="detail-val">{c.holidaysCount} Declared Holidays</span>
                  </div>
                </div>

                <div className="country-card-footer">
                  <button
                    type="button"
                    className="btn-configure-country"
                    onClick={() => alert(`Configuring compliance rules for ${c.name}`)}
                  >
                    <Settings size={14} />
                    <span>Configure Statutory Rules</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: COMPANY ADMIN MANAGEMENT
          ===================================================================== */}
      {currentTab === 'saas-admins' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Company Administrators (Tenant Owners)</h2>
              <p className="section-desc">
                Super Admin creates and monitors Company Admins. Each admin controls their own organization independently.
              </p>
            </div>
            <button
              type="button"
              className="primary-action-btn"
              onClick={() => alert('Company Admin Provisioning: Assigns a user as the root administrator for an enterprise tenant.')}
            >
              <Plus size={16} />
              <span>Create Company Admin</span>
            </button>
          </div>

          <div className="saas-table-container">
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Administrator Profile</th>
                  <th>Assigned Company</th>
                  <th>Country</th>
                  <th>MFA Status</th>
                  <th>Status</th>
                  <th>Last Session</th>
                  <th style={{ textAlign: 'right' }}>Security Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm) => (
                  <tr key={adm.id}>
                    <td>
                      <div className="admin-profile-cell">
                        <div className="admin-avatar">{adm.name.charAt(0)}</div>
                        <div>
                          <div className="admin-name">{adm.name}</div>
                          <div className="admin-email">{adm.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="company-tag-bold">{adm.company}</span>
                    </td>
                    <td>{adm.country}</td>
                    <td>
                      {adm.mfaEnabled ? (
                        <span className="mfa-badge enabled"><Lock size={12} /> 2FA Active</span>
                      ) : (
                        <span className="mfa-badge disabled"><AlertTriangle size={12} /> Not Enforced</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-tag status-${adm.status.toLowerCase()}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td>
                      <div className="session-info">
                        <div>{adm.lastLogin}</div>
                        <span className="ip-note">IP: {adm.ipAddress}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cluster">
                        <button
                          type="button"
                          className="action-pill-btn"
                          onClick={() => alert(`Password reset instructions sent to ${adm.email}`)}
                        >
                          Reset Pwd
                        </button>
                        <button
                          type="button"
                          className="action-pill-btn red"
                          onClick={() => alert(`Forced session termination executed for ${adm.name}`)}
                        >
                          Force Logout
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: SUBSCRIPTION & BILLING MANAGEMENT
          ===================================================================== */}
      {currentTab === 'saas-subscriptions' && (
        <div className="tab-pane-content">
          <div className="subscription-plans-grid">
            <div className="plan-card">
              <div className="plan-tier-name">BASIC TIER</div>
              <div className="plan-price">$950 <span>/ month</span></div>
              <p className="plan-limits-desc">For small pharma distribution businesses</p>
              <ul className="plan-perks-list">
                <li>Up to 250 Field MRs</li>
                <li>Core MR Reporting &amp; DCR</li>
                <li>Chemist Order Booking (POB)</li>
                <li>50 GB Storage Limit</li>
                <li>Single Country Deployment</li>
              </ul>
              <div className="plan-sub-count">8 Companies Enrolled</div>
            </div>

            <div className="plan-card featured-plan">
              <div className="featured-ribbon">POPULAR</div>
              <div className="plan-tier-name">PRO ENTERPRISE</div>
              <div className="plan-price">$2,800 <span>/ month</span></div>
              <p className="plan-limits-desc">For regional pharmaceutical manufacturers</p>
              <ul className="plan-perks-list">
                <li>Up to 1,500 Field Reps</li>
                <li>Full DCR + Tour Plans (MTP)</li>
                <li>TA / DA Smart Expense Claims</li>
                <li>Statutory Payroll &amp; NSSF</li>
                <li>250 GB Storage Limit</li>
              </ul>
              <div className="plan-sub-count">24 Companies Enrolled</div>
            </div>

            <div className="plan-card">
              <div className="plan-tier-name">GLOBAL PLATINUM</div>
              <div className="plan-price">$5,500 <span>/ month</span></div>
              <p className="plan-limits-desc">For multinational pharmaceutical conglomerates</p>
              <ul className="plan-perks-list">
                <li>Unlimited Field Reps &amp; GMs</li>
                <li>Multi-Country Schema Isolation</li>
                <li>AI Studio &amp; Route Optimization</li>
                <li>Automated OCR Prescription Reader</li>
                <li>1 TB Dedicated Geo-Vault</li>
              </ul>
              <div className="plan-sub-count">10 Companies Enrolled</div>
            </div>
          </div>

          <div className="section-title-sm" style={{ marginTop: '28px' }}>
            <span>Recent Enterprise Subscription Invoices &amp; Renewals</span>
          </div>

          <div className="saas-table-container">
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Company Tenant</th>
                  <th>Billing Tier</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Cycle End Date</th>
                  <th style={{ textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>INV-2026-0941</code></td>
                  <td><strong>Alleviare Life Sciences India</strong></td>
                  <td>Enterprise Platinum</td>
                  <td><strong>$4,200.00</strong></td>
                  <td><span className="status-badge-green">PAID</span></td>
                  <td>2027-04-01</td>
                  <td style={{ textAlign: 'right' }}><button className="action-pill-btn">Download PDF</button></td>
                </tr>
                <tr>
                  <td><code>INV-2026-0942</code></td>
                  <td><strong>ABC Pharma Cambodia</strong></td>
                  <td>Enterprise Platinum</td>
                  <td><strong>$3,400.00</strong></td>
                  <td><span className="status-badge-green">PAID</span></td>
                  <td>2027-09-30</td>
                  <td style={{ textAlign: 'right' }}><button className="action-pill-btn">Download PDF</button></td>
                </tr>
                <tr>
                  <td><code>INV-2026-0943</code></td>
                  <td><strong>Square BioPharma Bangladesh</strong></td>
                  <td>Pro Enterprise</td>
                  <td><strong>$2,800.00</strong></td>
                  <td><span className="status-badge-green">PAID</span></td>
                  <td>2026-12-15</td>
                  <td style={{ textAlign: 'right' }}><button className="action-pill-btn">Download PDF</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: FEATURE / MODULE MANAGEMENT (PER-COMPANY TOGGLES)
          ===================================================================== */}
      {currentTab === 'saas-features' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Per-Company Feature &amp; Module Matrix</h2>
              <p className="section-desc">
                Enable or disable specific modules per tenant. For example, Cambodia has NSSF enabled, while AI Analytics is only enabled for enterprise tier companies.
              </p>
            </div>
            <button
              type="button"
              className="action-pill-btn"
              onClick={() => alert('Syncing module licenses across all active tenant schemas')}
            >
              <RefreshCw size={14} />
              <span>Sync Module Licensings</span>
            </button>
          </div>

          <div className="saas-table-container">
            <table className="saas-data-table matrix-table">
              <thead>
                <tr>
                  <th>Company Tenant</th>
                  <th>MR Reporting</th>
                  <th>Doctors &amp; Chemist</th>
                  <th>Sales &amp; Orders</th>
                  <th>Payroll Engine</th>
                  <th>NSSF (Cambodia)</th>
                  <th>HRMS Suite</th>
                  <th>AI Studio (OCR/TSP)</th>
                  <th>Advanced Analytics</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="comp-name-group">
                        <span>{c.flag}</span>
                        <div>
                          <strong>{c.name}</strong>
                          <div className="comp-code-sub">{c.plan} &bull; {c.tenantId}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.mrReporting ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'mrReporting')}
                      >
                        {c.modules.mrReporting ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.doctorManagement ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'doctorManagement')}
                      >
                        {c.modules.doctorManagement ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.sales ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'sales')}
                      >
                        {c.modules.sales ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.payroll ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'payroll')}
                      >
                        {c.modules.payroll ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.nssf ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'nssf')}
                      >
                        {c.modules.nssf ? (
                          <span className="nssf-active-pill">NSSF Active</span>
                        ) : (
                          <span className="nssf-inactive-pill">Disabled</span>
                        )}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.hrms ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'hrms')}
                      >
                        {c.modules.hrms ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.aiAnalytics ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'aiAnalytics')}
                      >
                        {c.modules.aiAnalytics ? (
                          <span className="ai-active-pill">AI Enabled</span>
                        ) : (
                          <span className="ai-inactive-pill">Locked</span>
                        )}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`toggle-icon-btn ${c.modules.advancedReports ? 'on' : 'off'}`}
                        onClick={() => handleToggleModule(c.id, 'advancedReports')}
                      >
                        {c.modules.advancedReports ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#94a3b8" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 7: TENANT ISOLATION MANAGEMENT
          ===================================================================== */}
      {currentTab === 'saas-tenants' && (
        <div className="tab-pane-content">
          <div className="country-header-banner">
            <div>
              <h2 className="section-title">Multi-Tenant Database &amp; Storage Isolation</h2>
              <p className="section-desc">
                Strict logical &amp; schema isolation guarantees that no company can ever inspect or cross-contaminate another enterprise’s doctors, MRs, or sales.
              </p>
            </div>
            <button
              type="button"
              className="primary-action-btn"
              onClick={() => alert('Triggering automated backup across all tenant schemas to Azure Vault')}
            >
              <HardDrive size={16} />
              <span>Trigger Global Backup</span>
            </button>
          </div>

          <div className="tenants-grid">
            {tenants.map((t) => (
              <div key={t.id} className="tenant-card">
                <div className="tenant-top-row">
                  <div>
                    <span className="tenant-code-badge">{t.id}</span>
                    <h3 className="tenant-comp-name">{t.company}</h3>
                  </div>
                  <span className={`tenant-status-dot ${t.status.toLowerCase()}`}>
                    {t.status === 'ONLINE' ? '🟢 Online' : '🟡 Standby'}
                  </span>
                </div>

                <div className="tenant-schema-box">
                  <Database size={14} color="#64748b" />
                  <code>{t.schema}</code>
                </div>

                <div className="tenant-specs">
                  <div className="spec-row">
                    <span>Country:</span>
                    <strong>{t.country}</strong>
                  </div>
                  <div className="spec-row">
                    <span>Storage Quota:</span>
                    <strong>{t.storage}</strong>
                  </div>
                  <div className="spec-row">
                    <span>Database Health:</span>
                    <strong className="text-green">{t.dbHealth}</strong>
                  </div>
                  <div className="spec-row">
                    <span>Last Snapshot:</span>
                    <span>{t.lastBackup}</span>
                  </div>
                </div>

                <div className="tenant-actions-row">
                  <button
                    type="button"
                    className="action-pill-btn"
                    onClick={() => alert(`Initiating schema integrity verification for ${t.id}`)}
                  >
                    Verify Schema
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn primary"
                    onClick={() => alert(`Generating isolated encrypted export of ${t.schema}`)}
                  >
                    Export Snapshot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 8: SYSTEM HEALTH, SECURITY & GLOBAL AUDIT LOGS
          ===================================================================== */}
      {currentTab === 'saas-system-health' && (
        <div className="tab-pane-content">
          <div className="section-title-sm">
            <span>Core Infrastructure &amp; Microservices Telemetry</span>
          </div>

          <div className="health-services-grid">
            {SYSTEM_HEALTH_METRICS.map((s, idx) => (
              <div key={idx} className="service-health-card">
                <div className="service-top">
                  <div className="service-name">{s.service}</div>
                  <span className={`service-status-pill ${s.status.toLowerCase()}`}>
                    {s.status === 'HEALTHY' ? '🟢 Healthy' : '🟡 Degraded'}
                  </span>
                </div>
                <div className="service-metrics-row">
                  <span>Latency: <strong>{s.latency}</strong></span>
                  <span>Uptime: <strong>{s.uptime}</strong></span>
                </div>
                {s.note && <div className="service-note-text">{s.note}</div>}
              </div>
            ))}
          </div>

          {/* Platform Security & Global Audit Trail */}
          <div className="section-title-sm" style={{ marginTop: '28px' }}>
            <span>Platform Governance Audit Trail</span>
          </div>

          <div className="saas-table-container">
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Target Tenant / Entity</th>
                  <th>Performed By</th>
                  <th>IP Address</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>18 Sep 2026, 09:20 AM</td>
                  <td><strong>Company Created</strong></td>
                  <td>ABC Pharma Cambodia (TENANT-002)</td>
                  <td>Super Admin (Global HQ)</td>
                  <td>103.21.144.1</td>
                  <td><span className="status-badge-green">SUCCESS</span></td>
                </tr>
                <tr>
                  <td>18 Sep 2026, 08:45 AM</td>
                  <td><strong>Module Enabled (NSSF)</strong></td>
                  <td>ABC Pharma Cambodia</td>
                  <td>Super Admin (Global HQ)</td>
                  <td>103.21.144.1</td>
                  <td><span className="status-badge-green">SUCCESS</span></td>
                </tr>
                <tr>
                  <td>17 Sep 2026, 04:15 PM</td>
                  <td><strong>Subscription Tier Updated</strong></td>
                  <td>Alleviare Life Sciences India</td>
                  <td>Super Admin (Global HQ)</td>
                  <td>103.21.144.1</td>
                  <td><span className="status-badge-green">SUCCESS</span></td>
                </tr>
                <tr>
                  <td>17 Sep 2026, 11:30 AM</td>
                  <td><strong>Company Admin Provisioned</strong></td>
                  <td>Square BioPharma (Tanvir Ahmed)</td>
                  <td>Super Admin (Global HQ)</td>
                  <td>103.21.144.1</td>
                  <td><span className="status-badge-green">SUCCESS</span></td>
                </tr>
                <tr>
                  <td>16 Sep 2026, 06:10 PM</td>
                  <td><strong>Tenant Schema Backup</strong></td>
                  <td>Global Mesh (42 Tenants)</td>
                  <td>System Daemon Cron</td>
                  <td>127.0.0.1</td>
                  <td><span className="status-badge-green">SUCCESS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          CREATE COMPANY MODAL
          ===================================================================== */}
      {isCreateCompanyOpen && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={24} color="#2563eb" />
                <div>
                  <h3>Create New Pharmaceutical Enterprise Company</h3>
                  <p>Provisions a dedicated isolated tenant, currency, and initial company administrator.</p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsCreateCompanyOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Pharma Cambodia Ltd"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Company Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RYL-KH"
                    value={newCompany.code}
                    onChange={(e) => setNewCompany({ ...newCompany, code: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Country Jurisdiction</label>
                  <select
                    value={newCompany.country}
                    onChange={(e) => {
                      const country = e.target.value;
                      let curr = 'USD';
                      let tz = 'Asia/Phnom_Penh';
                      if (country === 'India') { curr = 'INR'; tz = 'Asia/Kolkata'; }
                      if (country === 'Bangladesh') { curr = 'BDT'; tz = 'Asia/Dhaka'; }
                      if (country === 'Nepal') { curr = 'NPR'; tz = 'Asia/Kathmandu'; }
                      if (country === 'Thailand') { curr = 'THB'; tz = 'Asia/Bangkok'; }
                      if (country === 'Vietnam') { curr = 'VND'; tz = 'Asia/Ho_Chi_Minh'; }
                      setNewCompany({ ...newCompany, country, currency: curr, timezone: tz });
                    }}
                    className="form-control"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="Cambodia">🇰🇭 Cambodia</option>
                    <option value="Bangladesh">🇧🇩 Bangladesh</option>
                    <option value="Nepal">🇳🇵 Nepal</option>
                    <option value="Thailand">🇹🇭 Thailand</option>
                    <option value="Vietnam">🇻🇳 Vietnam</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Default Currency</label>
                  <input
                    type="text"
                    value={newCompany.currency}
                    onChange={(e) => setNewCompany({ ...newCompany, currency: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Timezone</label>
                  <input
                    type="text"
                    value={newCompany.timezone}
                    onChange={(e) => setNewCompany({ ...newCompany, timezone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Initial Company Admin Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sothea Meas"
                    value={newCompany.adminName}
                    onChange={(e) => setNewCompany({ ...newCompany, adminName: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Initial Company Admin Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@royalpharma.com.kh"
                    value={newCompany.adminEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, adminEmail: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Subscription Tier</label>
                  <select
                    value={newCompany.plan}
                    onChange={(e) => setNewCompany({ ...newCompany, plan: e.target.value })}
                    className="form-control"
                  >
                    <option value="BASIC">Basic ($950/mo)</option>
                    <option value="PRO">Pro Enterprise ($2,800/mo)</option>
                    <option value="ENTERPRISE">Global Platinum ($5,500/mo)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fiscal Year Cycle</label>
                  <select
                    value={newCompany.fiscalYear}
                    onChange={(e) => setNewCompany({ ...newCompany, fiscalYear: e.target.value })}
                    className="form-control"
                  >
                    <option value="Jan - Dec">January - December</option>
                    <option value="Apr - Mar">April - March</option>
                    <option value="Jul - Jun">July - June</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsCreateCompanyOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-create-btn"
                >
                  <CheckCircle2 size={16} />
                  <span>Provision Isolated Tenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
