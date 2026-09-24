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
import { DEFAULT_SOVEREIGN_REGISTRY } from '../data/sovereignRegistry';

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

const COUNTRY_OPTIONS = DEFAULT_SOVEREIGN_REGISTRY.map(c => ({
  code: c.code,
  name: c.name,
  flag: c.flag,
  currency: c.currencyCode,
  symbol: c.currencySymbol,
  timezone: c.timezone,
  taxScheme: c.taxScheme,
  socialSecurity: c.socialSecurity,
  fiscalYear: c.fiscalYear
}));

const PLAN_PRESETS = [
  { id: 'FREE_TRIAL', name: 'Free Trial', rate: 0, users: 25, storage: 10, desc: '14-Day evaluation with core DCR & Doctor CRM' },
  { id: 'STARTER', name: 'Starter Tier', rate: 100, users: 50, storage: 25, desc: 'Ideal for regional pharma brands with field MRs' },
  { id: 'GROWTH', name: 'Growth Tier', rate: 450, users: 150, storage: 50, desc: 'Multi-territory sales ops with order booking' },
  { id: 'PROFESSIONAL', name: 'Professional', rate: 1000, users: 350, storage: 100, desc: 'Complete enterprise SFA with GPS telemetry' },
  { id: 'ENTERPRISE', name: 'Enterprise Sovereign', rate: 2500, users: 1000, storage: 500, desc: 'Unlimited scalability, AI forecasting & SLA' },
  { id: 'CUSTOM', name: 'Custom Agreement', rate: 0, users: 500, storage: 250, desc: 'Negotiated enterprise contract terms' }
];

const COLOR_PRESETS = [
  '#0284c7', // Royal Sky Blue
  '#1d4ed8', // Imperial Sapphire
  '#1e40af', // Regal Cobalt
  '#0f2b5c', // Royal Navy
  '#091e3a', // Sovereign Midnight
  '#4338ca', // Majestic Indigo
  '#4f46e5', // Deep Royal Blue
  '#6d28d9', // Sovereign Violet
  '#7c3aed', // Imperial Purple
  '#581c87', // Royal Plum
  '#881337', // Royal Burgundy
  '#9f1239', // Imperial Maroon
  '#be123c', // Sovereign Crimson
  '#e11d48', // Monarch Ruby
  '#dc2626', // Royal Scarlet
  '#c2410c', // Sovereign Copper
  '#d97706', // Imperial Amber
  '#b45309', // Royal Bronze
  '#ca8a04', // Sovereign Gold
  '#047857', // Imperial Emerald
  '#059669', // Sovereign Jade
  '#065f46', // Royal Forest
  '#0f766e', // Imperial Teal
  '#0891b2', // Royal Peacock
  '#0f172a'  // Sovereign Obsidian
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
  { id: 'admin', stepNum: 5, title: 'Company Admin', desc: 'Root administrator account', icon: ShieldCheck },
  { id: 'security', stepNum: 6, title: 'Security & Review', desc: 'Timeouts, IP whitelist & launch', icon: Lock }
];

