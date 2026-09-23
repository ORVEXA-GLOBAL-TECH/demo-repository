import React, { useState } from 'react';
import {
  X,
  Building2,
  Globe2,
  CreditCard,
  Users,
  Layers,
  ShieldCheck,
  Lock,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Server,
  Zap,
  HardDrive,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Calculator,
  TrendingUp,
  Compass,
  Stethoscope
} from 'lucide-react';
import ImageKitUploader from './ImageKitUploader';

export const ROLE_MODULES_CONFIG = [
  {
    id: 'admin',
    name: 'Admin',
    fullName: 'Admin Module',
    badge: 'Master Governance',
    icon: ShieldCheck,
    color: '#0284c7',
    desc: 'System administration, user access control, product master data and compliance auditing.',
    features: [
      { key: 'userManagement', label: 'User Provisioning & Licensing', desc: 'Create, lock, assign and manage employee licenses across all divisions' },
      { key: 'roleAccessControl', label: 'RBAC & Permission Matrices', desc: 'Configure granular permission sets and hierarchical access controls' },
      { key: 'masterDataManagement', label: 'Master HCP & Chemist Database', desc: 'Centralized curation of verified doctors, hospitals, and stockists' },
      { key: 'productCatalog', label: 'Product Catalog & Price Lists', desc: 'Manage pharmaceutical formulations, SKUs, batches and tax rates' },
      { key: 'systemSecurityAudit', label: 'Security & Audit Trail Logs', desc: 'Immutable login audits, 21 CFR Part 11 electronic records access' },
      { key: 'integrationsApi', label: 'API Keys & ERP Integrations', desc: 'Connect SAP, Oracle, Tally, or warehouse dispatch Webhooks' }
    ]
  },
  {
    id: 'director',
    name: 'Director',
    fullName: 'Director Module',
    badge: 'Executive Leadership',
    icon: Briefcase,
    color: '#7c3aed',
    desc: 'Strategic oversight, national revenue dashboards, AI sales projections and board approvals.',
    features: [
      { key: 'executiveKpis', label: 'Executive KPI & Revenue Dashboards', desc: 'Real-time sales revenue, margin analysis, and nationwide growth trends' },
      { key: 'growthAnalytics', label: 'Territory Market Penetration', desc: 'Zonal market share, competitor intelligence and doctor reach rates' },
      { key: 'aiSalesForecasting', label: 'AI Predictive Forecasting & Churn', desc: 'Machine-learning models for demand forecasting and inventory risks' },
      { key: 'strategicApprovals', label: 'Commercial Strategy Approvals', desc: 'High-value distributor credit lines, annual budgets and policy sign-offs' },
      { key: 'boardReporting', label: 'Governance & Board Pack Generation', desc: 'One-click export of statutory compliance and quarterly performance decks' }
    ]
  },
  {
    id: 'accountant',
    name: 'Accountant',
    fullName: 'Accountant Module',
    badge: 'Finance & Claims',
    icon: Calculator,
    color: '#059669',
    desc: 'Travel & daily allowances (TA/DA), stockist billing, invoice reconciliations and ledger.',
    features: [
      { key: 'expenseClaims', label: 'Field Expense Claims (TA / DA)', desc: 'Audit mileage, GPS journey validation, daily DA allowances and hotel bills' },
      { key: 'invoiceBilling', label: 'Stockist Invoicing & POB Billing', desc: 'Generate GST-compliant tax invoices and track outstanding receivables' },
      { key: 'sampleGiftAudit', label: 'Sample & Gift Inventory Audit', desc: 'Track batch dispatch, doctor gift distribution costs and sample registers' },
      { key: 'payrollIncentives', label: 'Sales Incentive & Commission Calculations', desc: 'Automated calculation of field force target-linked monthly payouts' },
      { key: 'taxCompliance', label: 'Tax Ledgers & ERP Sync', desc: 'Export journal entries to Tally, SAP and financial ledger systems' }
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    fullName: 'Manager Module',
    badge: 'Regional Ops',
    icon: Building2,
    color: '#d97706',
    desc: 'Zonal field operations oversight, team scorecards, leave approvals and territory routing.',
    features: [
      { key: 'zonalOversight', label: 'Zonal Operations Cockpit', desc: 'Monitor multi-state team field presence, call volume and doctor coverage' },
      { key: 'teamScorecards', label: 'Team Performance Scorecards', desc: 'Rank sales reps, supervisors, and areas by KPI achievement velocity' },
      { key: 'leaveApprovals', label: 'Leave & Tour Plan Escalations', desc: 'Approve medical leave, tour budget escalations, and territory exceptions' },
      { key: 'territoryWorkflows', label: 'Territory Reallocation Workflows', desc: 'Reassign doctors, routes, and stockists between sales divisions' },
      { key: 'doctorCoverageAudit', label: 'Doctor Coverage & Missed Call Analysis', desc: 'Identify core vs non-core physician frequency compliance' }
    ]
  },
  {
    id: 'salesManager',
    name: 'Sales Manager',
    fullName: 'Sales Manager Module',
    badge: 'Sales Operations',
    icon: TrendingUp,
    color: '#e11d48',
    desc: 'Secondary order booking, target tracking, stockist credit limits and hierarchy distribution.',
    features: [
      { key: 'orderManagement', label: 'Secondary Order Booking & Approvals', desc: 'Review orders placed by MRs with stockists, apply discounts and dispatch' },
      { key: 'targetTracking', label: 'Target vs Achievement Analytics', desc: 'Track monthly brand-wise, rep-wise, and territory-wise sales targets' },
      { key: 'stockistCreditLimits', label: 'Stockist Credit & Outstanding Ledgers', desc: 'Monitor payment recovery, credit limits, and overdue balance alerts' },
      { key: 'salesHierarchy', label: 'Sales Hierarchy & Team Distribution', desc: 'Configure Area Business Managers, reps, and product division assignments' },
      { key: 'productPerformance', label: 'Fast-Moving SKU & Brand Performance', desc: 'Track product lifecycle, newly launched molecules and sales velocity' }
    ]
  },
  {
    id: 'mrSupervisor',
    name: 'MR Supervisor',
    fullName: 'MR Supervisor Module',
    badge: 'Field Supervision',
    icon: Compass,
    color: '#0891b2',
    desc: 'Real-time GPS tracking, DCR review, joint doctor fieldwork and route deviation alerts.',
    features: [
      { key: 'gpsLiveTracking', label: 'Real-time Field GPS Telemetry', desc: 'Track live rep locations, battery telemetry, and route breadcrumbs' },
      { key: 'dcrVerification', label: 'DCR Review & Electronic Verification', desc: 'Verify doctor call logs, chemist visits, and field photos in real-time' },
      { key: 'jointCalls', label: 'Joint Field Work & Accompaniment Calls', desc: 'Record coaching feedback and dual visits to high-prescribing KOL doctors' },
      { key: 'routeDeviationAlerts', label: 'Route Deviation & Geo-Fencing Alerts', desc: 'Alerts when rep calls are logged outside verified clinic coordinates' },
      { key: 'tourProgramApproval', label: 'Monthly Tour Program Approvals', desc: 'Review, modify and approve next month’s proposed rep travel calendars' }
    ]
  },
  {
    id: 'mr',
    name: 'MR',
    fullName: 'MR Module',
    badge: 'Field Representative',
    icon: Stethoscope,
    color: '#2563eb',
    desc: 'Daily call reporting (DCR), monthly tour plan, doctor CRM, chemist POB booking and offline sync.',
    features: [
      { key: 'dcrReporting', label: 'Daily Call Reporting (DCR)', desc: 'Instant logging of doctor discussions, chemist visits and stockist interactions' },
      { key: 'tourProgramPlanning', label: 'Monthly Tour Program (MTP) Submission', desc: 'Submit advance monthly route calendar and travel plan for manager approval' },
      { key: 'doctorCrm', label: 'Doctor / HCP CRM Directory', desc: 'View physician profiles, specialties, prescribing habits, and visit history' },
      { key: 'pobOrderBooking', label: 'Chemist POB Order Booking', desc: 'Collect and book secondary product orders directly from retail chemists' },
      { key: 'digitalVisualAids', label: 'Digital E-Detailing & Visual Aids', desc: 'Present interactive tablet slides, medical animations, and molecule studies' },
      { key: 'sampleDistribution', label: 'Sample & Gift Distribution Log', desc: 'Record physician sample delivery with batch numbers and digital signatures' },
      { key: 'offlineSync', label: 'Offline Mobile Sync Engine', desc: 'Continue logging calls and orders without internet; auto-syncs when online' }
    ]
  }
];

const COUNTRY_OPTIONS = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹', timezone: 'Asia/Kolkata' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND', symbol: '₫', timezone: 'Asia/Ho_Chi_Minh' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', timezone: 'America/New_York' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', timezone: 'Europe/London' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ', timezone: 'Asia/Dubai' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', symbol: 'S$', timezone: 'Asia/Singapore' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€', timezone: 'Europe/Berlin' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', symbol: '₱', timezone: 'Asia/Manila' }
];

