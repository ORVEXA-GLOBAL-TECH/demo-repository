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
  CheckSquare,
  CalendarPlus,
  UserPlus,
  Info,
  PlayCircle,
  StopCircle,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Award
} from 'lucide-react';

import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  toggleTenantStatus,
  restoreTenant,
  resetTenantAdminPassword,
  assignTenantAdmin,
  extendTenantSubscription,
  impersonateTenant,
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
  toggleUserStatus,
  resetUserPassword,
  forceLogoutUser,
  toggleUserLock,
  updateUserPermissions,
  getUserActivity,
  getUserLoginHistory,
  getSovereignCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  upgradeDowngradePlan,
  renewSubscription,
  configureSubscriptionDates,
  processSubscriptionExpiries,
  getAuditLogs,
  createAuditLog,
  getSystemAlerts,
  createSystemAlert,
  deleteSystemAlert
} from '../services/api';

import { DEFAULT_SOVEREIGN_REGISTRY } from '../data/sovereignRegistry';

// Standard Tier Rates Calculator Helper
const getTierMonthlyRate = (tier, customRate = 0) => {
  const norm = (tier || 'STARTER').toUpperCase();
  if (norm === 'FREE_TRIAL' || norm === 'TRIAL') return 0;
  if (norm === 'CUSTOM') return Number(customRate) || 0;
  if (norm === 'ENTERPRISE') return 2500;
  if (norm === 'PROFESSIONAL' || norm === 'PRO') return 1000;
  return 100; // STARTER / BASIC
};

