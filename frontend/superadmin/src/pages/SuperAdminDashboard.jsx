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
  Timer
} from 'lucide-react';

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
    taxScheme: 'PPh 21 (5%-35%) + 11% PPN',
    socialSecurity: 'BPJS Ketenagakerjaan (5.7%) + BPJS Kesehatan (5%)',
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
    fxRateToUSD: 58.20,
    timezone: 'Asia/Manila',
    utcOffset: 'UTC+08:00',
    language: 'Filipino (Tagalog), English',
    fiscalYear: 'January - December',
    taxScheme: 'TRAIN Law (0%-35%) + 12% VAT',
    socialSecurity: 'SSS (4.5%) + PhilHealth (5%) + Pag-IBIG',
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
    language: 'English, Hindi',
    fiscalYear: 'April - March',
    taxScheme: 'GST (18%) + TDS (10%)',
    socialSecurity: 'EPFO (12%) + ESIC (0.75%) + Gratuity',
    publicHolidays: 14,
    status: 'ACTIVE'
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    flag: '🇧🇩',
    currencyCode: 'BDT',
    currencySymbol: '৳',
    currencyName: 'Bangladeshi Taka',
    fxRateToUSD: 120.0,
    timezone: 'Asia/Dhaka',
    utcOffset: 'UTC+06:00',
    language: 'Bengali (বাংলা), English',
    fiscalYear: 'July - June',
    taxScheme: 'Progressive Tax Slab + 15% VAT',
    socialSecurity: 'Workers Profit Participation Fund (WPPF 5%)',
    publicHolidays: 16,
    status: 'ACTIVE'
  },
  {
    code: 'NP',
    name: 'Nepal',
    flag: '🇳🇵',
    currencyCode: 'NPR',
    currencySymbol: 'रू',
    currencyName: 'Nepalese Rupee',
    fxRateToUSD: 133.50,
    timezone: 'Asia/Kathmandu',
    utcOffset: 'UTC+05:45',
    language: 'Nepali (नेपाली), English',
    fiscalYear: 'July - June (Shrawan-Ashadh)',
    taxScheme: 'TDS (15%) + Social Security Tax (1%)',
    socialSecurity: 'Social Security Fund (SSF 31% Contributory)',
    publicHolidays: 18,
    status: 'ACTIVE'
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    currencyCode: 'LKR',
    currencySymbol: 'Rs',
    currencyName: 'Sri Lankan Rupee',
    fxRateToUSD: 305.0,
    timezone: 'Asia/Colombo',
    utcOffset: 'UTC+05:30',
    language: 'Sinhala, Tamil, English',
    fiscalYear: 'April - March',
    taxScheme: 'APIT (6%-36%) + 18% VAT',
    socialSecurity: 'EPF (8%) + ETF (3%)',
    publicHolidays: 25,
    status: 'ACTIVE'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates (Dubai)',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'د.إ',
    currencyName: 'UAE Dirham',
    fxRateToUSD: 3.67,
    timezone: 'Asia/Dubai',
    utcOffset: 'UTC+04:00',
    language: 'Arabic (العربية), English',
    fiscalYear: 'January - December',
    taxScheme: 'Corporate Tax (9%) + 5% VAT (0% Personal Income Tax)',
    socialSecurity: 'GPSSA Pension Scheme (National Employees 20%)',
    publicHolidays: 14,
    status: 'ACTIVE'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia (Riyadh)',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    currencySymbol: '﷼',
    currencyName: 'Saudi Riyal',
    fxRateToUSD: 3.75,
    timezone: 'Asia/Riyadh',
    utcOffset: 'UTC+03:00',
    language: 'Arabic (العربية), English',
    fiscalYear: 'January - December',
    taxScheme: '15% VAT (0% Personal Income Tax)',
    socialSecurity: 'GOSI (Social Insurance 21.5%)',
    publicHolidays: 10,
    status: 'ACTIVE'
  },
  {
    code: 'QA',
    name: 'Qatar',
    flag: '🇶🇦',
    currencyCode: 'QAR',
    currencySymbol: 'ر.ق',
    currencyName: 'Qatari Riyal',
    fxRateToUSD: 3.64,
    timezone: 'Asia/Qatar',
    utcOffset: 'UTC+03:00',
    language: 'Arabic, English',
    fiscalYear: 'January - December',
    taxScheme: '10% Corporate Tax (0% Personal Income Tax)',
    socialSecurity: 'GRSIA (National Pension Scheme 15%)',
    publicHolidays: 11,
    status: 'ACTIVE'
  },
  {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    currencyCode: 'OMR',
    currencySymbol: 'ر.ع.',
    currencyName: 'Omani Rial',
    fxRateToUSD: 0.385,
    timezone: 'Asia/Muscat',
    utcOffset: 'UTC+04:00',
    language: 'Arabic, English',
    fiscalYear: 'January - December',
    taxScheme: '5% VAT (0% Personal Income Tax)',
    socialSecurity: 'PASI (Social Insurance 18.5%)',
    publicHolidays: 12,
    status: 'ACTIVE'
  },
  {
    code: 'JP',
    name: 'Japan (Tokyo)',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    currencyName: 'Japanese Yen',
    fxRateToUSD: 155.0,
    timezone: 'Asia/Tokyo',
    utcOffset: 'UTC+09:00',
    language: 'Japanese (日本語), English',
    fiscalYear: 'April - March',
    taxScheme: 'Income Tax (5%-45%) + 10% Consumption Tax',
    socialSecurity: 'Shakai Hoken (Health, Pension & Care ~15%)',
    publicHolidays: 16,
    status: 'ACTIVE'
  },
  {
    code: 'KR',
    name: 'South Korea (Seoul)',
    flag: '🇰🇷',
    currencyCode: 'KRW',
    currencySymbol: '₩',
    currencyName: 'South Korean Won',
    fxRateToUSD: 1380.0,
    timezone: 'Asia/Seoul',
    utcOffset: 'UTC+09:00',
    language: 'Korean (한국어), English',
    fiscalYear: 'January - December',
    taxScheme: 'Income Tax (6%-45%) + 10% VAT',
    socialSecurity: 'Four Major National Insurances (~9%)',
    publicHolidays: 15,
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
    name: 'United Kingdom (London)',
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
    name: 'Germany / European Union',
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
    name: 'United States & Global HQ',
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
  },
  {
    code: 'CA',
    name: 'Canada (Toronto)',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    currencyName: 'Canadian Dollar',
    fxRateToUSD: 1.37,
    timezone: 'America/Toronto',
    utcOffset: 'UTC-05:00',
    language: 'English, French',
    fiscalYear: 'January - December',
    taxScheme: 'Federal + Provincial (15%-33%) + GST/HST',
    socialSecurity: 'Canada Pension Plan (CPP 5.95%) + EI',
    publicHolidays: 12,
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
  // DYNAMIC STATE STORES (Clean, zero hardcoded dummy personas / fake data)
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

  // Active Multi-Currency Display Setting (USD, INR, KHR, BDT, NPR, THB, VND, AED)
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = useState('USD');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');

  // Live World Clock State (updates every second)
  const [currentUtcTime, setCurrentUtcTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    dateFormat: 'YYYY-MM-DD',
    timezone: 'UTC+05:30',
    currency: 'USD',
    language: 'English',
    defaultWorkingDays: 'Monday - Saturday',
    mfaEnforced: true,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 60,
    maxFileUploadMB: 25,
    gpsRetentionDays: 90
  });

  // Mobile App Version State
  const [appVersionState, setAppVersionState] = useState({
    currentVersion: '3.4.0',
    minSupportedVersion: '3.2.0',
    recommendedVersion: '3.4.0',
    forceUpdateEnabled: false,
    releaseNotes: 'Performance optimizations for offline DCR sync, enhanced battery savings during GPS tracking, and instant chemist search.'
  });

  // Maintenance Mode States
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    globalMaintenance: false,
    reportingModuleMaintenance: false,
    ordersModuleMaintenance: false,
    mobileAppMaintenance: false
  });

  // Emergency Platform Kill-Switch State
  const [emergencyLockActive, setEmergencyLockActive] = useState(false);

  // Sub-tab selectors
  const [companySubTab, setCompanySubTab] = useState('all'); // all | active | suspended | trial | admins
  const [userSubTab, setUserSubTab] = useState('all'); // all | admins | managers | mrs
  const [supportSubTab, setSupportSubTab] = useState('open'); // open | resolved
  const [jurisdictionSubTab, setJurisdictionSubTab] = useState('countries'); // countries | timezones | currencies

  // Modals & Action States
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isImpersonateOpen, setIsImpersonateOpen] = useState(false);
  const [impersonateTarget, setImpersonateTarget] = useState(null);
  const [impersonateReason, setImpersonateReason] = useState('');
  const [activeImpersonation, setActiveImpersonation] = useState(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // Form state
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    code: '',
    country: 'India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    fiscalYear: 'April - March',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    plan: 'PRO',
    userLimit: 250,
    mrLimit: 200,
    storageLimitGB: 50
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
  // DYNAMICALLY COMPUTED METRICS
  // --------------------------------------------------------------------------
  const filteredCompanies = companies.filter(c => {
    if (selectedCountryFilter !== 'ALL' && c.country !== selectedCountryFilter) return false;
    return true;
  });

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;
  const trialCompanies = companies.filter(c => c.status === 'TRIAL').length;
  const suspendedCompanies = companies.filter(c => c.status === 'SUSPENDED').length;

  const totalUsers = companies.reduce((acc, c) => acc + (Number(c.usersCount) || 0), 0);
  const activeUsers = companies.filter(c => c.status === 'ACTIVE').reduce((acc, c) => acc + (Number(c.usersCount) || 0), 0);
  const totalMRs = companies.reduce((acc, c) => acc + (Number(c.mrsCount) || 0), 0);
  const totalManagers = companies.reduce((acc, c) => acc + (Number(c.managersCount) || 0), 0);
  const totalAdmins = admins.length;
  const totalDoctors = companies.reduce((acc, c) => acc + (Number(c.doctorsCount) || 0), 0);
  const totalVisits = companies.reduce((acc, c) => acc + (Number(c.visitsCount) || 0), 0);
  const totalReports = companies.reduce((acc, c) => acc + (Number(c.reportsCount) || 0), 0);

  const totalStorageGB = companies.reduce((acc, c) => acc + (Number(c.storageUsedGB) || 0), 0);
  const totalStorageTB = (totalStorageGB / 1024).toFixed(2);
  const totalCallsToday = companies.reduce((acc, c) => acc + (Number(c.apiCallsToday) || 0), 0);

  const totalMRR_USD = companies.reduce((acc, c) => {
    if (c.status !== 'ACTIVE') return acc;
    const planRate = c.plan === 'ENTERPRISE' ? 4200 : c.plan === 'PRO' ? 2800 : 950;
    return acc + (Number(c.customMRR) || planRate);
  }, 0);
  const totalARR_USD = totalMRR_USD * 12;

  // Currency Converter Calculation
  const convertCurrency = (amountInUSD, targetCurrency) => {
    const targetMeta = sovereignRegistry.find(c => c.currencyCode.includes(targetCurrency));
    const rate = targetMeta ? targetMeta.fxRateToUSD : 1;
    return {
      converted: (amountInUSD * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      symbol: targetMeta ? targetMeta.currencySymbol : '$'
    };
  };

  const getConvertedFxResult = () => {
    const fromMeta = sovereignRegistry.find(c => c.currencyCode.includes(fxConverter.fromCurrency));
    const toMeta = sovereignRegistry.find(c => c.currencyCode.includes(fxConverter.toCurrency));
    const fromRate = fromMeta ? fromMeta.fxRateToUSD : 1;
    const toRate = toMeta ? toMeta.fxRateToUSD : 1;
    // Base amount in USD
    const inUSD = fxConverter.amount / fromRate;
    const result = (inUSD * toRate).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return {
      result,
      symbol: toMeta ? toMeta.currencySymbol : '$'
    };
  };

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
  // ACTION HANDLERS
  // --------------------------------------------------------------------------
  const logAudit = (action, detail, entity = 'Platform') => {
    const act = {
      id: `ACT-${Date.now().toString().slice(-5)}`,
      title: action,
      detail: detail,
      entity: entity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Super Admin (HQ)',
      severity: 'info'
    };
    setRecentActivities(prev => [act, ...prev]);
  };

  const handleCreateCompany = (e) => {
    e.preventDefault();
    if (!newCompanyForm.name.trim() || !newCompanyForm.adminEmail.trim()) {
      alert('Please provide company name and company admin email.');
      return;
    }

    const tenantIndex = companies.length + 1;
    const tenantId = `TENANT-${String(tenantIndex).padStart(3, '0')}`;
    const companyId = `CMP-${String(tenantIndex).padStart(3, '0')}`;
    const adminId = `ADM-${String(admins.length + 1).padStart(2, '0')}`;
    const planRate = newCompanyForm.plan === 'ENTERPRISE' ? 4200 : newCompanyForm.plan === 'PRO' ? 2800 : 950;

    const matchedCountry = sovereignRegistry.find(c => c.name === newCompanyForm.country);
    const countryFlag = matchedCountry ? matchedCountry.flag : '🌐';

    const createdCompany = {
      id: companyId,
      code: newCompanyForm.code || `CMP-${Date.now().toString().slice(-4)}`,
      name: newCompanyForm.name,
      country: newCompanyForm.country,
      flag: countryFlag,
      currency: newCompanyForm.currency,
      timezone: newCompanyForm.timezone,
      fiscalYear: newCompanyForm.fiscalYear,
      adminName: newCompanyForm.adminName || 'Organization Admin',
      adminEmail: newCompanyForm.adminEmail,
      plan: newCompanyForm.plan,
      status: 'ACTIVE',
      usersCount: 1,
      mrsCount: 0,
      managersCount: 0,
      gmsCount: 0,
      doctorsCount: 0,
      visitsCount: 0,
      reportsCount: 0,
      storageUsedGB: 1,
      storageLimitGB: newCompanyForm.storageLimitGB || 50,
      userLimit: newCompanyForm.userLimit || 250,
      mrLimit: newCompanyForm.mrLimit || 200,
      apiCallsToday: 0,
      tenantId: tenantId,
      mrr: `$${planRate.toLocaleString()}`,
      customMRR: planRate,
      createdDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      modules: {
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
        aiStudio: newCompanyForm.plan === 'ENTERPRISE'
      }
    };

    const createdAdmin = {
      id: adminId,
      name: newCompanyForm.adminName || 'Organization Admin',
      email: newCompanyForm.adminEmail,
      company: newCompanyForm.name,
      companyId: companyId,
      country: newCompanyForm.country,
      role: 'COMPANY ADMIN',
      mfaEnabled: false,
      status: 'ACTIVE',
      lastLogin: 'Never logged in',
      ipAddress: 'Pending First Login'
    };

    const createdPlatformUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: newCompanyForm.adminName || 'Organization Admin',
      email: newCompanyForm.adminEmail,
      mobile: newCompanyForm.adminPhone || '--',
      company: newCompanyForm.name,
      role: 'COMPANY ADMIN',
      status: 'ACTIVE',
      lastLogin: 'Never logged in'
    };

    setCompanies(prev => [createdCompany, ...prev]);
    setAdmins(prev => [createdAdmin, ...prev]);
    setPlatformUsers(prev => [createdPlatformUser, ...prev]);
    logAudit('Create Company', `Provisioned tenant ${tenantId} for ${createdCompany.name} in ${createdCompany.country} (${createdCompany.timezone}, ${createdCompany.currency})`, createdCompany.name);

    setIsCreateCompanyOpen(false);
    setNewCompanyForm({
      name: '',
      code: '',
      country: 'India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      fiscalYear: 'April - March',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      plan: 'PRO',
      userLimit: 250,
      mrLimit: 200,
      storageLimitGB: 50
    });
  };

  const handleCountrySelectionChange = (countryName) => {
    const matched = sovereignRegistry.find(c => c.name === countryName);
    if (matched) {
      setNewCompanyForm(prev => ({
        ...prev,
        country: matched.name,
        currency: matched.currencyCode,
        timezone: matched.timezone,
        fiscalYear: matched.fiscalYear
      }));
    }
  };

  const handleToggleModule = (companyId, moduleKey) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === companyId) {
          const updated = {
            ...c,
            modules: {
              ...c.modules,
              [moduleKey]: !c.modules[moduleKey]
            }
          };
          logAudit('Module Access Toggled', `Toggled ${moduleKey} to ${updated.modules[moduleKey] ? 'ENABLED' : 'DISABLED'} for ${c.name}`, c.name);
          return updated;
        }
        return c;
      })
    );
  };

  const toggleCompanyStatus = (id) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          logAudit('Company Status Changed', `Changed status of ${c.name} to ${nextStatus}`, c.name);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleStartImpersonation = (e) => {
    e.preventDefault();
    if (!impersonateReason.trim()) {
      alert('A valid reason is required for strict security and auditing compliance.');
      return;
    }
    const record = {
      target: impersonateTarget,
      reason: impersonateReason,
      startedAt: new Date().toLocaleTimeString()
    };
    setActiveImpersonation(record);
    logAudit('Admin Impersonation Started', `Super Admin impersonated ${impersonateTarget.name} (${impersonateTarget.company}). Reason: ${impersonateReason}`, impersonateTarget.company);
    setIsImpersonateOpen(false);
    setImpersonateReason('');
  };

  const handleEndImpersonation = () => {
    if (activeImpersonation) {
      logAudit('Admin Impersonation Ended', `Ended session as ${activeImpersonation.target.name}`, activeImpersonation.target.company);
      setActiveImpersonation(null);
    }
  };

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;
    const ann = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title: newAnnouncement.title,
      type: newAnnouncement.type,
      target: newAnnouncement.target,
      content: newAnnouncement.content,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAnnouncements(prev => [ann, ...prev]);
    logAudit('Published Announcement', `Published broadcast: "${newAnnouncement.title}" to target ${newAnnouncement.target}`);
    setIsAnnouncementModalOpen(false);
    setNewAnnouncement({ title: '', type: 'MAINTENANCE', target: 'ALL', content: '' });
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
      assignedTo: 'Super Admin HQ',
      createdAt: new Date().toLocaleDateString()
    };
    setSupportTickets(prev => [tick, ...prev]);
    logAudit('Support Ticket Created', `Created support ticket #${tick.id}: ${tick.subject}`, tick.companyName);
    setIsNewTicketOpen(false);
    setNewTicket({ companyName: '', category: 'TECHNICAL', priority: 'HIGH', subject: '', description: '' });
  };

  // --------------------------------------------------------------------------
  // RENDER SECTIONS
  // --------------------------------------------------------------------------
  return (
    <div className="superadmin-suite-container">
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
            <Globe2 size={14} />
            <span>ORVEXA GLOBAL TECH // MULTI-COUNTRY &bull; MULTI-TIMEZONE &bull; MULTI-CURRENCY</span>
          </div>
          <h1 className="saas-header-title">Super Admin Platform Command Center</h1>
          <p className="saas-header-desc">
            Global SaaS Sovereign Governance &bull; 8+ Active Jurisdictions &bull; Automatic Local Time &amp; Tax Compliance &bull; Multi-Currency FX Engine
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
          1. PLATFORM DASHBOARD (19 PLATFORM METRICS)
          ===================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="tab-pane-content">
          <div className="arch-reminder-card" style={{ borderLeftColor: '#f59e0b', background: 'linear-gradient(90deg, #fffbeb 0%, #f8fafc 100%)' }}>
            <ShieldCheck size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <span className="arch-card-title" style={{ color: '#92400e', fontSize: '0.86rem' }}>Multi-Country Global Platform Active: </span>
              <span className="arch-card-desc" style={{ color: '#78350f' }}>
                Complete visibility across {totalCompanies} tenants, {totalUsers.toLocaleString()} users, {totalAdmins} admins, {totalDoctors.toLocaleString()} doctors, {totalVisits.toLocaleString()} visits, and sovereign currency engines.
              </span>
            </div>
          </div>

          {/* 6 Executive KPI Metric Cards */}
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
                {totalMRs.toLocaleString()} MRs &bull; {totalManagers.toLocaleString()} Managers
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Doctors &amp; Field Visits</span>
                <Activity size={18} className="kpi-icon cyan" />
              </div>
              <div className="kpi-number text-blue">{totalDoctors.toLocaleString()}</div>
              <div className="kpi-sub">
                <strong>{totalVisits.toLocaleString()} Field Calls Completed</strong>
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Reports &amp; Analytics</span>
                <FileText size={18} className="kpi-icon purple" />
              </div>
              <div className="kpi-number" style={{ color: '#7c3aed' }}>{totalReports.toLocaleString()}</div>
              <div className="kpi-sub">
                <strong>DCRs, Chemist Orders &amp; Claims</strong>
              </div>
            </div>

            <div className="saas-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Storage &amp; Telemetry</span>
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
                          <th>Currency</th>
                          <th>Plan</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
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
                                  <div className="comp-code-sub">{comp.code} &bull; {comp.tenantId}</div>
                                </div>
                              </div>
                            </td>
                            <td><strong>{comp.country}</strong></td>
                            <td><span className="tenant-id-pill">{comp.timezone}</span></td>
                            <td><strong>{comp.currency}</strong></td>
                            <td><span className={`plan-pill plan-${comp.plan.toLowerCase()}`}>{comp.plan}</span></td>
                            <td>
                              <span className={`status-tag status-${comp.status.toLowerCase()}`}>
                                {comp.status === 'ACTIVE' ? '🟢 Active' : '🟡 Suspended'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button type="button" className="action-pill-btn primary" onClick={() => setActiveTab('features')}>
                                Modules
                              </button>
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
                    <p className="section-desc">Immutable log of company registration, admin auth, and feature changes</p>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveTab('security')}>
                    Audit Log &rarr;
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentActivities.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', background: '#f8fafc', borderRadius: '8px' }}>
                      No recent activity logs. New tenant events will appear here in real-time.
                    </div>
                  ) : (
                    recentActivities.slice(0, 6).map((act) => (
                      <div key={act.id} style={{ padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{act.title}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{act.detail}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f172a' }}>{act.actor}</div>
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{act.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: World Clock & Live FX Rates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Live Multi-Timezone World Clock */}
              <div className="card-section">
                <div className="card-header-flex">
                  <h3 className="card-header-title">
                    <Clock size={18} color="#d97706" /> Live Regional World Clocks
                  </h3>
                  <button type="button" className="action-pill-btn" onClick={() => setActiveTab('jurisdictions')}>
                    All Clocks &rarr;
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {sovereignRegistry.slice(0, 4).map((reg) => (
                    <div key={reg.code} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                        <span>{reg.flag} {reg.name}</span>
                        <span style={{ fontWeight: '700' }}>{reg.utcOffset}</span>
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '2px', fontFamily: 'monospace' }}>
                        {formatTimezoneClock(reg.timezone)}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>{formatTimezoneDate(reg.timezone)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Microservices Health */}
              <div className="card-section">
                <div className="card-header-flex">
                  <h3 className="card-header-title">
                    <Server size={18} color="#059669" /> Global Cloud Health
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                    🟢 8 Regions Active
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['API Gateway (Global)', 'PostgreSQL Multi-Tenant', 'Azure Geo-Blob Vault', 'Auth Service (JWT/OIDC)', 'GPS & Satellite Gateway', 'SendGrid Global Ingress'].map((svc) => (
                    <div key={svc} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{svc}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669' }}>● 99.99%</span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>&lt; 40ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. COMPANY / TENANT MANAGEMENT (FULL LIFECYCLE & ACTIONS)
          ===================================================================== */}
      {activeTab === 'companies' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${companySubTab === 'all' ? 'active' : ''}`} onClick={() => setCompanySubTab('all')}>
              All Companies ({totalCompanies})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'active' ? 'active' : ''}`} onClick={() => setCompanySubTab('active')}>
              Active ({activeCompanies})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'suspended' ? 'active' : ''}`} onClick={() => setCompanySubTab('suspended')}>
              Suspended ({suspendedCompanies})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'trial' ? 'active' : ''}`} onClick={() => setCompanySubTab('trial')}>
              Trials ({trialCompanies})
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
                placeholder="Search company by name, code, jurisdiction, admin..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
            <button type="button" className="primary-action-btn" onClick={() => setIsCreateCompanyOpen(true)}>
              <Plus size={16} />
              <span>Create New Pharma Company</span>
            </button>
          </div>

          {companySubTab === 'admins' ? (
            <div className="saas-table-container">
              {admins.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <UserCog size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Company Admins Registered</div>
                  <p style={{ fontSize: '0.8rem', margin: '4px auto 12px' }}>Company admins are created when provisioning a new tenant.</p>
                </div>
              ) : (
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Admin Name &amp; Email</th>
                      <th>Assigned Pharma Company</th>
                      <th>Country</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th style={{ textAlign: 'right' }}>Security Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((adm) => (
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
                        <td>{adm.country}</td>
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
                              onClick={() => {
                                alert(`Password reset instructions triggered for ${adm.email}`);
                                logAudit('Password Reset', `Super Admin triggered password reset for ${adm.email}`, adm.company);
                              }}
                            >
                              Reset Pwd
                            </button>
                            <button
                              type="button"
                              className="action-pill-btn red"
                              onClick={() => {
                                alert(`Force logout executed for ${adm.name}`);
                                logAudit('Force Logout', `Forced session termination for ${adm.name}`, adm.company);
                              }}
                            >
                              Force Logout
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="saas-table-container">
              {companies.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <Building2 size={40} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>No Companies Enrolled Yet</div>
                  <p style={{ fontSize: '0.84rem', maxWidth: '420px', margin: '6px auto 16px', color: '#64748b' }}>
                    Click "Create New Pharma Company" to onboard an enterprise organization.
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
                      <th>Users / Limits</th>
                      <th>Storage</th>
                      <th>MRR</th>
                      <th>Status</th>
                      <th>Expiry</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
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
                                <div className="comp-code-sub">{company.code} &bull; {company.tenantId} &bull; {company.country}</div>
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
                              <span>{company.mrsCount} / {company.mrLimit} MRs</span>
                            </div>
                          </td>
                          <td><strong>{company.storageUsedGB} GB</strong> / {company.storageLimitGB} GB</td>
                          <td><strong>{company.mrr}</strong></td>
                          <td>
                            <span className={`status-tag status-${company.status.toLowerCase()}`}>
                              {company.status === 'ACTIVE' ? '🟢 Active' : company.status === 'TRIAL' ? '🟣 Trial' : '🟡 Suspended'}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{company.renewalDate}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cluster">
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                onClick={() => {
                                  const adminMatch = admins.find(a => a.company === company.name) || { name: company.adminName, email: company.adminEmail, company: company.name };
                                  setImpersonateTarget(adminMatch);
                                  setIsImpersonateOpen(true);
                                }}
                                title="Login as company admin (Audited)"
                              >
                                <Eye size={12} /> Impersonate
                              </button>
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
                                onClick={() => setActiveTab('features')}
                              >
                                Modules
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
          3. MULTI-COUNTRY, MULTI-TIMEZONE & MULTI-CURRENCY JURISDICTIONS HUB
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

          {/* VIEW A: SOVEREIGN COUNTRIES & REGULATORY REGISTRY */}
          {jurisdictionSubTab === 'countries' && (
            <div>
              <div className="country-header-banner" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 className="section-title">Supported Sovereign Jurisdictions &amp; Regulatory Frameworks</h2>
                    <p className="section-desc">
                      Super Admin configures sovereign statutory requirements: local currency symbols, IANA timezone standards, fiscal year cycles, tax withholding (GST/VAT/TDS), and mandatory social security contributions (NSSF, SSF, SSO, EPFO, ESIC).
                    </p>
                  </div>
                  <button
                    type="button"
                    className="primary-action-btn"
                    onClick={() => alert('New Sovereign Jurisdiction Wizard: Setup statutory fiscal year, tax withholding rates, and social security formulas.')}
                  >
                    <Plus size={16} /> Add Sovereign Country
                  </button>
                </div>
              </div>

              <div className="countries-grid">
                {sovereignRegistry.map((c) => {
                  const countryCompaniesCount = companies.filter(comp => comp.country.toLowerCase() === c.name.toLowerCase()).length;
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
                          <span className="detail-val">{c.timezone} ({c.utcOffset})</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-key">Fiscal Year Cycle:</span>
                          <span className="detail-val">{c.fiscalYear}</span>
                        </div>
                        <div className="detail-item highlight-tax">
                          <span className="detail-key">Tax / Withholding:</span>
                          <span className="detail-val">{c.taxScheme}</span>
                        </div>
                        <div className="detail-item highlight-nssf">
                          <span className="detail-key">Social Security / Statutory:</span>
                          <span className="detail-val">{c.socialSecurity}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-key">Public Holiday Calendar:</span>
                          <span className="detail-val">{c.publicHolidays} Statutory Holidays</span>
                        </div>
                      </div>

                      <div className="country-card-footer">
                        <button
                          type="button"
                          className="btn-configure-country"
                          onClick={() => alert(`Configuring statutory compliance rules for ${c.name}`)}
                        >
                          <Settings size={14} />
                          <span>Configure Compliance Rules</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW B: MULTI-TIMEZONE LIVE ENGINE */}
          {jurisdictionSubTab === 'timezones' && (
            <div>
              <div className="card-section" style={{ marginBottom: '18px' }}>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Timer size={20} color="#d97706" /> Global Live Regional Clocks &amp; Timezone Telemetry
                </h2>
                <p className="section-desc">
                  Synchronizes field representative shift schedules, DCR cutoff deadlines, automated snapshot triggers, and midnight attendance rolls across global timezones.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  {sovereignRegistry.map((reg) => (
                    <div key={reg.code} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem' }}>{reg.flag}</span>
                        <span className="tenant-id-pill">{reg.utcOffset}</span>
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
            </div>
          )}

          {/* VIEW C: MULTI-CURRENCY & FX EXCHANGE ENGINE */}
          {jurisdictionSubTab === 'currencies' && (
            <div>
              <div className="saas-overview-layout">
                {/* FX Rates Table */}
                <div className="card-section">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Multi-Currency Exchange Rate Engine (FX Matrix)</h2>
                      <p className="section-desc">Real-time benchmark FX rates relative to Base Platform Currency (USD).</p>
                    </div>
                    <button type="button" className="action-pill-btn" onClick={() => alert('FX rates refreshed from global interbank exchange feed.')}>
                      <RefreshCw size={13} /> Refresh FX Rates
                    </button>
                  </div>

                  <div className="saas-table-container">
                    <table className="saas-data-table">
                      <thead>
                        <tr>
                          <th>Jurisdiction &amp; Currency</th>
                          <th>ISO Code</th>
                          <th>Symbol</th>
                          <th>Exchange Rate (per 1 USD)</th>
                          <th>Base Equivalent ($1,000 USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sovereignRegistry.map((c) => (
                          <tr key={c.code}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{c.flag}</span>
                                <strong>{c.currencyName}</strong>
                              </div>
                            </td>
                            <td><span className="tenant-id-pill">{c.currencyCode}</span></td>
                            <td><strong style={{ fontSize: '0.95rem' }}>{c.currencySymbol}</strong></td>
                            <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                              1 USD = {c.fxRateToUSD.toLocaleString()} {c.currencyCode}
                            </td>
                            <td style={{ fontFamily: 'monospace', color: '#059669', fontWeight: '700' }}>
                              {c.currencySymbol} {(1000 * c.fxRateToUSD).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive Currency Converter Tool */}
                <div className="card-section">
                  <h3 className="card-header-title">
                    <ArrowRightLeft size={18} color="#2563eb" /> Live Currency Converter Tool
                  </h3>
                  <p className="section-desc">Instantly calculate subscription pricing and invoice totals across sovereign currencies.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={fxConverter.amount}
                        onChange={(e) => setFxConverter({ ...fxConverter, amount: Number(e.target.value) })}
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>From Currency</label>
                        <select
                          className="form-control"
                          value={fxConverter.fromCurrency}
                          onChange={(e) => setFxConverter({ ...fxConverter, fromCurrency: e.target.value })}
                        >
                          {sovereignRegistry.map((reg) => (
                            <option key={`from-${reg.code}`} value={reg.currencyCode.split(' ')[0]}>
                              {reg.flag} {reg.currencyCode} ({reg.currencySymbol} - {reg.name})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>To Currency</label>
                        <select
                          className="form-control"
                          value={fxConverter.toCurrency}
                          onChange={(e) => setFxConverter({ ...fxConverter, toCurrency: e.target.value })}
                        >
                          {sovereignRegistry.map((reg) => (
                            <option key={`to-${reg.code}`} value={reg.currencyCode.split(' ')[0]}>
                              {reg.flag} {reg.currencyCode} ({reg.currencySymbol} - {reg.name})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Converted Result Box */}
                    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>
                        Converted Sovereign Amount
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e3a8a', margin: '4px 0' }}>
                        {getConvertedFxResult().symbol} {getConvertedFxResult().result}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>
                        {fxConverter.amount.toLocaleString()} {fxConverter.fromCurrency} = {getConvertedFxResult().result} {fxConverter.toCurrency}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          4. PLATFORM USERS (CROSS-TENANT SEARCH & GOVERNANCE)
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
            <button type="button" className={`sub-nav-pill ${userSubTab === 'managers' ? 'active' : ''}`} onClick={() => setUserSubTab('managers')}>
              Managers ({platformUsers.filter(u => u.role.includes('MANAGER')).length})
            </button>
            <button type="button" className={`sub-nav-pill ${userSubTab === 'mrs' ? 'active' : ''}`} onClick={() => setUserSubTab('mrs')}>
              MRs ({platformUsers.filter(u => u.role === 'MR').length})
            </button>
          </div>

          <div className="pane-action-bar">
            <div className="search-box-large">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search across all tenants: Employee Name, Mobile, Email, Company, Role..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
          </div>

          <div className="saas-table-container">
            {platformUsers.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <Users size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Cross-Platform Users Found</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 12px' }}>Users enrolled across company tenants will be indexed here.</p>
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
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {platformUsers
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
                        <td><span className="status-tag status-active">{user.status}</span></td>
                        <td>{user.lastLogin}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="actions-cluster">
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => {
                                alert(`Reset account credentials initiated for ${user.email}`);
                                logAudit('Account Reset', `Reset account for ${user.email}`, user.company);
                              }}
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              className="action-pill-btn red"
                              onClick={() => {
                                alert(`Force logout sent for ${user.name}`);
                                logAudit('Force Logout', `Forced logout for ${user.name}`, user.company);
                              }}
                            >
                              Force Logout
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
      )}

      {/* =====================================================================
          5. SUBSCRIPTIONS & BILLING MANAGEMENT
          ===================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="tab-pane-content">
          <div className="subscription-plans-grid">
            <div className="plan-card">
              <div className="plan-tier-name">FREE TRIAL</div>
              <div className="plan-price">$0 <span>/ 30 days</span></div>
              <p className="plan-limits-desc">For pilot testing with new pharmaceutical brands</p>
              <ul className="plan-perks-list">
                <li>Up to 25 Field Reps</li>
                <li>Core Daily Call Reports (DCR)</li>
                <li>Chemist &amp; Doctor Registry</li>
                <li>5 GB Storage Quota</li>
              </ul>
              <div className="plan-sub-count">{trialCompanies} Companies in Trial</div>
            </div>

            <div className="plan-card">
              <div className="plan-tier-name">BASIC TIER</div>
              <div className="plan-price">$950 <span>/ month</span></div>
              <p className="plan-limits-desc">For regional pharma distribution agencies</p>
              <ul className="plan-perks-list">
                <li>Up to 250 Field MRs</li>
                <li>Core MR Reporting &amp; DCR</li>
                <li>Chemist Order Booking (POB)</li>
                <li>50 GB Storage Limit</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'BASIC').length} Enrolled</div>
            </div>

            <div className="plan-card featured-plan">
              <div className="featured-ribbon">POPULAR</div>
              <div className="plan-tier-name">PRO ENTERPRISE</div>
              <div className="plan-price">$2,800 <span>/ month</span></div>
              <p className="plan-limits-desc">For pharmaceutical manufacturing corporations</p>
              <ul className="plan-perks-list">
                <li>Up to 1,500 Field Reps</li>
                <li>Full DCR + Tour Plans (MTP)</li>
                <li>TA / DA Smart Expense Claims</li>
                <li>Statutory Payroll &amp; NSSF</li>
                <li>250 GB Storage Limit</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'PRO').length} Enrolled</div>
            </div>

            <div className="plan-card">
              <div className="plan-tier-name">GLOBAL PLATINUM</div>
              <div className="plan-price">$4,200 <span>/ month</span></div>
              <p className="plan-limits-desc">For multinational pharmaceutical conglomerates</p>
              <ul className="plan-perks-list">
                <li>Unlimited Field Reps &amp; GMs</li>
                <li>Multi-Country Schema Isolation</li>
                <li>AI Studio &amp; Prescription OCR</li>
                <li>Dedicated Storage Geo-Vault</li>
              </ul>
              <div className="plan-sub-count">{companies.filter(c => c.plan === 'ENTERPRISE').length} Enrolled</div>
            </div>
          </div>

          <div className="section-title-sm" style={{ marginTop: '28px' }}>
            <span>Enterprise Subscription Invoices &amp; Billing History</span>
          </div>

          <div className="saas-table-container">
            {invoices.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                <CreditCard size={32} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                <span>No subscription invoices generated yet. Invoices generate on cycle renewal dates.</span>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Company Tenant</th>
                    <th>Tier</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Renewal Date</th>
                    <th style={{ textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td><code>{inv.id}</code></td>
                      <td><strong>{inv.company}</strong></td>
                      <td>{inv.tier}</td>
                      <td><strong>{inv.amount}</strong></td>
                      <td><span className="status-badge-green">{inv.status}</span></td>
                      <td>{inv.date}</td>
                      <td style={{ textAlign: 'right' }}><button className="action-pill-btn">PDF</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. FEATURES & CANARY FEATURE FLAGS
          ===================================================================== */}
      {activeTab === 'features' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Feature Modules &amp; Canary Feature Flags</h2>
              <p className="section-desc">
                Super Admin controls per-tenant module accessibility and gradual percentage rollouts across the platform.
              </p>
            </div>
          </div>

          {/* Feature Flags Section */}
          <div className="card-section" style={{ marginBottom: '22px' }}>
            <h3 className="card-header-title">
              <Sliders size={18} color="#7c3aed" /> Active Feature Flags &amp; Canary Deployments
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
                        const newPct = flag.rolloutPercent >= 100 ? 0 : flag.rolloutPercent + 25;
                        setFeatureFlags(prev => prev.map(f => f.id === flag.id ? { ...f, rolloutPercent: newPct } : f));
                        logAudit('Feature Flag Updated', `Updated ${flag.name} rollout to ${newPct}%`);
                      }}
                    >
                      Adjust % Rollout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Company Matrix */}
          <div className="section-title-sm"><span>Per-Company Module Access Matrix</span></div>
          <div className="saas-table-container">
            {companies.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <Layers size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Companies Enrolled</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 12px' }}>Provision a company to configure module licensing toggles.</p>
              </div>
            ) : (
              <table className="saas-data-table matrix-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>MR Reporting</th>
                    <th>DCR</th>
                    <th>Attendance</th>
                    <th>Doctors</th>
                    <th>Chemist</th>
                    <th>Expense</th>
                    <th>GPS</th>
                    <th>Orders</th>
                    <th>AI Studio</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'mrReporting')}>
                          {c.modules.mrReporting ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'dcr')}>
                          {c.modules.dcr ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'attendance')}>
                          {c.modules.attendance ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'doctorManagement')}>
                          {c.modules.doctorManagement ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'chemistManagement')}>
                          {c.modules.chemistManagement ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'expense')}>
                          {c.modules.expense ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'gpsTracking')}>
                          {c.modules.gpsTracking ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'orderManagement')}>
                          {c.modules.orderManagement ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td>
                        <button type="button" className="toggle-icon-btn" onClick={() => handleToggleModule(c.id, 'aiStudio')}>
                          {c.modules.aiStudio ? <span className="ai-active-pill">AI Active</span> : <span className="ai-inactive-pill">Off</span>}
                        </button>
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
          7. GLOBAL PLATFORM CONFIGURATION & SETTINGS
          ===================================================================== */}
      {activeTab === 'settings' && (
        <div className="tab-pane-content">
          <div className="card-section">
            <h2 className="section-title">Platform-Wide Default Settings &amp; Policies</h2>
            <p className="section-desc">Configure default date formats, timeouts, security thresholds, and file upload quotas.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('✅ Global configuration saved successfully.');
                logAudit('Global Settings Saved', 'Super Admin updated platform default policies.');
              }}
              style={{ marginTop: '18px' }}
            >
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Default Date Format</label>
                  <select
                    className="form-control"
                    value={globalSettings.dateFormat}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, dateFormat: e.target.value })}
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (UK / India)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Default Timezone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={globalSettings.timezone}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, timezone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Default Base Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    value={globalSettings.currency}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, currency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={globalSettings.sessionTimeoutMinutes}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, sessionTimeoutMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Max File Upload Limit (MB)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={globalSettings.maxFileUploadMB}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, maxFileUploadMB: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>GPS History Retention (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={globalSettings.gpsRetentionDays}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, gpsRetentionDays: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Save Global Policies
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          8. GLOBAL ROLE TEMPLATES
          ===================================================================== */}
      {activeTab === 'roles' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Platform Role Hierarchy &amp; Permission Templates</h2>
              <p className="section-desc">Super Admin defines standard roles across all organizations.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { role: 'SUPER ADMIN', level: 'Tier-0', desc: 'Platform Owner: Full governance, schema creation, pricing, and master overrides.' },
              { role: 'PLATFORM ADMIN', level: 'Tier-1', desc: 'SaaS Operator: Tenant monitoring, support ticket triage, and infrastructure metrics.' },
              { role: 'COMPANY ADMIN', level: 'Tenant Root', desc: 'Organization Owner: Manages employees, doctors, routes, and company configurations.' },
              { role: 'REGIONAL MANAGER', level: 'Managerial', desc: 'Supervises Area Managers and MRs, approves tour plans (MTP) and expense claims.' },
              { role: 'AREA MANAGER', level: 'Supervisory', desc: 'Field supervisor: Joint doctor visits, chemist audit, and territory coverage review.' },
              { role: 'MEDICAL REPRESENTATIVE (MR)', level: 'Field Executive', desc: 'Field execution: Doctor call reporting (DCR), chemist order booking (POB), and GPS attendance.' }
            ].map((r) => (
              <div key={r.role} className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{r.role}</strong>
                  <span className="status-badge-green">{r.level}</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '8px 0 12px' }}>{r.desc}</p>
                <button type="button" className="action-pill-btn" onClick={() => alert(`Configuring permission matrix for ${r.role}`)}>
                  Configure Permissions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          9. INTEGRATIONS & API MANAGEMENT
          ===================================================================== */}
      {activeTab === 'integrations' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Enterprise Integrations &amp; API Management</h2>
              <p className="section-desc">Manage API credentials, webhooks, rate limits, and third-party SaaS connectors.</p>
            </div>
            <button type="button" className="primary-action-btn" onClick={() => alert('New API Key generated.')}>
              <Plus size={16} /> Generate API Key
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { name: 'Google Maps / Mapbox Geocoding', category: 'MAPS', status: 'CONNECTED', desc: 'GPS Telemetry & Route Optimization' },
              { name: 'SendGrid Enterprise SMTP', category: 'EMAIL', status: 'CONNECTED', desc: 'System alerts, invoices, and password resets' },
              { name: 'Twilio SMS Gateway', category: 'SMS', status: 'CONNECTED', desc: '2FA OTP verification and SMS notices' },
              { name: 'WhatsApp Cloud API', category: 'MESSAGING', status: 'READY', desc: 'Automated order booking receipts to chemists' },
              { name: 'SAP / ERP Connector', category: 'ERP', status: 'READY', desc: 'Bi-directional sync of product catalog & invoices' },
              { name: 'Azure Cloud Blob Storage', category: 'STORAGE', status: 'CONNECTED', desc: 'Multi-tenant encrypted document repository' }
            ].map((integ) => (
              <div key={integ.name} className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{integ.name}</strong>
                  <span className="status-badge-green">{integ.status}</span>
                </div>
                <span className="plan-pill plan-basic" style={{ marginTop: '4px', display: 'inline-block' }}>{integ.category}</span>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '8px 0 12px' }}>{integ.desc}</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" className="action-pill-btn" onClick={() => alert(`Connection test passed for ${integ.name}!`)}>
                    Test Connection
                  </button>
                  <button type="button" className="action-pill-btn primary" onClick={() => alert(`Configuring credentials for ${integ.name}`)}>
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          10. MOBILE APP VERSION MANAGEMENT
          ===================================================================== */}
      {activeTab === 'app-management' && (
        <div className="tab-pane-content">
          <div className="card-section">
            <h2 className="section-title">Mobile App Version Control &amp; Force Update Engine</h2>
            <p className="section-desc">Manage Android/iOS field app builds, minimum required versions, and release notes.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('✅ Mobile version deployment configuration updated.');
                logAudit('Mobile App Version Updated', `Updated app build parameters: Version ${appVersionState.currentVersion}`);
              }}
              style={{ marginTop: '18px' }}
            >
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Current Released Build</label>
                  <input
                    type="text"
                    className="form-control"
                    value={appVersionState.currentVersion}
                    onChange={(e) => setAppVersionState({ ...appVersionState, currentVersion: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Supported Build</label>
                  <input
                    type="text"
                    className="form-control"
                    value={appVersionState.minSupportedVersion}
                    onChange={(e) => setAppVersionState({ ...appVersionState, minSupportedVersion: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Recommended Build</label>
                  <input
                    type="text"
                    className="form-control"
                    value={appVersionState.recommendedVersion}
                    onChange={(e) => setAppVersionState({ ...appVersionState, recommendedVersion: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Release Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={appVersionState.releaseNotes}
                  onChange={(e) => setAppVersionState({ ...appVersionState, releaseNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                <input
                  type="checkbox"
                  id="forceUpdateCheck"
                  checked={appVersionState.forceUpdateEnabled}
                  onChange={(e) => setAppVersionState({ ...appVersionState, forceUpdateEnabled: e.target.checked })}
                />
                <label htmlFor="forceUpdateCheck" style={{ fontSize: '0.84rem', fontWeight: '700', color: '#991b1b', cursor: 'pointer' }}>
                  Enable Force Update (Blocks field reps on builds older than minimum supported version)
                </label>
              </div>

              <button type="submit" className="btn btn-primary">
                Publish Version Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          11. CROSS-COMPANY ANALYTICS
          ===================================================================== */}
      {activeTab === 'analytics' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Cross-Tenant Usage Analytics &amp; Telemetry</h2>
              <p className="section-desc">Aggregate activity, DAU/MAU, API throughput, and storage utilization without breaching tenant privacy.</p>
            </div>
          </div>

          <div className="metrics-grid-4">
            <div className="stat-card">
              <div className="kpi-label">Daily Active Users (DAU)</div>
              <div className="kpi-number text-blue">{Math.round(activeUsers * 0.72).toLocaleString()}</div>
              <div className="kpi-sub">72% Active Daily Engagement</div>
            </div>
            <div className="stat-card">
              <div className="kpi-label">Monthly Active Users (MAU)</div>
              <div className="kpi-number text-purple">{activeUsers.toLocaleString()}</div>
              <div className="kpi-sub">Total Active Headcount</div>
            </div>
            <div className="stat-card">
              <div className="kpi-label">Daily Ingress API Calls</div>
              <div className="kpi-number text-green">{totalCallsToday.toLocaleString()}</div>
              <div className="kpi-sub">Average Latency: 38ms</div>
            </div>
            <div className="stat-card">
              <div className="kpi-label">Report Generation Velocity</div>
              <div className="kpi-number text-amber">{totalReports.toLocaleString()}</div>
              <div className="kpi-sub">All tenants aggregated</div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          12. SECURITY & AUDIT LOGS
          ===================================================================== */}
      {activeTab === 'security' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Immutable Platform Governance Audit Trail</h2>
              <p className="section-desc">Real-time recording of security events, administrative logins, and provisioning changes.</p>
            </div>
          </div>

          <div className="saas-table-container">
            {recentActivities.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                <ShieldCheck size={32} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                <span>No audit trail logs recorded yet. Security events will appear here.</span>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Target Entity</th>
                    <th>Performed By</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((act) => (
                    <tr key={act.id}>
                      <td>{act.time}</td>
                      <td><strong>{act.title}</strong></td>
                      <td>{act.detail}</td>
                      <td><span className="tenant-id-pill">{act.entity}</span></td>
                      <td>{act.actor}</td>
                      <td><span className="status-badge-green">SUCCESS</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          13. SYSTEM HEALTH & MAINTENANCE MODE
          ===================================================================== */}
      {activeTab === 'system-health' && (
        <div className="tab-pane-content">
          <div className="card-section" style={{ marginBottom: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={20} color="#2563eb" /> Granular Maintenance Mode Controls
            </h2>
            <p className="section-desc">Take specific modules or the entire platform offline for scheduled updates.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Global Web Application</strong>
                  <input
                    type="checkbox"
                    checked={maintenanceConfig.globalMaintenance}
                    onChange={(e) => {
                      setMaintenanceConfig({ ...maintenanceConfig, globalMaintenance: e.target.checked });
                      logAudit('Maintenance Mode Changed', `Global maintenance set to ${e.target.checked}`);
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Displays maintenance landing banner to all portal users</p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Mobile Sync Engine</strong>
                  <input
                    type="checkbox"
                    checked={maintenanceConfig.mobileAppMaintenance}
                    onChange={(e) => {
                      setMaintenanceConfig({ ...maintenanceConfig, mobileAppMaintenance: e.target.checked });
                      logAudit('Maintenance Mode Changed', `Mobile sync maintenance set to ${e.target.checked}`);
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Pauses background mobile batch synchronization</p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>DCR Reporting Ingress</strong>
                  <input
                    type="checkbox"
                    checked={maintenanceConfig.reportingModuleMaintenance}
                    onChange={(e) => {
                      setMaintenanceConfig({ ...maintenanceConfig, reportingModuleMaintenance: e.target.checked });
                      logAudit('Maintenance Mode Changed', `Reporting ingress maintenance set to ${e.target.checked}`);
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Queues submitted daily call reports safely in Redis</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          14. SUPPORT DESK / TICKETS
          ===================================================================== */}
      {activeTab === 'support' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${supportSubTab === 'open' ? 'active' : ''}`} onClick={() => setSupportSubTab('open')}>
              Open Tickets ({supportTickets.filter(t => t.status === 'OPEN').length})
            </button>
            <button type="button" className={`sub-nav-pill ${supportSubTab === 'resolved' ? 'active' : ''}`} onClick={() => setSupportSubTab('resolved')}>
              Resolved ({supportTickets.filter(t => t.status === 'RESOLVED').length})
            </button>
          </div>

          <div className="pane-action-bar">
            <button type="button" className="primary-action-btn" onClick={() => setIsNewTicketOpen(true)}>
              <Plus size={16} />
              <span>Create Support Ticket</span>
            </button>
          </div>

          <div className="saas-table-container">
            {supportTickets.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <LifeBuoy size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Support Tickets Active</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 12px' }}>Support requests raised by tenant admins will be routed here.</p>
                <button type="button" className="btn btn-primary" onClick={() => setIsNewTicketOpen(true)}>
                  <Plus size={15} /> Create Ticket
                </button>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Pharma Company</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets
                    .filter(t => supportSubTab === 'all' || t.status.toLowerCase() === supportSubTab)
                    .map((t) => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td><strong>{t.companyName}</strong></td>
                        <td>{t.subject}</td>
                        <td><span className="plan-pill plan-basic">{t.category}</span></td>
                        <td>
                          <span className={t.priority === 'HIGH' ? 'alert-badge-red' : 'alert-badge-amber'}>
                            {t.priority}
                          </span>
                        </td>
                        <td><span className="status-tag status-active">{t.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => {
                              setSupportTickets(prev => prev.map(item => item.id === t.id ? { ...item, status: item.status === 'OPEN' ? 'RESOLVED' : 'OPEN' } : item));
                            }}
                          >
                            {t.status === 'OPEN' ? 'Mark Resolved' : 'Reopen'}
                          </button>
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
          15. ANNOUNCEMENTS & BROADCAST NOTIFICATIONS
          ===================================================================== */}
      {activeTab === 'communications' && (
        <div className="tab-pane-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">Global Platform Announcements &amp; Broadcasts</h2>
              <p className="section-desc">Broadcast maintenance advisories, release notes, or security notices to all or targeted tenants.</p>
            </div>
            <button type="button" className="primary-action-btn" onClick={() => setIsAnnouncementModalOpen(true)}>
              <Megaphone size={16} /> Publish Announcement
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Megaphone size={34} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                <span>No active global announcements. Click "Publish Announcement" to broadcast.</span>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="card-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="status-tag status-trial">{ann.type}</span>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{ann.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Target: <strong>{ann.target}</strong> &bull; {ann.publishedAt}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '8px' }}>{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          16. EMERGENCY & DISASTER KILL-SWITCH
          ===================================================================== */}
      {activeTab === 'emergency' && (
        <div className="tab-pane-content">
          <div className="emergency-panel">
            <div className="emergency-header">
              <AlertOctagon size={28} />
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Platform Emergency Disaster &amp; Kill-Switch Controls</h2>
                <p style={{ fontSize: '0.8rem' }}>Strictly restricted to Tier-0 Master Super Administrator. All actions are irreversibly audited.</p>
              </div>
            </div>

            <div className="emergency-grid">
              <div className="emergency-card">
                <div>
                  <strong style={{ color: '#991b1b', fontSize: '0.9rem' }}>Global Login Lockout</strong>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Instantly rejects authentication across all company web and mobile apps during security threats.</p>
                </div>
                <button
                  type="button"
                  className="btn-emergency"
                  onClick={() => {
                    const confirm = window.confirm('🚨 DANGER: Are you sure you want to toggle Global Platform Login Lockout?');
                    if (confirm) {
                      setEmergencyLockActive(!emergencyLockActive);
                      logAudit('EMERGENCY KILL-SWITCH', `Global login lockout set to ${!emergencyLockActive}`);
                    }
                  }}
                >
                  {emergencyLockActive ? 'Deactivate Emergency Lock' : 'Activate Global Lockout'}
                </button>
              </div>

              <div className="emergency-card">
                <div>
                  <strong style={{ color: '#991b1b', fontSize: '0.9rem' }}>Force Logout All Platform Users</strong>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Invalidates all active JWT tokens and Redis sessions across all tenants.</p>
                </div>
                <button
                  type="button"
                  className="btn-emergency"
                  onClick={() => {
                    const confirm = window.confirm('🚨 Are you sure you want to terminate all active sessions globally?');
                    if (confirm) {
                      alert('✅ All active platform user sessions have been terminated.');
                      logAudit('EMERGENCY SESSION PURGE', 'Purged all active JWT sessions across the platform.');
                    }
                  }}
                >
                  Terminate All Sessions
                </button>
              </div>

              <div className="emergency-card">
                <div>
                  <strong style={{ color: '#991b1b', fontSize: '0.9rem' }}>Revoke All External API Keys</strong>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Immediately revokes all ERP, CRM, and webhook authorization secrets.</p>
                </div>
                <button
                  type="button"
                  className="btn-emergency"
                  onClick={() => {
                    const confirm = window.confirm('🚨 Are you sure you want to revoke all external API tokens?');
                    if (confirm) {
                      alert('✅ All external API keys have been revoked.');
                      logAudit('EMERGENCY API REVOCATION', 'Revoked all external integration API keys.');
                    }
                  }}
                >
                  Revoke API Keys
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          17. MY ACCOUNT & MASTER SECURITY
          ===================================================================== */}
      {activeTab === 'my-account' && (
        <div className="tab-pane-content">
          <div className="card-section">
            <h2 className="section-title">Master Super Administrator Account</h2>
            <p className="section-desc">Tier-0 root administrator settings, 2FA MFA enforcement, and hardware key credentials.</p>

            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
              <div className="form-group">
                <label>Administrator Name</label>
                <input type="text" className="form-control" defaultValue="Super Administrator" readOnly />
              </div>
              <div className="form-group">
                <label>Administrator Security Level</label>
                <input type="text" className="form-control" defaultValue="TIER-0 GLOBAL ROOT" readOnly />
              </div>
              <div className="form-group">
                <label>Two-Factor Authentication (2FA)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="status-badge-green"><Lock size={12} /> 2FA TOTP Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CREATE COMPANY MODAL (WITH SOVEREIGN JURISDICTION AUTOFILL)
          ===================================================================== */}
      {isCreateCompanyOpen && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={24} color="#2563eb" />
                <div>
                  <h3>Create New Pharmaceutical Enterprise Company</h3>
                  <p>Provisions an isolated tenant with automatic sovereign currency, IANA timezone, and statutory tax defaults.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreateCompanyOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateCompany} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Pharma Cambodia Ltd"
                    value={newCompanyForm.name}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Company Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RYL-KH"
                    value={newCompanyForm.code}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, code: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Country Jurisdiction (Autofills Settings)</label>
                  <select
                    value={newCompanyForm.country}
                    onChange={(e) => handleCountrySelectionChange(e.target.value)}
                    className="form-control"
                  >
                    {sovereignRegistry.map(reg => (
                      <option key={reg.code} value={reg.name}>{reg.flag} {reg.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Default Currency</label>
                  <input
                    type="text"
                    value={newCompanyForm.currency}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, currency: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Timezone (IANA Standard)</label>
                  <input
                    type="text"
                    value={newCompanyForm.timezone}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, timezone: e.target.value })}
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
                    placeholder="Enter Admin Full Name"
                    value={newCompanyForm.adminName}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, adminName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Initial Company Admin Corporate Email</label>
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
                  <label>Subscription Tier</label>
                  <select
                    value={newCompanyForm.plan}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, plan: e.target.value })}
                    className="form-control"
                  >
                    <option value="BASIC">Basic ($950/mo)</option>
                    <option value="PRO">Pro Enterprise ($2,800/mo)</option>
                    <option value="ENTERPRISE">Global Platinum ($4,200/mo)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>User Limit</label>
                  <input
                    type="number"
                    value={newCompanyForm.userLimit}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, userLimit: Number(e.target.value) })}
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
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateCompanyOpen(false)}>Cancel</button>
                <button type="submit" className="submit-create-btn">
                  <CheckCircle2 size={16} /> <span>Provision Isolated Tenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          IMPERSONATION MODAL (AUDITED)
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
                ⚠️ <strong>Audited Action:</strong> All interactions conducted during this impersonation session are logged with your Super Admin identity and timestamps.
              </div>

              <div className="form-group">
                <label>Reason for Impersonation (Required for Audit Compliance)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Support ticket #1042: Debugging MTP routing approval"
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
          PUBLISH ANNOUNCEMENT MODAL
          ===================================================================== */}
      {isAnnouncementModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <Megaphone size={22} color="#2563eb" />
                <div>
                  <h3>Publish Global Announcement</h3>
                  <p>Broadcast notices to tenants across web and mobile consoles.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsAnnouncementModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSendAnnouncement} className="modal-form-body">
              <div className="form-group">
                <label>Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Maintenance Notice"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  >
                    <option value="MAINTENANCE">Maintenance Notice</option>
                    <option value="FEATURE">New Feature Release</option>
                    <option value="SECURITY">Security Advisory</option>
                    <option value="POLICY">Policy / Terms Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    className="form-control"
                    value={newAnnouncement.target}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
                  >
                    <option value="ALL">All Users Across Platform</option>
                    <option value="COMPANY_ADMINS">Company Admins Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Announcement Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write announcement details..."
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
          NEW TICKET MODAL
          ===================================================================== */}
      {isNewTicketOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <LifeBuoy size={22} color="#2563eb" />
                <div>
                  <h3>Create Support Ticket</h3>
                  <p>Log a support request for a company organization.</p>
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

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  >
                    <option value="TECHNICAL">Technical Issue</option>
                    <option value="BILLING">Billing &amp; Subscription</option>
                    <option value="DATA">Data / Schema Export</option>
                    <option value="TRAINING">Training &amp; Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
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
                  placeholder="Details of the support request..."
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