const PLAN_PRESETS = [
  { id: 'FREE_TRIAL', name: 'Free Trial', rate: 0, users: 25, storage: 10, desc: '14-Day evaluation with core DCR & Doctor CRM' },
  { id: 'STARTER', name: 'Starter Tier', rate: 100, users: 50, storage: 25, desc: 'Ideal for regional pharma brands with field MRs' },
  { id: 'GROWTH', name: 'Growth Tier', rate: 450, users: 150, storage: 50, desc: 'Multi-territory sales ops with order booking' },
  { id: 'PROFESSIONAL', name: 'Professional', rate: 1000, users: 350, storage: 100, desc: 'Complete enterprise SFA with GPS telemetry' },
  { id: 'ENTERPRISE', name: 'Enterprise Sovereign', rate: 2500, users: 1000, storage: 500, desc: 'Unlimited scalability, AI forecasting & SLA' },
  { id: 'CUSTOM', name: 'Custom Agreement', rate: 0, users: 500, storage: 250, desc: 'Negotiated enterprise contract terms' }
];

const COLOR_PRESETS = [
  '#0284c7', // Sky Blue
  '#059669', // Emerald
  '#7c3aed', // Royal Violet
  '#4f46e5', // Deep Indigo
  '#d97706', // Amber Gold
  '#e11d48', // Crimson Red
  '#0f172a', // Slate Black
  '#0891b2'  // Cyan
];