// Helper to format ISO datetime to local input string (YYYY-MM-DDTHH:mm)
const toLocalInputDateTime = (dateObj) => {
  const d = dateObj ? new Date(dateObj) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 16);
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().slice(0, 16);
};

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
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sovereignRegistry, setSovereignRegistry] = useState(DEFAULT_SOVEREIGN_REGISTRY);

  // --------------------------------------------------------------------------
  // PLAN MANAGEMENT & ADVANCED SUBSCRIPTION STATES
  // --------------------------------------------------------------------------
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isDeletePlanOpen, setIsDeletePlanOpen] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [newPlanForm, setNewPlanForm] = useState({
    code: '',
    name: '',
    description: '',
    tier: 'STARTER',
    priceMonthly: 100,
    priceYearly: 1000,
    trialDays: 14,
    gracePeriodDays: 7,
    featuresText: 'Unlimited Field Users & Admins\nCore MR Daily Call Reports\nChemist Order Booking (POB)\nProduct Catalog & Samples',
    isActive: true,
    isCustom: false
  });
  const [editingPlanForm, setEditingPlanForm] = useState({
    id: '',
    code: '',
    name: '',
    description: '',
    tier: 'STARTER',
    priceMonthly: 100,
    priceYearly: 1000,
    trialDays: 14,
    gracePeriodDays: 7,
    featuresText: '',
    isActive: true,
    isCustom: false
  });

  // Upgrade & Downgrade Modal State
  const [isUpgradeDowngradeOpen, setIsUpgradeDowngradeOpen] = useState(false);
  const [upgradeTargetCompany, setUpgradeTargetCompany] = useState(null);
  const [upgradeForm, setUpgradeForm] = useState({
    targetTier: 'PROFESSIONAL',
    actionType: 'UPGRADE',
    customRate: 0,
    isCustomPricing: false,
    billingInterval: 'Monthly',
    reason: 'Super Admin tier upgrade'
  });

  // Renewal Modal State
  const [isRenewSubOpen, setIsRenewSubOpen] = useState(false);
  const [renewTargetCompany, setRenewTargetCompany] = useState(null);
  const [renewForm, setRenewForm] = useState({
    durationMonths: 12,
    additionalDays: 0,
    newExpiryDate: '',
    amountBilled: 0,
    notes: 'Super Admin manual renewal'
  });

  // Dates & Grace Period Configuration Modal State
  const [isConfigDatesOpen, setIsConfigDatesOpen] = useState(false);
  const [configTargetCompany, setConfigTargetCompany] = useState(null);
  const [configDatesForm, setConfigDatesForm] = useState({
    subscriptionStartAt: '',
    subscriptionEndAt: '',
    trialStartAt: '',
    trialEndAt: '',
    gracePeriodDays: 7,
    autoSuspendAfterGrace: true,
    status: 'Active',
    planTier: 'STARTER'
  });

  // Batch Auto-Suspend Expiry Processing Modal State
  const [isProcessExpiriesOpen, setIsProcessExpiriesOpen] = useState(false);
  const [processExpiriesResult, setProcessExpiriesResult] = useState({
    loading: false,
    message: '',
    suspendedCount: 0,
    suspendedCompanies: []
  });

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
      const [tenantsRes, usersRes, countriesRes, subsRes, alertsRes, auditRes, plansRes] = await Promise.allSettled([
        getTenants(),
        getPlatformUsers(),
        getSovereignCountries(),
        getSubscriptions(),
        getSystemAlerts(),
        getAuditLogs(30),
        getPlans()
      ]);

      if (plansRes.status === 'fulfilled' && Array.isArray(plansRes.value)) {
        setPlans(plansRes.value);
      }

      if (tenantsRes.status === 'fulfilled' && Array.isArray(tenantsRes.value)) {
        const mappedCompanies = tenantsRes.value.map(t => {
          const matchedCountry = sovereignRegistry.find(c => c.code === t.country_code) || DEFAULT_SOVEREIGN_REGISTRY[0];
          const isTrial = t.plan === 'FREE_TRIAL' || t.plan === 'TRIAL' || t.status === 'TRIAL' || t.status === 'Trial';
          const isCustom = t.plan === 'CUSTOM' || t.is_custom_pricing;
          const planRate = getTierMonthlyRate(t.plan, t.custom_rate || t.monthly_rate);

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
            plan: (t.plan || 'STARTER').toUpperCase(),
            status: (t.status || 'ACTIVE').toUpperCase(),
            usersCount: t.user_count || 1,
            mrsCount: t.mr_count || 0,
            adminEmail: t.contact_email,
            adminName: t.contact_email?.split('@')[0] || 'Admin',
            storageUsedGB: 1,
            storageLimitGB: t.max_storage_gb || 50,
            userLimit: t.max_mrs || 250,
            mrLimit: t.max_mrs || 200,
            mrr: isTrial ? '$0 (Free Trial)' : `$${(t.monthly_rate || planRate).toLocaleString()}`,
            customMRR: isTrial ? 0 : (t.monthly_rate || planRate),
            isCustomPricing: isCustom,
            customRate: t.custom_rate || 0,
            trialStartAt: t.trial_start_at,
            trialEndAt: t.trial_end_at,
            subscriptionStartAt: t.subscription_start_at,
            subscriptionEndAt: t.subscription_end_at,
            gracePeriodDays: t.grace_period_days !== undefined ? t.grace_period_days : 7,
            autoSuspendAfterGrace: t.auto_suspend_after_grace !== false,
            lastRenewedAt: t.last_renewed_at,
            renewalCount: t.renewal_count || 0,
            renewalDate: t.subscription_end_at ? new Date(t.subscription_end_at).toISOString().split('T')[0] : (t.trial_end_at ? new Date(t.trial_end_at).toISOString().split('T')[0] : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
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
          isLocked: Boolean(u.is_locked || u.status?.toUpperCase() === 'LOCKED'),
          lockReason: u.lock_reason || '',
          permissions: typeof u.permissions === 'object' && u.permissions ? u.permissions : {
            manage_users: true,
            manage_products: true,
            manage_orders: true,
            manage_doctors: true,
            manage_dcr: true,
            view_analytics: true,
            export_data: true,
            manage_settings: true
          },
          territory: u.territory || 'Global HQ',
          countryCode: u.country_code || 'IN',
          lastLogin: u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never logged in'
        }));
        setPlatformUsers(mappedUsers);
        setAdmins(mappedUsers.filter(u => u.role.includes('ADMIN')));
      }

      if (countriesRes.status === 'fulfilled' && Array.isArray(countriesRes.value) && countriesRes.value.length > 0) {
        const merged = DEFAULT_SOVEREIGN_REGISTRY.map(dc => {
          const dbMatch = countriesRes.value.find(c => c.code === dc.code);
          if (dbMatch) {
            return {
              ...dc,
              name: dbMatch.name || dc.name,
              currencyCode: dbMatch.currency_code || dbMatch.currencyCode || dc.currencyCode,
              currencySymbol: dbMatch.currency_symbol || dbMatch.currencySymbol || dc.currencySymbol,
              timezone: dbMatch.primary_timezone || dbMatch.timezone || dc.timezone,
              taxScheme: dbMatch.tax_scheme || dbMatch.taxScheme || dc.taxScheme,
              fxRateToUSD: Number(dbMatch.fx_rate_to_usd !== undefined ? dbMatch.fx_rate_to_usd : (dbMatch.fxRateToUSD !== undefined ? dbMatch.fxRateToUSD : dc.fxRateToUSD)) || dc.fxRateToUSD || 1.0,
              socialSecurity: dbMatch.social_security || dbMatch.socialSecurity || dc.socialSecurity,
              fiscalYear: dbMatch.fiscal_year || dbMatch.fiscalYear || dc.fiscalYear
            };
          }
          return dc;
        });

        const extraCustomCountries = countriesRes.value
          .filter(c => !DEFAULT_SOVEREIGN_REGISTRY.some(dc => dc.code === c.code))
          .map(c => ({
            code: c.code,
            name: c.name,
            flag: c.flag || '🌐',
            currencyCode: c.currency_code || c.currencyCode || 'USD',
            currencySymbol: c.currency_symbol || c.currencySymbol || '$',
            currencyName: c.currency_name || `${c.name} Currency`,
            fxRateToUSD: Number(c.fx_rate_to_usd || c.fxRateToUSD) || 1.0,
            timezone: c.primary_timezone || c.timezone || 'UTC',
            utcOffset: c.utc_offset || 'UTC',
            taxScheme: c.tax_scheme || c.taxScheme || 'Standard Tax',
            socialSecurity: c.social_security || 'Statutory Scheme',
            fiscalYear: c.fiscal_year || 'January - December',
            status: 'ACTIVE'
          }));

        setSovereignRegistry([...merged, ...extraCustomCountries]);
      }

      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value)) {
        const mappedInvoices = subsRes.value.map(s => ({
          id: `INV-${s.id.slice(0, 6).toUpperCase()}`,
          company: s.tenant_name || s.tenants_companies?.name || 'Pharma Tenant',
          tier: s.plan_tier || 'STARTER',
          amount: `$${Number(s.amount_billed || 100).toLocaleString()}`,
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
  const [companySubTab, setCompanySubTab] = useState('all'); // all | active | trial | suspended | deactivated | admins
  const [userSubTab, setUserSubTab] = useState('admins'); // admins | company-totals
  const [supportSubTab, setSupportSubTab] = useState('open'); // open | resolved
  const [jurisdictionSubTab, setJurisdictionSubTab] = useState('countries'); // countries | timezones | currencies

  // --------------------------------------------------------------------------
  // MODALS STATE (TENANTS, USERS, COUNTRIES, SUBSCRIPTIONS, PASSWORDS)
  // --------------------------------------------------------------------------
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isViewCompanyOpen, setIsViewCompanyOpen] = useState(false);
  const [viewingCompany, setViewingCompany] = useState(null);
  const [isDeleteCompanyOpen, setIsDeleteCompanyOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState(null);

  const [isAssignAdminOpen, setIsAssignAdminOpen] = useState(false);
  const [assignAdminTarget, setAssignAdminTarget] = useState(null);
  const [assignAdminForm, setAssignAdminForm] = useState({ adminName: '', adminEmail: '', adminPassword: '' });

  const [isExtendSubscriptionOpen, setIsExtendSubscriptionOpen] = useState(false);
  const [extendSubTarget, setExtendSubTarget] = useState(null);
  const [extendDaysInput, setExtendDaysInput] = useState(30);
  const [extendReasonInput, setExtendReasonInput] = useState('');

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

  const [isLockUserOpen, setIsLockUserOpen] = useState(false);
  const [lockUserTarget, setLockUserTarget] = useState(null);
  const [lockReasonInput, setLockReasonInput] = useState('');

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [permissionsTarget, setPermissionsTarget] = useState(null);
  const [userPermissionsForm, setUserPermissionsForm] = useState({
    manage_users: true,
    manage_products: true,
    manage_orders: true,
    manage_doctors: true,
    manage_dcr: true,
    view_analytics: true,
    export_data: true,
    manage_settings: true
  });

  const [isUserActivityOpen, setIsUserActivityOpen] = useState(false);
  const [activityTargetUser, setActivityTargetUser] = useState(null);
  const [userActivitiesList, setUserActivitiesList] = useState([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);

  const [isUserLoginHistoryOpen, setIsUserLoginHistoryOpen] = useState(false);
  const [loginHistoryTargetUser, setLoginHistoryTargetUser] = useState(null);
  const [userLoginHistoryList, setUserLoginHistoryList] = useState([]);
  const [isLoginHistoryLoading, setIsLoginHistoryLoading] = useState(false);

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

  // Form states with precise Start & End Times
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
    plan: 'FREE_TRIAL',
    customRate: 0,
    startAt: toLocalInputDateTime(new Date()),
    endAt: toLocalInputDateTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
    billingCycle: 'Monthly'
  });

  const [editCompanyForm, setEditCompanyForm] = useState({
    name: '',
    legalName: '',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    plan: 'STARTER',
    customRate: 0,
    startAt: toLocalInputDateTime(new Date()),
    endAt: toLocalInputDateTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    contactEmail: '',
    contactPhone: '',
    billingCycle: 'Monthly',
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
    fxRateToUSD: 1.0,
    primaryTimezone: 'UTC',
    taxScheme: 'Standard VAT / PIT',
    socialSecurity: 'Statutory Scheme',
    fiscalYear: 'January - December'
  });

  const [editCountryForm, setEditCountryForm] = useState({
    name: '',
    currencyCode: '',
    currencySymbol: '',
    fxRateToUSD: 1.0,
    primaryTimezone: '',
    taxScheme: '',
    socialSecurity: '',
    fiscalYear: ''
  });

  const [subModalForm, setSubModalForm] = useState({
    planTier: 'STARTER',
    customRate: 0,
    amountBilled: 100,
    startAt: toLocalInputDateTime(new Date()),
    endAt: toLocalInputDateTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    billingInterval: 'Monthly'
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
  // DYNAMIC COMPUTED METRICS & LIVE REVENUE ENGINE
  // --------------------------------------------------------------------------
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;
  const trialCompanies = companies.filter(c => c.status === 'TRIAL' || c.plan === 'FREE_TRIAL' || c.plan === 'TRIAL').length;
  const suspendedCompanies = companies.filter(c => c.status === 'SUSPENDED').length;

  const totalUsers = platformUsers.length || companies.reduce((acc, c) => acc + (Number(c.usersCount) || 0), 0);
  const activeUsers = platformUsers.filter(u => u.status === 'ACTIVE').length || activeCompanies;
  const totalMRs = platformUsers.filter(u => u.role === 'MEDICAL_REP' || u.role === 'MR').length || companies.reduce((acc, c) => acc + (Number(c.mrsCount) || 0), 0);
  const totalAdmins = platformUsers.filter(u => u.role.includes('ADMIN')).length || admins.length;
  const totalStorageGB = companies.reduce((acc, c) => acc + (Number(c.storageUsedGB) || 0), 0);
  const totalStorageTB = (totalStorageGB / 1024).toFixed(2);

  // Live Real-Time Monthly & Annual Recurring Revenue
  const totalMRR_USD = companies.reduce((acc, c) => {
    if (c.status !== 'ACTIVE') return acc;
    if (c.plan === 'FREE_TRIAL' || c.plan === 'TRIAL') return acc;
    if (c.plan === 'CUSTOM' || c.isCustomPricing) {
      return acc + (Number(c.customRate) || Number(c.customMRR) || 0);
    }
    const planRate = c.plan === 'ENTERPRISE' ? 2500 : (c.plan === 'PROFESSIONAL' || c.plan === 'PRO') ? 1000 : 100;
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
  // 1. TENANT CRUD HANDLERS WITH START & END TIMESTAMPS
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

  // Helper function to calculate duration presets for Start/End times
  const applyDurationPreset = (setter, baseStart, daysToAdd) => {
    const start = baseStart ? new Date(baseStart) : new Date();
    const end = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    setter(prev => ({
      ...prev,
      startAt: toLocalInputDateTime(start),
      endAt: toLocalInputDateTime(end)
    }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyForm.name.trim() || !newCompanyForm.adminEmail.trim()) {
      showToast('Please provide both company name and admin email.', 'error');
      return;
    }

    try {
      const isTrial = newCompanyForm.plan === 'FREE_TRIAL' || newCompanyForm.plan === 'TRIAL';
      const isCustom = newCompanyForm.plan === 'CUSTOM';
      const calculatedRate = getTierMonthlyRate(newCompanyForm.plan, newCompanyForm.customRate);

      const payload = {
        name: newCompanyForm.name,
        legalName: newCompanyForm.legalName || newCompanyForm.name,
        code: newCompanyForm.code || newCompanyForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        countryCode: newCompanyForm.countryCode,
        currencyCode: newCompanyForm.currency,
        timezone: newCompanyForm.timezone,
        plan: newCompanyForm.plan,
        status: isTrial ? 'Trial' : 'Active',
        isCustomPricing: isCustom,
        customRate: isCustom ? calculatedRate : 0,
        monthlyRate: calculatedRate,
        trialStartAt: isTrial ? new Date(newCompanyForm.startAt).toISOString() : null,
        trialEndAt: isTrial ? new Date(newCompanyForm.endAt).toISOString() : null,
        subscriptionStartAt: !isTrial ? new Date(newCompanyForm.startAt).toISOString() : null,
        subscriptionEndAt: !isTrial ? new Date(newCompanyForm.endAt).toISOString() : null,
        billingCycle: newCompanyForm.billingCycle || 'Monthly',
        contactEmail: newCompanyForm.adminEmail,
        contactPhone: newCompanyForm.adminPhone,
        adminName: newCompanyForm.adminName
      };

      await createTenant(payload);
      showToast(`Tenant "${newCompanyForm.name}" successfully provisioned with ${newCompanyForm.plan} plan!`, 'success');
      logAudit('TENANT_PROVISIONED', `Created pharma company ${newCompanyForm.name} on ${newCompanyForm.plan} ($${calculatedRate}/mo)`, newCompanyForm.name);

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
        plan: 'FREE_TRIAL',
        customRate: 0,
        startAt: toLocalInputDateTime(new Date()),
        endAt: toLocalInputDateTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
        billingCycle: 'Monthly'
      });
    } catch (err) {
      showToast(`Failed to create tenant: ${err.message}`, 'error');
    }
  };

  const handleEditCompanyCountryChange = (countryName) => {
    const matched = sovereignRegistry.find(c => c.name === countryName || c.code === countryName);
    if (matched) {
      setEditCompanyForm(prev => ({
        ...prev,
        country: matched.name,
        countryCode: matched.code,
        currency: matched.currencyCode,
        timezone: matched.timezone
      }));
    }
  };

  const handleOpenEditCompany = (company) => {
    setEditingCompany(company);
    const isTrial = company.plan === 'FREE_TRIAL' || company.plan === 'TRIAL' || company.status === 'TRIAL';
    const isCustom = company.plan === 'CUSTOM' || company.isCustomPricing;
    const matchedCountry = sovereignRegistry.find(c => c.code === company.countryCode || c.name === company.country) || DEFAULT_SOVEREIGN_REGISTRY[0];

    setEditCompanyForm({
      name: company.name,
      legalName: company.legalName || company.name,
      country: matchedCountry.name,
      countryCode: company.countryCode || matchedCountry.code,
      currency: company.currency || matchedCountry.currencyCode,
      timezone: company.timezone || matchedCountry.timezone,
      plan: company.plan,
      isCustomPricing: isCustom,
      customRate: company.customRate || company.customMRR || 0,
      startAt: toLocalInputDateTime(company.trialStartAt || company.subscriptionStartAt || new Date()),
      endAt: toLocalInputDateTime(company.trialEndAt || company.subscriptionEndAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      contactEmail: company.adminEmail || '',
      contactPhone: '',
      billingCycle: 'Monthly',
      status: company.status
    });
    setIsEditCompanyOpen(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      const isTrial = editCompanyForm.plan === 'FREE_TRIAL' || editCompanyForm.plan === 'TRIAL';
      const isCustom = editCompanyForm.plan === 'CUSTOM';
      const calculatedRate = getTierMonthlyRate(editCompanyForm.plan, editCompanyForm.customRate);

      await updateTenant(editingCompany.id, {
        name: editCompanyForm.name,
        legalName: editCompanyForm.legalName,
        countryCode: editCompanyForm.countryCode,
        currencyCode: editCompanyForm.currency,
        timezone: editCompanyForm.timezone,
        plan: editCompanyForm.plan,
        status: isTrial ? 'Trial' : editCompanyForm.status,
        monthlyRate: calculatedRate,
        isCustomPricing: isCustom,
        customRate: isCustom ? calculatedRate : 0,
        trialStartAt: isTrial ? new Date(editCompanyForm.startAt).toISOString() : null,
        trialEndAt: isTrial ? new Date(editCompanyForm.endAt).toISOString() : null,
        subscriptionStartAt: !isTrial ? new Date(editCompanyForm.startAt).toISOString() : null,
        subscriptionEndAt: !isTrial ? new Date(editCompanyForm.endAt).toISOString() : null,
        contactEmail: editCompanyForm.contactEmail
      });

      showToast(`Company "${editCompanyForm.name}" updated with country ${editCompanyForm.country} (${editCompanyForm.currency}, ${editCompanyForm.timezone})!`, 'success');
      logAudit('TENANT_UPDATED', `Updated configuration for ${editCompanyForm.name} (${editCompanyForm.plan} - $${calculatedRate}/mo)`, editCompanyForm.name);
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

  const handleViewCompany = (company) => {
    setViewingCompany(company);
    setIsViewCompanyOpen(true);
  };

  const handleSetCompanyStatus = async (id, newStatus, name) => {
    try {
      await toggleTenantStatus(id, newStatus);
      showToast(`Company "${name}" status updated to ${newStatus}.`, 'success');
      logAudit('STATUS_CHANGED', `Updated status of ${name} to ${newStatus}`, name);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: newStatus.toUpperCase() } : c));
      if (viewingCompany && viewingCompany.id === id) {
        setViewingCompany(prev => ({ ...prev, status: newStatus.toUpperCase() }));
      }
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const handleRestoreCompany = async (id, name) => {
    try {
      await restoreTenant(id);
      showToast(`Company "${name}" successfully restored to ACTIVE!`, 'success');
      logAudit('TENANT_RESTORED', `Restored tenant ${name} to active`, name);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'ACTIVE' } : c));
      if (viewingCompany && viewingCompany.id === id) {
        setViewingCompany(prev => ({ ...prev, status: 'ACTIVE' }));
      }
    } catch (err) {
      showToast(`Restore failed: ${err.message}`, 'error');
    }
  };

  const handleOpenAssignAdmin = (company) => {
    setAssignAdminTarget(company);
    setAssignAdminForm({
      adminName: company.adminName || '',
      adminEmail: company.adminEmail || '',
      adminPassword: ''
    });
    setIsAssignAdminOpen(true);
  };

  const handleConfirmAssignAdmin = async (e) => {
    e.preventDefault();
    if (!assignAdminTarget || !assignAdminForm.adminEmail.trim()) {
      showToast('Admin email is required.', 'error');
      return;
    }

    try {
      await assignTenantAdmin(assignAdminTarget.id, assignAdminForm);
      showToast(`Company Admin assigned to ${assignAdminForm.adminEmail}!`, 'success');
      logAudit('ADMIN_ASSIGNED', `Assigned ${assignAdminForm.adminEmail} as admin for ${assignAdminTarget.name}`, assignAdminTarget.name);
      setIsAssignAdminOpen(false);
      setAssignAdminTarget(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to assign admin: ${err.message}`, 'error');
    }
  };

  const handleOpenExtendSubscription = (company) => {
    setExtendSubTarget(company);
    setExtendDaysInput(30);
    setExtendReasonInput('Super Admin extension');
    setIsExtendSubscriptionOpen(true);
  };

  const handleConfirmExtendSubscription = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!extendSubTarget) return;

    try {
      await extendTenantSubscription(extendSubTarget.id, {
        additionalDays: Number(extendDaysInput) || 30,
        reason: extendReasonInput || 'Super Admin extension'
      });
      showToast(`Subscription extended by ${extendDaysInput} days for ${extendSubTarget.name}!`, 'success');
      logAudit('SUBSCRIPTION_EXTENDED', `Extended subscription +${extendDaysInput} days for ${extendSubTarget.name}`, extendSubTarget.name);
      setIsExtendSubscriptionOpen(false);
      setExtendSubTarget(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to extend subscription: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // PLAN MANAGEMENT HANDLERS (Create, Edit, Delete)
  // --------------------------------------------------------------------------
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newPlanForm.code.trim() || !newPlanForm.name.trim()) {
      showToast('Plan code and name are required.', 'error');
      return;
    }

    try {
      const featuresArray = newPlanForm.featuresText
        ? newPlanForm.featuresText.split('\n').map(f => f.trim()).filter(Boolean)
        : [];

      await createPlan({
        code: newPlanForm.code,
        name: newPlanForm.name,
        description: newPlanForm.description,
        tier: newPlanForm.tier,
        priceMonthly: Number(newPlanForm.priceMonthly) || 0,
        priceYearly: Number(newPlanForm.priceYearly) || 0,
        trialDays: Number(newPlanForm.trialDays) || 14,
        gracePeriodDays: Number(newPlanForm.gracePeriodDays) || 7,
        features: featuresArray,
        isActive: newPlanForm.isActive,
        isCustom: newPlanForm.isCustom
      });

      showToast(`SaaS Plan "${newPlanForm.name}" created successfully!`, 'success');
      logAudit('PLAN_CREATED', `Created plan ${newPlanForm.name} (${newPlanForm.code})`, newPlanForm.name);
      setIsCreatePlanOpen(false);
      loadAllData();
      setNewPlanForm({
        code: '',
        name: '',
        description: '',
        tier: 'STARTER',
        priceMonthly: 100,
        priceYearly: 1000,
        trialDays: 14,
        gracePeriodDays: 7,
        featuresText: 'Unlimited Field Users & Admins\nCore MR Daily Call Reports\nChemist Order Booking (POB)\nProduct Catalog & Samples',
        isActive: true,
        isCustom: false
      });
    } catch (err) {
      showToast(`Failed to create plan: ${err.message}`, 'error');
    }
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlanForm({
      id: plan.id,
      code: plan.code,
      name: plan.name,
      description: plan.description || '',
      tier: plan.tier || 'STARTER',
      priceMonthly: plan.price_monthly !== undefined ? plan.price_monthly : (plan.priceMonthly || 0),
      priceYearly: plan.price_yearly !== undefined ? plan.price_yearly : (plan.priceYearly || 0),
      trialDays: plan.trial_days !== undefined ? plan.trial_days : (plan.trialDays || 14),
      gracePeriodDays: plan.grace_period_days !== undefined ? plan.grace_period_days : (plan.gracePeriodDays || 7),
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
      isActive: plan.is_active !== undefined ? plan.is_active : true,
      isCustom: plan.is_custom || false
    });
    setIsEditPlanOpen(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!editingPlanForm.name.trim()) {
      showToast('Plan name is required.', 'error');
      return;
    }

    try {
      const featuresArray = editingPlanForm.featuresText
        ? editingPlanForm.featuresText.split('\n').map(f => f.trim()).filter(Boolean)
        : [];

      await updatePlan(editingPlanForm.id || editingPlanForm.code, {
        name: editingPlanForm.name,
        description: editingPlanForm.description,
        tier: editingPlanForm.tier,
        priceMonthly: Number(editingPlanForm.priceMonthly) || 0,
        priceYearly: Number(editingPlanForm.priceYearly) || 0,
        trialDays: Number(editingPlanForm.trialDays) || 14,
        gracePeriodDays: Number(editingPlanForm.gracePeriodDays) || 7,
        features: featuresArray,
        isActive: editingPlanForm.isActive,
        isCustom: editingPlanForm.isCustom
      });

      showToast(`Plan "${editingPlanForm.name}" updated successfully!`, 'success');
      logAudit('PLAN_UPDATED', `Updated plan ${editingPlanForm.name}`, editingPlanForm.name);
      setIsEditPlanOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`Failed to update plan: ${err.message}`, 'error');
    }
  };

  const handleOpenDeletePlan = (plan) => {
    setDeletingPlan(plan);
    setIsDeletePlanOpen(true);
  };

  const handleConfirmDeletePlan = async () => {
    if (!deletingPlan) return;
    try {
      await deletePlan(deletingPlan.id || deletingPlan.code);
      showToast(`Plan "${deletingPlan.name}" removed successfully!`, 'success');
      logAudit('PLAN_DELETED', `Deleted plan ${deletingPlan.name}`, deletingPlan.name);
      setIsDeletePlanOpen(false);
      setDeletingPlan(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to delete plan: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // ADVANCED SUBSCRIPTION LIFECYCLE HANDLERS
  // --------------------------------------------------------------------------
  const handleOpenUpgradeDowngrade = (company, forcedAction = null) => {
    setUpgradeTargetCompany(company);
    const action = forcedAction || (company.plan === 'ENTERPRISE' ? 'DOWNGRADE' : 'UPGRADE');
    const target = action === 'UPGRADE'
      ? (company.plan === 'STARTER' || company.plan === 'FREE_TRIAL' ? 'PROFESSIONAL' : 'ENTERPRISE')
      : (company.plan === 'ENTERPRISE' ? 'PROFESSIONAL' : 'STARTER');

    setUpgradeForm({
      targetTier: target,
      actionType: action,
      customRate: company.customRate || company.customMRR || 0,
      isCustomPricing: company.isCustomPricing || false,
      billingInterval: 'Monthly',
      reason: `Super Admin ${action.toLowerCase()} for ${company.name}`
    });
    setIsUpgradeDowngradeOpen(true);
  };

  const handleConfirmUpgradeDowngrade = async (e) => {
    e.preventDefault();
    if (!upgradeTargetCompany) return;

    try {
      await upgradeDowngradePlan({
        tenantId: upgradeTargetCompany.id,
        newPlanTier: upgradeForm.targetTier,
        actionType: upgradeForm.actionType,
        customRate: upgradeForm.customRate,
        isCustomPricing: upgradeForm.isCustomPricing || upgradeForm.targetTier === 'CUSTOM',
        billingInterval: upgradeForm.billingInterval,
        reason: upgradeForm.reason
      });

      showToast(`Company ${upgradeTargetCompany.name} successfully ${upgradeForm.actionType.toLowerCase()}d to ${upgradeForm.targetTier}!`, 'success');
      logAudit(
        upgradeForm.actionType === 'UPGRADE' ? 'PLAN_UPGRADED' : 'PLAN_DOWNGRADED',
        `${upgradeForm.actionType}d ${upgradeTargetCompany.name} from ${upgradeTargetCompany.plan} to ${upgradeForm.targetTier}`,
        upgradeTargetCompany.name
      );
      setIsUpgradeDowngradeOpen(false);
      setUpgradeTargetCompany(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to modify tier: ${err.message}`, 'error');
    }
  };

  const handleOpenRenewSub = (company) => {
    setRenewTargetCompany(company);
    const currentRate = typeof company.mrr === 'string' && company.mrr.includes('$')
      ? Number(company.mrr.replace(/[^0-9.]/g, '')) || 100
      : (company.customMRR || 100);

    setRenewForm({
      durationMonths: 12,
      additionalDays: 0,
      newExpiryDate: '',
      amountBilled: currentRate * 12,
      notes: 'Super Admin annual renewal'
    });
    setIsRenewSubOpen(true);
  };

  const handleConfirmRenewSub = async (e) => {
    e.preventDefault();
    if (!renewTargetCompany) return;

    try {
      await renewSubscription({
        tenantId: renewTargetCompany.id,
        durationMonths: Number(renewForm.durationMonths) || 12,
        additionalDays: Number(renewForm.additionalDays) || 0,
        newExpiryDate: renewForm.newExpiryDate || undefined,
        amountBilled: Number(renewForm.amountBilled) || 0,
        notes: renewForm.notes
      });

      showToast(`Subscription renewed successfully for "${renewTargetCompany.name}"!`, 'success');
      logAudit('SUBSCRIPTION_RENEWED', `Renewed subscription for ${renewTargetCompany.name}`, renewTargetCompany.name);
      setIsRenewSubOpen(false);
      setRenewTargetCompany(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to renew subscription: ${err.message}`, 'error');
    }
  };

  const handleOpenConfigDates = (company) => {
    setConfigTargetCompany(company);
    const isTrial = company.plan === 'FREE_TRIAL' || company.plan === 'TRIAL' || company.status === 'TRIAL';

    setConfigDatesForm({
      subscriptionStartAt: toLocalInputDateTime(company.subscriptionStartAt || new Date()),
      subscriptionEndAt: toLocalInputDateTime(company.subscriptionEndAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      trialStartAt: toLocalInputDateTime(company.trialStartAt || new Date()),
      trialEndAt: toLocalInputDateTime(company.trialEndAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      gracePeriodDays: company.gracePeriodDays !== undefined ? company.gracePeriodDays : 7,
      autoSuspendAfterGrace: company.autoSuspendAfterGrace !== false,
      status: company.status,
      planTier: company.plan
    });
    setIsConfigDatesOpen(true);
  };

  const handleConfirmConfigDates = async (e) => {
    e.preventDefault();
    if (!configTargetCompany) return;

    try {
      const isTrial = configDatesForm.planTier === 'FREE_TRIAL' || configDatesForm.planTier === 'TRIAL' || configDatesForm.status === 'TRIAL';

      await configureSubscriptionDates({
        tenantId: configTargetCompany.id,
        subscriptionStartAt: !isTrial ? new Date(configDatesForm.subscriptionStartAt).toISOString() : null,
        subscriptionEndAt: !isTrial ? new Date(configDatesForm.subscriptionEndAt).toISOString() : null,
        trialStartAt: isTrial ? new Date(configDatesForm.trialStartAt).toISOString() : null,
        trialEndAt: isTrial ? new Date(configDatesForm.trialEndAt).toISOString() : null,
        gracePeriodDays: Number(configDatesForm.gracePeriodDays) || 7,
        autoSuspendAfterGrace: Boolean(configDatesForm.autoSuspendAfterGrace),
        planTier: configDatesForm.planTier,
        status: configDatesForm.status
      });

      showToast(`Subscription dates & grace policy updated for ${configTargetCompany.name}!`, 'success');
      logAudit('SUBSCRIPTION_DATES_CONFIGURED', `Configured dates & grace period for ${configTargetCompany.name}`, configTargetCompany.name);
      setIsConfigDatesOpen(false);
      setConfigTargetCompany(null);
      loadAllData();
    } catch (err) {
      showToast(`Failed to update dates: ${err.message}`, 'error');
    }
  };

  const handleProcessExpiries = async () => {
    setProcessExpiriesResult({ loading: true, message: 'Analyzing account subscriptions & grace periods...', suspendedCount: 0, suspendedCompanies: [] });
    setIsProcessExpiriesOpen(true);

    try {
      const res = await processSubscriptionExpiries();
      setProcessExpiriesResult({
        loading: false,
        message: res.message || 'Expiries processed successfully.',
        suspendedCount: res.suspendedCount || 0,
        suspendedCompanies: res.suspendedCompanies || []
      });
      if (res.suspendedCount > 0) {
        showToast(`${res.suspendedCount} expired account(s) automatically suspended after grace period.`, 'warning');
      } else {
        showToast('All tenant subscriptions and grace periods are in good standing.', 'success');
      }
      loadAllData();
    } catch (err) {
      setProcessExpiriesResult({
        loading: false,
        message: `Error executing batch expiry processor: ${err.message}`,
        suspendedCount: 0,
        suspendedCompanies: []
      });
    }
  };

  const handleImpersonateCompany = async (company) => {
    try {
      const res = await impersonateTenant(company.id, 'Super Admin Governance Session');
      const targetUser = res?.data?.adminUser || {
        id: 'adm-' + company.id,
        name: company.adminName || `${company.name} Admin`,
        email: company.adminEmail || `admin@${company.code.toLowerCase()}.com`,
        role: 'COMPANY_ADMIN',
        company: company.name
      };
      setActiveImpersonation({
        target: targetUser,
        reason: 'Super Admin Governance Session',
        timestamp: new Date().toISOString()
      });
      showToast(`Now impersonating ${targetUser.name} (${company.name}).`, 'success');
      logAudit('IMPERSONATION_STARTED', `Started impersonation for ${company.name}`, company.name);
    } catch (err) {
      showToast(`Impersonation session error: ${err.message}`, 'error');
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

  const handleForceLogoutUser = async (user) => {
    if (!window.confirm(`Are you sure you want to force logout ${user.name || user.email}? All active sessions will be terminated immediately.`)) return;
    try {
      await forceLogoutUser(user.id);
      showToast(`Force logout applied: All active sessions revoked for ${user.email}.`, 'success');
      logAudit('USER_FORCED_LOGOUT', `Forcefully revoked sessions for ${user.email}`);
    } catch (err) {
      showToast(`Force logout failed: ${err.message}`, 'error');
    }
  };

  const handleOpenLockUser = (user) => {
    setLockUserTarget(user);
    setLockReasonInput(user.lockReason || (user.isLocked || user.status === 'LOCKED' ? '' : 'Security policy violation / Suspicious activity'));
    setIsLockUserOpen(true);
  };

  const handleConfirmLockUser = async (e) => {
    e.preventDefault();
    if (!lockUserTarget) return;
    const isCurrentlyLocked = lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' || lockUserTarget.status === 'Locked';
    const newLockState = !isCurrentlyLocked;

    try {
      await toggleUserLock(lockUserTarget.id, newLockState, lockReasonInput);
      const actionMsg = newLockState ? `Account ${lockUserTarget.email} locked.` : `Account ${lockUserTarget.email} unlocked.`;
      showToast(actionMsg, 'success');
      logAudit(newLockState ? 'USER_ACCOUNT_LOCKED' : 'USER_ACCOUNT_UNLOCKED', `${actionMsg} Reason: ${lockReasonInput}`);
      setIsLockUserOpen(false);
      setLockUserTarget(null);
      setPlatformUsers(prev => prev.map(u => u.id === lockUserTarget.id ? { ...u, isLocked: newLockState, status: newLockState ? 'LOCKED' : 'ACTIVE', lockReason: lockReasonInput } : u));
    } catch (err) {
      showToast(`Failed to update account lock: ${err.message}`, 'error');
    }
  };

  const handleOpenUserPermissions = (user) => {
    setPermissionsTarget(user);
    const defaultPerms = {
      manage_users: true,
      manage_products: true,
      manage_orders: true,
      manage_doctors: true,
      manage_dcr: true,
      view_analytics: true,
      export_data: true,
      manage_settings: true
    };
    setUserPermissionsForm(user.permissions && typeof user.permissions === 'object' ? { ...defaultPerms, ...user.permissions } : defaultPerms);
    setIsPermissionsModalOpen(true);
  };

  const handleSaveUserPermissions = async (e) => {
    e.preventDefault();
    if (!permissionsTarget) return;
    try {
      await updateUserPermissions(permissionsTarget.id, userPermissionsForm);
      showToast(`Permissions updated for ${permissionsTarget.email}!`, 'success');
      logAudit('USER_PERMISSIONS_CHANGED', `Updated granular permissions for ${permissionsTarget.email}`);
      setIsPermissionsModalOpen(false);
      setPermissionsTarget(null);
      setPlatformUsers(prev => prev.map(u => u.id === permissionsTarget.id ? { ...u, permissions: userPermissionsForm } : u));
    } catch (err) {
      showToast(`Permission update error: ${err.message}`, 'error');
    }
  };

  const handleOpenUserActivity = async (user) => {
    setActivityTargetUser(user);
    setIsUserActivityOpen(true);
    setIsActivitiesLoading(true);
    try {
      const logs = await getUserActivity(user.id);
      setUserActivitiesList(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.warn('Activity fetch error:', err);
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const handleOpenUserLoginHistory = async (user) => {
    setLoginHistoryTargetUser(user);
    setIsUserLoginHistoryOpen(true);
    setIsLoginHistoryLoading(true);
    try {
      const history = await getUserLoginHistory(user.id);
      setUserLoginHistoryList(Array.isArray(history) ? history : []);
    } catch (err) {
      console.warn('Login history fetch error:', err);
    } finally {
      setIsLoginHistoryLoading(false);
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
      const payload = {
        code: newCountryForm.code.toUpperCase().trim(),
        name: newCountryForm.name.trim(),
        currency_code: newCountryForm.currencyCode.toUpperCase().trim(),
        currency_symbol: newCountryForm.currencySymbol || '$',
        fx_rate_to_usd: Number(newCountryForm.fxRateToUSD) || 1.0,
        primary_timezone: newCountryForm.primaryTimezone || 'UTC',
        tax_scheme: newCountryForm.taxScheme,
        social_security: newCountryForm.socialSecurity,
        fiscal_year: newCountryForm.fiscalYear
      };

      await createCountry(payload);

      showToast(`Sovereign Country ${newCountryForm.name} registered (FX: 1 USD = ${payload.fx_rate_to_usd} ${payload.currency_code})!`, 'success');
      logAudit('SOVEREIGN_COUNTRY_ADDED', `Registered country ${newCountryForm.name} (${newCountryForm.code})`);
      setIsCreateCountryOpen(false);
      loadAllData();
      setNewCountryForm({
        code: '',
        name: '',
        currencyCode: '',
        currencySymbol: '',
        fxRateToUSD: 1.0,
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
      fxRateToUSD: country.fxRateToUSD || 1.0,
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
      const updatedData = {
        name: editCountryForm.name,
        currency_code: editCountryForm.currencyCode,
        currency_symbol: editCountryForm.currencySymbol,
        fx_rate_to_usd: Number(editCountryForm.fxRateToUSD) || 1.0,
        primary_timezone: editCountryForm.primaryTimezone,
        tax_scheme: editCountryForm.taxScheme,
        social_security: editCountryForm.socialSecurity,
        fiscal_year: editCountryForm.fiscalYear
      };

      await updateCountry(editingCountry.code, updatedData);

      // Instantly update in-memory sovereignRegistry so all UI components update live
      setSovereignRegistry(prev => prev.map(c => c.code === editingCountry.code ? {
        ...c,
        name: editCountryForm.name,
        currencyCode: editCountryForm.currencyCode,
        currencySymbol: editCountryForm.currencySymbol,
        fxRateToUSD: Number(editCountryForm.fxRateToUSD) || 1.0,
        timezone: editCountryForm.primaryTimezone,
        taxScheme: editCountryForm.taxScheme,
        socialSecurity: editCountryForm.socialSecurity,
        fiscalYear: editCountryForm.fiscalYear
      } : c));

      showToast(`Country ${editingCountry.name} updated: FX Rate, Timezone & Tax synced!`, 'success');
      logAudit('SOVEREIGN_COUNTRY_UPDATED', `Updated statutory parameters for ${editingCountry.name} (FX: ${editCountryForm.fxRateToUSD})`);
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
  // 4. SUBSCRIPTION / BILLING & TIMESTAMPS HANDLERS
  // --------------------------------------------------------------------------
  const handleOpenSubscriptionModal = (company) => {
    setSubModalTarget(company);
    const isTrial = company.plan === 'FREE_TRIAL' || company.plan === 'TRIAL';
    const isCustom = company.plan === 'CUSTOM' || company.isCustomPricing;

    let defaultRate = 100;
    if (isTrial) defaultRate = 0;
    else if (isCustom) defaultRate = Number(company.customRate) || Number(company.customMRR) || 0;
    else if (company.plan === 'ENTERPRISE') defaultRate = 2500;
    else if (company.plan === 'PROFESSIONAL' || company.plan === 'PRO') defaultRate = 1000;

    setSubModalForm({
      planTier: company.plan || 'STARTER',
      customRate: isCustom ? defaultRate : 0,
      amountBilled: defaultRate,
      billingInterval: 'Monthly',
      startAt: toLocalInputDateTime(company.trialStartAt || company.subscriptionStartAt || new Date()),
      endAt: toLocalInputDateTime(company.trialEndAt || company.subscriptionEndAt || new Date(Date.now() + (isTrial ? 14 : 365) * 24 * 60 * 60 * 1000))
    });
    setIsSubscriptionModalOpen(true);
  };

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    if (!subModalTarget) return;

    try {
      const isTrial = subModalForm.planTier === 'FREE_TRIAL' || subModalForm.planTier === 'TRIAL';
      const isCustom = subModalForm.planTier === 'CUSTOM';

      let calculatedAmount = 0;
      if (isTrial) calculatedAmount = 0;
      else if (isCustom) calculatedAmount = Number(subModalForm.customRate) || 0;
      else if (subModalForm.planTier === 'STARTER' || subModalForm.planTier === 'BASIC') calculatedAmount = 100;
      else if (subModalForm.planTier === 'PROFESSIONAL' || subModalForm.planTier === 'PRO') calculatedAmount = 1000;
      else if (subModalForm.planTier === 'ENTERPRISE') calculatedAmount = 2500;

      await createSubscription({
        tenantId: subModalTarget.id,
        planTier: subModalForm.planTier,
        amountBilled: calculatedAmount,
        customRate: isCustom ? calculatedAmount : 0,
        isCustomPricing: isCustom,
        billingInterval: subModalForm.billingInterval,
        startAt: new Date(subModalForm.startAt).toISOString(),
        endAt: new Date(subModalForm.endAt).toISOString(),
        status: isTrial ? 'Trial' : 'Active'
      });

      showToast(`Subscription plan ${subModalForm.planTier} ($${calculatedAmount}/mo) assigned to ${subModalTarget.name}!`, 'success');
      logAudit('SUBSCRIPTION_UPDATED', `Assigned ${subModalForm.planTier} to ${subModalTarget.name} (Valid: ${subModalForm.startAt} to ${subModalForm.endAt})`, subModalTarget.name);
      setIsSubscriptionModalOpen(false);
      loadAllData();
    } catch (err) {
      showToast(`Subscription update error: ${err.message}`, 'error');
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
            Sovereign Governance &bull; Free Trials &amp; Demo Engines &bull; Live Revenue Analytics &bull; Multi-Tier Monetization
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
            <span className="pill-label">Active / Trials</span>
            <span className="pill-value">{activeCompanies} Paid &bull; {trialCompanies} Trial</span>
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
                <span className="dot-trial" style={{ background: '#f3e8ff', color: '#6b21a8', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>🟣 {trialCompanies} Trial / Demo</span>
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
                <strong>{activeCompanies} Paid Subscriptions</strong> &bull; ARR: ${totalARR_USD.toLocaleString()}
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
                    <p className="section-desc">Multi-tenant isolation status, subscription duration, and live plan rates</p>
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
                      <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Get started by provisioning a Free Trial or Paid Pharma Tenant.</p>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsCreateCompanyOpen(true)}>
                        <Plus size={14} /> Provision Tenant
                      </button>
                    </div>
                  ) : (
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Company &amp; Flag</th>
                          <th>Plan Tier</th>
                          <th>Monthly Rate</th>
                          <th>Status</th>
                          <th>Start / End Date</th>
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
                                  <div className="comp-code-sub">{comp.code} &bull; {comp.country}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`plan-pill plan-${comp.plan.toLowerCase()}`}>
                                {comp.plan}
                              </span>
                            </td>
                            <td><strong>{comp.mrr}</strong></td>
                            <td>
                              <span className={`status-tag status-${comp.status.toLowerCase()}`}>
                                {comp.status === 'ACTIVE' ? '🟢 Active' : comp.status === 'TRIAL' ? '🟣 Trial' : '🟡 Suspended'}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                              <div>Expires: <strong>{comp.renewalDate}</strong></div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="actions-cluster">
                                <button type="button" className="action-pill-btn" onClick={() => handleOpenSubscriptionModal(comp)}>
                                  Plan
                                </button>
                                <button type="button" className="action-pill-btn" onClick={() => handleOpenEditCompany(comp)}>
                                  <Edit size={12} /> Edit
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
                    <Plus size={14} color="#2563eb" /> Provision Free Trial / Demo
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
          2. COMPANIES & TENANTS (FULL CRUD & TRIAL TIMERS)
          ===================================================================== */}
      {activeTab === 'companies' && (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${companySubTab === 'all' ? 'active' : ''}`} onClick={() => setCompanySubTab('all')}>
              All Pharma Companies ({companies.length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'active' ? 'active' : ''}`} onClick={() => setCompanySubTab('active')}>
              🟢 Active ({companies.filter(c => c.status === 'ACTIVE').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'trial' ? 'active' : ''}`} onClick={() => setCompanySubTab('trial')}>
              🟣 Trials &amp; Demos ({companies.filter(c => c.status === 'TRIAL' || c.plan === 'FREE_TRIAL').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'suspended' ? 'active' : ''}`} onClick={() => setCompanySubTab('suspended')}>
              🟡 Suspended ({companies.filter(c => c.status === 'SUSPENDED').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'deactivated' ? 'active' : ''}`} onClick={() => setCompanySubTab('deactivated')}>
              ⚪ Deactivated ({companies.filter(c => c.status === 'DEACTIVATED' || c.status === 'INACTIVE').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'admins' ? 'active' : ''}`} onClick={() => setCompanySubTab('admins')}>
              🛡️ Company Admins ({admins.length})
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
              <Plus size={16} /> Create / Provision Tenant
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
                    Click "Create / Provision Tenant" to onboard your first organization.
                  </p>
                  <button type="button" className="btn btn-primary" onClick={() => setIsCreateCompanyOpen(true)}>
                    <Plus size={16} /> Create / Provision Tenant
                  </button>
                </div>
              ) : (
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company &amp; Code</th>
                      <th>Country</th>
                      <th>Plan Tier</th>
                      <th>Total Users</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Start &amp; End Period</th>
                      <th style={{ textAlign: 'right' }}>Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(c => {
                        if (companySubTab === 'all') return true;
                        if (companySubTab === 'active') return c.status === 'ACTIVE';
                        if (companySubTab === 'trial') return c.status === 'TRIAL' || c.plan === 'FREE_TRIAL';
                        if (companySubTab === 'suspended') return c.status === 'SUSPENDED';
                        if (companySubTab === 'deactivated') return c.status === 'DEACTIVATED' || c.status === 'INACTIVE';
                        return true;
                      })
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
                                <div className="comp-code-sub">{company.code}</div>
                              </div>
                            </div>
                          </td>
                          <td><strong>{company.country}</strong></td>
                          <td><span className={`plan-pill plan-${company.plan.toLowerCase()}`}>{company.plan}</span></td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: '#1e293b' }}>
                              <Users size={14} color="#6366f1" /> {company.usersCount || company.user_count || 0} Users
                            </span>
                          </td>
                          <td><strong>{company.mrr}</strong></td>
                          <td>
                            <span className={`status-tag status-${company.status.toLowerCase()}`}>
                              {company.status === 'ACTIVE' ? '🟢 Active' : company.status === 'TRIAL' ? '🟣 Trial' : company.status === 'SUSPENDED' ? '🟡 Suspended' : '⚪ Deactivated'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.74rem', color: '#334155' }}>
                            <div>Expires: <strong>{company.renewalDate}</strong></div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cluster">
                              {/* 1. View Company */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleViewCompany(company)}
                                title="View Company Profile & Telemetry"
                              >
                                <Eye size={12} /> View
                              </button>

                              {/* 2. Edit Company */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenEditCompany(company)}
                                title="Edit Company Details"
                              >
                                <Edit size={12} /> Edit
                              </button>

                              {/* 3. Change Subscription */}
                              <button
                                type="button"
                                className="action-pill-btn primary"
                                onClick={() => handleOpenSubscriptionModal(company)}
                                title="Change Subscription Plan & Pricing"
                              >
                                <CreditCard size={12} /> Plan
                              </button>

                              {/* 4. Extend Subscription */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenExtendSubscription(company)}
                                title="Extend Trial / Subscription Duration"
                              >
                                <CalendarPlus size={12} /> Extend
                              </button>

                              {/* 5. Assign Root Company Admin */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenAssignAdmin(company)}
                                title="Assign Root Company Administrator"
                              >
                                <UserPlus size={12} /> Admin
                              </button>

                              {/* 6. Reset Admin Password */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenResetAdminPassword(company)}
                                title="Reset Company Admin Password"
                              >
                                <Key size={12} /> Pwd
                              </button>

                              {/* 7. Impersonate Admin */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                onClick={() => handleImpersonateCompany(company)}
                                title="Impersonate / Login as Company Admin"
                              >
                                <ShieldCheck size={12} /> Login
                              </button>

                              {/* 8. Activate / Suspend / Deactivate / Restore Status Controls */}
                              {company.status === 'ACTIVE' && (
                                <>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#b45309' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'SUSPENDED', company.name)}
                                    title="Suspend Company Tenant"
                                  >
                                    <StopCircle size={12} /> Suspend
                                  </button>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#64748b' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'DEACTIVATED', company.name)}
                                    title="Deactivate Company Tenant"
                                  >
                                    Deactivate
                                  </button>
                                </>
                              )}

                              {company.status === 'SUSPENDED' && (
                                <>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#16a34a' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'ACTIVE', company.name)}
                                    title="Activate Company Tenant"
                                  >
                                    <PlayCircle size={12} /> Activate
                                  </button>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#64748b' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'DEACTIVATED', company.name)}
                                    title="Deactivate Company Tenant"
                                  >
                                    Deactivate
                                  </button>
                                </>
                              )}

                              {(company.status === 'DEACTIVATED' || company.status === 'INACTIVE') && (
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                                  onClick={() => handleRestoreCompany(company.id, company.name)}
                                  title="Restore Company Tenant to Active Status"
                                >
                                  <RotateCcw size={12} /> Restore
                                </button>
                              )}

                              {/* 9. Permanent Purge / Delete */}
                              <button
                                type="button"
                                className="action-pill-btn red"
                                onClick={() => handleOpenDeleteCompany(company)}
                                title="Permanently Delete Tenant"
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
              {/* Interactive Live FX & Tax Calculator */}
              <div className="card-section" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Coins size={20} color="#2563eb" /> Live Real-Time Multi-Currency &amp; Tax Converter
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                      Calculate SaaS plan pricing, tax withholding, and local currency billing across all {sovereignRegistry.length} sovereign markets instantly.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700' }}>Base Amount ($ USD)</label>
                    <input
                      type="number"
                      min="0"
                      value={fxConverter.amount}
                      onChange={(e) => setFxConverter(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="form-control"
                      style={{ fontWeight: '800', fontSize: '1rem', background: '#ffffff' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700' }}>Target Sovereign Country</label>
                    <select
                      className="form-control"
                      value={fxConverter.toCurrency}
                      onChange={(e) => setFxConverter(prev => ({ ...prev, toCurrency: e.target.value }))}
                      style={{ fontWeight: '700', background: '#ffffff' }}
                    >
                      {sovereignRegistry.map((c) => (
                        <option key={c.code} value={c.currencyCode}>
                          {c.flag} {c.name} ({c.currencyCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const targetC = sovereignRegistry.find(c => c.currencyCode === fxConverter.toCurrency) || sovereignRegistry[0];
                    const convertedVal = (fxConverter.amount * (targetC.fxRateToUSD || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    return (
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                          Converted Value ({targetC.currencyCode})
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
                          {targetC.currencySymbol} {convertedVal}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>
                          🏛️ Tax Scheme: {targetC.taxScheme}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="section-title">Multi-Currency Exchange Matrix</h2>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Live rates synced with database &amp; sovereign registry</span>
                </div>
                <div className="saas-table-container" style={{ marginTop: '12px' }}>
                  <table className="saas-data-table">
                    <thead>
                      <tr>
                        <th>Jurisdiction &amp; Currency</th>
                        <th>ISO Code</th>
                        <th>Symbol</th>
                        <th>Exchange Rate (per 1 USD)</th>
                        <th>Tax / Withholding Standard</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
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
                          <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1e40af' }}>
                            1 USD = {(c.fxRateToUSD || 1).toLocaleString()} {c.currencyCode}
                          </td>
                          <td style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {c.taxScheme}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => handleOpenEditCountry(c)}
                              title="Update Exchange Rate & Tax"
                            >
                              <Edit size={12} /> Edit FX &amp; Tax
                            </button>
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
          {/* Sub-Navigation: Company Admins vs Total Users of Each Company */}
          <div className="sub-nav-tabs">
            <button
              type="button"
              className={`sub-nav-pill ${userSubTab === 'admins' ? 'active' : ''}`}
              onClick={() => setUserSubTab('admins')}
            >
              🏢 Company Administrators ({platformUsers.filter(u => u.role.includes('ADMIN')).length})
            </button>
            <button
              type="button"
              className={`sub-nav-pill ${userSubTab === 'company-totals' ? 'active' : ''}`}
              onClick={() => setUserSubTab('company-totals')}
            >
              👥 Total Users of Each Company ({companies.length})
            </button>
          </div>

          {userSubTab === 'admins' ? (
            <div>
              <div className="pane-action-bar">
                <div className="search-box-large">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search company administrators: Name, Email, Company..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="search-input-field"
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setIsCreateUserOpen(true)}>
                  <Plus size={16} /> Add Company Admin
                </button>
              </div>

              <div className="saas-table-container">
                {platformUsers.filter(u => u.role.includes('ADMIN')).length === 0 ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <ShieldCheck size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Company Admins Found</div>
                    <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Click "Add Company Admin" to provision an administrator account.</p>
                    <button type="button" className="btn btn-primary" onClick={() => setIsCreateUserOpen(true)}>
                      <Plus size={16} /> Add Company Admin
                    </button>
                  </div>
                ) : (
                  <table className="saas-data-table">
                    <thead>
                      <tr>
                        <th>Administrator Profile</th>
                        <th>Assigned Company</th>
                        <th>Role</th>
                        <th>Mobile</th>
                        <th>Status</th>
                        <th>Last Active</th>
                        <th style={{ textAlign: 'right' }}>CRUD Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {platformUsers
                        .filter(u => u.role.includes('ADMIN'))
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
                            <td>{user.mobile || '—'}</td>
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
                                  title="Edit Administrator Profile"
                                >
                                  <Edit size={12} /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#0369a1', borderColor: '#bae6fd', background: '#f0f9ff' }}
                                  onClick={() => handleOpenUserPermissions(user)}
                                  title="Change Admin Permissions & RBAC"
                                >
                                  <Sliders size={12} /> Permissions
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenResetUserPassword(user)}
                                  title="Reset Administrator Password"
                                >
                                  <Key size={12} /> Reset Pwd
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#e11d48', borderColor: '#fecdd3', background: '#fff1f2' }}
                                  onClick={() => handleForceLogoutUser(user)}
                                  title="Force Logout / Revoke Active Sessions"
                                >
                                  <LogOut size={12} /> Force Logout
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: user.isLocked || user.status === 'LOCKED' ? '#059669' : '#d97706', borderColor: '#fde68a' }}
                                  onClick={() => handleOpenLockUser(user)}
                                  title={user.isLocked || user.status === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
                                >
                                  <Lock size={12} /> {user.isLocked || user.status === 'LOCKED' ? 'Unlock' : 'Lock'}
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenUserActivity(user)}
                                  title="View Admin Activity Log"
                                >
                                  <Activity size={12} /> Activity
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenUserLoginHistory(user)}
                                  title="View Admin Login History"
                                >
                                  <Clock size={12} /> Logins
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleToggleUserStatus(user.id, user.status, user.email)}
                                  title="Activate / Deactivate Account"
                                >
                                  {user.status === 'ACTIVE' || user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                  onClick={() => {
                                    setImpersonateTarget(user);
                                    setIsImpersonateOpen(true);
                                  }}
                                  title="Audit & Impersonate Company Admin"
                                >
                                  <Eye size={12} /> Impersonate
                                </button>
                                {user.role !== 'SUPER_ADMIN' && (
                                  <button
                                    type="button"
                                    className="action-pill-btn red"
                                    onClick={() => handleOpenDeleteUser(user)}
                                    title="Delete Administrator"
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
          ) : (
            /* COMPANY TOTAL USERS TELEMETRY VIEW */
            <div>
              <div className="pane-action-bar">
                <div className="search-box-large">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search company user statistics: Name, Country, Plan..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="search-input-field"
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setIsCreateCompanyOpen(true)}>
                  <Plus size={16} /> Provision New Company
                </button>
              </div>

              <div className="saas-table-container">
                {companies.length === 0 ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <Building2 size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Companies Enrolled</div>
                    <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Provision a company to start monitoring total user counts.</p>
                  </div>
                ) : (
                  <table className="saas-data-table">
                    <thead>
                      <tr>
                        <th>Company &amp; Code</th>
                        <th>Sovereign Country</th>
                        <th>Subscription Plan</th>
                        <th>No. of Admins</th>
                        <th>Total Users</th>
                        <th>Company Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies
                        .filter(c =>
                          c.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          c.country.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          c.plan.toLowerCase().includes(globalSearchQuery.toLowerCase())
                        )
                        .map((c) => (
                          <tr key={c.id}>
                            <td>
                              <div className="comp-name-group">
                                <span className="comp-flag">{c.flag}</span>
                                <div>
                                  <div className="comp-name-text">{c.name}</div>
                                  <div className="comp-code-sub">{c.code}</div>
                                </div>
                              </div>
                            </td>
                            <td><strong>{c.country}</strong></td>
                            <td>
                              <span className={`plan-pill plan-${c.plan.toLowerCase()}`}>{c.plan}</span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: '#0369a1' }}>
                                <ShieldCheck size={14} color="#0284c7" /> {c.admin_count || 1} Admin{c.admin_count !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '800', color: '#4338ca', background: '#eef2ff', padding: '4px 10px', borderRadius: '6px' }}>
                                <Users size={14} color="#6366f1" /> {c.usersCount || c.user_count || 0} Total Users
                              </span>
                            </td>
                            <td>
                              <span className={`status-tag status-${c.status.toLowerCase()}`}>
                                {c.status === 'ACTIVE' ? '🟢 Active' : c.status === 'TRIAL' ? '🟣 Trial' : '🟡 Suspended'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="actions-cluster">
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenEditCompany(c)}
                                >
                                  <Edit size={12} /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenResetAdminPassword(c)}
                                >
                                  <Key size={12} /> Reset Pwd
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
        </div>
      )}

      {/* =====================================================================
          5. SUBSCRIPTIONS & MONETIZATION (PLANS CRUD & ADVANCED GOVERNANCE)
          ===================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={22} color="#0284c7" /> SaaS Plans &amp; Subscription Governance
              </h2>
              <p className="section-desc">Create/edit plans, configure trial periods, grace periods, upgrades, renewals, and automated suspension.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleProcessExpiries}
                title="Scan all accounts for expired subscriptions/trials and apply grace period suspension rules"
              >
                <RefreshCw size={15} /> <span>Process Expiries &amp; Grace Check</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsCreatePlanOpen(true)}
              >
                <Plus size={16} /> <span>Create New Plan</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC SUBSCRIPTION PLANS GRID */}
          <div className="subscription-plans-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {(plans.length > 0 ? plans : [
              {
                id: 'p1', code: 'FREE_TRIAL', name: 'Free Trial / Demo', description: 'Pilot evaluation with full feature access for a configurable trial period.',
                price_monthly: 0, price_yearly: 0, trial_days: 14, grace_period_days: 7,
                features: ['Unlimited Users & Admins', 'Field DCR & GPS Tracking', 'Chemist & Doctor Directories', 'Configurable Start & End Dates', 'Full Analytics Suite']
              },
              {
                id: 'p2', code: 'STARTER', name: 'Starter Tier', description: 'Entry-level pharma distribution for growing teams and regional distributors.',
                price_monthly: 100, price_yearly: 1000, trial_days: 14, grace_period_days: 7,
                features: ['Unlimited Field Users & Admins', 'Core MR Daily Call Reports', 'Chemist Order Booking (POB)', 'Product Catalog & Samples', 'Email Support']
              },
              {
                id: 'p3', code: 'PROFESSIONAL', name: 'Professional Tier', description: 'Complete operational powerhouse for regional pharma manufacturers.',
                price_monthly: 1000, price_yearly: 10000, trial_days: 14, grace_period_days: 7,
                features: ['Unlimited Field Reps & Managers', 'Tour Plans (MTP) & Approvals', 'TA / DA Smart Expense Claims', 'Statutory Payroll & Compliance', 'Live Geo-Tracking & Hierarchy']
              },
              {
                id: 'p4', code: 'ENTERPRISE', name: 'Enterprise Tier', description: 'For multinational pharmaceutical conglomerates requiring sovereign isolation.',
                price_monthly: 2500, price_yearly: 25000, trial_days: 30, grace_period_days: 14,
                features: ['Unlimited Field Reps & Executive GMs', 'Multi-Country Sovereign Isolation', 'AI Prescription OCR & Studio', 'Automated SAP/Oracle ERP Sync', '24/7 Dedicated SLA Support']
              },
              {
                id: 'p5', code: 'CUSTOM', name: 'Custom Enterprise Tier', description: 'Tailored contract terms, bespoke pricing, and custom SLAs as per client requirements.',
                price_monthly: 0, price_yearly: 0, trial_days: 14, grace_period_days: 14, is_custom: true,
                features: ['Unlimited Users & Custom Limits', 'Custom USD Rate & Contract Terms', 'Flexible Billing Schedules', 'Bespoke ERP Integration & On-Premises Option', 'Dedicated Solutions Architect']
              }
            ]).map((plan) => {
              const enrolledCount = companies.filter(c => 
                c.plan === plan.code || 
                (plan.code === 'FREE_TRIAL' && (c.plan === 'TRIAL' || c.status === 'TRIAL')) ||
                (plan.code === 'STARTER' && c.plan === 'BASIC') ||
                (plan.code === 'PROFESSIONAL' && c.plan === 'PRO') ||
                (plan.code === 'CUSTOM' && c.isCustomPricing)
              ).length;

              const isFeatured = plan.code === 'PROFESSIONAL' || plan.tier === 'PROFESSIONAL';
              const isTrial = plan.code === 'FREE_TRIAL' || plan.tier === 'FREE_TRIAL';
              const isCustom = plan.code === 'CUSTOM' || plan.is_custom;

              return (
                <div
                  key={plan.id || plan.code}
                  className={`plan-card ${isFeatured ? 'featured-plan' : ''}`}
                  style={{
                    borderColor: isFeatured ? '#0284c7' : isTrial ? '#8b5cf6' : isCustom ? '#0f172a' : '#e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {isFeatured && <div className="featured-ribbon">POPULAR</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="plan-tier-name" style={{ color: isTrial ? '#7c3aed' : isCustom ? '#0f172a' : '#0284c7', margin: 0 }}>
                        {plan.name || plan.code}
                      </span>
                      <span className="plan-pill plan-pro" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        {plan.code}
                      </span>
                    </div>

                    <div className="plan-price">
                      {isTrial ? '$0' : isCustom ? 'Custom' : `$${Number(plan.price_monthly || plan.priceMonthly || 0).toLocaleString()}`}
                      <span> {isTrial ? '/ demo period' : isCustom ? '/ contract' : '/ month'}</span>
                    </div>

                    {!isTrial && !isCustom && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '-4px', marginBottom: '10px' }}>
                        ${Number(plan.price_yearly || plan.priceYearly || 0).toLocaleString()} / year (Save 17%)
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 12px' }}>
                      <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        ⏳ {plan.trial_days || plan.trialDays || 14}d Trial
                      </span>
                      <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        🛡️ {plan.grace_period_days || plan.gracePeriodDays || 7}d Grace
                      </span>
                    </div>

                    <p className="plan-limits-desc" style={{ fontSize: '0.78rem', minHeight: '34px' }}>
                      {plan.description || 'Enterprise plan configuration with full modular capability.'}
                    </p>

                    <ul className="plan-perks-list" style={{ marginTop: '10px', fontSize: '0.76rem' }}>
                      {(Array.isArray(plan.features) ? plan.features : typeof plan.features === 'string' ? JSON.parse(plan.features || '[]') : []).map((feat, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} color="#16a34a" /> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="plan-sub-count" style={{ background: isTrial ? '#f5f3ff' : isFeatured ? '#f0f9ff' : '#f8fafc', color: isTrial ? '#7c3aed' : isFeatured ? '#0369a1' : '#334155', marginTop: '16px' }}>
                      {enrolledCount} {enrolledCount === 1 ? 'Company' : 'Companies'} Enrolled
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, padding: '6px 8px', fontSize: '0.74rem' }}
                        onClick={() => handleOpenEditPlan(plan)}
                      >
                        <Edit size={12} /> Edit Plan
                      </button>
                      {plan.code !== 'FREE_TRIAL' && plan.code !== 'STARTER' && (
                        <button
                          type="button"
                          className="action-pill-btn red"
                          style={{ padding: '6px 10px' }}
                          onClick={() => handleOpenDeletePlan(plan)}
                          title="Delete Plan"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="section-title-sm" style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>Tenant Billing &amp; Subscriptions Overview</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{companies.length} Total Accounts Under Governance</span>
          </div>

          <div className="saas-table-container" style={{ marginTop: '12px' }}>
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Company Tenant</th>
                  <th>Current Tier</th>
                  <th>Monthly Rate</th>
                  <th>Status &amp; Health</th>
                  <th>Subscription Start &amp; Expiry</th>
                  <th>Grace Policy</th>
                  <th style={{ textAlign: 'right' }}>Subscription Controls</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => {
                  const isTrial = c.plan === 'FREE_TRIAL' || c.plan === 'TRIAL' || c.status === 'TRIAL';
                  const expDate = c.subscriptionEndAt || c.trialEndAt || c.renewalDate;
                  const expTime = expDate ? new Date(expDate).getTime() : null;
                  const nowTime = Date.now();
                  const daysRemaining = expTime ? Math.ceil((expTime - nowTime) / (1000 * 60 * 60 * 24)) : null;
                  const graceDays = c.gracePeriodDays !== undefined ? c.gracePeriodDays : 7;
                  const isGraceActive = daysRemaining !== null && daysRemaining <= 0 && daysRemaining > -graceDays;
                  const isFullyExpired = daysRemaining !== null && daysRemaining <= -graceDays;

                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="comp-name-group">
                          <span className="comp-flag">{c.flag}</span>
                          <div>
                            <div className="comp-name-text">{c.name}</div>
                            <div className="comp-code-sub">{c.code} &bull; {c.country}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`plan-pill plan-${c.plan?.toLowerCase()}`}>{c.plan}</span>
                      </td>
                      <td><strong>{c.mrr}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className={`status-tag status-${c.status?.toLowerCase()}`}>
                            {c.status === 'ACTIVE' ? '🟢 Active' : c.status === 'TRIAL' ? '🟣 In Trial' : c.status === 'SUSPENDED' ? '🟡 Suspended' : c.status}
                          </span>
                          {isGraceActive && (
                            <span style={{ fontSize: '0.66rem', color: '#d97706', fontWeight: '700', background: '#fffbeb', padding: '1px 6px', borderRadius: '4px' }}>
                              ⚠️ Grace Active ({Math.abs(daysRemaining)}d past expiry)
                            </span>
                          )}
                          {isFullyExpired && c.status === 'SUSPENDED' && (
                            <span style={{ fontSize: '0.66rem', color: '#dc2626', fontWeight: '700', background: '#fef2f2', padding: '1px 6px', borderRadius: '4px' }}>
                              🛑 Auto-Suspended (Grace Expired)
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.78rem' }}>
                          <div style={{ color: '#0f172a', fontWeight: '600' }}>
                            📅 Expiry: <strong>{c.renewalDate}</strong>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: daysRemaining !== null && daysRemaining < 15 ? '#dc2626' : '#64748b' }}>
                            {daysRemaining !== null ? (
                              daysRemaining > 0 ? `${daysRemaining} days remaining` : `Expired ${Math.abs(daysRemaining)} days ago`
                            ) : 'No end date set'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                          <div><strong>{graceDays} Days</strong> Grace</div>
                          <div style={{ fontSize: '0.68rem', color: c.autoSuspendAfterGrace !== false ? '#16a34a' : '#64748b' }}>
                            {c.autoSuspendAfterGrace !== false ? '✓ Auto-suspend ON' : '✕ Auto-suspend OFF'}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                            onClick={() => handleOpenSubscriptionModal(c)}
                            title="Assign or Change SaaS Plan"
                          >
                            <CreditCard size={12} /> Assign Plan
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#7c3aed', borderColor: '#ddd6fe', background: '#f5f3ff' }}
                            onClick={() => handleOpenUpgradeDowngrade(c)}
                            title="Upgrade or Downgrade Subscription Tier"
                          >
                            <TrendingUp size={12} /> Up/Downgrade
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                            onClick={() => handleOpenRenewSub(c)}
                            title="Renew Subscription"
                          >
                            <RefreshCcw size={12} /> Renew
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                            onClick={() => handleOpenConfigDates(c)}
                            title="Configure Subscription & Trial Start/End Dates & Grace Period"
                          >
                            <Calendar size={12} /> Dates &amp; Grace
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
          MODAL: PROVISION TENANT (FREE TRIAL, STARTER, PRO, ENTERPRISE, CUSTOM)
          ===================================================================== */}
      {isCreateCompanyOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={24} color="#d97706" />
                <div>
                  <h3>Provision Isolated Pharma Tenant</h3>
                  <p>Configure Free Trial, Starter, Professional, Enterprise or Custom tier with start/end times.</p>
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
                    placeholder="e.g. Alleviare Pharma Global Ltd."
                    value={newCompanyForm.name}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Tenant Unique Code</label>
                  <input
                    type="text"
                    placeholder="e.g. alleviare-global"
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
                  <label>Subscription Tier *</label>
                  <select
                    value={newCompanyForm.plan}
                    onChange={(e) => {
                      const selectedPlan = e.target.value;
                      if (selectedPlan === 'FREE_TRIAL') {
                        applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 14);
                      } else {
                        applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 365);
                      }
                      setNewCompanyForm(prev => ({ ...prev, plan: selectedPlan }));
                    }}
                    className="form-control"
                    style={{ fontWeight: '700' }}
                  >
                    <option value="FREE_TRIAL">Free Trial / Demo ($0)</option>
                    <option value="STARTER">Starter Tier ($100/mo)</option>
                    <option value="PROFESSIONAL">Professional Tier ($1,000/mo)</option>
                    <option value="ENTERPRISE">Enterprise Tier ($2,500/mo)</option>
                    <option value="CUSTOM">Custom Pricing (User Defined)</option>
                  </select>
                </div>
              </div>

              {/* Custom Pricing Input if CUSTOM is selected */}
              {newCompanyForm.plan === 'CUSTOM' && (
                <div className="form-group" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px' }}>
                  <label>Custom Monthly Rate ($ USD) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newCompanyForm.customRate}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, customRate: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              )}

              {/* Dynamic Local Currency & Tax Scheme Preview */}
              {(() => {
                const currentCountry = sovereignRegistry.find(c => c.name === newCompanyForm.country || c.code === newCompanyForm.countryCode) || sovereignRegistry[0];
                const isTrial = newCompanyForm.plan === 'FREE_TRIAL';
                const usdRate = isTrial ? 0 : (newCompanyForm.plan === 'CUSTOM' ? Number(newCompanyForm.customRate) || 0 : (newCompanyForm.plan === 'ENTERPRISE' ? 2500 : (newCompanyForm.plan === 'PROFESSIONAL' ? 1000 : 100)));
                const localRate = (usdRate * (currentCountry.fxRateToUSD || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                return (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', margin: '6px 0 12px', fontSize: '0.8rem', color: '#166534' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span><strong>💱 Real-Time Local Billing:</strong> {isTrial ? 'Free Trial ($0.00)' : `${currentCountry.currencySymbol} ${localRate} ${currentCountry.currencyCode}`}</span>
                      <span style={{ fontSize: '0.72rem', color: '#15803d', fontFamily: 'monospace' }}>(1 USD = {(currentCountry.fxRateToUSD || 1).toLocaleString()} {currentCountry.currencyCode})</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#14532d' }}>
                      <strong>🏛️ Statutory Tax Standard:</strong> {currentCountry.taxScheme} | <strong>⏰ Timezone:</strong> {currentCountry.timezone}
                    </div>
                  </div>
                );
              })()}

              {/* Start & End Date Time Picker with Duration Presets */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', margin: '4px 0 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Subscription / Trial Validity Timestamps:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 7)}>+7d Trial</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 14)}>+14d Trial</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 30)}>+30d Demo</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setNewCompanyForm, newCompanyForm.startAt, 365)}>+1 Year</button>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>Start Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={newCompanyForm.startAt}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, startAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>End / Expiry Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={newCompanyForm.endAt}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, endAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
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

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Auto-Assigned Currency</label>
                  <input
                    type="text"
                    readOnly
                    value={`${newCompanyForm.currency}`}
                    className="form-control"
                    style={{ background: '#f1f5f9', fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Auto-Assigned Timezone</label>
                  <input
                    type="text"
                    readOnly
                    value={newCompanyForm.timezone}
                    className="form-control"
                    style={{ background: '#f1f5f9', fontWeight: '700' }}
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
          MODAL: EDIT COMPANY (UPDATE & TRIAL SETTINGS)
          ===================================================================== */}
      {isEditCompanyOpen && editingCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Edit size={22} color="#2563eb" />
                <div>
                  <h3>Edit Pharma Company</h3>
                  <p>Update jurisdiction, currency, timezone, and subscription validity.</p>
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
                  <label>Sovereign Country Jurisdiction</label>
                  <select
                    className="form-control"
                    value={editCompanyForm.country}
                    onChange={(e) => handleEditCompanyCountryChange(e.target.value)}
                  >
                    {sovereignRegistry.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Subscription Tier</label>
                  <select
                    className="form-control"
                    value={editCompanyForm.plan}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, plan: e.target.value })}
                  >
                    <option value="FREE_TRIAL">Free Trial / Demo ($0)</option>
                    <option value="STARTER">Starter Tier ($100/mo)</option>
                    <option value="PROFESSIONAL">Professional Tier ($1,000/mo)</option>
                    <option value="ENTERPRISE">Enterprise Tier ($2,500/mo)</option>
                    <option value="CUSTOM">Custom Pricing (User Defined)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={editCompanyForm.status}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="TRIAL">TRIAL</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="DEACTIVATED">DEACTIVATED</option>
                  </select>
                </div>
              </div>

              {editCompanyForm.plan === 'CUSTOM' && (
                <div className="form-group" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px' }}>
                  <label>Custom Monthly Rate ($ USD)</label>
                  <input
                    type="number"
                    value={editCompanyForm.customRate}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, customRate: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              )}

              {/* Dynamic Local Currency & Tax Scheme Preview in Edit Modal */}
              {(() => {
                const currentCountry = sovereignRegistry.find(c => c.name === editCompanyForm.country || c.code === editCompanyForm.countryCode) || sovereignRegistry[0];
                const isTrial = editCompanyForm.plan === 'FREE_TRIAL';
                const usdRate = isTrial ? 0 : (editCompanyForm.plan === 'CUSTOM' ? Number(editCompanyForm.customRate) || 0 : (editCompanyForm.plan === 'ENTERPRISE' ? 2500 : (editCompanyForm.plan === 'PROFESSIONAL' ? 1000 : 100)));
                const localRate = (usdRate * (currentCountry.fxRateToUSD || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                return (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', margin: '6px 0 12px', fontSize: '0.8rem', color: '#166534' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span><strong>💱 Real-Time Local Billing:</strong> {isTrial ? 'Free Trial ($0.00)' : `${currentCountry.currencySymbol} ${localRate} ${currentCountry.currencyCode}`}</span>
                      <span style={{ fontSize: '0.72rem', color: '#15803d', fontFamily: 'monospace' }}>(1 USD = {(currentCountry.fxRateToUSD || 1).toLocaleString()} {currentCountry.currencyCode})</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#14532d' }}>
                      <strong>🏛️ Statutory Tax:</strong> {currentCountry.taxScheme} | <strong>⏰ Timezone:</strong> {editCompanyForm.timezone}
                    </div>
                  </div>
                );
              })()}

              {/* Start & End Timestamps in Edit Modal */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', margin: '4px 0 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Subscription / Trial Validity Period:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setEditCompanyForm, editCompanyForm.startAt, 7)}>+7d</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setEditCompanyForm, editCompanyForm.startAt, 30)}>+30d</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setEditCompanyForm, editCompanyForm.startAt, 365)}>+1 Year</button>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>Start Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={editCompanyForm.startAt}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, startAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>End Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={editCompanyForm.endAt}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, endAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
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
                  <label>Assigned Currency &amp; Timezone</label>
                  <input
                    type="text"
                    readOnly
                    value={`${editCompanyForm.currency} (${editCompanyForm.timezone})`}
                    className="form-control"
                    style={{ background: '#f1f5f9', fontWeight: '700' }}
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
          MODAL: VIEW COMPANY (COMPLETE TELEMETRY & GOVERNANCE INSPECTOR)
          ===================================================================== */}
      {isViewCompanyOpen && viewingCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span style={{ fontSize: '1.8rem', marginRight: '4px' }}>{viewingCompany.flag || '🏢'}</span>
                <div>
                  <h3>{viewingCompany.name}</h3>
                  <p>Tenant Code: <strong>{viewingCompany.code}</strong> &bull; Jurisdiction: <strong>{viewingCompany.country}</strong></p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsViewCompanyOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {/* Top Quick Telemetry KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700' }}>STATUS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>{viewingCompany.status}</div>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: '700' }}>TOTAL USERS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>{viewingCompany.usersCount || viewingCompany.user_count || 0}</div>
                </div>
                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6b21a8', fontWeight: '700' }}>PLAN TIER</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#7c3aed', marginTop: '2px' }}>{viewingCompany.plan}</div>
                </div>
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#854d0e', fontWeight: '700' }}>MONTHLY RATE</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#a16207', marginTop: '2px' }}>{viewingCompany.mrr}</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <h4 style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: '800', marginBottom: '8px' }}>🏢 Commercial &amp; Sovereign Profile</h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: '1.7', color: '#334155' }}>
                    <div>Legal Name: <strong>{viewingCompany.legalName || viewingCompany.name}</strong></div>
                    <div>Default Currency: <strong>{viewingCompany.currency}</strong></div>
                    <div>Default Timezone: <strong>{viewingCompany.timezone}</strong></div>
                    <div>Billing Cycle: <strong>{viewingCompany.billingCycle || 'Monthly'}</strong></div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <h4 style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: '800', marginBottom: '8px' }}>🛡️ Root Company Administrator</h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: '1.7', color: '#334155' }}>
                    <div>Admin Name: <strong>{viewingCompany.adminName || 'Company Administrator'}</strong></div>
                    <div>Admin Email: <strong>{viewingCompany.adminEmail || 'admin@' + viewingCompany.code.toLowerCase() + '.com'}</strong></div>
                    <div>Expiry / Renewal: <strong>{viewingCompany.renewalDate}</strong></div>
                  </div>
                </div>
              </div>

              {/* Quick Action Shortcuts inside View Modal */}
              <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '10px 14px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Direct Governance Actions:</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="action-pill-btn"
                    onClick={() => {
                      setIsViewCompanyOpen(false);
                      handleOpenExtendSubscription(viewingCompany);
                    }}
                  >
                    <CalendarPlus size={12} /> Extend Validity
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn primary"
                    onClick={() => {
                      setIsViewCompanyOpen(false);
                      handleOpenSubscriptionModal(viewingCompany);
                    }}
                  >
                    <CreditCard size={12} /> Change Plan
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn"
                    onClick={() => {
                      setIsViewCompanyOpen(false);
                      handleOpenAssignAdmin(viewingCompany);
                    }}
                  >
                    <UserPlus size={12} /> Assign Admin
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn"
                    onClick={() => {
                      setIsViewCompanyOpen(false);
                      handleOpenResetAdminPassword(viewingCompany);
                    }}
                  >
                    <Key size={12} /> Reset Pwd
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                    onClick={() => {
                      setIsViewCompanyOpen(false);
                      handleImpersonateCompany(viewingCompany);
                    }}
                  >
                    <ShieldCheck size={12} /> Login as Admin
                  </button>
                </div>
              </div>

              <div className="modal-actions-bar" style={{ marginTop: '16px' }}>
                <button type="button" className="btn btn-primary" onClick={() => setIsViewCompanyOpen(false)}>
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ASSIGN ROOT COMPANY ADMIN
          ===================================================================== */}
      {isAssignAdminOpen && assignAdminTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <UserPlus size={22} color="#0284c7" />
                <div>
                  <h3>Assign Root Company Administrator</h3>
                  <p>Assign or change the root admin for <strong>{assignAdminTarget.name}</strong></p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsAssignAdminOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmAssignAdmin} className="modal-form-body">
              <div className="form-group">
                <label>Admin Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Nguyen Van Minh"
                  value={assignAdminForm.adminName}
                  onChange={(e) => setAssignAdminForm({ ...assignAdminForm, adminName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Admin Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@company.com"
                  value={assignAdminForm.adminEmail}
                  onChange={(e) => setAssignAdminForm({ ...assignAdminForm, adminEmail: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Admin Initial Password (optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank for default Admin@1234!"
                  value={assignAdminForm.adminPassword}
                  onChange={(e) => setAssignAdminForm({ ...assignAdminForm, adminPassword: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsAssignAdminOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={16} /> <span>Assign Administrator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EXTEND SUBSCRIPTION / TRIAL DURATION
          ===================================================================== */}
      {isExtendSubscriptionOpen && extendSubTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <CalendarPlus size={22} color="#16a34a" />
                <div>
                  <h3>Extend Subscription / Trial Duration</h3>
                  <p>Add validity days for <strong>{extendSubTarget.name}</strong> ({extendSubTarget.plan})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsExtendSubscriptionOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmExtendSubscription} className="modal-form-body">
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.82rem', color: '#166534' }}>
                <div>Current Expiry Date: <strong>{extendSubTarget.renewalDate}</strong></div>
                <div>Subscription Status: <strong>{extendSubTarget.status}</strong></div>
              </div>

              <div className="form-group">
                <label>Quick Validity Extension Presets:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 7 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(7)}>+7 Days</button>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 14 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(14)}>+14 Days (Trial)</button>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 30 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(30)}>+30 Days (1 Month)</button>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 90 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(90)}>+90 Days (Quarter)</button>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 180 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(180)}>+180 Days (Half Yr)</button>
                  <button type="button" className={`action-pill-btn ${extendDaysInput === 365 ? 'primary' : ''}`} onClick={() => setExtendDaysInput(365)}>+365 Days (1 Year)</button>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Days to Add *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={extendDaysInput}
                  onChange={(e) => setExtendDaysInput(Number(e.target.value))}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Reason / Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Extended demo evaluation period upon request"
                  value={extendReasonInput}
                  onChange={(e) => setExtendReasonInput(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsExtendSubscriptionOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CalendarPlus size={16} /> <span>Apply Duration Extension</span>
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
          MODAL: CHANGE ADMIN PERMISSIONS (RBAC GOVERNANCE)
          ===================================================================== */}
      {isPermissionsModalOpen && permissionsTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Sliders size={22} color="#0284c7" />
                <div>
                  <h3>Change Administrator Permissions (RBAC)</h3>
                  <p>Configure granular functional permissions for <strong>{permissionsTarget.name}</strong> ({permissionsTarget.email})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsPermissionsModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveUserPermissions} className="modal-form-body">
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.8rem', color: '#0369a1' }}>
                <strong>Assigned Organization:</strong> {permissionsTarget.company} | <strong>Current Role:</strong> {permissionsTarget.role}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'manage_users', label: '👥 User & Rep Management', desc: 'Create, edit & manage field reps' },
                  { key: 'manage_products', label: '💊 Product Catalog', desc: 'Manage medicines, SKU & prices' },
                  { key: 'manage_orders', label: '📦 Orders & Booking', desc: 'Approve chemist & doctor orders' },
                  { key: 'manage_doctors', label: '🩺 Doctor Directory', desc: 'Manage healthcare specialists' },
                  { key: 'manage_dcr', label: '📋 DCR & Call Logs', desc: 'Approve daily call submissions' },
                  { key: 'view_analytics', label: '📊 Sales & Revenue Analytics', desc: 'Access financial charts & KPI' },
                  { key: 'export_data', label: '📥 Data & Report Export', desc: 'Export spreadsheets & PDF files' },
                  { key: 'manage_settings', label: '⚙️ Company Settings', desc: 'Manage policies, holidays & tiers' }
                ].map((perm) => (
                  <label
                    key={perm.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: userPermissionsForm[perm.key] ? '#f8fafc' : '#ffffff',
                      border: userPermissionsForm[perm.key] ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(userPermissionsForm[perm.key])}
                      onChange={(e) => setUserPermissionsForm({ ...userPermissionsForm, [perm.key]: e.target.checked })}
                      style={{ marginTop: '3px', accentColor: '#0284c7', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>{perm.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{perm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="modal-actions-bar" style={{ marginTop: '18px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsPermissionsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save Permissions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LOCK / UNLOCK USER ACCOUNT
          ===================================================================== */}
      {isLockUserOpen && lockUserTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Lock size={22} color={lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? '#16a34a' : '#dc2626'} />
                <div>
                  <h3>{lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? 'Unlock Administrator Account' : 'Lock Administrator Account'}</h3>
                  <p>{lockUserTarget.name} ({lockUserTarget.email})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsLockUserOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmLockUser} className="modal-form-body">
              <div style={{ background: lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? '#f0fdf4' : '#fef2f2', border: lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? '1px solid #bbf7d0' : '1px solid #fecdd3', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.82rem', color: lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? '#166534' : '#991b1b' }}>
                {lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED'
                  ? '🔓 Unlocking this account will restore full login access for this administrator immediately.'
                  : '🔒 Locking this account will immediately block all login attempts and invalidate active sessions.'}
              </div>

              {!(lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED') && (
                <div className="form-group">
                  <label>Lock Reason / Security Audit Note</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Excessive failed logins / Policy violation"
                    value={lockReasonInput}
                    onChange={(e) => setLockReasonInput(e.target.value)}
                    className="form-control"
                  />
                </div>
              )}

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsLockUserOpen(false)}>Cancel</button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? '#16a34a' : '#dc2626',
                    color: '#ffffff'
                  }}
                >
                  <Lock size={16} /> <span>{lockUserTarget.isLocked || lockUserTarget.status === 'LOCKED' ? 'Confirm & Unlock Account' : 'Confirm & Lock Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW ADMIN ACTIVITY AUDIT TRAIL
          ===================================================================== */}
      {isUserActivityOpen && activityTargetUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Activity size={22} color="#059669" />
                <div>
                  <h3>Administrator Activity Log</h3>
                  <p>Audit trail of operations performed by <strong>{activityTargetUser.name}</strong> ({activityTargetUser.email})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsUserActivityOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {isActivitiesLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 8px', display: 'block' }} />
                  Loading activity logs...
                </div>
              ) : userActivitiesList.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                  No recent activities recorded for this administrator.
                </div>
              ) : (
                <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {userActivitiesList.map((act, idx) => (
                    <div
                      key={act.id || idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>
                          {act.action || act.title || 'ADMIN_ACTION'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                          {typeof act.details === 'object' ? JSON.stringify(act.details) : (act.details || act.detail || 'Standard operation executed')}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {new Date(act.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions-bar" style={{ marginTop: '16px' }}>
                <button type="button" className="btn btn-primary" onClick={() => setIsUserActivityOpen(false)}>Close Activity Viewer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW ADMIN LOGIN HISTORY
          ===================================================================== */}
      {isUserLoginHistoryOpen && loginHistoryTargetUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Clock size={22} color="#d97706" />
                <div>
                  <h3>Admin Login &amp; Session History</h3>
                  <p>Recent authentication sessions for <strong>{loginHistoryTargetUser.name}</strong> ({loginHistoryTargetUser.email})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsUserLoginHistoryOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {isLoginHistoryLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 8px', display: 'block' }} />
                  Loading login sessions...
                </div>
              ) : userLoginHistoryList.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                  No recorded login history for this user.
                </div>
              ) : (
                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  <table className="saas-data-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>IP Address</th>
                        <th>Device / Browser</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLoginHistoryList.map((log, idx) => (
                        <tr key={log.id || idx}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {new Date(log.created_at || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{log.ip_address || '127.0.0.1'}</td>
                          <td>{log.device_info || 'Chrome / Web Portal'}</td>
                          <td>{log.location || 'Global Cloud'}</td>
                          <td>
                            <span className={`status-tag status-${(log.status || 'SUCCESS').toLowerCase() === 'success' ? 'active' : 'suspended'}`}>
                              {log.status || 'SUCCESS'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="modal-actions-bar" style={{ marginTop: '16px' }}>
                <button type="button" className="btn btn-primary" onClick={() => setIsUserLoginHistoryOpen(false)}>Close Session Viewer</button>
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
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Globe2 size={22} color="#d97706" />
                <div>
                  <h3>Add Sovereign Jurisdiction</h3>
                  <p>Register a new sovereign market with statutory compliance, FX exchange rate, and timezone.</p>
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

              <div className="form-grid-3">
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
                <div className="form-group">
                  <label>Exchange Rate (per 1 USD) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    required
                    placeholder="e.g. 3.6725"
                    value={newCountryForm.fxRateToUSD}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, fxRateToUSD: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Primary IANA Timezone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asia/Dubai"
                    value={newCountryForm.primaryTimezone}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, primaryTimezone: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Fiscal Year</label>
                  <input
                    type="text"
                    placeholder="e.g. January - December"
                    value={newCountryForm.fiscalYear}
                    onChange={(e) => setNewCountryForm({ ...newCountryForm, fiscalYear: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tax &amp; Withholding Scheme</label>
                <input
                  type="text"
                  placeholder="e.g. VAT 5% + Corporate Tax 9%"
                  value={newCountryForm.taxScheme}
                  onChange={(e) => setNewCountryForm({ ...newCountryForm, taxScheme: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Social Security / Statutory Care</label>
                <input
                  type="text"
                  placeholder="e.g. GPSSA Pension / Statutory Insurance"
                  value={newCountryForm.socialSecurity}
                  onChange={(e) => setNewCountryForm({ ...newCountryForm, socialSecurity: e.target.value })}
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
          MODAL: EDIT COUNTRY STATUTORY COMPLIANCE & FX
          ===================================================================== */}
      {isEditCountryOpen && editingCountry && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Settings size={22} color="#2563eb" />
                <div>
                  <h3>Configure Sovereign Jurisdiction</h3>
                  <p>Update currency, live FX rate, timezone, and statutory tax rules for {editingCountry.name} ({editingCountry.code})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditCountryOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleUpdateCountry} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Country Commercial Name</label>
                  <input
                    type="text"
                    required
                    value={editCountryForm.name}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Primary IANA Timezone</label>
                  <input
                    type="text"
                    required
                    value={editCountryForm.primaryTimezone}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, primaryTimezone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Currency ISO Code</label>
                  <input
                    type="text"
                    required
                    value={editCountryForm.currencyCode}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, currencyCode: e.target.value.toUpperCase() })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Currency Symbol</label>
                  <input
                    type="text"
                    value={editCountryForm.currencySymbol}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, currencySymbol: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Exchange Rate (per 1 USD)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    required
                    value={editCountryForm.fxRateToUSD}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, fxRateToUSD: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontWeight: '700', color: '#1e40af' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tax &amp; Withholding Scheme</label>
                <input
                  type="text"
                  value={editCountryForm.taxScheme}
                  onChange={(e) => setEditCountryForm({ ...editCountryForm, taxScheme: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Social Security / Statutory Fund</label>
                  <input
                    type="text"
                    value={editCountryForm.socialSecurity}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, socialSecurity: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Fiscal Year</label>
                  <input
                    type="text"
                    value={editCountryForm.fiscalYear}
                    onChange={(e) => setEditCountryForm({ ...editCountryForm, fiscalYear: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditCountryOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save Sovereign Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MANAGE SUBSCRIPTION (FREE TRIAL, STARTER, PRO, ENTERPRISE, CUSTOM WITH TIMESTAMPS)
          ===================================================================== */}
      {isSubscriptionModalOpen && subModalTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <CreditCard size={22} color="#059669" />
                <div>
                  <h3>Manage Subscription &amp; Validity</h3>
                  <p>Assign Free Trial, Starter, Professional, Enterprise, or Custom plan for {subModalTarget.name}</p>
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
                    let rate = 100;
                    if (tier === 'FREE_TRIAL') {
                      rate = 0;
                      applyDurationPreset(setSubModalForm, subModalForm.startAt, 14);
                    } else if (tier === 'CUSTOM') {
                      rate = Number(subModalForm.customRate) || 0;
                    } else if (tier === 'ENTERPRISE') {
                      rate = 2500;
                    } else if (tier === 'PROFESSIONAL' || tier === 'PRO') {
                      rate = 1000;
                    } else {
                      rate = 100;
                    }
                    setSubModalForm(prev => ({ ...prev, planTier: tier, amountBilled: rate }));
                  }}
                  style={{ fontWeight: '700' }}
                >
                  <option value="FREE_TRIAL">Free Trial / Demo ($0)</option>
                  <option value="STARTER">Starter Tier ($100/mo)</option>
                  <option value="PROFESSIONAL">Professional Tier ($1,000/mo)</option>
                  <option value="ENTERPRISE">Enterprise Tier ($2,500/mo)</option>
                  <option value="CUSTOM">Custom Pricing (User Defined)</option>
                </select>
              </div>

              {subModalForm.planTier === 'CUSTOM' && (
                <div className="form-group" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px' }}>
                  <label>Custom Monthly Rate ($ USD) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={subModalForm.customRate}
                    onChange={(e) => setSubModalForm({ ...subModalForm, customRate: Number(e.target.value), amountBilled: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              )}

              {/* Start & End Timestamps with Presets */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', margin: '4px 0 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Subscription / Trial Validity Period:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setSubModalForm, subModalForm.startAt, 7)}>+7d Trial</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setSubModalForm, subModalForm.startAt, 14)}>+14d Trial</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setSubModalForm, subModalForm.startAt, 30)}>+30d Demo</button>
                    <button type="button" className="action-pill-btn" onClick={() => applyDurationPreset(setSubModalForm, subModalForm.startAt, 365)}>+1 Year</button>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>Start Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={subModalForm.startAt}
                      onChange={(e) => setSubModalForm({ ...subModalForm, startAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.72rem' }}>End Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={subModalForm.endAt}
                      onChange={(e) => setSubModalForm({ ...subModalForm, endAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsSubscriptionModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> <span>Save &amp; Update Live Revenue</span>
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

      {/* =====================================================================
          MODAL: CREATE SAAS PLAN
          ===================================================================== */}
      {isCreatePlanOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <CreditCard size={22} color="#0284c7" />
                <div>
                  <h3>Create SaaS Subscription Plan</h3>
                  <p>Define a new monetization tier, pricing, trial length &amp; grace period.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreatePlanOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreatePlan} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Plan Code (Unique ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GROWTH_PLUS"
                    value={newPlanForm.code}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, code: e.target.value.toUpperCase() })}
                    className="form-control"
                    style={{ fontFamily: 'monospace', fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Plus Tier"
                    value={newPlanForm.name}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Summary of target pharma companies and scale..."
                  value={newPlanForm.description}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Monthly Price ($ USD) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 500"
                    value={newPlanForm.priceMonthly}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, priceMonthly: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Annual Price ($ USD) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 5000"
                    value={newPlanForm.priceYearly}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, priceYearly: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Default Trial Duration (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlanForm.trialDays}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, trialDays: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Grace Period Before Suspend (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlanForm.gracePeriodDays}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, gracePeriodDays: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Features &amp; Modules List (1 per line)</label>
                <textarea
                  rows={4}
                  placeholder="Unlimited Field Reps&#10;Core MR Reporting&#10;POB Order Booking"
                  value={newPlanForm.featuresText}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, featuresText: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreatePlanOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> <span>Create &amp; Publish Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDIT SAAS PLAN
          ===================================================================== */}
      {isEditPlanOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Edit size={22} color="#0284c7" />
                <div>
                  <h3>Edit SaaS Plan: {editingPlanForm.name}</h3>
                  <p>Modify pricing, limits, trial days, and grace period.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditPlanOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleUpdatePlan} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Plan Code</label>
                  <input
                    type="text"
                    disabled
                    value={editingPlanForm.code}
                    className="form-control disabled-input"
                    style={{ fontFamily: 'monospace', fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPlanForm.name}
                    onChange={(e) => setEditingPlanForm({ ...editingPlanForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editingPlanForm.description}
                  onChange={(e) => setEditingPlanForm({ ...editingPlanForm, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Monthly Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPlanForm.priceMonthly}
                    onChange={(e) => setEditingPlanForm({ ...editingPlanForm, priceMonthly: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Annual Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPlanForm.priceYearly}
                    onChange={(e) => setEditingPlanForm({ ...editingPlanForm, priceYearly: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Default Trial Duration (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPlanForm.trialDays}
                    onChange={(e) => setEditingPlanForm({ ...editingPlanForm, trialDays: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Grace Period (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPlanForm.gracePeriodDays}
                    onChange={(e) => setEditingPlanForm({ ...editingPlanForm, gracePeriodDays: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={editingPlanForm.featuresText}
                  onChange={(e) => setEditingPlanForm({ ...editingPlanForm, featuresText: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditPlanOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> <span>Save Plan Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DELETE SAAS PLAN
          ===================================================================== */}
      {isDeletePlanOpen && deletingPlan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Trash2 size={22} color="#dc2626" />
                <div>
                  <h3>Delete Plan: {deletingPlan.name}</h3>
                  <p>Confirm plan removal from available subscription tiers.</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsDeletePlanOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                Are you sure you want to permanently delete the <strong>{deletingPlan.name} ({deletingPlan.code})</strong> plan?
                Active companies currently enrolled must be reassigned first.
              </p>

              <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsDeletePlanOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" style={{ background: '#dc2626' }} onClick={handleConfirmDeletePlan}>
                  <Trash2 size={16} /> <span>Delete Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: UPGRADE / DOWNGRADE COMPANY PLAN TIER
          ===================================================================== */}
      {isUpgradeDowngradeOpen && upgradeTargetCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <TrendingUp size={22} color="#7c3aed" />
                <div>
                  <h3>Upgrade / Downgrade Subscription</h3>
                  <p>{upgradeTargetCompany.name} (Current: {upgradeTargetCompany.plan})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsUpgradeDowngradeOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmUpgradeDowngrade} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Operation Type</label>
                  <select
                    className="form-control"
                    value={upgradeForm.actionType}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, actionType: e.target.value })}
                  >
                    <option value="UPGRADE">🚀 Upgrade Plan Tier</option>
                    <option value="DOWNGRADE">📉 Downgrade Plan Tier</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Subscription Tier *</label>
                  <select
                    className="form-control"
                    value={upgradeForm.targetTier}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, targetTier: e.target.value })}
                    style={{ fontWeight: '700' }}
                  >
                    <option value="FREE_TRIAL">Free Trial / Demo ($0)</option>
                    <option value="STARTER">Starter Tier ($100/mo)</option>
                    <option value="PROFESSIONAL">Professional Tier ($1,000/mo)</option>
                    <option value="ENTERPRISE">Enterprise Tier ($2,500/mo)</option>
                    <option value="CUSTOM">Custom Pricing (User Defined)</option>
                  </select>
                </div>
              </div>

              {upgradeForm.targetTier === 'CUSTOM' && (
                <div className="form-group" style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <label>Custom Monthly Rate ($ USD) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3500"
                    value={upgradeForm.customRate}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, customRate: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Reason / Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Client requested enterprise feature expansion"
                  value={upgradeForm.reason}
                  onChange={(e) => setUpgradeForm({ ...upgradeForm, reason: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsUpgradeDowngradeOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#7c3aed' }}>
                  <TrendingUp size={16} /> <span>Confirm Tier Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: RENEW SUBSCRIPTION
          ===================================================================== */}
      {isRenewSubOpen && renewTargetCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <RefreshCcw size={22} color="#059669" />
                <div>
                  <h3>Renew Subscription Validity</h3>
                  <p>{renewTargetCompany.name} ({renewTargetCompany.plan})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsRenewSubOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmRenewSub} className="modal-form-body">
              <div className="form-group">
                <label>Renewal Term Preset</label>
                <select
                  className="form-control"
                  value={renewForm.durationMonths}
                  onChange={(e) => {
                    const months = Number(e.target.value);
                    const baseRate = typeof renewTargetCompany.mrr === 'string' && renewTargetCompany.mrr.includes('$')
                      ? Number(renewTargetCompany.mrr.replace(/[^0-9.]/g, '')) || 100
                      : (renewTargetCompany.customMRR || 100);
                    setRenewForm({
                      ...renewForm,
                      durationMonths: months,
                      amountBilled: baseRate * months
                    });
                  }}
                  style={{ fontWeight: '700' }}
                >
                  <option value={1}>+1 Month Extension</option>
                  <option value={3}>+3 Months Extension (Quarterly)</option>
                  <option value={6}>+6 Months Extension (Semi-Annual)</option>
                  <option value={12}>+12 Months Extension (Annual Renewal)</option>
                  <option value={24}>+24 Months Extension (2-Year Enterprise)</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Renewal Amount ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={renewForm.amountBilled}
                    onChange={(e) => setRenewForm({ ...renewForm, amountBilled: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Additional Grace Days (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={renewForm.additionalDays}
                    onChange={(e) => setRenewForm({ ...renewForm, additionalDays: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Renewal Notes / Invoice Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Wire transfer PO #49102"
                  value={renewForm.notes}
                  onChange={(e) => setRenewForm({ ...renewForm, notes: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsRenewSubOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#059669' }}>
                  <RefreshCcw size={16} /> <span>Confirm &amp; Process Renewal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONFIGURE SUBSCRIPTION DATES & GRACE PERIOD
          ===================================================================== */}
      {isConfigDatesOpen && configTargetCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Calendar size={22} color="#b45309" />
                <div>
                  <h3>Subscription Dates, Trial &amp; Grace Period</h3>
                  <p>{configTargetCompany.name} ({configTargetCompany.plan})</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsConfigDatesOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleConfirmConfigDates} className="modal-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Subscription Start Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={configDatesForm.subscriptionStartAt}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, subscriptionStartAt: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Subscription Expiry Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={configDatesForm.subscriptionEndAt}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, subscriptionEndAt: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Trial Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={configDatesForm.trialStartAt}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, trialStartAt: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Trial Expiry Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={configDatesForm.trialEndAt}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, trialEndAt: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Grace Period Allowed (Days)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={configDatesForm.gracePeriodDays}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, gracePeriodDays: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div className="form-group">
                  <label>Account Status</label>
                  <select
                    className="form-control"
                    value={configDatesForm.status}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="TRIAL">Trial</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', margin: '4px 0 16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(configDatesForm.autoSuspendAfterGrace)}
                    onChange={(e) => setConfigDatesForm({ ...configDatesForm, autoSuspendAfterGrace: e.target.checked })}
                    style={{ accentColor: '#dc2626', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
                      Suspend Account Automatically After Grace Period Expires
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      If enabled, when expiry date + grace period passes, the tenant company status is changed to SUSPENDED.
                    </div>
                  </div>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsConfigDatesOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#b45309' }}>
                  <Save size={16} /> <span>Save Dates &amp; Grace Policy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PROCESS SUBSCRIPTION EXPIRIES & GRACE AUDIT
          ===================================================================== */}
      {isProcessExpiriesOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <RefreshCw size={22} color="#0284c7" />
                <div>
                  <h3>Subscription Expiry &amp; Grace Period Engine</h3>
                  <p>Automated policy enforcement across all tenant organizations</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsProcessExpiriesOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {processExpiriesResult.loading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#0284c7' }}>
                  <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontWeight: '700' }}>Evaluating Tenant Subscription &amp; Grace Schedules...</div>
                </div>
              ) : (
                <div>
                  <div style={{ background: processExpiriesResult.suspendedCount > 0 ? '#fffbeb' : '#f0fdf4', border: processExpiriesResult.suspendedCount > 0 ? '1px solid #fde68a' : '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: '800', color: processExpiriesResult.suspendedCount > 0 ? '#92400e' : '#166534', fontSize: '0.92rem' }}>
                      {processExpiriesResult.message}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: processExpiriesResult.suspendedCount > 0 ? '#b45309' : '#15803d', marginTop: '4px' }}>
                      Total accounts auto-suspended: <strong>{processExpiriesResult.suspendedCount}</strong>
                    </div>
                  </div>

                  {processExpiriesResult.suspendedCompanies && processExpiriesResult.suspendedCompanies.length > 0 && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <table className="saas-data-table" style={{ margin: 0 }}>
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Plan</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processExpiriesResult.suspendedCompanies.map((sc, i) => (
                            <tr key={i}>
                              <td><strong>{sc.name}</strong></td>
                              <td><span className="plan-pill plan-pro">{sc.plan}</span></td>
                              <td><span className="status-tag status-suspended">SUSPENDED</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setIsProcessExpiriesOpen(false)}>
                      Close Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
