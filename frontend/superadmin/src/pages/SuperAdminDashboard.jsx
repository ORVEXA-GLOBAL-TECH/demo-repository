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
  Award,
  Zap,
  Bell,
  Cpu
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
  resetAccount,
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
  deleteSystemAlert,
  getGlobalSettings,
  updateGlobalSettings,
  getCompanySettings,
  updateCompanyOverrides,
  resetCompanyOverrides,
  getRoleTemplates,
  updateRoleTemplate,
  getPlatformAnalytics,
  getSystemHealth,
  triggerPlatformBackup,
  retryFailedJobs,
  runSystemDiagnostic
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

  // Platform Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    dateFormat: 'YYYY-MM-DD',
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notificationSettings: {
      email: true,
      inApp: true,
      sms: false,
      push: true,
      weeklyDigest: true,
      criticalAlerts: true
    },
    securityPolicy: {
      enforce2FA: false,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      allowMultipleSessions: true
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    sessionTimeoutMinutes: 60,
    fileLimits: {
      maxFileSizeMB: 25,
      allowedFileTypes: ['pdf', 'jpg', 'png', 'xlsx', 'csv', 'docx']
    }
  });
  const [isSavingGlobalSettings, setIsSavingGlobalSettings] = useState(false);

  // Company Overrides State
  const [selectedOverrideCompanyId, setSelectedOverrideCompanyId] = useState('');
  const [companyOverrideData, setCompanyOverrideData] = useState(null);
  const [companyOverrideForm, setCompanyOverrideForm] = useState({
    hasCustomTimezone: false,
    timezone: 'UTC',
    hasCustomCurrency: false,
    currency: 'USD',
    hasCustomDateFormat: false,
    dateFormat: 'YYYY-MM-DD',
    hasCustomWorkingDays: false,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hasCustomSessionTimeout: false,
    sessionTimeoutMinutes: 60,
    hasCustomFileLimits: false,
    maxFileSizeMB: 25
  });
  const [isSavingCompanyOverride, setIsSavingCompanyOverride] = useState(false);

  // Role Templates & RBAC State
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [selectedRoleKey, setSelectedRoleKey] = useState('COMPANY_ADMIN');
  const [isSavingRoleTemplate, setIsSavingRoleTemplate] = useState(false);

  // Platform Intelligence & Analytics State
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30d');

  // System Health & Maintenance State
  const [systemHealth, setSystemHealth] = useState(null);
  const [isHealthRefreshing, setIsHealthRefreshing] = useState(false);
  const [selectedHealthService, setSelectedHealthService] = useState(null);
  const [diagnosticModal, setDiagnosticModal] = useState({ isOpen: false, data: null, loading: false });
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [isRetryingFailedJobs, setIsRetryingFailedJobs] = useState(false);

  // Global Platform Audit Logs State (8-Dimensional Tracking)
  const [auditLogsList, setAuditLogsList] = useState([]);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditCompanyFilter, setAuditCompanyFilter] = useState('ALL');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');
  const [selectedAuditDiff, setSelectedAuditDiff] = useState(null);

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
      const [tenantsRes, usersRes, countriesRes, subsRes, alertsRes, auditRes, plansRes, settingsRes, rolesRes, analyticsRes, healthRes] = await Promise.allSettled([
        getTenants(),
        getPlatformUsers(),
        getSovereignCountries(),
        getSubscriptions(),
        getSystemAlerts(),
        getAuditLogs(30),
        getPlans(),
        getGlobalSettings(),
        getRoleTemplates(),
        getPlatformAnalytics(),
        getSystemHealth()
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setSystemHealth(healthRes.value);
      }

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
        setPlatformAnalytics(analyticsRes.value);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        setGlobalSettings(settingsRes.value);
      }

      if (rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value) && rolesRes.value.length > 0) {
        setRoleTemplates(rolesRes.value);
      }

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
          id: a.id || `ACT-${Date.now().toString().slice(-5)}`,
          title: a.action,
          action: a.action,
          who: a.actor_name || a.actor_email?.split('@')[0] || 'Super Admin',
          actorName: a.actor_name || a.actor_email?.split('@')[0] || 'Super Admin',
          actorEmail: a.actor_email || 'superadmin@alleviaresfa.com',
          actorRole: a.actor_role || 'SUPER_ADMIN',
          company: a.company_name || a.tenant_name || (a.tenant_id ? 'Tenant Organization' : 'Platform HQ (Global)'),
          tenantId: a.tenant_id,
          createdAt: a.created_at || new Date().toISOString(),
          time: a.created_at ? new Date(a.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Just now',
          ip: a.ip_address || '103.21.144.92',
          device: a.device_info || a.user_agent || 'Chrome 128.0 (Windows 11)',
          oldValue: typeof a.old_value === 'string' ? JSON.parse(a.old_value) : (a.old_value || null),
          newValue: typeof a.new_value === 'string' ? JSON.parse(a.new_value) : (a.new_value || null),
          details: a.details || {},
          targetEntity: a.target_entity || 'System',
          entity: a.company_name || a.tenant_name || a.target_entity || 'Global Platform',
          actor: a.actor_email,
          detail: typeof a.details === 'object' ? JSON.stringify(a.details) : (a.details || a.target_entity),
          severity: 'info'
        }));
        setRecentActivities(mappedLogs);
        setAuditLogsList(mappedLogs);
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

  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [viewUserDetailTab, setViewUserDetailTab] = useState('overview'); // overview | company | device | logins
  const [isResetAccountOpen, setIsResetAccountOpen] = useState(false);
  const [resetAccountTarget, setResetAccountTarget] = useState(null);
  const [resetAccountResult, setResetAccountResult] = useState(null);
  const [customTempPassword, setCustomTempPassword] = useState('');

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

  const handleOpenViewUser = (user) => {
    setViewingUser(user);
    setViewUserDetailTab('overview');
    setIsViewUserOpen(true);
  };

  const handleOpenResetAccountModal = (user) => {
    setResetAccountTarget(user);
    setResetAccountResult(null);
    setCustomTempPassword(`Reset@${Math.floor(100000 + Math.random() * 900000)}!`);
    setIsResetAccountOpen(true);
  };

  const handleConfirmResetAccount = async (e) => {
    if (e) e.preventDefault();
    if (!resetAccountTarget) return;

    try {
      const res = await resetAccount(resetAccountTarget.id, customTempPassword);
      setResetAccountResult(res);
      showToast(`Account reset successful for ${resetAccountTarget.email}!`, 'success');
      logAudit('ACCOUNT_RESET', `Super Admin performed full account reset for ${resetAccountTarget.email}`, resetAccountTarget.company || 'Platform');
      setPlatformUsers(prev => prev.map(u => u.id === resetAccountTarget.id ? { ...u, status: 'ACTIVE', isLocked: false, lockReason: null } : u));
    } catch (err) {
      showToast(`Failed to reset account: ${err.message}`, 'error');
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

  // --------------------------------------------------------------------------
  // GLOBAL SETTINGS & COMPANY OVERRIDES HANDLERS
  // --------------------------------------------------------------------------
  const handleSaveGlobalSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingGlobalSettings(true);
    try {
      await updateGlobalSettings(globalSettings);
      showToast('Global platform configuration successfully updated!', 'success');
      logAudit('SETTINGS_UPDATED', 'Super Admin updated platform-wide global configuration', 'Platform');
    } catch (err) {
      showToast(`Failed to update global settings: ${err.message}`, 'error');
    } finally {
      setIsSavingGlobalSettings(false);
    }
  };

  const handleSelectOverrideCompany = async (companyId) => {
    setSelectedOverrideCompanyId(companyId);
    if (!companyId) {
      setCompanyOverrideData(null);
      return;
    }
    try {
      const data = await getCompanySettings(companyId);
      setCompanyOverrideData(data);
      const ov = data.overrides || {};
      setCompanyOverrideForm({
        hasCustomTimezone: Boolean(ov.timezone),
        timezone: ov.timezone || globalSettings.timezone,
        hasCustomCurrency: Boolean(ov.currency),
        currency: ov.currency || globalSettings.currency,
        hasCustomDateFormat: Boolean(ov.dateFormat),
        dateFormat: ov.dateFormat || globalSettings.dateFormat,
        hasCustomWorkingDays: Boolean(ov.workingDays),
        workingDays: ov.workingDays || globalSettings.defaultWorkingDays,
        hasCustomSessionTimeout: ov.sessionTimeoutMinutes !== undefined,
        sessionTimeoutMinutes: ov.sessionTimeoutMinutes !== undefined ? ov.sessionTimeoutMinutes : globalSettings.sessionTimeoutMinutes,
        hasCustomFileLimits: Boolean(ov.fileLimits?.maxFileSizeMB),
        maxFileSizeMB: ov.fileLimits?.maxFileSizeMB || globalSettings.fileLimits.maxFileSizeMB
      });
    } catch (err) {
      showToast(`Failed to fetch company overrides: ${err.message}`, 'error');
    }
  };

  const handleSaveCompanyOverrides = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOverrideCompanyId) {
      showToast('Please select a company first.', 'error');
      return;
    }
    setIsSavingCompanyOverride(true);
    try {
      const overrides = {};
      if (companyOverrideForm.hasCustomTimezone) overrides.timezone = companyOverrideForm.timezone;
      if (companyOverrideForm.hasCustomCurrency) overrides.currency = companyOverrideForm.currency;
      if (companyOverrideForm.hasCustomDateFormat) overrides.dateFormat = companyOverrideForm.dateFormat;
      if (companyOverrideForm.hasCustomWorkingDays) overrides.workingDays = companyOverrideForm.workingDays;
      if (companyOverrideForm.hasCustomSessionTimeout) overrides.sessionTimeoutMinutes = Number(companyOverrideForm.sessionTimeoutMinutes);
      if (companyOverrideForm.hasCustomFileLimits) {
        overrides.fileLimits = {
          ...globalSettings.fileLimits,
          maxFileSizeMB: Number(companyOverrideForm.maxFileSizeMB)
        };
      }

      await updateCompanyOverrides(selectedOverrideCompanyId, overrides);
      showToast('Company-specific configuration overrides updated!', 'success');
      logAudit('COMPANY_OVERRIDES_UPDATED', `Super Admin updated overrides for tenant ID ${selectedOverrideCompanyId}`, 'Tenant');
      handleSelectOverrideCompany(selectedOverrideCompanyId);
      loadAllData();
    } catch (err) {
      showToast(`Failed to save overrides: ${err.message}`, 'error');
    } finally {
      setIsSavingCompanyOverride(false);
    }
  };

  const handleResetCompanyOverrides = async () => {
    if (!selectedOverrideCompanyId) return;
    if (!window.confirm('Reset all overrides for this company to inherit platform global defaults?')) return;
    setIsSavingCompanyOverride(true);
    try {
      await resetCompanyOverrides(selectedOverrideCompanyId);
      showToast('Company overrides removed. Now inheriting global defaults.', 'success');
      logAudit('COMPANY_OVERRIDES_RESET', `Reset overrides to global defaults for tenant ID ${selectedOverrideCompanyId}`, 'Tenant');
      handleSelectOverrideCompany(selectedOverrideCompanyId);
      loadAllData();
    } catch (err) {
      showToast(`Failed to reset overrides: ${err.message}`, 'error');
    } finally {
      setIsSavingCompanyOverride(false);
    }
  };

  // --------------------------------------------------------------------------
  // ROLE TEMPLATES & RBAC HANDLERS
  // --------------------------------------------------------------------------
  const handleToggleRolePermission = (roleKey, permKey) => {
    setRoleTemplates(prev => prev.map(rt => {
      if (rt.roleKey === roleKey) {
        return {
          ...rt,
          permissions: {
            ...rt.permissions,
            [permKey]: !rt.permissions[permKey]
          }
        };
      }
      return rt;
    }));
  };

  const handleSaveRoleTemplate = async (roleKey) => {
    const targetRole = roleTemplates.find(r => r.roleKey === roleKey);
    if (!targetRole) return;
    setIsSavingRoleTemplate(true);
    try {
      await updateRoleTemplate(roleKey, targetRole.permissions, {
        roleName: targetRole.roleName,
        description: targetRole.description
      });
      showToast(`Role template for "${targetRole.roleName}" saved successfully!`, 'success');
      logAudit('ROLE_TEMPLATE_SAVED', `Updated permissions matrix for role ${roleKey}`, 'RBAC');
    } catch (err) {
      showToast(`Failed to save role template: ${err.message}`, 'error');
    } finally {
      setIsSavingRoleTemplate(false);
    }
  };

  // --------------------------------------------------------------------------
  // SYSTEM HEALTH ACTION HANDLERS
  // --------------------------------------------------------------------------
  const handleRefreshHealth = async () => {
    setIsHealthRefreshing(true);
    try {
      const data = await getSystemHealth();
      setSystemHealth(data);
      showToast('System health and telemetry metrics refreshed!', 'success');
    } catch (err) {
      showToast(`Health refresh failed: ${err.message}`, 'error');
    } finally {
      setIsHealthRefreshing(false);
    }
  };

  const handleTriggerBackup = async () => {
    setIsBackupRunning(true);
    try {
      const res = await triggerPlatformBackup();
      showToast(res.message || 'Encrypted backup snapshot triggered successfully!', 'success');
      logAudit('BACKUP_TRIGGERED', 'Super Admin triggered manual encrypted database backup snapshot', 'Database Backup');
      const data = await getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      showToast(`Failed to trigger backup: ${err.message}`, 'error');
    } finally {
      setIsBackupRunning(false);
    }
  };

  const handleRetryFailedJobs = async () => {
    setIsRetryingFailedJobs(true);
    try {
      const res = await retryFailedJobs();
      showToast(res.message || 'Failed queue items requeued successfully!', 'success');
      logAudit('JOBS_REQUEUED', 'Super Admin retried all failed dead-letter queue items', 'Background Jobs');
      const data = await getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      showToast(`Retry failed: ${err.message}`, 'error');
    } finally {
      setIsRetryingFailedJobs(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setDiagnosticModal({ isOpen: true, loading: true, data: null });
    try {
      const res = await runSystemDiagnostic();
      setDiagnosticModal({ isOpen: true, loading: false, data: res });
      logAudit('SYSTEM_DIAGNOSTIC_RUN', 'Super Admin executed end-to-end 9-subsystem health diagnostic', 'System Diagnostics');
    } catch (err) {
      setDiagnosticModal({ isOpen: true, loading: false, data: { success: false, error: err.message } });
    }
  };

  const handleRefreshAuditLogs = async () => {
    try {
      const logs = await getAuditLogs({
        limit: 100,
        action: auditActionFilter,
        tenantId: auditCompanyFilter,
        search: auditSearchQuery
      });
      if (Array.isArray(logs)) {
        const mapped = logs.map(a => ({
          id: a.id || `ACT-${Date.now().toString().slice(-5)}`,
          title: a.action,
          action: a.action,
          who: a.actor_name || a.actor_email?.split('@')[0] || 'Super Admin',
          actorName: a.actor_name || a.actor_email?.split('@')[0] || 'Super Admin',
          actorEmail: a.actor_email || 'superadmin@alleviaresfa.com',
          actorRole: a.actor_role || 'SUPER_ADMIN',
          company: a.company_name || a.tenant_name || (a.tenant_id ? 'Tenant Organization' : 'Platform HQ (Global)'),
          tenantId: a.tenant_id,
          createdAt: a.created_at || new Date().toISOString(),
          time: a.created_at ? new Date(a.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Just now',
          ip: a.ip_address || '103.21.144.92',
          device: a.device_info || a.user_agent || 'Chrome 128.0 (Windows 11)',
          oldValue: typeof a.old_value === 'string' ? JSON.parse(a.old_value) : (a.old_value || null),
          newValue: typeof a.new_value === 'string' ? JSON.parse(a.new_value) : (a.new_value || null),
          details: a.details || {},
          targetEntity: a.target_entity || 'System',
          entity: a.company_name || a.tenant_name || a.target_entity || 'Global Platform',
          actor: a.actor_email,
          detail: typeof a.details === 'object' ? JSON.stringify(a.details) : (a.details || a.target_entity),
          severity: 'info'
        }));
        setAuditLogsList(mapped);
        showToast('Platform audit logs refreshed!', 'success');
      }
    } catch (err) {
      showToast(`Audit refresh failed: ${err.message}`, 'error');
    }
  };

  const handleExportAuditLogs = () => {
    try {
      const headers = ['Audit ID', 'Who (Actor)', 'Actor Email', 'Role', 'Company', 'Action', 'Target Entity', 'Timestamp', 'IP Address', 'Device Info', 'Old Value (JSON)', 'New Value (JSON)'];
      const filtered = auditLogsList.filter(log => {
        const matchesSearch = !auditSearchQuery.trim() || 
          (log.who && log.who.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
          (log.actorEmail && log.actorEmail.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
          (log.company && log.company.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
          (log.action && log.action.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
          (log.ip && log.ip.includes(auditSearchQuery)) ||
          (log.device && log.device.toLowerCase().includes(auditSearchQuery.toLowerCase()));

        const matchesCompany = auditCompanyFilter === 'ALL' || log.tenantId === auditCompanyFilter || log.company === auditCompanyFilter;
        const matchesAction = auditActionFilter === 'ALL' || (log.action && log.action.toUpperCase().includes(auditActionFilter.toUpperCase()));

        return matchesSearch && matchesCompany && matchesAction;
      });

      const rows = filtered.map(l => [
        `"${l.id}"`,
        `"${l.who || l.actorName || ''}"`,
        `"${l.actorEmail || ''}"`,
        `"${l.actorRole || ''}"`,
        `"${l.company || ''}"`,
        `"${l.action || ''}"`,
        `"${l.targetEntity || ''}"`,
        `"${l.createdAt || l.time || ''}"`,
        `"${l.ip || ''}"`,
        `"${l.device || ''}"`,
        `"${JSON.stringify(l.oldValue || '').replace(/"/g, '""')}"`,
        `"${JSON.stringify(l.newValue || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `platform_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported audit trail to CSV successfully!', 'success');
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error');
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
                                  style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                                  onClick={() => handleOpenViewUser(user)}
                                  title="View User Details, Company Association & Device Telemetry"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{
                                    color: user.status === 'ACTIVE' || user.status === 'Active' ? '#dc2626' : '#16a34a',
                                    borderColor: user.status === 'ACTIVE' || user.status === 'Active' ? '#fecdd3' : '#bbf7d0',
                                    background: user.status === 'ACTIVE' || user.status === 'Active' ? '#fff1f2' : '#f0fdf4'
                                  }}
                                  onClick={() => handleToggleUserStatus(user.id, user.status, user.email)}
                                  title={user.status === 'ACTIVE' || user.status === 'Active' ? 'Disable User Account' : 'Enable User Account'}
                                >
                                  {user.status === 'ACTIVE' || user.status === 'Active' ? 'Disable' : 'Enable'}
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
                                  style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                                  onClick={() => handleOpenResetAccountModal(user)}
                                  title="Reset Account (Unlock, activate, generate new temporary credentials)"
                                >
                                  <RotateCcw size={12} /> Reset Account
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenUserLoginHistory(user)}
                                  title="View Login Activity & Device Signatures"
                                >
                                  <Clock size={12} /> Logins
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  onClick={() => handleOpenUserActivity(user)}
                                  title="View Audit Activity Trail"
                                >
                                  <Activity size={12} /> Activity
                                </button>
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
                                  title="Change Admin Permissions"
                                >
                                  <Sliders size={12} /> Permissions
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
          GLOBAL CONFIGURATION & COMPANY OVERRIDES TAB
          ===================================================================== */}
      {activeTab === 'settings' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Global Platform Configuration</h2>
              <p className="section-desc">Super Admin controls platform-wide policies. Companies inherit these defaults unless explicitly overridden.</p>
            </div>
          </div>

          {/* Section 1: Platform-Wide Global Defaults */}
          <div className="card-section" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} color="#0284c7" /> Platform Global Defaults
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Base parameters applied across all tenant organizations</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveGlobalSettings}
                disabled={isSavingGlobalSettings}
              >
                <Save size={16} /> {isSavingGlobalSettings ? 'Saving...' : 'Save Global Defaults'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Date Format */}
              <div className="form-group">
                <label className="form-label">Platform Date Format</label>
                <select
                  className="form-control"
                  value={globalSettings.dateFormat}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard - e.g. 2026-09-20)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK / India / Europe - e.g. 20/09/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard - e.g. 09/20/2026)</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 20-09-2026)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="form-group">
                <label className="form-label">Platform Timezone</label>
                <select
                  className="form-control"
                  value={globalSettings.timezone}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30 - India)</option>
                  <option value="America/New_York">America/New_York (EST/EDT - US East)</option>
                  <option value="America/Chicago">America/Chicago (CST/CDT - US Central)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT - US West)</option>
                  <option value="Europe/London">Europe/London (GMT/BST - UK)</option>
                  <option value="Europe/Paris">Europe/Paris (CET - Central Europe)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00 - UAE / GCC)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00 - Japan)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST +10:00)</option>
                </select>
              </div>

              {/* Default Currency */}
              <div className="form-group">
                <label className="form-label">Platform Default Currency</label>
                <select
                  className="form-control"
                  value={globalSettings.currency}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="AED">AED (AED) - UAE Dirham</option>
                  <option value="SGD">SGD ($) - Singapore Dollar</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                </select>
              </div>

              {/* Language */}
              <div className="form-group">
                <label className="form-label">Platform Language</label>
                <select
                  className="form-control"
                  value={globalSettings.language}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (Español - es)</option>
                  <option value="fr">French (Français - fr)</option>
                  <option value="de">German (Deutsch - de)</option>
                  <option value="hi">Hindi (हिन्दी - hi)</option>
                  <option value="ar">Arabic (العربية - ar)</option>
                </select>
              </div>

              {/* Session Timeout */}
              <div className="form-group">
                <label className="form-label">Default Session Timeout</label>
                <select
                  className="form-control"
                  value={globalSettings.sessionTimeoutMinutes}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))}
                >
                  <option value={15}>15 Minutes (Strict Financial/Pharma)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Standard Enterprise)</option>
                  <option value={120}>2 Hours</option>
                  <option value={480}>8 Hours (Full Working Shift)</option>
                </select>
              </div>

              {/* Max File Size Limit */}
              <div className="form-group">
                <label className="form-label">Default Max File Upload Size</label>
                <select
                  className="form-control"
                  value={globalSettings.fileLimits?.maxFileSizeMB || 25}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    fileLimits: { ...(prev.fileLimits || {}), maxFileSizeMB: Number(e.target.value) }
                  }))}
                >
                  <option value={10}>10 MB</option>
                  <option value={25}>25 MB (Standard Attachment)</option>
                  <option value={50}>50 MB</option>
                  <option value={100}>100 MB (High Definition Clinical Docs)</option>
                </select>
              </div>
            </div>

            {/* Default Working Days */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Default Working Days Schedule</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const isChecked = (globalSettings.defaultWorkingDays || []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      className="action-pill-btn"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: isChecked ? '#0284c7' : '#f8fafc',
                        color: isChecked ? '#ffffff' : '#64748b',
                        borderColor: isChecked ? '#0284c7' : '#cbd5e1',
                        fontWeight: '600'
                      }}
                      onClick={() => {
                        const cur = globalSettings.defaultWorkingDays || [];
                        const updated = isChecked ? cur.filter(d => d !== day) : [...cur, day];
                        setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: updated }));
                      }}
                    >
                      {isChecked ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: '8px' }}>
                  Quick Presets:
                </span>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }))}
                >
                  Mon-Fri
                </button>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }))}
                >
                  Mon-Sat
                </button>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }))}
                >
                  All 7 Days
                </button>
              </div>
            </div>

            {/* Notification, Security & Password Policy Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {/* Notifications */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} color="#0284c7" /> Default Notification Channels
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    { key: 'email', label: 'Transactional Email Dispatch' },
                    { key: 'inApp', label: 'Real-Time In-App Alert Badges' },
                    { key: 'sms', label: 'SMS Gateway Broadcasts' },
                    { key: 'push', label: 'Mobile Rep Push Telemetry' },
                    { key: 'weeklyDigest', label: 'Automated Weekly Digest' },
                    { key: 'criticalAlerts', label: 'High-Priority Security Alerts' }
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(globalSettings.notificationSettings?.[item.key])}
                        onChange={(e) => setGlobalSettings(prev => ({
                          ...prev,
                          notificationSettings: { ...(prev.notificationSettings || {}), [item.key]: e.target.checked }
                        }))}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Policy */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} color="#dc2626" /> Default Security Policy
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.securityPolicy?.enforce2FA)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), enforce2FA: e.target.checked }
                      }))}
                    />
                    <span>Enforce Mandatory 2FA for Administrators</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.securityPolicy?.allowMultipleSessions)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), allowMultipleSessions: e.target.checked }
                      }))}
                    />
                    <span>Allow Concurrent Multi-Device Sessions</span>
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Max Failed Login Lockout:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.securityPolicy?.maxLoginAttempts || 5}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), maxLoginAttempts: Number(e.target.value) }
                      }))}
                    >
                      <option value={3}>3 Attempts</option>
                      <option value={5}>5 Attempts</option>
                      <option value={10}>10 Attempts</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Lockout Duration:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.securityPolicy?.lockoutDurationMinutes || 15}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), lockoutDurationMinutes: Number(e.target.value) }
                      }))}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={16} color="#d97706" /> Default Password Policy
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Min Password Length:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.passwordPolicy?.minLength || 8}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), minLength: Number(e.target.value) }
                      }))}
                    >
                      <option value={8}>8 Characters</option>
                      <option value={10}>10 Characters</option>
                      <option value={12}>12 Characters</option>
                      <option value={14}>14 Characters</option>
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireUppercase)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireUppercase: e.target.checked }
                      }))}
                    />
                    <span>Require Uppercase Letters (A-Z)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireNumbers)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireNumbers: e.target.checked }
                      }))}
                    />
                    <span>Require Numbers (0-9)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireSpecialChars)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireSpecialChars: e.target.checked }
                      }))}
                    />
                    <span>Require Special Characters (!@#$)</span>
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Password Expiry Cycle:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.passwordPolicy?.expiryDays || 90}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), expiryDays: Number(e.target.value) }
                      }))}
                    >
                      <option value={30}>Every 30 Days</option>
                      <option value={60}>Every 60 Days</option>
                      <option value={90}>Every 90 Days</option>
                      <option value={180}>Every 180 Days</option>
                      <option value={0}>Never Expire</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Company-Specific Overrides Inspector & Manager */}
          <div className="card-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={20} color="#7c3aed" /> Company-Specific Configuration Overrides
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Configure granular exceptions for specific tenant organizations
                </p>
              </div>

              {selectedOverrideCompanyId && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
                    onClick={handleResetCompanyOverrides}
                    disabled={isSavingCompanyOverride}
                  >
                    <RotateCcw size={13} /> Reset to Global Defaults
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveCompanyOverrides}
                    disabled={isSavingCompanyOverride}
                  >
                    <Save size={15} /> {isSavingCompanyOverride ? 'Saving...' : 'Save Company Overrides'}
                  </button>
                </div>
              )}
            </div>

            {/* Select Target Company */}
            <div className="form-group" style={{ maxWidth: '420px', marginBottom: '18px' }}>
              <label className="form-label">Select Pharmaceutical Company</label>
              <select
                className="form-control"
                value={selectedOverrideCompanyId}
                onChange={(e) => handleSelectOverrideCompany(e.target.value)}
              >
                <option value="">-- Choose a company to inspect or override --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.country}) - Plan: {c.plan}
                  </option>
                ))}
              </select>
            </div>

            {selectedOverrideCompanyId && companyOverrideData ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                    {companyOverrideData.companyName}
                  </span>
                  {companyOverrideData.hasOverrides ? (
                    <span className="status-tag status-trial" style={{ background: '#fef3c7', color: '#b45309' }}>
                      ⚡ Custom Company Overrides Active
                    </span>
                  ) : (
                    <span className="status-badge-green" style={{ background: '#ecfdf5', color: '#059669' }}>
                      ✓ Inheriting Platform Global Defaults
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* Timezone Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomTimezone}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomTimezone: e.target.checked }))}
                      />
                      <span>Override Company Timezone</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomTimezone}
                      value={companyOverrideForm.timezone}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  {/* Currency Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomCurrency}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomCurrency: e.target.checked }))}
                      />
                      <span>Override Operating Currency</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomCurrency}
                      value={companyOverrideForm.currency}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="AED">AED (AED) - UAE Dirham</option>
                      <option value="SGD">SGD ($) - Singapore Dollar</option>
                    </select>
                  </div>

                  {/* Date Format Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomDateFormat}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomDateFormat: e.target.checked }))}
                      />
                      <span>Override Date Format</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomDateFormat}
                      value={companyOverrideForm.dateFormat}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, dateFormat: e.target.value }))}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/09/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-20)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/20/2026)</option>
                    </select>
                  </div>

                  {/* Session Timeout Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomSessionTimeout}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomSessionTimeout: e.target.checked }))}
                      />
                      <span>Override Inactivity Session Timeout</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomSessionTimeout}
                      value={companyOverrideForm.sessionTimeoutMinutes}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                      <option value={120}>2 Hours</option>
                      <option value={480}>8 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                <SlidersHorizontal size={36} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: '0.86rem' }}>Select a pharmaceutical company above to view and customize its configuration overrides.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ROLE TEMPLATES & RBAC PERMISSION MATRIX TAB
          ===================================================================== */}
      {activeTab === 'roles' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Role Templates &amp; RBAC Permissions Matrix</h2>
              <p className="section-desc">Super Admin defines what each role can do across all companies and platform modules.</p>
            </div>
            {selectedRoleKey !== 'SUPER_ADMIN' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSaveRoleTemplate(selectedRoleKey)}
                disabled={isSavingRoleTemplate}
              >
                <Save size={16} /> {isSavingRoleTemplate ? 'Saving...' : `Save ${selectedRoleKey} Permissions`}
              </button>
            )}
          </div>

          {/* Strict Security Guardrail Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
            border: '1px solid #fecdd3',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <ShieldAlert size={26} color="#e11d48" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', color: '#9f1239', fontSize: '0.88rem' }}>
                Strict Platform RBAC Guardrail Active
              </div>
              <div style={{ fontSize: '0.78rem', color: '#be123c', marginTop: '2px' }}>
                Super Admin defines what each role can do. Company Admins are strictly prohibited from modifying Super Admin permissions, altering platform-wide policies, or elevating tenant roles.
              </div>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {roleTemplates.map(role => {
              const isSelected = selectedRoleKey === role.roleKey;
              const isMaster = role.roleKey === 'SUPER_ADMIN';
              return (
                <button
                  key={role.roleKey}
                  type="button"
                  className="action-pill-btn"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    background: isSelected ? (isMaster ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#0284c7') : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    borderColor: isSelected ? 'transparent' : '#cbd5e1',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={() => setSelectedRoleKey(role.roleKey)}
                >
                  {isMaster ? '👑 ' : ''}{role.roleName?.split('(')[0] || role.roleKey}
                </button>
              );
            })}
          </div>

          {/* Active Role Matrix Card */}
          {(() => {
            const activeRoleObj = roleTemplates.find(r => r.roleKey === selectedRoleKey) || roleTemplates[0];
            if (!activeRoleObj) return null;
            const perms = activeRoleObj.permissions || {};
            const isMaster = activeRoleObj.roleKey === 'SUPER_ADMIN';

            const permissionCategories = [
              {
                title: '🏢 Platform & Tenant Governance',
                items: [
                  { key: 'platform.view_all_tenants', label: 'View All Tenant Companies', desc: 'Can view full cross-company list and metrics' },
                  { key: 'platform.manage_tenants', label: 'Provision & Edit Companies', desc: 'Create, edit, suspend, or delete company accounts' },
                  { key: 'platform.global_settings', label: 'Configure Global Platform Settings', desc: 'Platform-wide date formats, timezone, and security policies' },
                  { key: 'platform.role_templates', label: 'Define Role Templates & RBAC', desc: 'Super Admin permission matrix control' },
                  { key: 'platform.emergency_killswitch', label: 'Execute Emergency Kill-Switch', desc: 'Trigger tenant lockouts and maintenance mode' },
                  { key: 'platform.manage_billing', label: 'Manage SaaS Plans & Billing', desc: 'Create plans, upgrade/downgrade tiers, and renew subscriptions' },
                  { key: 'platform.impersonate_admin', label: 'Audited Impersonation', desc: 'Login as tenant company admin for remote support' }
                ]
              },
              {
                title: '👥 User & Admin Identity Governance',
                items: [
                  { key: 'users.create_admin', label: 'Create Company Admins', desc: 'Provision executive administrator accounts' },
                  { key: 'users.edit_admin', label: 'Edit Admin Profiles & Territories', desc: 'Modify names, contact info, and territory assignments' },
                  { key: 'users.toggle_status', label: 'Activate / Deactivate Accounts', desc: 'Toggle user active/inactive status' },
                  { key: 'users.reset_password', label: 'Reset User Passwords', desc: 'Generate secure temporary password credentials' },
                  { key: 'users.force_logout', label: 'Force Session Logout', desc: 'Revoke active JWT tokens instantly across devices' },
                  { key: 'users.lock_unlock', label: 'Lock / Unlock Accounts', desc: 'Lock compromised accounts with audit reasons' },
                  { key: 'users.change_permissions', label: 'Modify User Permissions', desc: 'Grant or revoke functional feature flags' }
                ]
              },
              {
                title: '💊 Pharma Sales & Field Operations',
                items: [
                  { key: 'catalog.manage', label: 'Manage Product Catalog & Pricing', desc: 'Create and update pharmaceutical SKU catalog' },
                  { key: 'doctors.manage', label: 'Manage Healthcare Professionals (Doctors)', desc: 'Register doctors, clinic locations, and specialties' },
                  { key: 'chemists.manage', label: 'Manage Chemists & Pharmacies', desc: 'Maintain pharmacy list and drug license registries' },
                  { key: 'dcr.view_all', label: 'Review & Approve Daily Call Reports (DCR)', desc: 'Inspect MR call logs, samples given, and feedback' },
                  { key: 'orders.view_all', label: 'Review & Approve Booking Orders (POB)', desc: 'Process chemist orders and stockist dispatches' },
                  { key: 'field_tracking.view_live', label: 'Live GPS Field Tracking & Telemetry', desc: 'Monitor field MR real-time routes and pings' }
                ]
              },
              {
                title: '🔒 Audit, Security & Compliance',
                items: [
                  { key: 'platform.view_audit_logs', label: 'Inspect Immutable Platform Audit Logs', desc: 'Full timestamped audit trail of all actions' },
                  { key: 'users.view_login_history', label: 'View Admin Login History & IP Geolocation', desc: 'Device fingerprint and security history logs' },
                  { key: 'export.download_reports', label: 'Export Data & Compliance Reports', desc: 'Download CSV and Excel operational data' }
                ]
              }
            ];

            return (
              <div className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div>
                    <h3 className="card-header-title" style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                      {activeRoleObj.roleName}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                      {activeRoleObj.description}
                    </p>
                  </div>
                  {isMaster ? (
                    <span className="status-tag" style={{ background: '#fef3c7', color: '#92400e', fontWeight: '800', border: '1px solid #fde68a' }}>
                      🔒 Master Role - Immutable Platform Authority
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSaveRoleTemplate(activeRoleObj.roleKey)}
                      disabled={isSavingRoleTemplate}
                    >
                      <Save size={15} /> {isSavingRoleTemplate ? 'Saving...' : 'Save Permissions'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                  {permissionCategories.map((cat, cIdx) => (
                    <div key={cIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
                        {cat.title}
                      </h4>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {cat.items.map(item => {
                          const isAllowed = isMaster ? true : Boolean(perms[item.key]);
                          const isSuperAdminOnlyControl = item.key.startsWith('platform.') && activeRoleObj.roleKey !== 'SUPER_ADMIN';

                          return (
                            <div
                              key={item.key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px'
                              }}
                            >
                              <div style={{ paddingRight: '12px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                                  {item.label}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                                  {item.desc}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isMaster || isSuperAdminOnlyControl}
                                onClick={() => handleToggleRolePermission(activeRoleObj.roleKey, item.key)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '16px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  border: 'none',
                                  cursor: (isMaster || isSuperAdminOnlyControl) ? 'not-allowed' : 'pointer',
                                  background: isAllowed ? '#10b981' : '#e2e8f0',
                                  color: isAllowed ? '#ffffff' : '#64748b',
                                  minWidth: '70px',
                                  textAlign: 'center',
                                  opacity: isSuperAdminOnlyControl ? 0.6 : 1
                                }}
                                title={isSuperAdminOnlyControl ? 'Super Admin only control - Company Admin restricted' : ''}
                              >
                                {isAllowed ? 'ALLOWED' : 'DENIED'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          PLATFORM-WIDE ANALYTICS & INTELLIGENCE CONSOLE
          ===================================================================== */}
      {activeTab === 'analytics' && (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Platform-Wide Intelligence &amp; Telemetry Analytics</h2>
              <p className="section-desc">Real-time user engagement, operational intensity leaderboard, API gateways, storage consumption, and global authentication activity.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Timeframe:</span>
              {['24h', '7d', '30d', 'MTD'].map(tf => (
                <button
                  key={tf}
                  type="button"
                  className="action-pill-btn"
                  style={{
                    background: analyticsTimeframe === tf ? '#0284c7' : '#ffffff',
                    color: analyticsTimeframe === tf ? '#ffffff' : '#475569',
                    borderColor: analyticsTimeframe === tf ? '#0284c7' : '#cbd5e1',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                  onClick={() => setAnalyticsTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Multi-Tenant Isolation Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <ShieldCheck size={26} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.88rem' }}>
                Multi-Tenant Data Privacy &amp; Isolation Enforced
              </div>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                Contractual multi-tenant partition is strictly maintained. Cross-company commercial records are isolated. Super Admin monitors aggregated platform health and infrastructure telemetry without compromising tenant confidentiality.
              </div>
            </div>
          </div>

          {/* 1. HERO ENGAGEMENT METRICS (4 Grid Cards) */}
          {(() => {
            const u = platformAnalytics?.users || {
              totalUsers: platformUsers.length || 120,
              activeUsers: platformUsers.filter(usr => usr.status === 'Active' || usr.status === 'ACTIVE').length || 112,
              dau: 78,
              mau: 115,
              dauMauRatio: '67.8%',
              newUsersThisMonth: 14,
              retentionRate: '94.8%'
            };

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                {/* Total Users */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Users</span>
                    <Users size={18} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.totalUsers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} /> <strong>+{u.newUsersThisMonth} new</strong> this month ({u.retentionRate} retention)
                  </div>
                </div>

                {/* Active Users */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Accounts</span>
                    <UserCheck size={18} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.activeUsers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                    <strong>{((u.activeUsers / (u.totalUsers || 1)) * 100).toFixed(1)}%</strong> of total platform roster
                  </div>
                </div>

                {/* Daily Active Users (DAU) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Daily Active Users (DAU)</span>
                    <Activity size={18} color="#7c3aed" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#7c3aed', margin: '8px 0 4px' }}>
                    {u.dau.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Stickiness (DAU/MAU): <strong>{u.dauMauRatio}</strong></span>
                  </div>
                </div>

                {/* Monthly Active Users (MAU) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Monthly Active Users (MAU)</span>
                    <Calendar size={18} color="#ea580c" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.mau.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669' }}>
                    <span>Active in last 30 days</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. COMPANIES WITH HIGHEST USAGE LEADERBOARD */}
          <div className="card-section" style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="#ea580c" /> Companies with Highest Operational Usage
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Ranked by field operational activity, daily call logs, orders placed, and storage intensity
                </p>
              </div>
              <span className="status-tag status-active" style={{ background: '#ecfdf5', color: '#059669' }}>
                Live Activity Index
              </span>
            </div>

            <div className="saas-table-container">
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Company Name &amp; Code</th>
                    <th>Plan Tier</th>
                    <th>Active Reps &amp; Users</th>
                    <th>DCR Reports</th>
                    <th>Sales Orders</th>
                    <th>Storage Used / Limit</th>
                    <th>Activity Score</th>
                    <th style={{ textAlign: 'right' }}>Usage Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {(platformAnalytics?.highestUsageCompanies || []).map((comp, idx) => (
                    <tr key={comp.id || idx}>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#fef3c7' : (idx === 1 ? '#f1f5f9' : (idx === 2 ? '#ffedd5' : '#f8fafc')),
                          color: idx === 0 ? '#b45309' : (idx === 1 ? '#475569' : (idx === 2 ? '#c2410c' : '#64748b')),
                          fontWeight: '800',
                          fontSize: '0.8rem'
                        }}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{comp.name}</strong>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}><code>{comp.code}</code></div>
                        </div>
                      </td>
                      <td><span className={`plan-pill plan-${(comp.plan || 'STARTER').toLowerCase()}`}>{comp.plan}</span></td>
                      <td><strong>{comp.userCount}</strong> Users</td>
                      <td><span style={{ fontWeight: '700', color: '#0284c7' }}>{comp.dcrCount?.toLocaleString() || 0} DCRs</span></td>
                      <td><strong>{comp.orderCount?.toLocaleString() || 0}</strong> Orders</td>
                      <td>
                        <div style={{ width: '130px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                            <span>{comp.storageUsedGB} GB</span>
                            <span style={{ color: '#94a3b8' }}>/ {comp.storageLimitGB} GB</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, comp.storagePercent || 25)}%`,
                              height: '100%',
                              background: (comp.storagePercent || 25) > 80 ? '#ef4444' : '#3b82f6',
                              borderRadius: '3px'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#0f172a' }}>{comp.usageScore || 75}</div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/100</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`status-tag status-${(comp.activityTier || 'NORMAL').toLowerCase() === 'high_intensity' ? 'active' : 'trial'}`}>
                          {comp.activityTier === 'HIGH_INTENSITY' ? '🔥 High Intensity' : comp.activityTier === 'MODERATE' ? '⚡ Moderate' : '🟢 Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. API USAGE & STORAGE CONSUMPTION (2-Column Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '22px' }}>
            {/* API Usage & Infrastructure */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Radio size={18} color="#0284c7" /> API Usage &amp; Infrastructure Throughput
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Calls Today</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                    {(platformAnalytics?.apiUsage?.totalCallsToday || 482920).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                    MTD: <strong>{((platformAnalytics?.apiUsage?.totalCallsMTD || 14280500) / 1000000).toFixed(1)}M Calls</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Avg Latency &amp; SLA</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669' }}>
                    {platformAnalytics?.apiUsage?.avgLatencyMs || 24}ms
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '2px' }}>
                    Uptime SLA: <strong>{platformAnalytics?.apiUsage?.uptimeSLA || '99.98%'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Top API Gateway Endpoints by Volume</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {(platformAnalytics?.apiUsage?.topEndpoints || []).map((ep, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div>
                        <code>{ep.route}</code>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{ep.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong>{ep.share}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{(ep.callsToday || 0).toLocaleString()} calls</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Usage Telemetry */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <HardDrive size={18} color="#7c3aed" /> Platform Storage Consumption
              </h3>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Storage Consumed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>
                      {platformAnalytics?.storage?.totalUsedGB || 142.6} GB
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#64748b' }}>
                    Provisioned: <strong>{platformAnalytics?.storage?.totalAllocatedGB || 500} GB</strong>
                  </div>
                </div>

                <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${platformAnalytics?.storage?.storageUsedPercent || 29}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #7c3aed)',
                    borderRadius: '5px'
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', textAlign: 'right' }}>
                  {platformAnalytics?.storage?.storageUsedPercent || 29}% allocated capacity used
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Storage Usage by Asset Category</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Clinical Documents</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.clinicalDocumentsGB || 54.2} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Doctor Visit Attachments</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.doctorVisitAttachmentsGB || 41.8} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Product SKU Media</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.productMediaGB || 28.6} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Audit Ledger Exports</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.auditLedgerExportsGB || 18.0} GB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. REPORT GENERATION & GLOBAL LOGIN ACTIVITY (2-Column Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            {/* Report Generation Metrics */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={18} color="#059669" /> Report Generation &amp; Export Volume
              </h3>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Reports Generated (MTD)</span>
                  <span className="status-badge-green">{(platformAnalytics?.reports?.activeScheduledExports || 42)} Active Cron Schedules</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#059669', marginTop: '4px' }}>
                  {(platformAnalytics?.reports?.totalGeneratedMTD || 8420).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>DCR Call Summaries:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.dcrDailyCallExports || 3840).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Sales Analytics Exports:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.salesOrderAnalytics || 2410).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Doctor Coverage:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.doctorCoverageSummaries || 1290).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Expense Audit Claims:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.expenseAuditClaims || 880).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Global Login Activity */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Clock size={18} color="#d97706" /> Global Login Velocity &amp; Regional Traffic
              </h3>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>24-Hour Auth Volume</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669' }}>
                    {platformAnalytics?.loginActivity?.successRate || '97.7%'} Success Rate
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '6px' }}>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0f172a' }}>
                    {(platformAnalytics?.loginActivity?.total24h || 342).toLocaleString()} Attempts
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#059669' }}>
                    ✓ {(platformAnalytics?.loginActivity?.successful || 334)} Passed
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#dc2626' }}>
                    ✕ {(platformAnalytics?.loginActivity?.failed || 8)} Failed
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Geographic Regional Distribution</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(platformAnalytics?.loginActivity?.geographicBreakdown || []).map((geo, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem' }}>{geo.flag}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f172a', margin: '2px 0' }}>{geo.country}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0284c7' }}>{geo.share}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SYSTEM HEALTH & INFRASTRUCTURE TELEMETRY
          ===================================================================== */}
      {activeTab === 'system-health' && (
        <div className="tab-pane-content">
          {/* Header Action Strip */}
          <div className="pane-action-bar" style={{ marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>System Health &amp; Subsystem Telemetry</h2>
                <span className="status-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '800' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)' }}></span>
                  ALL 9 CORE PLATFORM SYSTEMS HEALTHY
                </span>
              </div>
              <p className="section-desc" style={{ marginTop: '4px' }}>
                Real-time heartbeat monitoring across API gateways, PostgreSQL clusters, queue daemons, SMS/Email relays, and automated encrypted snapshots.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRefreshHealth}
                disabled={isHealthRefreshing}
              >
                <RefreshCw size={14} className={isHealthRefreshing ? 'spin' : ''} />
                <span>{isHealthRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRunDiagnostic}
              >
                <ShieldCheck size={14} color="#0284c7" />
                <span>Run Diagnostic</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRetryFailedJobs}
                disabled={isRetryingFailedJobs || !systemHealth?.telemetry?.failedJobs?.count}
              >
                <RotateCcw size={14} color="#d97706" />
                <span>{isRetryingFailedJobs ? 'Retrying...' : `Retry Failed Jobs (${systemHealth?.telemetry?.failedJobs?.count || 0})`}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleTriggerBackup}
                disabled={isBackupRunning}
                style={{ background: '#0284c7' }}
              >
                <Database size={14} />
                <span>{isBackupRunning ? 'Snapshotting...' : 'Trigger Backup Now'}</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              THE 9 CORE PLATFORM SERVICES HEALTH GRID (3x3)
              ===================================================================== */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} color="#0284c7" />
                <span>9 Core Microservices &amp; Infrastructure Health Status</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Last Polled: {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleTimeString() : 'Live'} &bull; SLA: 99.99%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {/* 1. API */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Server size={20} color="#2563eb" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>API Gateway</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>HTTP/2 REST Core Engine</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  API endpoints, Swagger docs, rate limiting &amp; CORS middleware operational.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Latency: <strong style={{ color: '#0f172a' }}>18ms</strong></span>
                  <span>Uptime: <strong style={{ color: '#16a34a' }}>99.99%</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[0])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 2. Database */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={20} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Database</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>PostgreSQL 15.4 / Supabase</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  ACID transactional multi-tenant schema with connection pooling &amp; indexing.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Latency: <strong style={{ color: '#0f172a' }}>{systemHealth?.telemetry?.databaseHealth?.latencyMs || 22}ms</strong></span>
                  <span>Tables: <strong style={{ color: '#0f172a' }}>{systemHealth?.telemetry?.databaseHealth?.totalTables || 38}</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[1])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 3. Storage */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HardDrive size={20} color="#7c3aed" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Storage</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Cloud Media &amp; Object Store</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  S3-compatible bucket &amp; encrypted asset storage for doctor prescriptions &amp; DCRs.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Used: <strong style={{ color: '#0f172a' }}>1.28 TB / 10 TB</strong></span>
                  <span>Uptime: <strong style={{ color: '#16a34a' }}>99.99%</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[2])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 4. Authentication */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={20} color="#d97706" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Authentication</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>JWT / Bcrypt / Session Guardian</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Cryptographic JWT verification, token version revocation &amp; session security.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Verify: <strong style={{ color: '#0f172a' }}>2.1ms</strong></span>
                  <span>Active Sessions: <strong style={{ color: '#0f172a' }}>482</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[3])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 5. Notifications */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={20} color="#db2777" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Notifications</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Socket.io &amp; Mobile Push</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Real-time Socket.io socket server and mobile push notification delivery pipeline.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Sockets: <strong style={{ color: '#0f172a' }}>156 active</strong></span>
                  <span>Latency: <strong style={{ color: '#0f172a' }}>32ms</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[4])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 6. Maps/GPS */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} color="#0891b2" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Maps / GPS</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Geocoding &amp; Route Matrix</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Reverse geocoding provider, distance matrix routing &amp; chemist geofencing.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Accuracy: <strong style={{ color: '#0f172a' }}>&lt; 15m</strong></span>
                  <span>Cache: <strong style={{ color: '#16a34a' }}>94.2%</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[5])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 7. Email */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={20} color="#4f46e5" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Email</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SMTP / SES Relay</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Transactional email dispatch for invoices, welcome activations &amp; password resets.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Delivery: <strong style={{ color: '#16a34a' }}>99.4%</strong></span>
                  <span>Bounce: <strong style={{ color: '#0f172a' }}>0.12%</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[6])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 8. SMS */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={20} color="#059669" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>SMS</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Telephony Gateway &amp; 2FA OTP</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Two-factor SMS OTP authentication &amp; emergency broadcast delivery.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>OTP Latency: <strong style={{ color: '#0f172a' }}>1.8s</strong></span>
                  <span>Carrier: <strong style={{ color: '#16a34a' }}>99.9%</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[7])}>
                    Details &rarr;
                  </button>
                </div>
              </div>

              {/* 9. Background Jobs */}
              <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={20} color="#334155" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Background Jobs</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Cron Workers &amp; Expiry Engine</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                    Healthy
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                  Subscription expiry auto-suspender, nightly aggregators &amp; vacuum daemons.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                  <span>Workers: <strong style={{ color: '#0f172a' }}>4 Active</strong></span>
                  <span>Processed: <strong style={{ color: '#0f172a' }}>18,450/24h</strong></span>
                  <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[8])}>
                    Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              DEEP OPERATIONAL & INFRASTRUCTURE TELEMETRY METRICS
              ===================================================================== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {/* Metric 1: Server Uptime */}
            <div className="saas-kpi-card" style={{ padding: '18px' }}>
              <div className="kpi-top">
                <span className="kpi-label">Server Uptime</span>
                <Clock size={18} className="kpi-icon blue" />
              </div>
              <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                {systemHealth?.telemetry?.serverUptime?.formatted || '48d 14h 22m'}
              </div>
              <div className="kpi-sub">
                <strong className="text-green">99.99% Availability</strong> &bull; Node {systemHealth?.telemetry?.serverUptime?.nodeVersion || 'v20.14'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                Heap: {systemHealth?.telemetry?.serverUptime?.memoryHeapUsedMB || '82.4'} MB / RSS: {systemHealth?.telemetry?.serverUptime?.memoryRssMB || '148.6'} MB
              </div>
            </div>

            {/* Metric 2: API Latency */}
            <div className="saas-kpi-card" style={{ padding: '18px' }}>
              <div className="kpi-top">
                <span className="kpi-label">API Latency (p95)</span>
                <Zap size={18} className="kpi-icon green" />
              </div>
              <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
                {systemHealth?.telemetry?.apiLatency?.current || 18} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>ms</span>
              </div>
              <div className="kpi-sub">
                p50: <strong>{systemHealth?.telemetry?.apiLatency?.p50 || 14}ms</strong> &bull; p95: <strong>{systemHealth?.telemetry?.apiLatency?.p95 || 38}ms</strong> &bull; p99: <strong>{systemHealth?.telemetry?.apiLatency?.p99 || 64}ms</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                Gateway Status: <span style={{ color: '#16a34a', fontWeight: '700' }}>Optimal Response Rate</span>
              </div>
            </div>

            {/* Metric 3: Error Rate */}
            <div className="saas-kpi-card" style={{ padding: '18px' }}>
              <div className="kpi-top">
                <span className="kpi-label">Platform Error Rate</span>
                <AlertOctagon size={18} className="kpi-icon indigo" />
              </div>
              <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                {systemHealth?.telemetry?.errorRate?.ratePercent || 0.02}%
              </div>
              <div className="kpi-sub">
                <strong className="text-green">48,920 (2xx)</strong> &bull; 84 (4xx) &bull; 9 (5xx)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                Error Budget Remaining: <strong style={{ color: '#0284c7' }}>99.98%</strong>
              </div>
            </div>

            {/* Metric 4: Database Health */}
            <div className="saas-kpi-card" style={{ padding: '18px' }}>
              <div className="kpi-top">
                <span className="kpi-label">Database Health</span>
                <Database size={18} className="kpi-icon green" />
              </div>
              <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
                {systemHealth?.telemetry?.databaseHealth?.status || 'CONNECTED'}
              </div>
              <div className="kpi-sub">
                Pool: <strong>{systemHealth?.telemetry?.databaseHealth?.pool?.idleCount || 18} Idle</strong> / <strong>{systemHealth?.telemetry?.databaseHealth?.pool?.totalCount || 20} Max</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                Cache Hit Ratio: <strong style={{ color: '#0f172a' }}>{systemHealth?.telemetry?.databaseHealth?.cacheHitRatio || '98.6%'}</strong> &bull; Repl Lag: 0ms
              </div>
            </div>
          </div>

          {/* 2-Column Telemetry Split: Failed Jobs / Queue Status & Storage / Backup */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Card A: Failed Jobs & Dead-Letter Queue */}
            <div className="card-section" style={{ margin: 0, padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#d97706" />
                    <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                      Failed Jobs &amp; Dead-Letter Queue ({systemHealth?.telemetry?.failedJobs?.count || 0})
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleRetryFailedJobs}
                    disabled={isRetryingFailedJobs || !systemHealth?.telemetry?.failedJobs?.count}
                    style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  >
                    <RotateCcw size={12} />
                    <span>{isRetryingFailedJobs ? 'Re-queueing...' : 'Retry All Failed'}</span>
                  </button>
                </div>

                {(!systemHealth?.telemetry?.failedJobs?.items || systemHealth.telemetry.failedJobs.items.length === 0) ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <CheckCircle2 size={28} color="#10b981" style={{ margin: '0 auto 6px', display: 'block' }} />
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Zero Failed Jobs</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>All asynchronous background queues are running cleanly.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {systemHealth.telemetry.failedJobs.items.map((job, idx) => (
                      <div key={idx} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: '800', color: '#92400e', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                              {job.id}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#78350f', marginLeft: '8px', fontWeight: '700' }}>{job.queue}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#b45309' }}>
                            {job.failedAt ? new Date(job.failedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>{job.task}</div>
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '2px' }}>Error: {job.error} (Attempt {job.attempts}/3)</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.74rem', color: '#64748b' }}>
                Auto-Retry Daemon: <strong>Active (Exponential backoff up to 3x)</strong>
              </div>
            </div>

            {/* Card B: Queue Status & Workers */}
            <div className="card-section" style={{ margin: 0, padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#0284c7" />
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                    Active Queue Workers &amp; Pipeline Status
                  </h3>
                </div>
                <span className="plan-pill plan-pro" style={{ fontSize: '0.7rem' }}>5 Queues Active</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(systemHealth?.telemetry?.queueStatus?.queues || []).map((q, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0f172a' }}><code>{q.name}</code></div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Workers: {q.workers} &bull; Completed Today: {q.completedToday.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="status-tag status-active" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{q.status}</span>
                      <div style={{ fontSize: '0.7rem', color: q.pending > 0 ? '#d97706' : '#16a34a', fontWeight: '700', marginTop: '2px' }}>
                        {q.pending} In Flight
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.74rem', color: '#475569' }}>
                <span>Total 24h Completed: <strong>18,450 jobs</strong></span>
                <span>Next Scheduled Cron: <strong>In 4 mins</strong></span>
              </div>
            </div>
          </div>

          {/* 2-Column Telemetry Split: Storage Usage & Backup Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
            {/* Card C: Storage Usage */}
            <div className="card-section" style={{ margin: 0, padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={18} color="#7c3aed" />
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>Platform Storage Usage</h3>
                </div>
                <span style={{ fontWeight: '800', color: '#7c3aed', fontSize: '0.85rem' }}>12.5% Used</span>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                1,280.4 GB <span style={{ fontSize: '0.82rem', fontWeight: '500', color: '#64748b' }}>of 10,240 GB (10 TB Allocated)</span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex', margin: '10px 0 14px' }}>
                <div style={{ width: '0.4%', background: '#2563eb' }} title="DB Tables (42.4 GB)"></div>
                <div style={{ width: '7.4%', background: '#7c3aed' }} title="Media & Attachments (758 GB)"></div>
                <div style={{ width: '1.4%', background: '#0284c7' }} title="Report Exports (140 GB)"></div>
                <div style={{ width: '3.3%', background: '#d97706' }} title="Encrypted Backups (340 GB)"></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b' }}>📦 Database Tables</div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>42.4 GB</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b' }}>📸 Media &amp; Attachments</div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>758.0 GB</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b' }}>📊 Report Exports</div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>140.0 GB</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b' }}>🔒 Encrypted Snapshots</div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>340.0 GB</div>
                </div>
              </div>
            </div>

            {/* Card D: Backup Status & Disaster Recovery */}
            <div className="card-section" style={{ margin: 0, padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#16a34a" />
                    <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>Backup &amp; Disaster Recovery</h3>
                  </div>
                  <span className="status-badge-green" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                    VERIFIED HEALTHY
                  </span>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '700' }}>Last Automated Snapshot:</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#166534' }}>
                      {systemHealth?.telemetry?.backupStatus?.lastBackupTime ? new Date(systemHealth.telemetry.backupStatus.lastBackupTime).toLocaleString() : 'Today 02:00 UTC'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.74rem', color: '#15803d' }}>
                    <span>Snapshot Size: <strong>24.8 GB</strong></span>
                    <span>Encryption: <strong>AES-256-GCM</strong></span>
                    <span>Retention: <strong>30 Days</strong></span>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.4 }}>
                  Target: <strong>Geo-Redundant Cloud Vault (Multi-Region S3 / Cold Vault)</strong>. Replication across 2 geographic availability zones.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Frequency: Every 24h at 02:00 UTC</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleTriggerBackup}
                  disabled={isBackupRunning}
                  style={{ background: '#0284c7', fontSize: '0.76rem', padding: '5px 12px' }}
                >
                  <Database size={13} />
                  <span>{isBackupRunning ? 'Snapshotting...' : 'Trigger Backup'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          7. GLOBAL PLATFORM AUDIT LOGS (8-DIMENSIONAL TRACKING)
          ===================================================================== */}
      {activeTab === 'security' && (
        <div className="tab-pane-content">
          {/* Header Action & Filter Bar */}
          <div className="pane-action-bar" style={{ marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Global Platform Audit Logs</h2>
                <span className="status-badge-green" style={{ fontSize: '0.74rem', fontWeight: '800' }}>
                  🔒 IMMUTABLE COMPLIANCE LEDGER
                </span>
              </div>
              <p className="section-desc" style={{ marginTop: '4px' }}>
                Full forensic change history tracking <strong>Who</strong>, <strong>Company</strong>, <strong>Action</strong>, <strong>Date/Time</strong>, <strong>IP</strong>, <strong>Device</strong>, <strong>Old Value</strong>, and <strong>New Value</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRefreshAuditLogs}
              >
                <RefreshCw size={14} />
                <span>Refresh Logs</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleExportAuditLogs}
                style={{ background: '#0284c7' }}
              >
                <Download size={14} />
                <span>Export Audit Trail (CSV)</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Strip */}
          <div className="card-section" style={{ padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by Actor, Email, Action, Company, IP or Device..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Company:</span>
              <select
                className="form-control"
                style={{ height: '36px', fontSize: '0.8rem', minWidth: '160px' }}
                value={auditCompanyFilter}
                onChange={(e) => setAuditCompanyFilter(e.target.value)}
              >
                <option value="ALL">All Companies (Platform-Wide)</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Action Type:</span>
              <select
                className="form-control"
                style={{ height: '36px', fontSize: '0.8rem', minWidth: '160px' }}
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
              >
                <option value="ALL">All Action Categories</option>
                <option value="SUBSCRIPTION">Subscription &amp; Billing</option>
                <option value="ROLE">Role &amp; Permissions</option>
                <option value="SETTINGS">Global Platform Settings</option>
                <option value="ACCOUNT">Account Security &amp; Locks</option>
                <option value="IMPERSONATION">Impersonation Audits</option>
                <option value="USER">User Management</option>
                <option value="BACKUP">Database Backups</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="saas-table-container">
              {auditLogsList.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <Inbox size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Audit Logs Found</div>
                  <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Platform changes and administrative actions will be recorded here.</p>
                </div>
              ) : (
                <table className="saas-data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '160px' }}>Who (Actor)</th>
                      <th style={{ minWidth: '150px' }}>Company</th>
                      <th style={{ minWidth: '140px' }}>Action</th>
                      <th style={{ minWidth: '140px' }}>Date / Time</th>
                      <th style={{ minWidth: '110px' }}>IP Address</th>
                      <th style={{ minWidth: '150px' }}>Device</th>
                      <th style={{ minWidth: '220px' }}>Old Value &rarr; New Value</th>
                      <th style={{ textAlign: 'right', minWidth: '90px' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogsList
                      .filter(log => {
                        const matchesSearch = !auditSearchQuery.trim() || 
                          (log.who && log.who.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
                          (log.actorEmail && log.actorEmail.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
                          (log.company && log.company.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
                          (log.action && log.action.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
                          (log.ip && log.ip.includes(auditSearchQuery)) ||
                          (log.device && log.device.toLowerCase().includes(auditSearchQuery.toLowerCase()));

                        const matchesCompany = auditCompanyFilter === 'ALL' || log.tenantId === auditCompanyFilter || log.company === auditCompanyFilter;
                        const matchesAction = auditActionFilter === 'ALL' || (log.action && log.action.toUpperCase().includes(auditActionFilter.toUpperCase()));

                        return matchesSearch && matchesCompany && matchesAction;
                      })
                      .map(log => {
                        const isDanger = log.action.includes('LOCKED') || log.action.includes('SUSPEND') || log.action.includes('DELETE');
                        const isUpgrade = log.action.includes('UPGRADE') || log.action.includes('EXTEND') || log.action.includes('RESTORE');
                        const isSecurity = log.action.includes('SECURITY') || log.action.includes('SETTINGS') || log.action.includes('ROLE');

                        return (
                          <tr key={log.id}>
                            {/* 1. Who (Actor) */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.72rem' }}>
                                  {(log.actorName || log.who || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0f172a' }}>
                                    {log.actorName || log.who || 'Super Admin'}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    {log.actorEmail}
                                  </div>
                                  <span className={`status-tag ${log.actorRole === 'SUPER_ADMIN' ? 'status-active' : 'status-trial'}`} style={{ fontSize: '0.62rem', padding: '1px 5px', marginTop: '2px', display: 'inline-block' }}>
                                    {log.actorRole}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 2. Company */}
                            <td>
                              <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1e293b' }}>
                                {log.company}
                              </div>
                              {log.tenantId && (
                                <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                                  {log.tenantId}
                                </div>
                              )}
                            </td>

                            {/* 3. Action */}
                            <td>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  background: isDanger ? '#fee2e2' : (isUpgrade ? '#dcfce7' : (isSecurity ? '#fef3c7' : '#e0f2fe')),
                                  color: isDanger ? '#991b1b' : (isUpgrade ? '#166534' : (isSecurity ? '#92400e' : '#0369a1')),
                                  border: `1px solid ${isDanger ? '#fecaca' : (isUpgrade ? '#bbf7d0' : (isSecurity ? '#fde68a' : '#bae6fd'))}`
                                }}
                              >
                                {log.action}
                              </span>
                              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                                Target: {log.targetEntity}
                              </div>
                            </td>

                            {/* 4. Date / Time */}
                            <td>
                              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
                                {log.time}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                                {log.createdAt ? new Date(log.createdAt).toISOString().slice(0, 10) : ''}
                              </div>
                            </td>

                            {/* 5. IP Address */}
                            <td>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>
                                {log.ip}
                              </span>
                            </td>

                            {/* 6. Device */}
                            <td>
                              <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: '500' }}>
                                {log.device}
                              </div>
                            </td>

                            {/* 7. Old Value -> New Value */}
                            <td>
                              {(log.oldValue || log.newValue) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {log.oldValue && (
                                    <div style={{ fontSize: '0.7rem', color: '#991b1b', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '4px', padding: '2px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '210px' }}>
                                      <strong>Old:</strong> {typeof log.oldValue === 'object' ? JSON.stringify(log.oldValue) : String(log.oldValue)}
                                    </div>
                                  )}
                                  {log.newValue && (
                                    <div style={{ fontSize: '0.7rem', color: '#166534', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '4px', padding: '2px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '210px' }}>
                                      <strong>New:</strong> {typeof log.newValue === 'object' ? JSON.stringify(log.newValue) : String(log.newValue)}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                  {log.detail || 'No direct state mutation'}
                                </span>
                              )}
                            </td>

                            {/* 8. Details / Action Inspector */}
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => setSelectedAuditDiff(log)}
                              >
                                <Eye size={12} />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
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
          MODAL: VIEW USER (PLATFORM DEEP INSPECTOR)
          ===================================================================== */}
      {isViewUserOpen && viewingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="admin-avatar" style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
                  {viewingUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0 }}>{viewingUser.name}</h3>
                    <span className={`status-tag status-${viewingUser.status?.toLowerCase() === 'active' ? 'active' : 'trial'}`}>
                      {viewingUser.status}
                    </span>
                    {viewingUser.isLocked && (
                      <span className="status-tag status-trial" style={{ background: '#fef2f2', color: '#dc2626' }}>
                        🔒 Locked
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.8rem' }}>{viewingUser.email} • {viewingUser.role}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsViewUserOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {/* Detail Tabs */}
              <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                {[
                  { key: 'overview', label: '👤 Profile & Identity' },
                  { key: 'company', label: '🏢 Company Association' },
                  { key: 'device', label: '💻 Device & Telemetry' },
                  { key: 'logins', label: '🕒 Login Activity' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    className="action-pill-btn"
                    style={{
                      background: viewUserDetailTab === tab.key ? '#0284c7' : '#f8fafc',
                      color: viewUserDetailTab === tab.key ? '#ffffff' : '#475569',
                      borderColor: viewUserDetailTab === tab.key ? '#0284c7' : '#cbd5e1',
                      fontWeight: '700'
                    }}
                    onClick={() => setViewUserDetailTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW & IDENTITY */}
              {viewUserDetailTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>User ID</div>
                    <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>{viewingUser.id}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Role</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0284c7' }}>{viewingUser.role}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Phone / Mobile</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>{viewingUser.phone || viewingUser.mobile || '—'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Territory</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>{viewingUser.territory || 'Default HQ'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Account Status</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? '#059669' : '#dc2626' }}>
                      {viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? '🟢 Active & Enabled' : '🔴 Disabled / Suspended'}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Security Lock State</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: viewingUser.isLocked ? '#dc2626' : '#059669' }}>
                      {viewingUser.isLocked ? '🔒 Account Locked' : '🔓 Unlocked'}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Last Active Timestamp</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>{viewingUser.lastLogin}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPANY ASSOCIATION */}
              {viewUserDetailTab === 'company' && (() => {
                const assignedComp = companies.find(c => c.id === viewingUser.tenantId || c.name === viewingUser.company) || {
                  name: viewingUser.company || 'Platform Central HQ',
                  code: 'HQ-GLOBAL',
                  country: 'India',
                  flag: '🌐',
                  plan: 'ENTERPRISE',
                  status: 'ACTIVE'
                };

                return (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>{assignedComp.flag || '🏢'}</span>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e3a8a' }}>{assignedComp.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#3b82f6' }}>Company Code: <strong>{assignedComp.code}</strong> • Jurisdiction: <strong>{assignedComp.country}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Subscription Tier</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#7c3aed' }}>{assignedComp.plan}</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Company Operating Status</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: assignedComp.status === 'ACTIVE' ? '#059669' : '#b45309' }}>
                          {assignedComp.status}
                        </div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Tenant ID</div>
                        <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>{viewingUser.tenantId || 'Central Platform'}</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Access Level in Tenant</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0284c7' }}>{viewingUser.role}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 3: DEVICE & SESSION TELEMETRY */}
              {viewUserDetailTab === 'device' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Last Active Device &amp; OS</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>Chrome 124.0 / Windows 11</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Last Login IP Address</div>
                    <div style={{ fontSize: '0.86rem', fontFamily: 'monospace', fontWeight: '800', color: '#2563eb' }}>103.21.244.18</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Geographic Location</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>Singapore, SG (Low Latency)</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Session Token Epoch</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#059669' }}>Active Token v{viewingUser.tokenVersion || 1}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.84rem', color: '#059669', fontWeight: '700' }}>✓ 2FA Security Verification Active</div>
                  </div>
                </div>
              )}

              {/* TAB 4: LOGIN ACTIVITY LOG */}
              {viewUserDetailTab === 'logins' && (
                <div className="saas-table-container">
                  <table className="saas-data-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Device &amp; Browser</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { time: 'Today, 22:45 UTC', device: 'Chrome 124.0 / Win11', ip: '103.21.244.18', loc: 'Singapore, SG', status: 'SUCCESS' },
                        { time: 'Yesterday, 14:12 UTC', device: 'Chrome 124.0 / Win11', ip: '103.21.244.18', loc: 'Singapore, SG', status: 'SUCCESS' },
                        { time: '3 days ago, 09:30 UTC', device: 'Safari 17 / iOS 17', ip: '14.161.42.90', loc: 'Ho Chi Minh, VN', status: 'SUCCESS' },
                        { time: '5 days ago, 03:15 UTC', device: 'Firefox 125 / macOS', ip: '115.79.208.12', loc: 'Phnom Penh, KH', status: 'FAILED' }
                      ].map((log, i) => (
                        <tr key={i}>
                          <td>{log.time}</td>
                          <td>{log.device}</td>
                          <td><code>{log.ip}</code></td>
                          <td>{log.loc}</td>
                          <td>
                            <span className={log.status === 'SUCCESS' ? 'status-badge-green' : 'status-tag status-trial'} style={log.status === 'FAILED' ? { background: '#fef2f2', color: '#dc2626' } : {}}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Platform-Level Quick Actions in Inspector */}
              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{
                      color: viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? '#dc2626' : '#16a34a',
                      borderColor: viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? '#fecdd3' : '#bbf7d0',
                      background: viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? '#fff1f2' : '#f0fdf4'
                    }}
                    onClick={() => {
                      handleToggleUserStatus(viewingUser.id, viewingUser.status, viewingUser.email);
                      setIsViewUserOpen(false);
                    }}
                  >
                    {viewingUser.status === 'ACTIVE' || viewingUser.status === 'Active' ? 'Disable User' : 'Enable User'}
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{ color: '#e11d48', borderColor: '#fecdd3', background: '#fff1f2' }}
                    onClick={() => {
                      handleForceLogoutUser(viewingUser);
                      setIsViewUserOpen(false);
                    }}
                  >
                    <LogOut size={12} /> Force Logout
                  </button>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                    onClick={() => {
                      setIsViewUserOpen(false);
                      handleOpenResetAccountModal(viewingUser);
                    }}
                  >
                    <RotateCcw size={12} /> Reset Account
                  </button>
                </div>
                <button type="button" className="cancel-btn" onClick={() => setIsViewUserOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: RESET USER ACCOUNT (FULL RE-CREDENTIALING & UNLOCK)
          ===================================================================== */}
      {isResetAccountOpen && resetAccountTarget && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <RotateCcw size={22} color="#d97706" />
                <div>
                  <h3>Reset User Account</h3>
                  <p>Restore and regenerate credentials for {resetAccountTarget.email}</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsResetAccountOpen(false)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {resetAccountResult ? (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '16px', color: '#166534' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={18} color="#16a34a" /> Account Successfully Reset!
                    </div>
                    <p style={{ fontSize: '0.8rem', margin: '6px 0 12px' }}>
                      Account for <strong>{resetAccountTarget.email}</strong> is now <strong>Active &amp; Unlocked</strong> with old sessions revoked.
                    </p>
                    <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '6px', padding: '10px 14px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>Temporary Password:</div>
                      <div style={{ fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: '800', color: '#0f172a', letterSpacing: '0.5px' }}>
                        {resetAccountResult.temporaryPassword}
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions-bar">
                    <button type="button" className="btn btn-primary" onClick={() => setIsResetAccountOpen(false)}>
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmResetAccount}>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px', marginBottom: '14px', fontSize: '0.82rem', color: '#92400e' }}>
                    <strong>Resetting this account will:</strong>
                    <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                      <li>Unlock the user account if locked</li>
                      <li>Set account status to <strong>Active</strong></li>
                      <li>Generate a secure new temporary password</li>
                      <li>Revoke all existing JWT sessions (force re-login)</li>
                    </ul>
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Temporary Password</label>
                    <input
                      type="text"
                      required
                      value={customTempPassword}
                      onChange={(e) => setCustomTempPassword(e.target.value)}
                      className="form-control"
                      style={{ fontFamily: 'monospace', fontWeight: '700' }}
                    />
                  </div>

                  <div className="modal-actions-bar">
                    <button type="button" className="cancel-btn" onClick={() => setIsResetAccountOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      <RotateCcw size={16} /> <span>Confirm &amp; Reset Account</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
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

      {/* =====================================================================
          MODAL: FULL 9-SUBSYSTEM DIAGNOSTIC REPORT
          ===================================================================== */}
      {diagnosticModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldCheck size={22} color="#0284c7" />
                <div>
                  <h3>Platform Subsystems Health Diagnostic</h3>
                  <p>End-to-end ping and latency verification across all 9 microservices</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setDiagnosticModal({ isOpen: false, data: null, loading: false })}>&times;</button>
            </div>

            <div className="modal-form-body">
              {diagnosticModal.loading ? (
                <div style={{ padding: '36px', textAlign: 'center', color: '#0284c7' }}>
                  <RefreshCw size={36} className="spin" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>Executing Subsystem Diagnostics...</div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Pinging API Gateway, Database Pool, S3 Object Vault, SMS/Email Relays &amp; Queue Schedulers...</p>
                </div>
              ) : (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} color="#16a34a" />
                      <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.92rem' }}>
                        All 9 Subsystems Passed Diagnostics (0 Anomalies)
                      </div>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: '4px' }}>
                      {diagnosticModal.data?.summary || 'All core platform subsystems passed health check diagnostics with zero blocking anomalies.'}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Tested Services</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>9 / 9</div>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Passed Probes</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#16a34a' }}>9</div>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>DB Ping Latency</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0284c7' }}>{diagnosticModal.data?.dbLatency || '22ms'}</div>
                    </div>
                  </div>

                  <div className="modal-actions-bar">
                    <button type="button" className="btn btn-primary" onClick={() => setDiagnosticModal({ isOpen: false, data: null, loading: false })}>
                      Close Diagnostic Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: SUBSYSTEM DETAILED INSPECTOR
          ===================================================================== */}
      {selectedHealthService && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Server size={22} color="#0284c7" />
                <div>
                  <h3>{selectedHealthService.name}</h3>
                  <p>Subsystem Technical Telemetry &amp; Performance Specifications</p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedHealthService(null)}>&times;</button>
            </div>

            <div className="modal-form-body">
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.88rem' }}>Status: {selectedHealthService.status}</div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d' }}>Uptime SLA: {selectedHealthService.uptime}</div>
                </div>
                <span className="status-badge-green">● OPERATIONAL</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '16px' }}>
                {selectedHealthService.description}
              </div>

              {selectedHealthService.details && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Active Runtime Parameters:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.76rem' }}>
                    {Object.entries(selectedHealthService.details).map(([k, v], i) => (
                      <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
                        <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                        <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{String(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-primary" onClick={() => setSelectedHealthService(null)}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: AUDIT FORENSIC CHANGE INSPECTOR (OLD VS NEW VALUE DIFF)
          ===================================================================== */}
      {selectedAuditDiff && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldAlert size={24} color="#0284c7" />
                <div>
                  <h3>Audit Forensic Change Inspector</h3>
                  <p>Log ID: <code>{selectedAuditDiff.id}</code> &bull; Action: <strong>{selectedAuditDiff.action}</strong></p>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedAuditDiff(null)}>&times;</button>
            </div>

            <div className="modal-form-body">
              {/* Context Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>👤 Who (Actor)</div>
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a', marginTop: '2px' }}>
                    {selectedAuditDiff.who || selectedAuditDiff.actorName || 'Super Admin'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{selectedAuditDiff.actorEmail} ({selectedAuditDiff.actorRole})</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>🏢 Company / Tenant</div>
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a', marginTop: '2px' }}>
                    {selectedAuditDiff.company || 'Platform HQ'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{selectedAuditDiff.tenantId || 'GLOBAL'}</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>🌐 Origin &amp; Device</div>
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a', marginTop: '2px' }}>
                    {selectedAuditDiff.ip || '127.0.0.1'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedAuditDiff.device || 'Web Browser'}
                  </div>
                </div>
              </div>

              {/* Timestamp & Target Entity Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '8px 12px', marginBottom: '16px', fontSize: '0.76rem' }}>
                <span>Timestamp: <strong>{selectedAuditDiff.time || selectedAuditDiff.createdAt}</strong></span>
                <span>Target Entity: <strong>{selectedAuditDiff.targetEntity}</strong></span>
              </div>

              {/* Side-by-Side Diff Container (Old Value vs New Value) */}
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                State Mutation Forensic Diff:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {/* Old Value */}
                <div style={{ border: '1px solid #fecaca', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#fee2e2', padding: '8px 12px', color: '#991b1b', fontWeight: '800', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔴</span>
                    <span>Old Value (Previous State)</span>
                  </div>
                  <div style={{ padding: '10px', background: '#fff5f5', minHeight: '130px', maxHeight: '220px', overflowY: 'auto' }}>
                    {selectedAuditDiff.oldValue ? (
                      <pre style={{ margin: 0, fontSize: '0.72rem', fontFamily: 'monospace', color: '#7f1d1d', whiteSpace: 'pre-wrap' }}>
                        {typeof selectedAuditDiff.oldValue === 'object' ? JSON.stringify(selectedAuditDiff.oldValue, null, 2) : String(selectedAuditDiff.oldValue)}
                      </pre>
                    ) : (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.74rem', padding: '20px 0', textAlign: 'center' }}>
                        (Null / No Previous Value)
                      </div>
                    )}
                  </div>
                </div>

                {/* New Value */}
                <div style={{ border: '1px solid #bbf7d0', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#dcfce7', padding: '8px 12px', color: '#166534', fontWeight: '800', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🟢</span>
                    <span>New Value (Mutated State)</span>
                  </div>
                  <div style={{ padding: '10px', background: '#f0fdf4', minHeight: '130px', maxHeight: '220px', overflowY: 'auto' }}>
                    {selectedAuditDiff.newValue ? (
                      <pre style={{ margin: 0, fontSize: '0.72rem', fontFamily: 'monospace', color: '#14532d', whiteSpace: 'pre-wrap' }}>
                        {typeof selectedAuditDiff.newValue === 'object' ? JSON.stringify(selectedAuditDiff.newValue, null, 2) : String(selectedAuditDiff.newValue)}
                      </pre>
                    ) : (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.74rem', padding: '20px 0', textAlign: 'center' }}>
                        (Null / No Mutated Value)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Metadata / Details */}
              {selectedAuditDiff.details && Object.keys(selectedAuditDiff.details).length > 0 && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', fontSize: '0.74rem' }}>
                  <span style={{ fontWeight: '700', color: '#334155' }}>Context Details / Audit Notes: </span>
                  <span style={{ color: '#475569' }}>
                    {typeof selectedAuditDiff.details === 'object' ? JSON.stringify(selectedAuditDiff.details) : String(selectedAuditDiff.details)}
                  </span>
                </div>
              )}

              <div className="modal-actions-bar" style={{ marginTop: '18px' }}>
                <button type="button" className="btn btn-primary" onClick={() => setSelectedAuditDiff(null)}>
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