export const buildInitialModules = () => {
  const modState = {
    mrReporting: true,
    dcr: true,
    tourPlan: true,
    gpsLiveTracking: true,
    doctorManagement: true,
    chemistStockist: true,
    orderManagement: true,
    expenseManagement: true,
    sampleDistribution: true,
    visualAids: true,
    aiAnalytics: true,
    whatsappAlerts: true,
    offlineSync: true
  };

  ROLE_MODULES_CONFIG.forEach(role => {
    modState[role.id] = { enabled: true };
    role.features.forEach(f => {
      modState[role.id][f.key] = true;
    });
  });

  return modState;
};

const WIZARD_STEPS = [
  { id: 'identity', stepNum: 1, title: 'Identity & Brand', desc: 'Company name, slug & logo', icon: Building2 },
  { id: 'regional', stepNum: 2, title: 'Regional & Compliance', desc: 'Jurisdiction, currency & GxP', icon: Globe2 },
  { id: 'commercial', stepNum: 3, title: 'Plan & Commercials', desc: 'Pricing tier & billing terms', icon: CreditCard },
  { id: 'quotas', stepNum: 4, title: 'Capacity Quotas', desc: 'User seats, storage & API rate', icon: Zap },
  { id: 'modules', stepNum: 5, title: 'Role Modules', desc: '7 Modules & Functionalities', icon: Layers },
  { id: 'admin', stepNum: 6, title: 'Company Admin', desc: 'Root administrator account', icon: ShieldCheck },
  { id: 'security', stepNum: 7, title: 'Security & Review', desc: 'Timeouts, IP whitelist & launch', icon: Lock }
];

