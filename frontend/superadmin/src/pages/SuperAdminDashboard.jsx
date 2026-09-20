import React, { useState, useEffect } from 'react';
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
  Percent,
  CheckCircle,
  Inbox,
  Radio,
  BarChart3,
  LifeBuoy,
  Megaphone,
  AlertOctagon,
  Eye,
  Sliders,
  ShieldAlert,
  Download,
  Trash2,
  RotateCcw,
  UserX,
  UserCheck2,
  Send,
  SlidersHorizontal,
  Flame,
  Check,
  X,
  Coins,
  ArrowRightLeft,
  Compass,
  Timer,
  Edit,
  Save,
  CheckSquare
} from 'lucide-react';

import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  toggleTenantStatus,
  resetTenantAdminPassword,
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
  toggleUserStatus,
  resetUserPassword,
  getSovereignCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAuditLogs,
  createAuditLog,
  getSystemAlerts,
  createSystemAlert,
  deleteSystemAlert
} from '../services/api';

// Sovereign country registry templates with statutory compliance, timezones, and currencies
const DEFAULT_SOVEREIGN_REGISTRY = [
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    currencyCode: 'VND',
    currencySymbol: '₫',
    currencyName: 'Vietnamese Dong',
    fxRateToUSD: 25400.0,
    timezone: 'Asia/Ho_Chi_Minh',
    utcOffset: 'UTC+07:00',
    language: 'Vietnamese (Tiếng Việt), English',
    fiscalYear: 'January - December',
    taxScheme: 'Progressive PIT (5%-35%) + 10% VAT',
    socialSecurity: 'Social Health + Unemployment + Social Insurance (32%)',
    publicHolidays: 11,
    status: 'ACTIVE'
  },
  {
    code: 'KH',
    name: 'Cambodia',
    flag: '🇰🇭',
    currencyCode: 'USD / KHR',
    currencySymbol: '$ / ៛',
    currencyName: 'US Dollar / Cambodian Riel',
    fxRateToUSD: 4100.0,
    timezone: 'Asia/Phnom_Penh',
    utcOffset: 'UTC+07:00',
    language: 'Khmer (ភាសាខ្មែរ), English',
    fiscalYear: 'January - December',
    taxScheme: 'Tax on Salary (0% - 20%) + 10% VAT',
    socialSecurity: 'NSSF (Occupational Risk + Health Care 2.6%)',
    publicHolidays: 22,
    status: 'ACTIVE'
  },
  {
    code: 'LA',
    name: 'Laos',
    flag: '🇱🇦',
    currencyCode: 'LAK',
    currencySymbol: '₭',
    currencyName: 'Lao Kip',
    fxRateToUSD: 22000.0,
    timezone: 'Asia/Vientiane',
    utcOffset: 'UTC+07:00',
    language: 'Lao (ພາສາລາວ), English',
    fiscalYear: 'January - December',
    taxScheme: 'PIT (0%-25%) + 10% VAT',
    socialSecurity: 'NSSF Laos (Social Security Organization 11%)',
    publicHolidays: 10,
    status: 'ACTIVE'
  },
  {
    code: 'TH',
    name: 'Thailand (Bangkok)',
    flag: '🇹🇭',
    currencyCode: 'THB',
    currencySymbol: '฿',
    currencyName: 'Thai Baht',
    fxRateToUSD: 36.50,
    timezone: 'Asia/Bangkok',
    utcOffset: 'UTC+07:00',
    language: 'Thai (ภาษาไทย), English',
    fiscalYear: 'January - December',
    taxScheme: 'PIT (Personal Income Tax 5%-35%) + 7% VAT',
    socialSecurity: 'Social Security Office (SSO 5% max 750 THB)',
    publicHolidays: 19,
    status: 'ACTIVE'
  },
  {
    code: 'MM',
    name: 'Myanmar',
    flag: '🇲🇲',
    currencyCode: 'MMK',
    currencySymbol: 'Ks',
    currencyName: 'Myanmar Kyat',
    fxRateToUSD: 2100.0,
    timezone: 'Asia/Yangon',
    utcOffset: 'UTC+06:30',
    language: 'Burmese (မြန်မာစာ), English',
    fiscalYear: 'October - September',
    taxScheme: 'PIT (0%-25%) + 5% Commercial Tax',
    socialSecurity: 'Social Security Board (SSB 5%)',
    publicHolidays: 26,
    status: 'ACTIVE'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    currencyCode: 'MYR',
    currencySymbol: 'RM',
    currencyName: 'Malaysian Ringgit',
    fxRateToUSD: 4.70,
    timezone: 'Asia/Kuala_Lumpur',
    utcOffset: 'UTC+08:00',
    language: 'Malay (Bahasa Melayu), English',
    fiscalYear: 'January - December',
    taxScheme: 'PCB Withholding (0%-30%) + SST (8%)',
    socialSecurity: 'EPF (11%) + SOCSO (0.5%) + EIS',
    publicHolidays: 15,
    status: 'ACTIVE'
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    currencyName: 'Singapore Dollar',
    fxRateToUSD: 1.34,
    timezone: 'Asia/Singapore',
    utcOffset: 'UTC+08:00',
    language: 'English, Mandarin, Malay, Tamil',
    fiscalYear: 'January - December',
    taxScheme: 'Progressive PIT (0%-24%) + 9% GST',
    socialSecurity: 'Central Provident Fund (CPF 20%)',
    publicHolidays: 11,
    status: 'ACTIVE'
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    currencyCode: 'IDR',
    currencySymbol: 'Rp',
    currencyName: 'Indonesian Rupiah',
    fxRateToUSD: 15850.0,
    timezone: 'Asia/Jakarta',
    utcOffset: 'UTC+07:00',
    language: 'Indonesian (Bahasa Indonesia), English',
    fiscalYear: 'January - December',
    taxScheme: 'PPh 21 (5%-35%) + 11% PPN (VAT)',
    socialSecurity: 'BPJS Ketenagakerjaan + BPJS Kesehatan (10.24%)',
    publicHolidays: 16,
    status: 'ACTIVE'
  },
  {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    currencyCode: 'PHP',
    currencySymbol: '₱',
    currencyName: 'Philippine Peso',
    fxRateToUSD: 57.20,
    timezone: 'Asia/Manila',
    utcOffset: 'UTC+08:00',
    language: 'Filipino (Tagalog), English',
    fiscalYear: 'January - December',
    taxScheme: 'TRAIN Law PIT (0%-35%) + 12% VAT',
    socialSecurity: 'SSS + PhilHealth + Pag-IBIG HDMF (14%)',
    publicHolidays: 18,
    status: 'ACTIVE'
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    currencyName: 'Indian Rupee',
    fxRateToUSD: 83.50,
    timezone: 'Asia/Kolkata',
    utcOffset: 'UTC+05:30',
    language: 'Hindi, English + 22 Scheduled Regional Languages',
    fiscalYear: 'April - March',
    taxScheme: 'New/Old Tax Regime (0%-30%) + 18% GST',
    socialSecurity: 'EPFO (12%) + ESIC (0.75%) + Gratuity + PT',
    publicHolidays: 24,
    status: 'ACTIVE'
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    flag: '🇧🇩',
    currencyCode: 'BDT',
    currencySymbol: '৳',
    currencyName: 'Bangladeshi Taka',
    fxRateToUSD: 117.50,
    timezone: 'Asia/Dhaka',
    utcOffset: 'UTC+06:00',
    language: 'Bengali (বাংলা), English',
    fiscalYear: 'July - June',
    taxScheme: 'Progressive PIT (0%-25%) + 15% VAT',
    socialSecurity: 'Workers Welfare Fund + Provident Fund (7%-8.33%)',
    publicHolidays: 22,
    status: 'ACTIVE'
  },
  {
    code: 'NP',
    name: 'Nepal',
    flag: '🇳🇵',
    currencyCode: 'NPR',
    currencySymbol: 'रू',
    currencyName: 'Nepalese Rupee',
    fxRateToUSD: 133.60,
    timezone: 'Asia/Kathmandu',
    utcOffset: 'UTC+05:45',
    language: 'Nepali (नेपाली), English',
    fiscalYear: 'Mid July - Mid July (Shrawan - Ashadh)',
    taxScheme: 'Slab Tax (1%-36%) + 13% VAT',
    socialSecurity: 'Social Security Fund (SSF 11% + 20% Employer)',
    publicHolidays: 35,
    status: 'ACTIVE'
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    currencyCode: 'LKR',
    currencySymbol: 'Rs',
    currencyName: 'Sri Lankan Rupee',
    fxRateToUSD: 302.0,
    timezone: 'Asia/Colombo',
    utcOffset: 'UTC+05:30',
    language: 'Sinhala, Tamil, English',
    fiscalYear: 'January - December',
    taxScheme: 'APIT (6%-36%) + 18% VAT',
    socialSecurity: 'EPF (8%) + ETF (3%)',
    publicHolidays: 25,
    status: 'ACTIVE'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'د.إ',
    currencyName: 'UAE Dirham',
    fxRateToUSD: 3.67,
    timezone: 'Asia/Dubai',
    utcOffset: 'UTC+04:00',
    language: 'Arabic, English',
    fiscalYear: 'January - December',
    taxScheme: '0% Personal Income Tax + 5% VAT',
    socialSecurity: 'GPSSA (Emiratis only 5% / Expats End-of-Service Gratuity)',
    publicHolidays: 14,
    status: 'ACTIVE'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    currencySymbol: '﷼',
    currencyName: 'Saudi Riyal',
    fxRateToUSD: 3.75,
    timezone: 'Asia/Riyadh',
    utcOffset: 'UTC+03:00',
    language: 'Arabic, English',
    fiscalYear: 'January - December',
    taxScheme: '0% PIT + 15% VAT + 2.5% Zakat',
    socialSecurity: 'GOSI (9.75% Saudi / 2% Occupational Hazard Expats)',
    publicHolidays: 10,
    status: 'ACTIVE'
  },
  {
    code: 'EG',
    name: 'Egypt (Cairo)',
    flag: '🇪🇬',
    currencyCode: 'EGP',
    currencySymbol: 'E£',
    currencyName: 'Egyptian Pound',
    fxRateToUSD: 47.50,
    timezone: 'Africa/Cairo',
    utcOffset: 'UTC+02:00',
    language: 'Arabic, English',
    fiscalYear: 'July - June',
    taxScheme: 'Income Tax (0%-25%) + 14% VAT',
    socialSecurity: 'Social Insurance Law 148 (11% Employee + 18.75% Employer)',
    publicHolidays: 18,
    status: 'ACTIVE'
  },
  {
    code: 'NG',
    name: 'Nigeria (Lagos)',
    flag: '🇳🇬',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    currencyName: 'Nigerian Naira',
    fxRateToUSD: 1480.0,
    timezone: 'Africa/Lagos',
    utcOffset: 'UTC+01:00',
    language: 'English',
    fiscalYear: 'January - December',
    taxScheme: 'PAYE (7%-24%) + 7.5% VAT',
    socialSecurity: 'Pension Reform Act (8% Employee + 10% Employer) + NHF + NSITF',
    publicHolidays: 12,
    status: 'ACTIVE'
  },
  {
    code: 'KE',
    name: 'Kenya (Nairobi)',
    flag: '🇰🇪',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    currencyName: 'Kenyan Shilling',
    fxRateToUSD: 130.0,
    timezone: 'Africa/Nairobi',
    utcOffset: 'UTC+03:00',
    language: 'Swahili, English',
    fiscalYear: 'January - December',
    taxScheme: 'PAYE (10%-35%) + 16% VAT + 1.5% Housing Levy',
    socialSecurity: 'NSSF (6%) + SHIF (Social Health Insurance 2.75%)',
    publicHolidays: 11,
    status: 'ACTIVE'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currencyCode: 'ZAR',
    currencySymbol: 'R',
    currencyName: 'South African Rand',
    fxRateToUSD: 18.20,
    timezone: 'Africa/Johannesburg',
    utcOffset: 'UTC+02:00',
    language: 'English, Zulu, Xhosa, Afrikaans',
    fiscalYear: 'March - February',
    taxScheme: 'PAYE (18%-45%) + 15% VAT',
    socialSecurity: 'UIF (1%) + SDL (Skills Development 1%) + COIDA',
    publicHolidays: 12,
    status: 'ACTIVE'
  },
  {
    code: 'BR',
    name: 'Brazil (São Paulo)',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    currencyName: 'Brazilian Real',
    fxRateToUSD: 5.35,
    timezone: 'America/Sao_Paulo',
    utcOffset: 'UTC-03:00',
    language: 'Portuguese (Português)',
    fiscalYear: 'January - December',
    taxScheme: 'IRPF (7.5%-27.5%) + PIS/COFINS/ICMS',
    socialSecurity: 'INSS (7.5%-14%) + FGTS (8% Guarantee Fund)',
    publicHolidays: 12,
    status: 'ACTIVE'
  },
  {
    code: 'AU',
    name: 'Australia (Sydney)',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    currencyName: 'Australian Dollar',
    fxRateToUSD: 1.52,
    timezone: 'Australia/Sydney',
    utcOffset: 'UTC+10:00',
    language: 'English',
    fiscalYear: 'July - June',
    taxScheme: 'PAYG Withholding (0%-45%) + 10% GST',
    socialSecurity: 'Superannuation Guarantee (11.5%)',
    publicHolidays: 13,
    status: 'ACTIVE'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    currencyName: 'British Pound',
    fxRateToUSD: 0.78,
    timezone: 'Europe/London',
    utcOffset: 'UTC+00:00',
    language: 'English',
    fiscalYear: 'April - April (6 Apr - 5 Apr)',
    taxScheme: 'PAYE (20%-45%) + 20% VAT',
    socialSecurity: 'National Insurance (NI Class 1)',
    publicHolidays: 8,
    status: 'ACTIVE'
  },
  {
    code: 'DE',
    name: 'Germany / EU',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    fxRateToUSD: 0.92,
    timezone: 'Europe/Berlin',
    utcOffset: 'UTC+01:00',
    language: 'German (Deutsch), English',
    fiscalYear: 'January - December',
    taxScheme: 'Income Tax (14%-45%) + 19% VAT',
    socialSecurity: 'Statutory Social & Pension Insurances (~40% split)',
    publicHolidays: 10,
    status: 'ACTIVE'
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
    fxRateToUSD: 1.0,
    timezone: 'America/New_York',
    utcOffset: 'UTC-05:00',
    language: 'English',
    fiscalYear: 'January - December',
    taxScheme: 'Federal + State Withholding + FICA',
    socialSecurity: 'Social Security (6.2%) + Medicare (1.45%)',
    publicHolidays: 11,
    status: 'ACTIVE'
  }
];