export default function CreateCompanyModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [completedSteps, setCompletedSteps] = useState({});
  const [failedSteps, setFailedSteps] = useState({});

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
    currency: 'INR',
    taxScheme: 'New/Old Tax Regime (0%-30%) + 18% GST',
    socialSecurity: 'EPFO (12%) + ESIC (0.75%) + Gratuity + PT',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 'APRIL',
    complianceFrameworks: ['21_CFR_PART_11', 'GXP', 'ISO_27001'],
    dataResidencyRegion: 'ap-south-1',

    // 3. Commercial & Subscription
    plan: 'STARTER',
    billingCycle: 'Monthly',
    monthlyRate: 100,
    annualContractValue: 1200,
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

      if (field === 'countryCode') {
        const matched = DEFAULT_SOVEREIGN_REGISTRY.find(c => c.code === val);
        if (matched) {
          next.countryCode = matched.code;
          next.operatingCountries = [matched.code];
          next.timezone = matched.timezone || prev.timezone;
          next.currencyCode = matched.currencyCode || prev.currencyCode;
          next.currency = matched.currencyCode || prev.currency;
          next.taxScheme = matched.taxScheme || '';
          next.socialSecurity = matched.socialSecurity || '';
          if (matched.fiscalYear?.toLowerCase().includes('april')) {
            next.fiscalYearStart = 'APRIL';
          } else if (matched.fiscalYear?.toLowerCase().includes('july')) {
            next.fiscalYearStart = 'JULY';
          } else if (matched.fiscalYear?.toLowerCase().includes('october')) {
            next.fiscalYearStart = 'OCTOBER';
          } else {
            next.fiscalYearStart = 'JANUARY';
          }
        }
      }

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
    if (activeTab === 'identity') {
      if (!formData.name.trim() || !formData.code.trim()) {
        setFailedSteps(prev => ({ ...prev, identity: true }));
        setCompletedSteps(prev => ({ ...prev, identity: false }));
        setValidationError('Please enter a valid Company Name and Tenant Slug before continuing.');
        return;
      }
      setCompletedSteps(prev => ({ ...prev, identity: true }));
      setFailedSteps(prev => ({ ...prev, identity: false }));
    } else if (activeTab === 'admin') {
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@') || !formData.adminName.trim()) {
        setFailedSteps(prev => ({ ...prev, admin: true }));
        setCompletedSteps(prev => ({ ...prev, admin: false }));
        setValidationError('Please enter Admin Name and a valid Contact Email.');
        return;
      }
      setCompletedSteps(prev => ({ ...prev, admin: true }));
      setFailedSteps(prev => ({ ...prev, admin: false }));
    } else {
      setCompletedSteps(prev => ({ ...prev, [activeTab]: true }));
      setFailedSteps(prev => ({ ...prev, [activeTab]: false }));
    }

    setValidationError('');
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      const nextStepId = WIZARD_STEPS[currentStepIndex + 1].id;
      setActiveTab(nextStepId);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStepIndex > 0) {
      const prevStepId = WIZARD_STEPS[currentStepIndex - 1].id;
      setActiveTab(prevStepId);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    let hasError = false;
    const newFailed = {};
    const newCompleted = { ...completedSteps };

    if (!formData.name.trim() || !formData.code.trim()) {
      newFailed.identity = true;
      newCompleted.identity = false;
      hasError = true;
    } else {
      newCompleted.identity = true;
      newFailed.identity = false;
    }

    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@') || !formData.adminName.trim()) {
      newFailed.admin = true;
      newCompleted.admin = false;
      hasError = true;
    } else {
      newCompleted.admin = true;
      newFailed.admin = false;
    }

    setFailedSteps(prev => ({ ...prev, ...newFailed }));
    setCompletedSteps(prev => ({ ...prev, ...newCompleted }));

    if (hasError) {
      if (newFailed.identity) {
        setActiveTab('identity');
        setValidationError('Please enter a Company Name and Tenant Slug.');
      } else if (newFailed.admin) {
        setActiveTab('admin');
        setValidationError('Please enter Admin Name and a valid Admin Contact Email.');
      }
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
        taxScheme: formData.taxScheme,
        socialSecurity: formData.socialSecurity,
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
          taxScheme: formData.taxScheme,
          socialSecurity: formData.socialSecurity,
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
            {WIZARD_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              const isCompleted = completedSteps[step.id] === true;
              const isFailed = failedSteps[step.id] === true;

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
                    border: isActive
                      ? isCompleted
                        ? '1px solid #10b981'
                        : isFailed
                          ? '1px solid #ef4444'
                          : '1px solid #0284c7'
                      : isCompleted
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : isFailed
                          ? '1px solid rgba(239, 68, 68, 0.4)'
                          : '1px solid transparent',
                    background: isActive
                      ? isCompleted
                        ? 'rgba(16, 185, 129, 0.16)'
                        : isFailed
                          ? 'rgba(239, 68, 68, 0.16)'
                          : 'rgba(2, 132, 199, 0.14)'
                      : isCompleted
                        ? 'rgba(16, 185, 129, 0.08)'
                        : isFailed
                          ? 'rgba(239, 68, 68, 0.08)'
                          : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isCompleted
                        ? 'rgba(16, 185, 129, 0.14)'
                        : isFailed
                          ? 'rgba(239, 68, 68, 0.14)'
                          : 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isCompleted
                        ? 'rgba(16, 185, 129, 0.08)'
                        : isFailed
                          ? 'rgba(239, 68, 68, 0.08)'
                          : 'transparent';
                    }
                  }}
                >
                  {/* Step Status Indicator Circle: Step number 1-6 initially, Green check ONLY if completed, Red cross if failed */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? '#10b981'
                      : isFailed
                        ? '#ef4444'
                        : isActive
                          ? '#0284c7'
                          : 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: isCompleted
                      ? '0 0 10px rgba(16, 185, 129, 0.45)'
                      : isFailed
                        ? '0 0 10px rgba(239, 68, 68, 0.45)'
                        : isActive
                          ? '0 0 8px rgba(2, 132, 199, 0.35)'
                          : 'none'
                  }}>
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isFailed ? (
                      <X size={14} strokeWidth={3} />
                    ) : (
                      step.stepNum
                    )}
                  </div>

                  {/* Step Title & Subtitle */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isCompleted
                        ? '#86efac'
                        : isFailed
                          ? '#fca5a5'
                          : isActive
                            ? '#f8fafc'
                            : '#cbd5e1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: isCompleted
                        ? '#6ee7b7'
                        : isFailed
                          ? '#f87171'
                          : isActive
                            ? '#93c5fd'
                            : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.desc}
                    </div>
                  </div>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      color={isCompleted ? '#10b981' : isFailed ? '#ef4444' : '#38bdf8'}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
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
                  STEP {currentStepIndex + 1} OF {WIZARD_STEPS.length}
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

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    <span>Brand Primary Color Theme (25 Royal Palettes)</span>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#0284c7', fontWeight: 700, background: '#f0f9ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                      Selected: {formData.brandPrimaryColor}
                    </span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleChange('brandPrimaryColor', color)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: color,
                          border: formData.brandPrimaryColor === color ? '3px solid #0f172a' : '1px solid rgba(0,0,0,0.15)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: formData.brandPrimaryColor === color ? '0 0 10px rgba(0,0,0,0.35)' : '0 1px 3px rgba(0,0,0,0.08)',
                          transform: formData.brandPrimaryColor === color ? 'scale(1.12)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                        title={color}
                      >
                        {formData.brandPrimaryColor === color && <Check size={16} strokeWidth={3} />}
                      </button>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', borderLeft: '1px solid #cbd5e1', paddingLeft: '10px' }}>
                      <input
                        type="color"
                        value={formData.brandPrimaryColor}
                        onChange={(e) => handleChange('brandPrimaryColor', e.target.value)}
                        style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Custom Color Picker"
                      />
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                        Custom
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                STEP 2: REGIONAL & SOVEREIGN GOVERNANCE
                -------------------------------------------------------- */}
            {activeTab === 'regional' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div style={{ gridColumn: '1 / -1', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e40af' }}>
                      Automated Sovereign Governance Synchronization
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#3b82f6' }}>
                      Selecting a sovereign country automatically synchronizes Timezone, Currency, Tax Scheme, and Social Security standards.
                    </div>
                  </div>
                </div>

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
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    <span>Operational Timezone</span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>Auto-Updated</span>
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    {DEFAULT_SOVEREIGN_REGISTRY.map(c => (
                      <option key={c.timezone} value={c.timezone}>
                        {c.timezone} ({c.name} &bull; {c.utcOffset})
                      </option>
                    ))}
                    {!DEFAULT_SOVEREIGN_REGISTRY.some(c => c.timezone === formData.timezone) && (
                      <option value={formData.timezone}>{formData.timezone}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    <span>Operational Currency</span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>Auto-Updated</span>
                  </label>
                  <select
                    value={formData.currencyCode}
                    onChange={(e) => handleChange('currencyCode', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                  >
                    {DEFAULT_SOVEREIGN_REGISTRY.map(c => (
                      <option key={c.currencyCode} value={c.currencyCode}>
                        {c.currencyCode} ({c.currencySymbol} - {c.currencyName || c.name})
                      </option>
                    ))}
                    {!DEFAULT_SOVEREIGN_REGISTRY.some(c => c.currencyCode === formData.currencyCode) && (
                      <option value={formData.currencyCode}>{formData.currencyCode}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    <span>Statutory Tax &amp; Withholding Scheme</span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>Auto-Updated</span>
                  </label>
                  <input
                    type="text"
                    value={formData.taxScheme}
                    onChange={(e) => handleChange('taxScheme', e.target.value)}
                    placeholder="e.g. VAT / PIT Regime"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', background: '#f8fafc', color: '#0f172a', fontWeight: 600, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    <span>Social Security / Statutory Care</span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>Auto-Updated</span>
                  </label>
                  <input
                    type="text"
                    value={formData.socialSecurity}
                    onChange={(e) => handleChange('socialSecurity', e.target.value)}
                    placeholder="e.g. EPFO / NSSF / Statutory Fund"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', background: '#f8fafc', color: '#0f172a', fontWeight: 600, outline: 'none' }}
                  />
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
                STEP 5: PRIMARY COMPANY ADMIN
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
                STEP 6: SECURITY & LAUNCH REVIEW
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