export default function CreateCompanyModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [activeRoleTab, setActiveRoleTab] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // 1. Identity & Branding
    name: '',
    legalName: '',
    code: '',
    industrySegment: 'PHARMACEUTICALS',
    companyType: 'ENTERPRISE',
    taxId: '',
    logoUrl: '',
    brandPrimaryColor: '#0284c7',
    websiteUrl: '',
    subdomain: '',
    customDomain: '',

    // 2. Regional & Sovereign Governance
    countryCode: 'IN',
    operatingCountries: ['IN'],
    timezone: 'Asia/Kolkata',
    currencyCode: 'INR',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 'APRIL',
    complianceFrameworks: ['21_CFR_PART_11', 'GXP', 'ISO_27001'],
    dataResidencyRegion: 'ap-south-1',

    // 3. Commercial & Subscription
    plan: 'STARTER',
    billingCycle: 'Monthly',
    monthlyRate: 100,
    annualContractValue: 1200,
    currency: 'USD',
    paymentTerms: 'NET_30',
    poNumber: '',
    trialDays: 14,
    gracePeriodDays: 14,
    autoRenew: true,

    // 4. Capacity Quotas & Limits
    maxUsers: 100,
    maxStorageGb: 25,
    apiRateLimitPerMin: 600,

    // 5. Pharma Role Modules (Admin, Director, Accountant, Manager, Sales Manager, MR Supervisor, MR)
    modules: buildInitialModules(),

    // 6. Primary Root Company Admin
    adminName: '',
    contactEmail: '',
    contactPhone: '',
    adminPassword: '',
    mfaEnforced: false,

    // 7. Security & Isolation
    sessionTimeoutMinutes: 15,
    ipWhitelist: '',
    auditRetentionYears: 7
  });

  if (!isOpen) return null;

  const currentStepIndex = WIZARD_STEPS.findIndex(s => s.id === activeTab);
  const currentStep = WIZARD_STEPS[currentStepIndex] || WIZARD_STEPS[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / WIZARD_STEPS.length) * 100);

  const handleChange = (field, val) => {
    setFormData(prev => {
      const next = { ...prev, [field]: val };

      if (field === 'name') {
        const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
        if (!prev.code || prev.code === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)) {
          next.code = slug;
        }
        if (!prev.subdomain || prev.subdomain === `${prev.code}.alleviare.com`) {
          next.subdomain = slug ? `${slug}.alleviare.com` : '';
        }
        if (!prev.legalName) {
          next.legalName = val ? `${val} Private Limited` : '';
        }
      }

      if (field === 'plan') {
        const matched = PLAN_PRESETS.find(p => p.id === val);
        if (matched) {
          next.monthlyRate = matched.rate;
          next.annualContractValue = matched.rate * 12;
          next.maxUsers = matched.users;
          next.maxStorageGb = matched.storage;
        }
      }

      if (field === 'monthlyRate') {
        next.annualContractValue = (Number(val) || 0) * 12;
      }

      return next;
    });
  };

  const handleToggleRoleModule = (roleId) => {
    setFormData(prev => {
      const current = prev.modules[roleId] || { enabled: true };
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [roleId]: {
            ...current,
            enabled: !current.enabled
          }
        }
      };
    });
  };

  const handleToggleRoleFeature = (roleId, featureKey) => {
    setFormData(prev => {
      const currentRole = prev.modules[roleId] || { enabled: true };
      const currentVal = currentRole[featureKey] !== false;
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [roleId]: {
            ...currentRole,
            [featureKey]: !currentVal
          }
        }
      };
    });
  };

  const handleEnableAllForRole = (roleId) => {
    setFormData(prev => {
      const roleDef = ROLE_MODULES_CONFIG.find(r => r.id === roleId);
      const updated = { enabled: true };
      if (roleDef) {
        roleDef.features.forEach(f => {
          updated[f.key] = true;
        });
      }
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [roleId]: updated
        }
      };
    });
  };

  const handleEnableAllGlobal = () => {
    setFormData(prev => {
      const updated = { ...prev.modules };
      ROLE_MODULES_CONFIG.forEach(roleDef => {
        updated[roleDef.id] = { enabled: true };
        roleDef.features.forEach(f => {
          updated[roleDef.id][f.key] = true;
        });
      });
      updated.mrReporting = true;
      updated.dcr = true;
      updated.tourPlan = true;
      updated.gpsLiveTracking = true;
      updated.doctorManagement = true;
      updated.chemistStockist = true;
      updated.orderManagement = true;
      updated.expenseManagement = true;
      updated.sampleDistribution = true;
      updated.visualAids = true;
      updated.aiAnalytics = true;
      updated.whatsappAlerts = true;
      updated.offlineSync = true;
      return {
        ...prev,
        modules: updated
      };
    });
  };

  const handleDeselectAllGlobal = () => {
    setFormData(prev => {
      const updated = { ...prev.modules };
      ROLE_MODULES_CONFIG.forEach(roleDef => {
        updated[roleDef.id] = { enabled: false };
        roleDef.features.forEach(f => {
          updated[roleDef.id][f.key] = false;
        });
      });
      return {
        ...prev,
        modules: updated
      };
    });
  };

  const handleModuleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [key]: !prev.modules[key]
      }
    }));
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange('adminPassword', pwd);
    setShowPassword(true);
  };

  const handleNext = () => {
    if (activeTab === 'identity' && !formData.name.trim()) {
      setValidationError('Please enter a Company Name before continuing.');
      return;
    }
    setValidationError('');
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setActiveTab(WIZARD_STEPS[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStepIndex > 0) {
      setActiveTab(WIZARD_STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setActiveTab('identity');
      setValidationError('Please enter a Company Name.');
      return;
    }

    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      setActiveTab('admin');
      setValidationError('Please enter a valid Admin Contact Email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        legalName: formData.legalName.trim() || formData.name.trim(),
        code: formData.code.trim().toLowerCase(),
        industrySegment: formData.industrySegment,
        companyType: formData.companyType,
        taxId: formData.taxId.trim(),
        logoUrl: formData.logoUrl.trim(),
        brandPrimaryColor: formData.brandPrimaryColor,
        websiteUrl: formData.websiteUrl.trim(),
        subdomain: formData.subdomain.trim().toLowerCase(),
        customDomain: formData.customDomain.trim(),
        countryCode: formData.countryCode,
        operatingCountries: formData.operatingCountries,
        timezone: formData.timezone,
        currencyCode: formData.currencyCode,
        dateFormat: formData.dateFormat,
        fiscalYearStart: formData.fiscalYearStart,
        complianceFrameworks: formData.complianceFrameworks,
        dataResidencyRegion: formData.dataResidencyRegion,
        plan: formData.plan,
        billingCycle: formData.billingCycle,
        monthlyRate: Number(formData.monthlyRate) || 0,
        annualContractValue: Number(formData.annualContractValue) || 0,
        currency: formData.currency,
        paymentTerms: formData.paymentTerms,
        poNumber: formData.poNumber.trim(),
        status: formData.plan === 'FREE_TRIAL' ? 'Trial' : 'Active',
        gracePeriodDays: Number(formData.gracePeriodDays) || 14,
        autoRenew: formData.autoRenew,
        maxUsers: Number(formData.maxUsers) || 100,
        maxStorageGb: Number(formData.maxStorageGb) || 25,
        apiRateLimitPerMin: Number(formData.apiRateLimitPerMin) || 600,
        adminName: formData.adminName.trim() || 'Company Administrator',
        contactName: formData.adminName.trim() || 'Company Administrator',
        contactEmail: formData.contactEmail.trim().toLowerCase(),
        contactPhone: formData.contactPhone.trim(),
        adminPassword: formData.adminPassword.trim() || 'Admin@1234!',
        mfaEnforced: formData.mfaEnforced,
        sessionTimeoutMinutes: Number(formData.sessionTimeoutMinutes) || 15,
        ipWhitelist: formData.ipWhitelist ? formData.ipWhitelist.split(',').map(s => s.trim()).filter(Boolean) : [],
        auditRetentionYears: Number(formData.auditRetentionYears) || 7,
        settings: {
          modules: formData.modules
        }
      };

      await onCreated(payload);
      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to provision company tenant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1080px',
        height: '710px',
        maxHeight: '92vh',
        display: 'flex',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* ==============================================================
            LEFT NAVIGATION RAIL / STEPPER SIDEBAR
            ============================================================== */}
        <div style={{
          width: '290px',
          background: 'linear-gradient(180deg, #090e17 0%, #0f172a 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #1e293b',
          flexShrink: 0
        }}>
          {/* Sidebar Top Branding */}
          <div style={{ padding: '22px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.35)'
              }}>
                <Building2 size={18} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: '#38bdf8', textTransform: 'uppercase' }}>
                  Multi-Tenant Sovereign
                </span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                  Provision Tenant
                </h3>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
              Step-by-step enterprise onboarding wizard
            </p>
          </div>

          {/* Stepper Navigation Items */}
          <div style={{ padding: '14px 12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {WIZARD_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setValidationError('');
                    setActiveTab(step.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    background: isActive
                      ? 'rgba(56, 189, 248, 0.12)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Step Number Circle / Checkmark */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isActive
                      ? '#0284c7'
                      : isPast
                        ? '#059669'
                        : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: isActive ? '0 0 12px rgba(2, 132, 199, 0.5)' : 'none'
                  }}>
                    {isPast ? <Check size={14} /> : step.stepNum}
                  </div>

                  {/* Step Title & Subtitle */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#f8fafc' : isPast ? '#cbd5e1' : '#94a3b8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: isActive ? '#38bdf8' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.desc}
                    </div>
                  </div>

                  {isActive && (
                    <ChevronRight size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time Tenant Preview Card */}
          <div style={{
            margin: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: formData.brandPrimaryColor || '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                flexShrink: 0,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  formData.name ? formData.name.charAt(0).toUpperCase() : 'T'
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formData.name || 'New Organization'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formData.code ? `${formData.code}.alleviare.com` : 'slug.alleviare.com'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                {formData.plan} (${formData.monthlyRate}/mo)
              </span>
              <span style={{ fontSize: '0.68rem', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                {formData.maxUsers} Users &bull; {formData.maxStorageGb}GB
              </span>
            </div>
          </div>
        </div>

        {/* ==============================================================
            RIGHT MAIN CONTENT AREA
            ============================================================== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', minWidth: 0 }}>
          {/* Header Bar */}
          <div style={{
            padding: '18px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  background: '#f0f9ff',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #bae6fd',
                  letterSpacing: '0.04em'
                }}>
                  STEP {currentStepIndex + 1} OF 7
                </span>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                  Progress: {progressPercent}%
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {currentStep.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                color: '#64748b',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div style={{
              margin: '16px 28px 0',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.84rem',
              fontWeight: 500
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Scrollable Form Canvas */}
          <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
            {/* --------------------------------------------------------
                STEP 1: IDENTITY & BRANDING
                -------------------------------------------------------- */}
            {activeTab === 'identity' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Commercial Company Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Novartis Pharma"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Brand title displayed across mobile apps &amp; reports</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Registered Legal Entity Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Novartis India Private Limited"
                    value={formData.legalName}
                    onChange={(e) => handleChange('legalName', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal entity for corporate agreements &amp; invoices</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Unique Tenant Code / Slug <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. novartis-in"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>System identifier used for API endpoints &amp; DB scoping</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Industry Segment
                  </label>
                  <select
                    value={formData.industrySegment}
                    onChange={(e) => handleChange('industrySegment', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="PHARMACEUTICALS">Pharmaceuticals &amp; Formulations</option>
                    <option value="BIOTECH">Biotechnology &amp; Vaccines</option>
                    <option value="MEDICAL_DEVICES">Medical Devices &amp; Diagnostics</option>
                    <option value="NUTRACEUTICALS">Nutraceuticals &amp; Wellness</option>
                    <option value="ANIMAL_HEALTH">Veterinary &amp; Animal Health</option>
                    <option value="CDMO_CRO">Contract Research &amp; CDMO</option>
                    <option value="HEALTHCARE_SYSTEM">Hospital Network / Healthcare</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Organization Type
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => handleChange('companyType', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="ENTERPRISE">Enterprise Multinational (MNC)</option>
                    <option value="MID_MARKET">Mid-Market Regional Leader</option>
                    <option value="STARTUP">High-Growth Pharma Startup</option>
                    <option value="GOVERNMENT">Government / State Medical Agency</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Tax ID / GSTIN / VAT Registration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 27AABCN1234F1Z8 / US-EIN"
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Dedicated Subdomain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. novartis.alleviare.com"
                    value={formData.subdomain}
                    onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase())}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Custom White-Label Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. sfa.novartis-pharma.com"
                    value={formData.customDomain}
                    onChange={(e) => handleChange('customDomain', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <ImageKitUploader
                    value={formData.logoUrl}
                    onChange={(newUrl) => handleChange('logoUrl', newUrl)}
                    companyName={formData.name || 'company'}
                    label="Company Brand Logo (ImageKit CDN Hosted)"
                    folder="/company-logos"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Brand Primary Color Theme
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleChange('brandPrimaryColor', color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: color,
                          border: formData.brandPrimaryColor === color ? '3px solid #0f172a' : '1px solid #cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        {formData.brandPrimaryColor === color && <Check size={14} />}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={formData.brandPrimaryColor}
                      onChange={(e) => handleChange('brandPrimaryColor', e.target.value)}
                      style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#475569' }}>
                      {formData.brandPrimaryColor}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 2: REGIONAL & SOVEREIGN GOVERNANCE
                -------------------------------------------------------- */}
            {activeTab === 'regional' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    HQ Sovereign Country
                  </label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleChange('countryCode', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code} &bull; {c.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Default Operational Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (ICT +7:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Operational Currency
                  </label>
                  <select
                    value={formData.currencyCode}
                    onChange={(e) => handleChange('currencyCode', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="VND">VND (₫ - Vietnamese Dong)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="AED">AED (د.إ - UAE Dirham)</option>
                    <option value="SGD">SGD (S$ - Singapore Dollar)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Standard Date Format
                  </label>
                  <select
                    value={formData.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 24/09/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/24/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Fiscal Year Starting Month
                  </label>
                  <select
                    value={formData.fiscalYearStart}
                    onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="APRIL">April (Standard Indian/UK FY)</option>
                    <option value="JANUARY">January (Calendar Year FY)</option>
                    <option value="JULY">July (Mid-Year FY)</option>
                    <option value="OCTOBER">October (Q4 FY)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Data Residency Cloud Region
                  </label>
                  <select
                    value={formData.dataResidencyRegion}
                    onChange={(e) => handleChange('dataResidencyRegion', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    <option value="ap-south-1">AWS Mumbai (ap-south-1) - Sovereign India</option>
                    <option value="ap-southeast-1">AWS Singapore (ap-southeast-1) - ASEAN Hub</option>
                    <option value="eu-central-1">AWS Frankfurt (eu-central-1) - GDPR Strict</option>
                    <option value="us-east-1">AWS N. Virginia (us-east-1) - Global Primary</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Regulatory Compliance &amp; Audit Frameworks
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: '21_CFR_PART_11', label: 'FDA 21 CFR Part 11 (Audit Trail & E-Sign)' },
                      { id: 'GXP', label: 'GxP Validated Guidelines' },
                      { id: 'HIPAA', label: 'HIPAA Health Privacy' },
                      { id: 'GDPR', label: 'GDPR EU Data Sovereign' },
                      { id: 'ISO_27001', label: 'ISO 27001 Certified' }
                    ].map(framework => {
                      const isChecked = formData.complianceFrameworks.includes(framework.id);
                      return (
                        <label
                          key={framework.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: isChecked ? '#eff6ff' : '#f8fafc',
                            border: `1px solid ${isChecked ? '#3b82f6' : '#cbd5e1'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: isChecked ? '#1d4ed8' : '#475569'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? formData.complianceFrameworks.filter(id => id !== framework.id)
                                : [...formData.complianceFrameworks, framework.id];
                              handleChange('complianceFrameworks', updated);
                            }}
                          />
                          <span>{framework.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 3: COMMERCIAL & SUBSCRIPTION
                -------------------------------------------------------- */}
            {activeTab === 'commercial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Select Subscription Plan Tier
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                    {PLAN_PRESETS.map(p => {
                      const isSelected = formData.plan === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleChange('plan', p.id)}
                          style={{
                            border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                            background: isSelected ? '#f0f9ff' : '#ffffff',
                            borderRadius: '12px',
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.9rem', color: isSelected ? '#0284c7' : '#0f172a' }}>
                                {p.name}
                              </strong>
                              {isSelected && <Check size={16} color="#0284c7" />}
                            </div>
                            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 0 10px' }}>
                              {p.desc}
                            </p>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                              ${p.rate} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b' }}>/month</span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                              Includes {p.users} Users &bull; {p.storage}GB Cloud
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => handleChange('billingCycle', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                    >
                      <option value="Monthly">Monthly Recurring</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual Upfront (15% Discount)</option>
                      <option value="Multi-Year">Multi-Year Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Monthly Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.monthlyRate}
                      onChange={(e) => handleChange('monthlyRate', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Payment Terms
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => handleChange('paymentTerms', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                    >
                      <option value="NET_30">NET 30 Days Invoice</option>
                      <option value="NET_60">NET 60 Days Enterprise</option>
                      <option value="CREDIT_CARD">Credit Card Auto-Charge</option>
                      <option value="ADVANCE_WIRE">Advance Wire Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Purchase Order (PO) / Agreement #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PO-NOV-2026-091"
                      value={formData.poNumber}
                      onChange={(e) => handleChange('poNumber', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <input
                    type="checkbox"
                    id="autoRenewCheck"
                    checked={formData.autoRenew}
                    onChange={(e) => handleChange('autoRenew', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="autoRenewCheck" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    Enable Automated Subscription Renewal on expiration date
                  </label>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 4: CAPACITY QUOTAS & LIMITS
                -------------------------------------------------------- */}
            {activeTab === 'quotas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Zap size={22} color="#0284c7" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Tenant Resource Envelope</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                      Configure the 3 core capacity constraints: total users, storage allocation, and API request throttling.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                  {/* 1. Max Users */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} color="#2563eb" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Max Users</h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Total user accounts across all roles</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUsers}
                      onChange={(e) => handleChange('maxUsers', e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {[25, 50, 100, 250, 500, 1000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleChange('maxUsers', val)}
                          style={{
                            background: formData.maxUsers === val ? '#2563eb' : '#f1f5f9',
                            color: formData.maxUsers === val ? '#fff' : '#475569',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Max Storage GB */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HardDrive size={20} color="#16a34a" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Max Storage (GB)</h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Database and document quota</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="5"
                      value={formData.maxStorageGb}
                      onChange={(e) => handleChange('maxStorageGb', e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {[10, 25, 50, 100, 250, 500].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleChange('maxStorageGb', val)}
                          style={{
                            background: formData.maxStorageGb === val ? '#16a34a' : '#f1f5f9',
                            color: formData.maxStorageGb === val ? '#fff' : '#475569',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {val} GB
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. API Rate Limit per min */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Server size={20} color="#9333ea" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>API Rate Limit</h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Requests per minute</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="100"
                      value={formData.apiRateLimitPerMin}
                      onChange={(e) => handleChange('apiRateLimitPerMin', e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {[300, 600, 1200, 3000, 5000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleChange('apiRateLimitPerMin', val)}
                          style={{
                            background: formData.apiRateLimitPerMin === val ? '#9333ea' : '#f1f5f9',
                            color: formData.apiRateLimitPerMin === val ? '#fff' : '#475569',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {val} /min
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 5: 7 ROLE MODULES & ENTITLEMENTS MATRIX
                (Admin, Director, Accountant, Manager, Sales Manager, MR Supervisor, MR)
                -------------------------------------------------------- */}
            {activeTab === 'modules' && (() => {
              const currentRoleDef = ROLE_MODULES_CONFIG.find(r => r.id === activeRoleTab) || ROLE_MODULES_CONFIG[0];
              const RoleIcon = currentRoleDef.icon;
              const roleState = formData.modules[currentRoleDef.id] || { enabled: true };
              const isRoleEnabled = roleState.enabled !== false;

              // Calculate overall stats
              let totalFeaturesCount = 0;
              let enabledFeaturesCount = 0;
              ROLE_MODULES_CONFIG.forEach(r => {
                const rState = formData.modules[r.id] || { enabled: true };
                r.features.forEach(f => {
                  totalFeaturesCount++;
                  if (rState.enabled !== false && rState[f.key] !== false) {
                    enabledFeaturesCount++;
                  }
                });
              });

              const currentRoleIndex = ROLE_MODULES_CONFIG.findIndex(r => r.id === activeRoleTab);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Top Action Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          7 Enterprise Role Modules
                        </h3>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: enabledFeaturesCount === totalFeaturesCount ? '#dcfce7' : '#e0f2fe',
                          color: enabledFeaturesCount === totalFeaturesCount ? '#15803d' : '#0369a1',
                          border: `1px solid ${enabledFeaturesCount === totalFeaturesCount ? '#86efac' : '#bae6fd'}`
                        }}>
                          {enabledFeaturesCount}/{totalFeaturesCount} Functionalities Active
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                        Choose and configure functionalities for: Admin, Director, Accountant, Manager, Sales Manager, MR Supervisor, and MR.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleEnableAllGlobal}
                        style={{
                          fontSize: '0.76rem',
                          padding: '6px 12px',
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                        }}
                      >
                        <Sparkles size={13} />
                        Enable All (7 Modules)
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllGlobal}
                        style={{
                          fontSize: '0.76rem',
                          padding: '6px 12px',
                          background: '#ffffff',
                          color: '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Role Selector Tabs Strip (7 Roles) */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    overflowX: 'auto',
                    paddingBottom: '4px'
                  }}>
                    {ROLE_MODULES_CONFIG.map((role) => {
                      const Icon = role.icon;
                      const isSelected = activeRoleTab === role.id;
                      const rState = formData.modules[role.id] || { enabled: true };
                      const roleActive = rState.enabled !== false;
                      const activeCount = role.features.filter(f => rState[f.key] !== false).length;

                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setActiveRoleTab(role.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: isSelected ? `2px solid ${role.color}` : '1px solid #e2e8f0',
                            background: isSelected ? '#f8fafc' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease',
                            opacity: roleActive ? 1 : 0.6
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: isSelected ? role.color : '#f1f5f9',
                            color: isSelected ? '#ffffff' : role.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon size={14} />
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#0f172a' : '#475569' }}>
                              {role.name}
                            </div>
                            <div style={{ fontSize: '0.66rem', color: roleActive ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                              {roleActive ? `${activeCount}/${role.features.length} On` : 'Disabled'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Role Configuration Card */}
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    background: '#ffffff',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    {/* Role Header Banner */}
                    <div style={{
                      padding: '14px 18px',
                      background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: currentRoleDef.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          <RoleIcon size={20} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                              {currentRoleDef.fullName}
                            </h4>
                            <span style={{ fontSize: '0.68rem', background: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {currentRoleDef.badge}
                            </span>
                          </div>
                          <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                            {currentRoleDef.desc}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleEnableAllForRole(currentRoleDef.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: currentRoleDef.color,
                            cursor: 'pointer'
                          }}
                        >
                          Select All Features
                        </button>

                        {/* Master Toggle */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          background: isRoleEnabled ? '#ecfdf5' : '#f1f5f9',
                          border: `1px solid ${isRoleEnabled ? '#a7f3d0' : '#cbd5e1'}`,
                          padding: '6px 12px',
                          borderRadius: '8px'
                        }}>
                          <input
                            type="checkbox"
                            checked={isRoleEnabled}
                            onChange={() => handleToggleRoleModule(currentRoleDef.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: isRoleEnabled ? '#047857' : '#64748b' }}>
                            {isRoleEnabled ? 'Module Active' : 'Module Disabled'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Features Checkbox Matrix */}
                    <div style={{ padding: '16px 18px' }}>
                      {isRoleEnabled ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                          {currentRoleDef.features.map(feat => {
                            const isFeatChecked = roleState[feat.key] !== false;

                            return (
                              <div
                                key={feat.key}
                                onClick={() => handleToggleRoleFeature(currentRoleDef.id, feat.key)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '10px',
                                  padding: '12px 14px',
                                  borderRadius: '10px',
                                  border: `1px solid ${isFeatChecked ? '#bae6fd' : '#e2e8f0'}`,
                                  background: isFeatChecked ? '#f0f9ff' : '#ffffff',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isFeatChecked}
                                  onChange={() => {}}
                                  style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: isFeatChecked ? '#0369a1' : '#334155'
                                  }}>
                                    {feat.label}
                                  </div>
                                  <p style={{ margin: '2px 0 0', fontSize: '0.71rem', color: '#64748b', lineHeight: 1.3 }}>
                                    {feat.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                          <AlertCircle size={24} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                            {currentRoleDef.name} Module is Currently Deactivated
                          </div>
                          <p style={{ margin: '4px 0 10px', fontSize: '0.76rem' }}>
                            Activate this module using the switch above to grant functionalities to this role.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleToggleRoleModule(currentRoleDef.id)}
                            style={{
                              padding: '6px 14px',
                              background: '#0284c7',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Activate {currentRoleDef.name} Module
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Role Navigation Footer */}
                    <div style={{
                      padding: '10px 18px',
                      background: '#f8fafc',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Configuring role <strong>{currentRoleIndex + 1} of 7</strong> ({currentRoleDef.name})
                      </div>
                      {currentRoleIndex < ROLE_MODULES_CONFIG.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveRoleTab(ROLE_MODULES_CONFIG[currentRoleIndex + 1].id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284c7',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Next: {ROLE_MODULES_CONFIG[currentRoleIndex + 1].name} Module &rarr;
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                          ✓ All 7 Role Modules Configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* --------------------------------------------------------
                STEP 6: PRIMARY COMPANY ADMIN
                -------------------------------------------------------- */}
            {activeTab === 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div style={{ gridColumn: '1 / -1', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#1d4ed8" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>
                    This root administrator account will have master access to manage the company's users and portal settings.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Admin Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.adminName}
                    onChange={(e) => handleChange('adminName', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Official Admin Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="admin@novartis-pharma.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value.toLowerCase())}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Primary login username &amp; notifications receiver</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Official Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      Initial Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      🎲 Generate Strong
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter or generate password"
                      value={formData.adminPassword}
                      onChange={(e) => handleChange('adminPassword', e.target.value)}
                      style={{ width: '100%', padding: '10px 38px 10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: showPassword ? 'monospace' : 'inherit', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>If left empty, default is Admin@1234!</span>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <input
                    type="checkbox"
                    id="mfaCheck"
                    checked={formData.mfaEnforced}
                    onChange={(e) => handleChange('mfaEnforced', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="mfaCheck" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    Enforce Two-Factor Authentication (MFA / 2FA) on initial login
                  </label>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 7: SECURITY & LAUNCH REVIEW
                -------------------------------------------------------- */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Session Idle Timeout
                    </label>
                    <select
                      value={formData.sessionTimeoutMinutes}
                      onChange={(e) => handleChange('sessionTimeoutMinutes', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                    >
                      <option value="5">5 Minutes (High Security)</option>
                      <option value="15">15 Minutes (Standard)</option>
                      <option value="30">30 Minutes (Recommended)</option>
                      <option value="60">60 Minutes (Relaxed)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Audit Log Retention Period
                    </label>
                    <select
                      value={formData.auditRetentionYears}
                      onChange={(e) => handleChange('auditRetentionYears', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                    >
                      <option value="1">1 Year</option>
                      <option value="3">3 Years</option>
                      <option value="7">7 Years (Pharma Statutory Standard)</option>
                      <option value="10">10 Years (Enterprise Sovereign)</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      IP Whitelist CIDRs (Optional, comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 103.21.144.0/24, 142.250.190.0/24"
                      value={formData.ipWhitelist}
                      onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Restricts console access to authorized corporate IP blocks</span>
                  </div>
                </div>

                {/* Pre-Provisioning Configuration Summary */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#0284c7" />
                    Pre-Provisioning Configuration Summary
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.8rem' }}>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Company:</span>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>{formData.name || 'Not specified'}</strong>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Tenant Slug:</span>
                      <strong style={{ display: 'block', color: '#0284c7', fontFamily: 'monospace', fontSize: '0.86rem' }}>{formData.code || 'auto-generated'}</strong>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Country &bull; Currency:</span>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>{formData.countryCode} &bull; {formData.currencyCode}</strong>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Plan Tier:</span>
                      <strong style={{ display: 'block', color: '#16a34a', fontSize: '0.86rem' }}>{formData.plan} (${formData.monthlyRate}/mo)</strong>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Capacity Limits:</span>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>{formData.maxUsers} Users &bull; {formData.maxStorageGb}GB</strong>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Admin Account:</span>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>{formData.contactEmail || 'Not specified'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==============================================================
              MODAL FOOTER ACTION CONTROLS
              ============================================================== */}
          <div style={{
            padding: '16px 28px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}

              {currentStepIndex < WIZARD_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: '9px 22px',
                    borderRadius: '8px',
                    background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  {isSubmitting ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
                  <span>{isSubmitting ? 'Provisioning Tenant...' : '🚀 Provision Company & Launch Tenant'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