export default function SuperAdminDashboard({
  activeTab = 'dashboard',
  setActiveTab,
  globalSearchQuery = '',
  setGlobalSearchQuery
}) {
  // --------------------------------------------------------------------------
  // DYNAMIC STATE STORES (Loaded from PostgreSQL / Supabase)
  // --------------------------------------------------------------------------
  const [companies, setCompanies] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [platformUsers, setPlatformUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sovereignRegistry, setSovereignRegistry] = useState(DEFAULT_SOVEREIGN_REGISTRY);

  // Active Multi-Currency Display Setting
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = useState('USD');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');

  // Live World Clock State
  const [currentUtcTime, setCurrentUtcTime] = useState(new Date());

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --------------------------------------------------------------------------
  // ASYNC DATA LOADER (Backend API + Supabase fallback)
  // --------------------------------------------------------------------------
  const loadAllData = async () => {
    try {
      const [tenantsRes, usersRes, countriesRes, subsRes, alertsRes, auditRes] = await Promise.allSettled([
        getTenants(),
        getPlatformUsers(),
        getSovereignCountries(),
        getSubscriptions(),
        getSystemAlerts(),
        getAuditLogs(30)
      ]);

      if (tenantsRes.status === 'fulfilled' && Array.isArray(tenantsRes.value)) {
        const mappedCompanies = tenantsRes.value.map(t => {
          const matchedCountry = sovereignRegistry.find(c => c.code === t.country_code) || DEFAULT_SOVEREIGN_REGISTRY[0];
          const planRate = t.plan === 'ENTERPRISE' ? 2000 : t.plan === 'PRO' ? 1000 : 100;
          return {
            id: t.id,
            code: t.code,
            name: t.name,
            legalName: t.legal_name || t.name,
            country: matchedCountry.name,
            countryCode: t.country_code || 'VN',
            flag: matchedCountry.flag || '🌐',
            currency: t.currency_code || 'USD',
            timezone: t.default_timezone || 'UTC',
            plan: (t.plan || 'PRO').toUpperCase(),
            status: (t.status || 'ACTIVE').toUpperCase(),
            usersCount: t.user_count || 1,
            mrsCount: t.mr_count || 0,
            adminEmail: t.contact_email,
            adminName: t.contact_email?.split('@')[0] || 'Admin',
            storageUsedGB: 1,
            storageLimitGB: t.max_storage_gb || 50,
            userLimit: t.max_mrs || 250,
            mrLimit: t.max_mrs || 200,
            mrr: `$${(t.monthly_rate || planRate).toLocaleString()}`,
            customMRR: t.monthly_rate || planRate,
            renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            modules: t.settings?.modules || {
              mrReporting: true,
              dcr: true,
              attendance: true,
              doctorManagement: true,
              chemistManagement: true,
              expense: true,
              gpsTracking: true,
              targetManagement: true,
              orderManagement: true,
              sampleManagement: false,
              analytics: true,
              aiStudio: t.plan === 'ENTERPRISE'
            }
          };
        });
        setCompanies(mappedCompanies);
      }

      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
        const mappedUsers = usersRes.value.map(u => ({
          id: u.id,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          email: u.email,
          mobile: u.phone || '--',
          phone: u.phone || '',
          company: u.company_name || u.tenants_companies?.name || 'Platform HQ',
          tenantId: u.tenant_id,
          role: u.role || 'COMPANY_ADMIN',
          status: (u.status || 'Active').toUpperCase(),
          territory: u.territory || 'Global HQ',
          countryCode: u.country_code || 'IN',
          lastLogin: u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never logged in'
        }));
        setPlatformUsers(mappedUsers);
        setAdmins(mappedUsers.filter(u => u.role.includes('ADMIN')));
      }

      if (countriesRes.status === 'fulfilled' && Array.isArray(countriesRes.value) && countriesRes.value.length > 0) {
        // Merge with existing full flags
        const merged = DEFAULT_SOVEREIGN_REGISTRY.map(dc => {
          const dbMatch = countriesRes.value.find(c => c.code === dc.code);
          return dbMatch ? { ...dc, ...dbMatch } : dc;
        });
        setSovereignRegistry(merged);
      }

      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value)) {
        const mappedInvoices = subsRes.value.map(s => ({
          id: `INV-${s.id.slice(0, 6).toUpperCase()}`,
          company: s.tenant_name || s.tenants_companies?.name || 'Pharma Tenant',
          tier: s.plan_tier || 'PRO',
          amount: `$${Number(s.amount_billed || 1000).toLocaleString()}`,
          status: s.status || 'Active',
          date: s.expiry_date || new Date().toISOString().split('T')[0]
        }));
        setInvoices(mappedInvoices);
      }

      if (alertsRes.status === 'fulfilled' && Array.isArray(alertsRes.value)) {
        setSystemAlerts(alertsRes.value);
      }

      if (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value)) {
        const mappedLogs = auditRes.value.map(a => ({
          id: `ACT-${a.id.slice(0, 5)}`,
          title: a.action,
          detail: typeof a.details === 'object' ? JSON.stringify(a.details) : (a.details || a.target_entity),
          entity: a.tenant_name || a.target_entity,
          time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: a.actor_email,
          severity: 'info'
        }));
        setRecentActivities(mappedLogs);
      }
    } catch (err) {
      console.warn('Live data sync notice:', err.message);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Currency Converter Interactive Tool State
  const [fxConverter, setFxConverter] = useState({
    amount: 1000,
    fromCurrency: 'USD',
    toCurrency: 'INR'
  });

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState([
    { id: 'FF-01', key: 'new_dcr_ui', name: 'New Dynamic DCR Experience v2', rolloutPercent: 0, status: 'CANARY', description: 'Interactive doctor visualizer and smart route map during daily call reporting' },
    { id: 'FF-02', key: 'ai_prescription_ocr', name: 'AI Chemist Prescription OCR', rolloutPercent: 0, status: 'BETA', description: 'Automatic optical character recognition of chemist order booking slips' },
    { id: 'FF-03', key: 'gps_high_precision_tracker', name: 'High-Precision Battery-Optimized GPS Engine', rolloutPercent: 0, status: 'TESTING', description: 'Sub-meter accuracy tracking with intelligent cellular battery optimization' }
  ]);

  // Sub-tab selectors
  const [companySubTab, setCompanySubTab] = useState('all'); // all | active | suspended | trial | admins
  const [userSubTab, setUserSubTab] = useState('all'); // all | admins | managers | mrs
  const [supportSubTab, setSupportSubTab] = useState('open'); // open | resolved
  const [jurisdictionSubTab, setJurisdictionSubTab] = useState('countries'); // countries | timezones | currencies

  // --------------------------------------------------------------------------
  // MODALS STATE (TENANTS, USERS, COUNTRIES, SUBSCRIPTIONS, PASSWORDS)
  // --------------------------------------------------------------------------
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isDeleteCompanyOpen, setIsDeleteCompanyOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState(null);

  const [isResetAdminPasswordOpen, setIsResetAdminPasswordOpen] = useState(false);
  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isResetUserPasswordOpen, setIsResetUserPasswordOpen] = useState(false);
  const [resetUserPasswordTarget, setResetUserPasswordTarget] = useState(null);
  const [newUserPasswordInput, setNewUserPasswordInput] = useState('');

  const [isCreateCountryOpen, setIsCreateCountryOpen] = useState(false);
  const [isEditCountryOpen, setIsEditCountryOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subModalTarget, setSubModalTarget] = useState(null);

  const [isImpersonateOpen, setIsImpersonateOpen] = useState(false);
  const [impersonateTarget, setImpersonateTarget] = useState(null);
  const [impersonateReason, setImpersonateReason] = useState('');
  const [activeImpersonation, setActiveImpersonation] = useState(null);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // Form states
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    legalName: '',
    code: '',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    plan: 'PRO',
    userLimit: 250,
    mrLimit: 200,
    storageLimitGB: 50,
    billingCycle: 'Monthly',
    monthlyRate: 1000
  });

  const [editCompanyForm, setEditCompanyForm] = useState({
    name: '',
    legalName: '',
    plan: 'PRO',
    userLimit: 250,
    mrLimit: 200,
    storageLimitGB: 50,
    contactEmail: '',
    contactPhone: '',
    billingCycle: 'Monthly',
    monthlyRate: 1000,
    status: 'ACTIVE'
  });

  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'MEDICAL_REP',
    tenantId: '',
    phone: '',
    territory: 'Regional Area 1',
    countryCode: 'IN'
  });

  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'MEDICAL_REP',
    tenantId: '',
    phone: '',
    territory: '',
    status: 'Active'
  });

  const [newCountryForm, setNewCountryForm] = useState({
    code: '',
    name: '',
    currencyCode: '',
    currencySymbol: '',
    primaryTimezone: 'UTC',
    taxScheme: 'Standard VAT / PIT',
    socialSecurity: 'Statutory Scheme',
    fiscalYear: 'January - December'
  });

  const [editCountryForm, setEditCountryForm] = useState({
    name: '',
    currencyCode: '',
    currencySymbol: '',
    primaryTimezone: '',
    taxScheme: '',
    socialSecurity: '',
    fiscalYear: ''
  });

  const [subModalForm, setSubModalForm] = useState({
    planTier: 'PRO',
    amountBilled: 1000,
    billingInterval: 'Monthly',
    expiryDate: ''
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    type: 'MAINTENANCE',
    target: 'ALL',
    content: ''
  });

  const [newTicket, setNewTicket] = useState({
    companyName: '',
    category: 'TECHNICAL',
    priority: 'HIGH',
    subject: '',
    description: ''
  });

  // --------------------------------------------------------------------------
  // DYNAMIC COMPUTED METRICS
  // --------------------------------------------------------------------------
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;
  const trialCompanies = companies.filter(c => c.status === 'TRIAL').length;
  const suspendedCompanies = companies.filter(c => c.status === 'SUSPENDED').length;

  const totalUsers = platformUsers.length || companies.reduce((acc, c) => acc + (Number(c.usersCount) || 0), 0);
  const activeUsers = platformUsers.filter(u => u.status === 'ACTIVE').length || activeCompanies;
  const totalMRs = platformUsers.filter(u => u.role === 'MEDICAL_REP' || u.role === 'MR').length || companies.reduce((acc, c) => acc + (Number(c.mrsCount) || 0), 0);
  const totalAdmins = platformUsers.filter(u => u.role.includes('ADMIN')).length || admins.length;
  const totalStorageGB = companies.reduce((acc, c) => acc + (Number(c.storageUsedGB) || 0), 0);
  const totalStorageTB = (totalStorageGB / 1024).toFixed(2);

  const totalMRR_USD = companies.reduce((acc, c) => {
    if (c.status !== 'ACTIVE') return acc;
    const planRate = c.plan === 'ENTERPRISE' ? 2000 : c.plan === 'PRO' ? 1000 : 100;
    return acc + (Number(c.customMRR) || planRate);
  }, 0);
  const totalARR_USD = totalMRR_USD * 12;

  // Helper for displaying time in IANA timezone
  const formatTimezoneClock = (ianaTz) => {
    try {
      return currentUtcTime.toLocaleTimeString('en-US', {
        timeZone: ianaTz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return currentUtcTime.toLocaleTimeString();
    }
  };

  const formatTimezoneDate = (ianaTz) => {
    try {
      return currentUtcTime.toLocaleDateString('en-US', {
        timeZone: ianaTz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return currentUtcTime.toLocaleDateString();
    }
  };

  // --------------------------------------------------------------------------
  // AUDIT LOGGING HELPER
  // --------------------------------------------------------------------------
  const logAudit = async (action, detail, entity = 'Platform') => {
    const act = {
      id: `ACT-${Date.now().toString().slice(-5)}`,
      title: action,
      detail: detail,
      entity: entity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Akshyatraj Pati (Master Super Admin)',
      severity: 'info'
    };
    setRecentActivities(prev => [act, ...prev]);

    try {
      await createAuditLog({
        action,
        targetEntity: entity,
        details: { detail },
        actorEmail: 'akshatrajpati@gmail.com',
        actorRole: 'SUPER_ADMIN'
      });
    } catch (e) {
      console.warn('Audit trail async write error:', e);
    }
  };

  // --------------------------------------------------------------------------
  // 1. TENANT CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleCountrySelectionChange = (countryName) => {
    const matched = sovereignRegistry.find(c => c.name === countryName);
    if (matched) {
      setNewCompanyForm(prev => ({
        ...prev,
        country: matched.name,
        countryCode: matched.code,
        currency: matched.currencyCode,
        timezone: matched.timezone
      }));
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyForm.name.trim() || !newCompanyForm.adminEmail.trim()) {
      showToast('Please provide both company name and admin email.', 'error');
      return;
    }

    try {
      const planRate = newCompanyForm.plan === 'ENTERPRISE' ? 2000 : newCompanyForm.plan === 'PRO' ? 1000 : 100;
      const payload = {
        name: newCompanyForm.name,
        legalName: newCompanyForm.legalName || newCompanyForm.name,
        code: newCompanyForm.code || newCompanyForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        countryCode: newCompanyForm.countryCode,
        currencyCode: newCompanyForm.currency,
        timezone: newCompanyForm.timezone,
        plan: newCompanyForm.plan,
        maxMrs: Number(newCompanyForm.mrLimit) || 200,
        maxAdmins: 5,
        maxDoctors: 5000,
        maxStorageGb: Number(newCompanyForm.storageLimitGB) || 50,
        billingCycle: newCompanyForm.billingCycle || 'Monthly',
        monthlyRate: planRate,
        contactEmail: newCompanyForm.adminEmail,
        contactPhone: newCompanyForm.adminPhone,
        adminName: newCompanyForm.adminName
      };

      const result = await createTenant(payload);
      showToast(`Tenant "${newCompanyForm.name}" successfully provisioned!`, 'success');
      logAudit('TENANT_PROVISIONED', `Created pharma company ${newCompanyForm.name} in ${newCompanyForm.country}`, newCompanyForm.name);

      setIsCreateCompanyOpen(false);
      loadAllData();
      setNewCompanyForm({
        name: '',
        legalName: '',
        code: '',
        country: 'India',
        countryCode: 'IN',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        plan: 'PRO',
        userLimit: 250,
        mrLimit: 200,
        storageLimitGB: 50,
        billingCycle: 'Monthly',
        monthlyRate: 1000
      });
    } catch (err) {
      showToast(`Failed to create tenant: ${err.message}`, 'error');
    }
  };

  const handleOpenEditCompany = (company) => {
    setEditingCompany(company);
    setEditCompanyForm({
      name: company.name,
      legalName: company.legalName || company.name,
      plan: company.plan,
      userLimit: company.userLimit || 250,
      mrLimit: company.mrLimit || 200,
      storageLimitGB: company.storageLimitGB || 50,
      contactEmail: company.adminEmail || '',
      contactPhone: '',
      billingCycle: 'Monthly',
      monthlyRate: company.customMRR || 1000,
      status: company.status
    });
    setIsEditCompanyOpen(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      await updateTenant(editingCompany.id, {
        name: editCompanyForm.name,
        legalName: editCompanyForm.legalName,
        plan: editCompanyForm.plan,
        maxMrs: Number(editCompanyForm.mrLimit),
        maxStorageGb: Number(editCompanyForm.storageLimitGB),
        contactEmail: editCompanyForm.contactEmail,
        status: editCompanyForm.status
      });

      showToast(`Company "${editCompanyForm.name}" updated successfully.`, 'success');
      logAudit('TENANT_UPDATED', `Updated configuration for ${editCompanyForm.name}`, editCompanyForm.name);
      setIsEditCompanyOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`Update error: ${err.message}`, 'error');
    }
  };

  const handleToggleCompanyStatus = async (id, currentStatus, name) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await toggleTenantStatus(id, nextStatus);
      showToast(`Company "${name}" status changed to ${nextStatus}.`, 'success');
      logAudit('STATUS_CHANGED', `Changed status of ${name} to ${nextStatus}`, name);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const handleOpenDeleteCompany = (company) => {
    setDeletingCompany(company);
    setIsDeleteCompanyOpen(true);
  };

  const handleConfirmDeleteCompany = async () => {
    if (!deletingCompany) return;
    try {
      await deleteTenant(deletingCompany.id);
      showToast(`Company "${deletingCompany.name}" permanently purged.`, 'success');
      logAudit('TENANT_DELETED', `Purged tenant ${deletingCompany.name}`, deletingCompany.name);
      setIsDeleteCompanyOpen(false);
      setDeletingCompany(null);
      setCompanies(prev => prev.filter(c => c.id !== deletingCompany.id));
    } catch (err) {
      showToast(`Failed to delete tenant: ${err.message}`, 'error');
    }
  };

  const handleOpenResetAdminPassword = (company) => {
    setResetPasswordTarget(company);
    setNewAdminPasswordInput('');
    setIsResetAdminPasswordOpen(true);
  };

  const handleConfirmResetAdminPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordTarget || !newAdminPasswordInput.trim()) {
      showToast('Please enter a new password.', 'error');
      return;
    }

    try {
      await resetTenantAdminPassword(resetPasswordTarget.id, newAdminPasswordInput.trim(), resetPasswordTarget.adminEmail);
      showToast(`Admin password reset successfully for ${resetPasswordTarget.name}!`, 'success');
      logAudit('ADMIN_PASSWORD_RESET', `Reset admin password for ${resetPasswordTarget.adminEmail}`, resetPasswordTarget.name);
      setIsResetAdminPasswordOpen(false);
      setResetPasswordTarget(null);
      setNewAdminPasswordInput('');
    } catch (err) {
      showToast(`Password reset error: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 2. PLATFORM USER CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.role) {
      showToast('Email and role are required.', 'error');
      return;
    }

    try {
      await createPlatformUser({
        firstName: newUserForm.firstName,
        lastName: newUserForm.lastName,
        email: newUserForm.email,
        password: newUserForm.password || 'User@1234!',
        role: newUserForm.role,
        tenantId: newUserForm.tenantId || null,
        phone: newUserForm.phone,
        territory: newUserForm.territory,
        countryCode: newUserForm.countryCode
      });

      showToast(`User ${newUserForm.email} created successfully.`, 'success');
      logAudit('USER_CREATED', `Created user ${newUserForm.email} with role ${newUserForm.role}`);
      setIsCreateUserOpen(false);
      loadAllData();
      setNewUserForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'MEDICAL_REP',
        tenantId: '',
        phone: '',
        territory: 'Regional Area 1',
        countryCode: 'IN'
      });
    } catch (err) {
      showToast(`Failed to create user: ${err.message}`, 'error');
    }
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setEditUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || '',
      phone: user.phone || '',
      territory: user.territory || '',
      status: user.status
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updatePlatformUser(editingUser.id, editUserForm);
      showToast(`User ${editUserForm.email} updated successfully.`, 'success');
      logAudit('USER_UPDATED', `Updated user ${editUserForm.email}`);
      setIsEditUserOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`User update error: ${err.message}`, 'error');
    }
  };

  const handleToggleUserStatus = async (id, currentStatus, email) => {
    const nextStatus = currentStatus === 'ACTIVE' || currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await toggleUserStatus(id, nextStatus);
      showToast(`User ${email} status changed to ${nextStatus}.`, 'success');
      logAudit('USER_STATUS_CHANGED', `Changed status of ${email} to ${nextStatus}`);
      setPlatformUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus.toUpperCase() } : u));
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  const handleOpenResetUserPassword = (user) => {
    setResetUserPasswordTarget(user);
    setNewUserPasswordInput('');
    setIsResetUserPasswordOpen(true);
  };

  const handleConfirmResetUserPassword = async (e) => {
    e.preventDefault();
    if (!resetUserPasswordTarget || !newUserPasswordInput.trim()) {
      showToast('Please enter a new password.', 'error');
      return;
    }

    try {
      await resetUserPassword(resetUserPasswordTarget.id, newUserPasswordInput.trim());
      showToast(`Password reset successfully for ${resetUserPasswordTarget.email}!`, 'success');
      logAudit('USER_PASSWORD_RESET', `Reset password for ${resetUserPasswordTarget.email}`);
      setIsResetUserPasswordOpen(false);
      setResetUserPasswordTarget(null);
      setNewUserPasswordInput('');
    } catch (err) {
      showToast(`Password reset error: ${err.message}`, 'error');
    }
  };

  const handleOpenDeleteUser = (user) => {
    setDeletingUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await deletePlatformUser(deletingUser.id);
      showToast(`User ${deletingUser.email} deleted successfully.`, 'success');
      logAudit('USER_DELETED', `Deleted user account ${deletingUser.email}`);
      setIsDeleteUserOpen(false);
      setDeletingUser(null);
      setPlatformUsers(prev => prev.filter(u => u.id !== deletingUser.id));
    } catch (err) {
      showToast(`Failed to delete user: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 3. SOVEREIGN COUNTRY CRUD HANDLERS
  // --------------------------------------------------------------------------
  const handleCreateCountry = async (e) => {
    e.preventDefault();
    if (!newCountryForm.code || !newCountryForm.name) {
      showToast('Country code and name are required.', 'error');
      return;
    }

    try {
      await createCountry({
        code: newCountryForm.code.toUpperCase().trim(),
        name: newCountryForm.name.trim(),
        currency_code: newCountryForm.currencyCode.toUpperCase().trim(),
        currency_symbol: newCountryForm.currencySymbol || '$',
        primary_timezone: newCountryForm.primaryTimezone || 'UTC',
        tax_scheme: newCountryForm.taxScheme,
        social_security: newCountryForm.socialSecurity,
        fiscal_year: newCountryForm.fiscalYear
      });

      showToast(`Sovereign Country ${newCountryForm.name} registered.`, 'success');
      logAudit('SOVEREIGN_COUNTRY_ADDED', `Registered country ${newCountryForm.name} (${newCountryForm.code})`);
      setIsCreateCountryOpen(false);
      loadAllData();
      setNewCountryForm({
        code: '',
        name: '',
        currencyCode: '',
        currencySymbol: '',
        primaryTimezone: 'UTC',
        taxScheme: 'Standard VAT / PIT',
        socialSecurity: 'Statutory Scheme',
        fiscalYear: 'January - December'
      });
    } catch (err) {
      showToast(`Country registration error: ${err.message}`, 'error');
    }
  };

  const handleOpenEditCountry = (country) => {
    setEditingCountry(country);
    setEditCountryForm({
      name: country.name,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      primaryTimezone: country.timezone,
      taxScheme: country.taxScheme,
      socialSecurity: country.socialSecurity,
      fiscalYear: country.fiscalYear
    });
    setIsEditCountryOpen(true);
  };

  const handleUpdateCountry = async (e) => {
    e.preventDefault();
    if (!editingCountry) return;

    try {
      await updateCountry(editingCountry.code, {
        name: editCountryForm.name,
        currency_code: editCountryForm.currencyCode,
        currency_symbol: editCountryForm.currencySymbol,
        primary_timezone: editCountryForm.primaryTimezone,
        tax_scheme: editCountryForm.taxScheme,
        social_security: editCountryForm.socialSecurity,
        fiscal_year: editCountryForm.fiscalYear
      });

      showToast(`Country ${editingCountry.name} updated.`, 'success');
      logAudit('SOVEREIGN_COUNTRY_UPDATED', `Updated statutory parameters for ${editingCountry.name}`);
      setIsEditCountryOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`Update error: ${err.message}`, 'error');
    }
  };

  const handleDeleteCountry = async (code, name) => {
    if (!window.confirm(`Are you sure you want to delete sovereign jurisdiction ${name}?`)) return;
    try {
      await deleteCountry(code);
      showToast(`Sovereign country ${name} removed.`, 'success');
      logAudit('SOVEREIGN_COUNTRY_DELETED', `Deleted jurisdiction ${name} (${code})`);
      setSovereignRegistry(prev => prev.filter(c => c.code !== code));
    } catch (err) {
      showToast(`Failed to delete country: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 4. SUBSCRIPTION / BILLING HANDLERS
  // --------------------------------------------------------------------------
  const handleOpenSubscriptionModal = (company) => {
    setSubModalTarget(company);
    setSubModalForm({
      planTier: company.plan || 'PRO',
      amountBilled: company.plan === 'ENTERPRISE' ? 2000 : company.plan === 'PRO' ? 1000 : 100,
      billingInterval: 'Monthly',
      expiryDate: company.renewalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setIsSubscriptionModalOpen(true);
  };

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    if (!subModalTarget) return;

    try {
      await createSubscription({
        tenant_id: subModalTarget.id,
        plan_tier: subModalForm.planTier,
        amount_billed: Number(subModalForm.amountBilled),
        billing_interval: subModalForm.billingInterval,
        expiry_date: subModalForm.expiryDate,
        status: 'Active'
      });

      showToast(`Subscription updated to ${subModalForm.planTier} for ${subModalTarget.name}!`, 'success');
      logAudit('SUBSCRIPTION_UPDATED', `Upgraded ${subModalTarget.name} to ${subModalForm.planTier}`, subModalTarget.name);
      setIsSubscriptionModalOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`Subscription error: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 5. ANNOUNCEMENTS & TICKETS
  // --------------------------------------------------------------------------
  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    try {
      await createSystemAlert({
        title: newAnnouncement.title,
        message: newAnnouncement.content,
        type: newAnnouncement.type,
        severity: newAnnouncement.type === 'SECURITY' ? 'Critical' : 'Info'
      });

      showToast(`Broadcast announcement "${newAnnouncement.title}" published!`, 'success');
      logAudit('ANNOUNCEMENT_PUBLISHED', `Broadcast: "${newAnnouncement.title}"`);
      setIsAnnouncementModalOpen(false);
      setNewAnnouncement({ title: '', type: 'MAINTENANCE', target: 'ALL', content: '' });
      loadAllData();
    } catch (err) {
      showToast(`Failed to publish: ${err.message}`, 'error');
    }
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim()) return;
    const tick = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      companyName: newTicket.companyName || 'General Platform',
      category: newTicket.category,
      priority: newTicket.priority,
      subject: newTicket.subject,
      description: newTicket.description,
      status: 'OPEN',
      assignedTo: 'Akshyatraj Pati (Super Admin HQ)',
      createdAt: new Date().toLocaleDateString()
    };
    setSupportTickets(prev => [tick, ...prev]);
    logAudit('TICKET_CREATED', `Support ticket #${tick.id}: ${tick.subject}`, tick.companyName);
    showToast(`Support Ticket #${tick.id} logged.`, 'success');
    setIsNewTicketOpen(false);
    setNewTicket({ companyName: '', category: 'TECHNICAL', priority: 'HIGH', subject: '', description: '' });
  };

  const handleStartImpersonation = (e) => {
    e.preventDefault();
    if (!impersonateReason.trim()) {
      showToast('A valid audit reason is required.', 'error');
      return;
    }
    const record = {
      target: impersonateTarget,
      reason: impersonateReason,
      startedAt: new Date().toLocaleTimeString()
    };
    setActiveImpersonation(record);
    logAudit('IMPERSONATION_STARTED', `Super Admin impersonated ${impersonateTarget.name} (${impersonateTarget.company}). Reason: ${impersonateReason}`, impersonateTarget.company);
    showToast(`Audited session started as ${impersonateTarget.name}`, 'success');
    setIsImpersonateOpen(false);
    setImpersonateReason('');
  };

  const handleEndImpersonation = () => {
    if (activeImpersonation) {
      logAudit('IMPERSONATION_ENDED', `Ended session as ${activeImpersonation.target.name}`, activeImpersonation.target.company);
      showToast('Impersonation session terminated.', 'info');
      setActiveImpersonation(null);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="superadmin-suite-container">
      {/* Real-Time Floating Toast Notification */}
      {toast && (
        <div className="saas-toast-container">
          <div className={`saas-toast-item ${toast.type === 'error' ? 'saas-toast-error' : 'saas-toast-success'}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Impersonation Active Banner */}
      {activeImpersonation && (
        <div className="impersonation-active-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Eye size={20} color="#b45309" />
            <div>
              <strong>AUDITED IMPERSONATION SESSION ACTIVE: </strong>
              <span>Viewing as <strong>{activeImpersonation.target.name}</strong> ({activeImpersonation.target.company}). Reason: <em>"{activeImpersonation.reason}"</em></span>
            </div>
          </div>
          <button
            type="button"
            className="action-pill-btn"
            style={{ background: '#b45309', color: '#fff', border: 'none' }}
            onClick={handleEndImpersonation}
          >
            End Impersonation Session
          </button>
        </div>
      )}

      {/* Global SaaS Header Strip */}
      <div className="saas-header-strip">
        <div className="saas-header-left">
          <div className="saas-global-chip">
            <Globe2 size={13} />
            <span>Multi-Country Sovereign Platform</span>
          </div>
          <h1 className="saas-header-title">Super Admin Platform Command Center</h1>
          <p className="saas-header-desc">
            Global SaaS Sovereign Governance &bull; 24 Market Jurisdictions &bull; Live CRUD Engine &bull; Automated FX
          </p>
        </div>

        <div className="saas-quick-stats-pills">
          <div className="header-stat-pill">
            <span className="pill-label">Total MRR (USD)</span>
            <span className="pill-value text-green">${totalMRR_USD.toLocaleString()}</span>
          </div>
          <div className="header-stat-pill">
            <span className="pill-label">ARR Run-Rate</span>
            <span className="pill-value text-purple">${totalARR_USD.toLocaleString()}</span>
          </div>
          <div className="header-stat-pill">
            <span className="pill-label">Active Tenants</span>
            <span className="pill-value">{activeCompanies} Active</span>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateCompanyOpen(true)}
            style={{ padding: '8px 14px', fontSize: '0.8rem', marginLeft: '6px' }}
          >
            <Plus size={15} />
            <span>Provision Tenant</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. PLATFORM DASHBOARD
          ===================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="tab-pane-content">
          {/* Executive KPI Metric Cards */}
          <div className="kpi-banner-grid">
            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Companies / Tenants</span>
                <Building2 size={18} className="kpi-icon blue" />
              </div>
              <div className="kpi-number">{totalCompanies}</div>
              <div className="kpi-status-breakdown">
                <span className="dot-active" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>🟢 {activeCompanies} Active</span>
                <span className="dot-trial" style={{ background: '#f3e8ff', color: '#6b21a8', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>🟣 {trialCompanies} Trial</span>
                <span className="dot-suspended" style={{ background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>🟡 {suspendedCompanies} Suspended</span>
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Platform Users</span>
                <Users size={18} className="kpi-icon indigo" />
              </div>
              <div className="kpi-number">{totalUsers.toLocaleString()}</div>
              <div className="kpi-sub">
                <strong className="text-green">{activeUsers.toLocaleString()} Active</strong> &bull; <strong className="text-blue">{totalAdmins} Admins</strong>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                {totalMRs.toLocaleString()} MRs &bull; Cross-Tenant Directory
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Storage &amp; Multi-Tenancy</span>
                <HardDrive size={18} className="kpi-icon blue" />
              </div>
              <div className="kpi-number">{totalStorageTB} TB</div>
              <div className="kpi-sub">
                <strong>{totalStorageGB} GB Multi-Tenant DBs</strong>
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">MRR &amp; ARR Status (USD)</span>
                <CreditCard size={18} className="kpi-icon green" />
              </div>
              <div className="kpi-number text-green">${totalMRR_USD.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>MRR</span></div>
              <div className="kpi-sub">
                <strong>{activeCompanies} Subscriptions</strong> &bull; ARR: ${totalARR_USD.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 2-Column Operational Grid */}
          <div className="saas-overview-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Tenant Companies Overview</h2>
                    <p className="section-desc">Multi-tenant isolation status, local timezone, and currency tier</p>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveTab('companies')}>
                    Manage Companies ({totalCompanies}) <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="saas-table-container">
                  {companies.length === 0 ? (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
                      <Inbox size={36} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#334155' }}>No Tenants Enrolled</div>
                      <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Get started by provisioning your first isolated pharma tenant.</p>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsCreateCompanyOpen(true)}>
                        <Plus size={14} /> Provision Tenant
                      </button>
                    </div>
                  ) : (
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Company &amp; Flag</th>
                          <th>Jurisdiction</th>
                          <th>Timezone</th>
                          <th>Plan</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.slice(0, 5).map((comp) => (
                          <tr key={comp.id}>
                            <td>
                              <div className="comp-name-group">
                                <span className="comp-flag">{comp.flag}</span>
                                <div>
                                  <div className="comp-name-text">{comp.name}</div>
                                  <div className="comp-code-sub">{comp.code}</div>
                                </div>
                              </div>
                            </td>
                            <td><strong>{comp.country}</strong></td>
                            <td><span className="tenant-id-pill">{comp.timezone}</span></td>
                            <td><span className={`plan-pill plan-${comp.plan.toLowerCase()}`}>{comp.plan}</span></td>
                            <td>
                              <span className={`status-tag status-${comp.status.toLowerCase()}`}>
                                {comp.status === 'ACTIVE' ? '🟢 Active' : '🟡 Suspended'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="actions-cluster">
                                <button type="button" className="action-pill-btn" onClick={() => handleOpenEditCompany(comp)}>
                                  <Edit size={12} /> Edit
                                </button>
                                <button type="button" className="action-pill-btn" onClick={() => handleToggleCompanyStatus(comp.id, comp.status, comp.name)}>
                                  {comp.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Real-Time Platform Activity Stream */}
              <div className="card-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={18} color="#2563eb" /> Real-Time Platform Activity Stream
                    </h2>
                    <p className="section-desc">Immutable audit trail of company provisioning, admin auth, and feature updates</p>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveTab('security')}>
                    Audit Log &rarr;
                  </button>
                </div>

                <div className="activity-feed">
                  {recentActivities.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                      Audit stream active. Platform events will appear in real time.
                    </div>
                  ) : (
                    recentActivities.slice(0, 6).map(act => (
                      <div key={act.id} className="activity-item">
                        <div className="activity-dot blue" />
                        <div className="activity-body">
                          <div className="activity-header">
                            <span className="act-title"><strong>{act.title}</strong> &bull; <span style={{ color: '#2563eb' }}>{act.entity}</span></span>
                            <span className="act-time">{act.time}</span>
                          </div>
                          <p className="act-detail">{act.detail}</p>
                          <span className="act-actor">Actor: {act.actor}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Broadcasts & Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section">
                <div className="card-header-flex">
                  <h3 className="card-header-title">
                    <Megaphone size={16} color="#d97706" /> Global Broadcast Notices
                  </h3>
                  <button type="button" className="action-pill-btn" onClick={() => setIsAnnouncementModalOpen(true)}>
                    <Plus size={12} /> Broadcast
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {systemAlerts.length === 0 ? (
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                      No active global announcements. Click Broadcast to publish alerts to tenants.
                    </div>
                  ) : (
                    systemAlerts.map(alert => (
                      <div key={alert.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{alert.title}</strong>
                          <button
                            type="button"
                            onClick={() => deleteSystemAlert(alert.id).then(() => {
                              showToast('Alert dismissed.', 'info');
                              setSystemAlerts(prev => prev.filter(a => a.id !== alert.id));
                            })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                          >
                            &times;
                          </button>
                        </div>
                        <p style={{ fontSize: '0.76rem', color: '#475569', margin: '4px 0 0' }}>{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="card-section">
                <h3 className="card-header-title">
                  <Settings size={16} color="#0f172a" /> Super Admin Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsCreateCompanyOpen(true)} style={{ justifyContent: 'flex-start' }}>
                    <Plus size={14} color="#2563eb" /> Provision New Pharma Tenant
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsCreateUserOpen(true)} style={{ justifyContent: 'flex-start' }}>
                    <Users size={14} color="#059669" /> Add Platform User
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsCreateCountryOpen(true)} style={{ justifyContent: 'flex-start' }}>
                    <Globe2 size={14} color="#d97706" /> Register Sovereign Country
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsNewTicketOpen(true)} style={{ justifyContent: 'flex-start' }}>
                    <LifeBuoy size={14} color="#7c3aed" /> Create Support Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. COMPANIES & TENANTS (FULL CRUD)
          ===================================================================== */}
      {activeTab === 'companies' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${companySubTab === 'all' ? 'active' : ''}`} onClick={() => setCompanySubTab('all')}>
              All Pharma Companies ({companies.length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'active' ? 'active' : ''}`} onClick={() => setCompanySubTab('active')}>
              Active ({companies.filter(c => c.status === 'ACTIVE').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'suspended' ? 'active' : ''}`} onClick={() => setCompanySubTab('suspended')}>
              Suspended ({companies.filter(c => c.status === 'SUSPENDED').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'admins' ? 'active' : ''}`} onClick={() => setCompanySubTab('admins')}>
              Company Admins ({admins.length})
            </button>
          </div>

          <div className="pane-action-bar">
            <div className="search-box-large">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by company name, jurisdiction, code..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setIsCreateCompanyOpen(true)}>
              <Plus size={16} /> Create New Pharma Company
            </button>
          </div>

          {companySubTab === 'admins' ? (
            <div className="saas-table-container">
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Admin Name &amp; Email</th>
                    <th>Assigned Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(adm => (
                    <tr key={adm.id}>
                      <td>
                        <div className="admin-profile-cell">
                          <div className="admin-avatar">{adm.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="admin-name">{adm.name}</div>
                            <div className="admin-email">{adm.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{adm.company}</strong></td>
                      <td><span className="plan-pill plan-pro">{adm.role}</span></td>
                      <td><span className="status-tag status-active">{adm.status}</span></td>
                      <td>{adm.lastLogin}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                            onClick={() => {
                              setImpersonateTarget(adm);
                              setIsImpersonateOpen(true);
                            }}
                          >
                            <Eye size={13} /> Impersonate
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => handleOpenResetUserPassword(adm)}
                          >
                            Reset Pwd
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn red"
                            onClick={() => handleOpenDeleteUser(adm)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="saas-table-container">
              {companies.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <Building2 size={40} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>No Companies Enrolled Yet</div>
                  <p style={{ fontSize: '0.84rem', margin: '6px auto 16px', color: '#64748b' }}>
                    Click "Create New Pharma Company" to provision your first tenant in PostgreSQL.
                  </p>
                  <button type="button" className="btn btn-primary" onClick={() => setIsCreateCompanyOpen(true)}>
                    <Plus size={16} /> Create New Pharma Company
                  </button>
                </div>
              ) : (
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company &amp; Jurisdiction</th>
                      <th>Timezone &amp; Currency</th>
                      <th>Plan</th>
                      <th>Quotas (MRs / Storage)</th>
                      <th>MRR</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>CRUD Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(c => companySubTab === 'all' || c.status.toLowerCase() === companySubTab)
                      .filter(c =>
                        c.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                        c.country.toLowerCase().includes(globalSearchQuery.toLowerCase())
                      )
                      .map((company) => (
                        <tr key={company.id}>
                          <td>
                            <div className="comp-name-group">
                              <span className="comp-flag">{company.flag}</span>
                              <div>
                                <div className="comp-name-text">{company.name}</div>
                                <div className="comp-code-sub">{company.code} &bull; {company.country}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="tenant-id-pill" style={{ marginBottom: '2px' }}>{company.timezone}</span>
                              <strong style={{ fontSize: '0.76rem', color: '#2563eb' }}>{company.currency}</strong>
                            </div>
                          </td>
                          <td><span className={`plan-pill plan-${company.plan.toLowerCase()}`}>{company.plan}</span></td>
                          <td>
                            <div className="users-breakdown-cell">
                              <strong>{company.usersCount} / {company.userLimit} Users</strong>
                              <span>{company.storageLimitGB} GB Quota</span>
                            </div>
                          </td>
                          <td><strong>{company.mrr}</strong></td>
                          <td>
                            <span className={`status-tag status-${company.status.toLowerCase()}`}>
                              {company.status === 'ACTIVE' ? '🟢 Active' : '🟡 Suspended'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cluster">
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenEditCompany(company)}
                                title="Edit Company Details"
                              >
                                <Edit size={12} /> Edit
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenSubscriptionModal(company)}
                                title="Upgrade / Manage Plan"
                              >
                                Plan
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenResetAdminPassword(company)}
                                title="Reset Company Admin Password"
                              >
                                <Key size={12} /> Pwd
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleToggleCompanyStatus(company.id, company.status, company.name)}
                              >
                                {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn red"
                                onClick={() => handleOpenDeleteCompany(company)}
                                title="Purge Tenant"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          3. JURISDICTIONS (SOVEREIGN COUNTRIES & FX)
          ===================================================================== */}
      {activeTab === 'jurisdictions' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'countries' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('countries')}>
              <Globe2 size={14} /> Sovereign Countries ({sovereignRegistry.length})
            </button>
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'timezones' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('timezones')}>
              <Clock size={14} /> Multi-Timezone World Clocks
            </button>
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'currencies' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('currencies')}>
              <Coins size={14} /> Multi-Currency &amp; FX Engine
            </button>
          </div>

          {jurisdictionSubTab === 'countries' && (
            <div>
              <div className="pane-action-bar">
                <div>
                  <h2 className="section-title">Supported Sovereign Jurisdictions</h2>
                  <p className="section-desc">Tax withholding, social security standards, IANA timezones, and currency registries</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setIsCreateCountryOpen(true)}>
                  <Plus size={16} /> Add Sovereign Country
                </button>
              </div>

              <div className="countries-grid">
                {sovereignRegistry.map((c) => {
                  const countryCompaniesCount = companies.filter(comp => comp.country?.toLowerCase() === c.name?.toLowerCase()).length;
                  return (
                    <div key={c.code} className="country-card">
                      <div className="country-card-header">
                        <div className="country-title-row">
                          <span className="country-big-flag">{c.flag}</span>
                          <div>
                            <h3 className="country-name">{c.name} ({c.code})</h3>
                            <span className="country-active-tag">{countryCompaniesCount} {countryCompaniesCount === 1 ? 'Company' : 'Companies'} Onboarded</span>
                          </div>
                        </div>
                        <span className="status-badge-green">Operational</span>
                      </div>

                      <div className="country-details-list">
                        <div className="detail-item">
                          <span className="detail-key">Currency &amp; Symbol:</span>
                          <span className="detail-val"><strong>{c.currencyCode} ({c.currencySymbol})</strong></span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-key">IANA Timezone:</span>
                          <span className="detail-val">{c.timezone}</span>
                        </div>
                        <div className="detail-item highlight-tax">
                          <span className="detail-key">Tax / Withholding:</span>
                          <span className="detail-val">{c.taxScheme}</span>
                        </div>
                        <div className="detail-item highlight-nssf">
                          <span className="detail-key">Social Security:</span>
                          <span className="detail-val">{c.socialSecurity}</span>
                        </div>
                      </div>

                      <div className="country-card-footer" style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                        <button
                          type="button"
                          className="btn-configure-country"
                          onClick={() => handleOpenEditCountry(c)}
                        >
                          <Settings size={14} /> <span>Configure</span>
                        </button>
                        <button
                          type="button"
                          className="action-pill-btn red"
                          onClick={() => handleDeleteCountry(c.code, c.name)}
                          title="Delete Country"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {jurisdictionSubTab === 'timezones' && (
            <div className="card-section">
              <h2 className="section-title"><Timer size={20} color="#d97706" /> Global Live Regional Clocks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
                {sovereignRegistry.map((reg) => (
                  <div key={reg.code} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>{reg.flag}</span>
                      <span className="tenant-id-pill">{reg.utcOffset || 'UTC'}</span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>{reg.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{reg.timezone}</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e3a8a', margin: '10px 0 2px', fontFamily: 'monospace' }}>
                      {formatTimezoneClock(reg.timezone)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>
                      {formatTimezoneDate(reg.timezone)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jurisdictionSubTab === 'currencies' && (
            <div className="saas-overview-layout">
              <div className="card-section">
                <h2 className="section-title">Multi-Currency Exchange Matrix</h2>
                <div className="saas-table-container" style={{ marginTop: '12px' }}>
                  <table className="saas-data-table">
                    <thead>
                      <tr>
                        <th>Jurisdiction &amp; Currency</th>
                        <th>ISO Code</th>
                        <th>Symbol</th>
                        <th>Exchange Rate (per 1 USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sovereignRegistry.map((c) => (
                        <tr key={c.code}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{c.flag}</span>
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td><span className="tenant-id-pill">{c.currencyCode}</span></td>
                          <td><strong>{c.currencySymbol}</strong></td>
                          <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                            1 USD = {(c.fxRateToUSD || 1).toLocaleString()} {c.currencyCode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          4. PLATFORM USERS DIRECTORY (FULL CRUD)
          ===================================================================== */}
      {activeTab === 'platform-users' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${userSubTab === 'all' ? 'active' : ''}`} onClick={() => setUserSubTab('all')}>
              All Platform Users ({platformUsers.length})
            </button>
            <button type="button" className={`sub-nav-pill ${userSubTab === 'admins' ? 'active' : ''}`} onClick={() => setUserSubTab('admins')}>
              Admins ({platformUsers.filter(u => u.role.includes('ADMIN')).length})
            </button>
            <button type="button" className={`sub-nav-pill ${userSubTab === 'mrs' ? 'active' : ''}`} onClick={() => setUserSubTab('mrs')}>
              MRs ({platformUsers.filter(u => u.role.includes('REP') || u.role === 'MR').length})
            </button>
          </div>

          <div className="pane-action-bar">
            <div className="search-box-large">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search across all tenants: Name, Email, Company, Role..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setIsCreateUserOpen(true)}>
              <Plus size={16} /> Add Platform User
            </button>
          </div>

          <div className="saas-table-container">
            {platformUsers.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <Users size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Users Registered</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Click "Add Platform User" to provision an employee account.</p>
                <button type="button" className="btn btn-primary" onClick={() => setIsCreateUserOpen(true)}>
                  <Plus size={16} /> Add Platform User
                </button>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Company / Tenant</th>
                    <th>Role</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>CRUD Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {platformUsers
                    .filter(u => userSubTab === 'all' || (userSubTab === 'admins' ? u.role.includes('ADMIN') : u.role.includes('REP') || u.role === 'MR'))
                    .filter(u =>
                      u.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      u.company.toLowerCase().includes(globalSearchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-profile-cell">
                            <div className="admin-avatar">{user.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="admin-name">{user.name}</div>
                              <div className="admin-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong>{user.company}</strong></td>
                        <td><span className="plan-pill plan-pro">{user.role}</span></td>
                        <td>{user.mobile}</td>
                        <td>
                          <span className={`status-tag status-${user.status?.toLowerCase() === 'active' ? 'active' : 'trial'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.lastLogin}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="actions-cluster">
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => handleOpenEditUser(user)}
                              title="Edit User"
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => handleOpenResetUserPassword(user)}
                              title="Reset Password"
                            >
                              <Key size={12} /> Pwd
                            </button>
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => handleToggleUserStatus(user.id, user.status, user.email)}
                            >
                              {user.status === 'ACTIVE' || user.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            {user.role !== 'SUPER_ADMIN' && (
                              <button
                                type="button"
                                className="action-pill-btn red"
                                onClick={() => handleOpenDeleteUser(user)}
                                title="Delete User"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. SUBSCRIPTIONS & MONETIZATION
          ===================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="tab-pane-content">
          <div className="subscription-plans-grid">
            <div className="plan-card">
              <div className="plan-tier-name">BASIC TIER</div>
              <div className="plan-price">$100 <span>/ month</span></div>
              <p className="plan-limits-desc">For regional pharma distribution agencies</p>
              <ul className="plan-perks-list">
                <li>Up to 250 Field MRs</li>
                <li>Core MR Reporting &amp; DCR</li>
                <li>50 GB Storage Limit</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'BASIC').length} Enrolled</div>
            </div>

            <div className="plan-card featured-plan">
              <div className="featured-ribbon">POPULAR</div>
              <div className="plan-tier-name">PRO ENTERPRISE</div>
              <div className="plan-price">$1,000 <span>/ month</span></div>
              <p className="plan-limits-desc">For pharmaceutical manufacturing corporations</p>
              <ul className="plan-perks-list">
                <li>Up to 1,500 Field Reps</li>
                <li>Full DCR + Tour Plans (MTP)</li>
                <li>TA / DA Smart Expense Claims</li>
                <li>250 GB Storage Limit</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'PRO').length} Enrolled</div>
            </div>

            <div className="plan-card">
              <div className="plan-tier-name">GLOBAL PLATINUM</div>
              <div className="plan-price">$2,000 <span>/ month</span></div>
              <p className="plan-limits-desc">For multinational pharmaceutical conglomerates</p>
              <ul className="plan-perks-list">
                <li>Unlimited Field Reps &amp; GMs</li>
                <li>Multi-Country Schema Isolation</li>
                <li>AI Studio &amp; Prescription OCR</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'ENTERPRISE').length} Enrolled</div>
            </div>
          </div>

          <div className="section-title-sm" style={{ marginTop: '28px' }}>
            <span>Tenant Billing &amp; Subscriptions</span>
          </div>

          <div className="saas-table-container">
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Company Tenant</th>
                  <th>Current Tier</th>
                  <th>Monthly Rate</th>
                  <th>Status</th>
                  <th>Next Renewal</th>
                  <th style={{ textAlign: 'right' }}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td><span className={`plan-pill plan-${c.plan.toLowerCase()}`}>{c.plan}</span></td>
                    <td><strong>{c.mrr}</strong></td>
                    <td><span className="status-badge-green">{c.status}</span></td>
                    <td>{c.renewalDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenSubscriptionModal(c)}>
                        Upgrade / Modify Plan
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
          6. FEATURES & CANARY FLAGS
          ===================================================================== */}
      {activeTab === 'features' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Feature Modules &amp; Canary Feature Flags</h2>
              <p className="section-desc">Control per-tenant module accessibility and rollout percentages</p>
            </div>
          </div>

          <div className="card-section" style={{ marginBottom: '22px' }}>
            <h3 className="card-header-title">
              <Sliders size={18} color="#7c3aed" /> Active Feature Flags
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              {featureFlags.map((flag) => (
                <div key={flag.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{flag.name}</strong>
                    <span className="status-tag status-trial">{flag.status}</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '6px 0 12px' }}>{flag.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span>Rollout: <strong>{flag.rolloutPercent}% of Tenants</strong></span>
                    <button
                      type="button"
                      className="action-pill-btn"
                      onClick={() => {
                        const newRollout = flag.rolloutPercent === 100 ? 0 : flag.rolloutPercent + 25;
                        setFeatureFlags(prev => prev.map(f => f.id === flag.id ? { ...f, rolloutPercent: newRollout } : f));
                        showToast(`Updated rollout of ${flag.name} to ${newRollout}%`, 'success');
                      }}
                    >
                      Step +25%
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          7. SECURITY & AUDIT LOGS
          ===================================================================== */}
      {activeTab === 'security' && (
        <div className="tab-pane-content">
          <div className="card-section">
            <h2 className="section-title">Immutable Platform Audit Logs</h2>
            <div className="saas-table-container" style={{ marginTop: '14px' }}>
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Entity / Target</th>
                    <th>Actor</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map(act => (
                    <tr key={act.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{act.time}</td>
                      <td><strong>{act.title}</strong></td>
                      <td>{act.entity}</td>
                      <td>{act.actor}</td>
                      <td style={{ fontSize: '0.76rem', color: '#475569' }}>{act.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          8. SUPPORT TICKETS
          ===================================================================== */}
      {activeTab === 'support' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Support Desk &amp; Tickets</h2>
              <p className="section-desc">Manage tenant requests and system alerts</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setIsNewTicketOpen(true)}>
              <Plus size={16} /> Create Support Ticket
            </button>
          </div>

          <div className="saas-table-container">
            {supportTickets.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <LifeBuoy size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Open Support Tickets</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Support tickets submitted by company admins will be tracked here.</p>
                <button type="button" className="btn btn-primary" onClick={() => setIsNewTicketOpen(true)}>
                  <Plus size={16} /> Create Support Ticket
                </button>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Company</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map(t => (
                    <tr key={t.id}>
                      <td><code>{t.id}</code></td>
                      <td><strong>{t.companyName}</strong></td>
                      <td>{t.category}</td>
                      <td><span className="status-tag status-trial">{t.priority}</span></td>
                      <td>{t.subject}</td>
                      <td><span className="status-badge-green">{t.status}</span></td>
                      <td>{t.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PROVISION TENANT (CREATE COMPANY)
          ===================================================================== */}
      {isCreateCompanyOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={24} color="#d97706" />
                <div>
                  <h3>Provision Isolated Pharma Tenant</h3>
                  <p>Create a dedicated enterprise tenant with sovereign statutory compliance.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreateCompanyOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateCompany} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Legal Commercial Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alleviare Pharma Vietnam Ltd."
                    value={newCompanyForm.name}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Tenant Unique Code</label>
                  <input
                    type="text"
                    placeholder="e.g. alleviare-vn"
                    value={newCompanyForm.code}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, code: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Sovereign Country Jurisdiction *</label>
                  <select
                    className="form-control"
                    value={newCompanyForm.country}
                    onChange={(e) => handleCountrySelectionChange(e.target.value)}
                  >
                    {sovereignRegistry.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subscription Tier</label>
                  <select
                    value={newCompanyForm.plan}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, plan: e.target.value })}
                    className="form-control"
                  >
                    <option value="BASIC">Basic ($100/mo)</option>
                    <option value="PRO">Pro Enterprise ($1,000/mo)</option>
                    <option value="ENTERPRISE">Global Platinum ($2,000/mo)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Initial Company Admin Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Nguyen Van Minh"
                    value={newCompanyForm.adminName}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, adminName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Company Admin Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@company.com"
                    value={newCompanyForm.adminEmail}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, adminEmail: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Max MRs Quota</label>
                  <input
                    type="number"
                    value={newCompanyForm.mrLimit}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, mrLimit: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Storage Limit (GB)</label>
                  <input
                    type="number"
                    value={newCompanyForm.storageLimitGB}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, storageLimitGB: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Default Currency</label>
                  <input
                    type="text"
                    readOnly
                    value={newCompanyForm.currency}
                    className="form-control"
                    style={{ background: '#f1f5f9' }}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateCompanyOpen(false)}>Cancel</button>
                <button type="submit" className="submit-create-btn">
                  <CheckCircle2 size={16} /> <span>Provision Tenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDIT COMPANY (UPDATE)
          ===================================================================== */}
      {isEditCompanyOpen && editingCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Edit size={22} color="#2563eb" />
                <div>
                  <h3>Edit Pharma Company</h3>
                  <p>Update tenant details, quotas, and subscription configuration.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditCompanyOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleUpdateCompany} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Commercial Name</label>
                  <input
                    type="text"
                    required
                    value={editCompanyForm.name}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Subscription Tier</label>
                  <select
                    className="form-control"
                    value={editCompanyForm.plan}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, plan: e.target.value })}
                  >
                    <option value="BASIC">Basic ($100/mo)</option>
                    <option value="PRO">Pro Enterprise ($1,000/mo)</option>
                    <option value="ENTERPRISE">Global Platinum ($2,000/mo)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Contact Admin Email</label>
                  <input
                    type="email"
                    value={editCompanyForm.contactEmail}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, contactEmail: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={editCompanyForm.status}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Max MRs Quota</label>
                  <input
                    type="number"
                    value={editCompanyForm.mrLimit}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, mrLimit: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Storage Limit (GB)</label>
                  <input
                    type="number"
                    value={editCompanyForm.storageLimitGB}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, storageLimitGB: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditCompanyOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DELETE COMPANY CONFIRMATION
          ===================================================================== */}
      {isDeleteCompanyOpen && deletingCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <AlertTriangle size={22} color="#dc2626" />
                <div>
                  <h3>Purge Pharma Tenant</h3>
                  <p>Permanently delete {deletingCompany.name}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsDeleteCompanyOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '14px', color: '#b91c1c', fontSize: '0.84rem' }}>
                ⚠️ <strong>Permanent Action:</strong> This will delete <strong>{deletingCompany.name}</strong> and all associated tenant records in PostgreSQL. This action cannot be undone.
              </div>

              <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsDeleteCompanyOpen(false)}>Cancel</button>
                <button type="button" className="btn-danger" onClick={handleConfirmDeleteCompany}>
                  <Trash2 size={16} /> <span>Confirm &amp; Delete Tenant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: RESET ADMIN PASSWORD
          ===================================================================== */}
      {isResetAdminPasswordOpen && resetPasswordTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Key size={22} color="#2563eb" />
                <div>
                  <h3>Reset Company Admin Password</h3>
                  <p>Set a new password for {resetPasswordTarget.name} ({resetPasswordTarget.adminEmail})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsResetAdminPasswordOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmResetAdminPassword} className="modal-form-body">
              <div className="form-group">
                <label>New Secure Password *</label>
                <input
                  type="password"
                  required
                  placeholder="e.g. Admin@2026!"
                  value={newAdminPasswordInput}
                  onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsResetAdminPasswordOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD PLATFORM USER
          ===================================================================== */}
      {isCreateUserOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Users size={22} color="#059669" />
                <div>
                  <h3>Add Platform User</h3>
                  <p>Create an employee account assigned to any company tenant or HQ.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreateUserOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@company.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input
                    type="password"
                    placeholder="User@1234!"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    className="form-control"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="COMPANY_ADMIN">Company Admin</option>
                    <option value="GENERAL_MANAGER">General Manager</option>
                    <option value="AREA_MANAGER">Area Manager</option>
                    <option value="MEDICAL_REP">Medical Representative (MR)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Company Tenant</label>
                  <select
                    className="form-control"
                    value={newUserForm.tenantId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, tenantId: e.target.value })}
                  >
                    <option value="">Global HQ / Platform</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Phone / Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Territory</label>
                  <input
                    type="text"
                    placeholder="e.g. Zone 1 North"
                    value={newUserForm.territory}
                    onChange={(e) => setNewUserForm({ ...newUserForm, territory: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateUserOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDIT PLATFORM USER
          ===================================================================== */}
      {isEditUserOpen && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Edit size={22} color="#2563eb" />
                <div>
                  <h3>Edit User Account</h3>
                  <p>Modify credentials and permissions for {editingUser.email}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditUserOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleUpdateUser} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editUserForm.firstName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editUserForm.lastName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="COMPANY_ADMIN">Company Admin</option>
                    <option value="GENERAL_MANAGER">General Manager</option>
                    <option value="AREA_MANAGER">Area Manager</option>
                    <option value="MEDICAL_REP">Medical Representative (MR)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={editUserForm.status}
                    onChange={(e) => setEditUserForm({ ...editUserForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditUserOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: RESET USER PASSWORD
          ===================================================================== */}
      {isResetUserPasswordOpen && resetUserPasswordTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Key size={22} color="#2563eb" />
                <div>
                  <h3>Reset User Password</h3>
                  <p>Update password for {resetUserPasswordTarget.email}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsResetUserPasswordOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmResetUserPassword} className="modal-form-body">
              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="e.g. Pass@2026!"
                  value={newUserPasswordInput}
                  onChange={(e) => setNewUserPasswordInput(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsResetUserPasswordOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DELETE USER CONFIRMATION
          ===================================================================== */}
      {isDeleteUserOpen && deletingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <AlertTriangle size={22} color="#dc2626" />
                <div>
                  <h3>Delete User Account</h3>
                  <p>Permanently remove {deletingUser.email}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsDeleteUserOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '14px', color: '#b91c1c', fontSize: '0.84rem' }}>
                ⚠️ <strong>Delete User:</strong> Are you sure you want to permanently delete account <strong>{deletingUser.email}</strong>?
              </div>

              <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsDeleteUserOpen(false)}>Cancel</button>
                <button type="button" className="btn-danger" onClick={handleConfirmDeleteUser}>
                  <Trash2 size={16} /> <span>Confirm &amp; Delete User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD SOVEREIGN COUNTRY
          ===================================================================== */}
      {isCreateCountryOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Globe2 size={22} color="#d97706" />
                <div>
                  <h3>Add Sovereign Jurisdiction</h3>
                  <p>Register a new sovereign market with statutory compliance.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreateCountryOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateCountry} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Country ISO Code (2 Letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. AE"
                    value={newCountryForm.code}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, code: e.target.value.toUpperCase() })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Country Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Arab Emirates"
                    value={newCountryForm.name}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Currency ISO Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AED"
                    value={newCountryForm.currencyCode}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, currencyCode: e.target.value.toUpperCase() })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Currency Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. د.إ"
                    value={newCountryForm.currencySymbol}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, currencySymbol: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Primary IANA Timezone</label>
                <input
                  type="text"
                  placeholder="e.g. Asia/Dubai"
                  value={newCountryForm.primaryTimezone}
                  onChange={(e) => setNewCountryForm({ ...newCountryForm, primaryTimezone: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateCountryOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> <span>Register Country</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDIT COUNTRY STATUTORY COMPLIANCE
          ===================================================================== */}
      {isEditCountryOpen && editingCountry && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Settings size={22} color="#2563eb" />
                <div>
                  <h3>Configure Compliance Rules</h3>
                  <p>Statutory tax, social security, and currency rules for {editingCountry.name}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditCountryOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleUpdateCountry} className="modal-form-body">
              <div className="form-group">
                <label>Tax &amp; Withholding Scheme</label>
                <input
                  type="text"
                  value={editCountryForm.taxScheme}
                  onChange={(e) => setEditCountryForm({ ...editCountryForm, taxScheme: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Social Security / Statutory Fund</label>
                <input
                  type="text"
                  value={editCountryForm.socialSecurity}
                  onChange={(e) => setEditCountryForm({ ...editCountryForm, socialSecurity: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditCountryOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save Compliance Rules</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MANAGE SUBSCRIPTION & BILLING
          ===================================================================== */}
      {isSubscriptionModalOpen && subModalTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <CreditCard size={22} color="#059669" />
                <div>
                  <h3>Manage Subscription</h3>
                  <p>Upgrade or adjust plan tier for {subModalTarget.name}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsSubscriptionModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveSubscription} className="modal-form-body">
              <div className="form-group">
                <label>Subscription Tier</label>
                <select
                  className="form-control"
                  value={subModalForm.planTier}
                  onChange={(e) => {
                    const tier = e.target.value;
                    const rate = tier === 'ENTERPRISE' ? 2000 : tier === 'PRO' ? 1000 : 100;
                    setSubModalForm({ ...subModalForm, planTier: tier, amountBilled: rate });
                  }}
                >
                  <option value="BASIC">Basic ($100/mo)</option>
                  <option value="PRO">Pro Enterprise ($1,000/mo)</option>
                  <option value="ENTERPRISE">Global Platinum ($2,000/mo)</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Monthly Billed Amount ($ USD)</label>
                  <input
                    type="number"
                    value={subModalForm.amountBilled}
                    onChange={(e) => setSubModalForm({ ...subModalForm, amountBilled: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Next Renewal Date</label>
                  <input
                    type="date"
                    value={subModalForm.expiryDate}
                    onChange={(e) => setSubModalForm({ ...subModalForm, expiryDate: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsSubscriptionModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> <span>Update Subscription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: IMPERSONATION (AUDITED)
          ===================================================================== */}
      {isImpersonateOpen && impersonateTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Eye size={22} color="#d97706" />
                <div>
                  <h3>Impersonate Company Admin</h3>
                  <p>Login as {impersonateTarget.name} ({impersonateTarget.company})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsImpersonateOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleStartImpersonation} className="modal-form-body">
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '10px 12px', fontSize: '0.78rem', color: '#92400e', marginBottom: '14px' }}>
                ⚠️ <strong>Audited Session:</strong> All interactions during this impersonation are recorded in platform audit logs with your Master Super Admin ID.
              </div>

              <div className="form-group">
                <label>Audit Compliance Reason *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Investigating DCR approval queue timeout"
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsImpersonateOpen(false)}>Cancel</button>
                <button type="submit" className="submit-create-btn" style={{ background: '#b45309' }}>
                  <Eye size={16} /> <span>Proceed to Impersonate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PUBLISH GLOBAL ANNOUNCEMENT
          ===================================================================== */}
      {isAnnouncementModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Megaphone size={22} color="#2563eb" />
                <div>
                  <h3>Publish Global Announcement</h3>
                  <p>Broadcast alerts to all tenant dashboards.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsAnnouncementModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSendAnnouncement} className="modal-form-body">
              <div className="form-group">
                <label>Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Infrastructure Maintenance"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write message details..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsAnnouncementModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> <span>Broadcast Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE SUPPORT TICKET
          ===================================================================== */}
      {isNewTicketOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <LifeBuoy size={22} color="#2563eb" />
                <div>
                  <h3>Create Support Ticket</h3>
                  <p>Log a support or technical inquiry.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsNewTicketOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateTicket} className="modal-form-body">
              <div className="form-group">
                <label>Company Tenant</label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={newTicket.companyName}
                  onChange={(e) => setNewTicket({ ...newTicket, companyName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Issue summary"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Details of the request..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsNewTicketOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <span>Create Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
