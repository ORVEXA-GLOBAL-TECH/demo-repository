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
  HelpCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Server,
  Zap,
  HardDrive
} from 'lucide-react';

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
  '#0284c7', // Sky Blue (Default)
  '#059669', // Emerald
  '#7c3aed', // Royal Violet
  '#4f46e5', // Deep Indigo
  '#d97706', // Amber Gold
  '#e11d48', // Crimson Red
  '#0f172a', // Slate Black
  '#0891b2'  // Cyan
];

export default function CreateCompanyModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('identity'); // identity | regional | commercial | quotas | modules | admin | security
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

    // 4. Capacity Quotas & Limits (Per user feedback: max user only, max storage and api rate limit per min)
    maxUsers: 100,
    maxStorageGb: 25,
    apiRateLimitPerMin: 600,

    // 5. Pharma Modules
    modules: {
      mrReporting: true,
      dcr: true,
      tourPlan: true,
      gpsLiveTracking: true,
      doctorManagement: true,
      chemistStockist: true,
      orderManagement: true,
      expenseManagement: true,
      sampleDistribution: false,
      visualAids: true,
      aiAnalytics: false,
      whatsappAlerts: true,
      offlineSync: true
    },

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

  const handleChange = (field, val) => {
    setFormData(prev => {
      const next = { ...prev, [field]: val };

      // Auto-generate code slug & subdomain when company name changes if not manually set
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

      // Sync country defaults
      if (field === 'countryCode') {
        const matched = COUNTRY_OPTIONS.find(c => c.code === val);
        if (matched) {
          next.timezone = matched.timezone;
          next.currencyCode = matched.currency;
        }
      }

      // Sync plan presets
      if (field === 'plan') {
        const p = PLAN_PRESETS.find(pr => pr.id === val);
        if (p) {
          next.monthlyRate = p.rate;
          next.annualContractValue = p.rate * 12;
          next.maxUsers = p.users;
          next.maxStorageGb = p.storage;
          next.modules.aiAnalytics = val === 'ENTERPRISE';
        }
      }

      if (field === 'monthlyRate') {
        next.annualContractValue = (Number(val) || 0) * 12;
      }

      return next;
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
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange('adminPassword', pwd);
    setShowPassword(true);
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

  const tabs = [
    { id: 'identity', label: '1. Identity & Brand', icon: Building2 },
    { id: 'regional', label: '2. Regional & Compliance', icon: Globe2 },
    { id: 'commercial', label: '3. Plan & Commercials', icon: CreditCard },
    { id: 'quotas', label: '4. Capacity Quotas', icon: Users },
    { id: 'modules', label: '5. Pharma Modules', icon: Layers },
    { id: 'admin', label: '6. Company Admin', icon: ShieldCheck },
    { id: 'security', label: '7. Security & Launch', icon: Lock }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '980px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: formData.brandPrimaryColor || '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              fontWeight: 800,
              fontSize: '20px',
              color: '#ffffff'
            }}>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                formData.name ? formData.name.charAt(0).toUpperCase() : <Building2 size={22} />
              )}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Provision New Pharma Tenant &amp; Company
                <span style={{ fontSize: '0.72rem', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  MULTI-TENANT SOVEREIGN
                </span>
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Complete enterprise onboarding wizard: Identity, regional compliance, commercial terms, quotas, and admin setup.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Wizard Navigation Steps */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#0284c7' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div style={{
            margin: '12px 24px 0',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem'
          }}>
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* ==============================================================
              TAB 1: IDENTITY & BRANDING
              ============================================================== */}
          {activeTab === 'identity' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Commercial Company Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Novartis Pharma"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Brand name displayed across mobile apps &amp; reports</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Registered Legal Entity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Novartis India Private Limited"
                  value={formData.legalName}
                  onChange={(e) => handleChange('legalName', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal title for commercial agreements and invoices</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Unique Tenant Code / Slug <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. novartis-in"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>System identifier used for API endpoints &amp; DB scoping</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Industry Segment
                </label>
                <select
                  value={formData.industrySegment}
                  onChange={(e) => handleChange('industrySegment', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Organization Type
                </label>
                <select
                  value={formData.companyType}
                  onChange={(e) => handleChange('companyType', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="ENTERPRISE">Enterprise Multinational (MNC)</option>
                  <option value="MID_MARKET">Mid-Market Regional Leader</option>
                  <option value="STARTUP">High-Growth Pharma Startup</option>
                  <option value="GOVERNMENT">Government / State Medical Agency</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tax ID / GSTIN / VAT Registration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCN1234F1Z8 / US-EIN"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Dedicated Subdomain
                </label>
                <input
                  type="text"
                  placeholder="e.g. novartis.alleviare.com"
                  value={formData.subdomain}
                  onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase())}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Custom White-Label Domain (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. sfa.novartis-pharma.com"
                  value={formData.customDomain}
                  onChange={(e) => handleChange('customDomain', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Logo URL (Direct Image Link)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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
                    style={{ width: '34px', height: '34px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#475569' }}>
                    {formData.brandPrimaryColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 2: REGIONAL & SOVEREIGN GOVERNANCE
              ============================================================== */}
          {activeTab === 'regional' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  HQ Sovereign Country
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  {COUNTRY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code} &bull; {c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Default Operational Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Operational Currency
                </label>
                <select
                  value={formData.currencyCode}
                  onChange={(e) => handleChange('currencyCode', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Standard Date Format
                </label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 24/09/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/24/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Fiscal Year Starting Month
                </label>
                <select
                  value={formData.fiscalYearStart}
                  onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="APRIL">April (Standard Indian/UK FY)</option>
                  <option value="JANUARY">January (Calendar Year FY)</option>
                  <option value="JULY">July (Mid-Year FY)</option>
                  <option value="OCTOBER">October (Q4 FY)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Data Residency Cloud Region
                </label>
                <select
                  value={formData.dataResidencyRegion}
                  onChange={(e) => handleChange('dataResidencyRegion', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="ap-south-1">AWS Mumbai (ap-south-1) - Sovereign India</option>
                  <option value="ap-southeast-1">AWS Singapore (ap-southeast-1) - ASEAN Hub</option>
                  <option value="eu-central-1">AWS Frankfurt (eu-central-1) - GDPR Strict</option>
                  <option value="us-east-1">AWS N. Virginia (us-east-1) - Global Primary</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Regulatory Compliance &amp; Audit Frameworks
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { id: '21_CFR_PART_11', label: 'FDA 21 CFR Part 11 (Audit Trail & E-Sign)' },
                    { id: 'GXP', label: 'GxP Validated Quality Guidelines' },
                    { id: 'HIPAA', label: 'HIPAA Patient Data Privacy' },
                    { id: 'GDPR', label: 'GDPR Sovereign EU Data Isolation' },
                    { id: 'ISO_27001', label: 'ISO 27001 InfoSec Certified' }
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
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
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

          {/* ==============================================================
              TAB 3: COMMERCIAL & SUBSCRIPTION
              ============================================================== */}
          {activeTab === 'commercial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                  Select Subscription Plan Tier
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
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
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.94rem', color: isSelected ? '#0284c7' : '#0f172a' }}>
                              {p.name}
                            </strong>
                            {isSelected && <Check size={16} color="#0284c7" />}
                          </div>
                          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '6px 0 12px' }}>
                            {p.desc}
                          </p>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                            ${p.rate} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/month</span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
                            Includes {p.users} Users &bull; {p.storage}GB Cloud
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => handleChange('billingCycle', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="Monthly">Monthly Recurring</option>
                    <option value="Quarterly">Quarterly (Every 3 Months)</option>
                    <option value="Annual">Annual Upfront (15% Discounted)</option>
                    <option value="Multi-Year">Multi-Year Enterprise Contract</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Monthly Rate ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyRate}
                    onChange={(e) => handleChange('monthlyRate', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Annual Contract Value (ARR / ACV)
                  </label>
                  <input
                    type="number"
                    value={formData.annualContractValue}
                    onChange={(e) => handleChange('annualContractValue', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => handleChange('paymentTerms', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="NET_30">NET 30 Days Invoice</option>
                    <option value="NET_60">NET 60 Days Enterprise</option>
                    <option value="CREDIT_CARD">Credit Card Auto-Charge</option>
                    <option value="ADVANCE_WIRE">Advance Wire Transfer</option>
                    <option value="PURCHASE_ORDER">Corporate Purchase Order</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Purchase Order (PO) / Agreement #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PO-NOV-2026-091"
                    value={formData.poNumber}
                    onChange={(e) => handleChange('poNumber', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Grace Period Days (Post-Expiry)
                  </label>
                  <input
                    type="number"
                    value={formData.gracePeriodDays}
                    onChange={(e) => handleChange('gracePeriodDays', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  id="autoRenewCheck"
                  checked={formData.autoRenew}
                  onChange={(e) => handleChange('autoRenew', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="autoRenewCheck" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Enable Automated Subscription Renewal on expiration date
                </label>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 4: CAPACITY QUOTAS & LIMITS
              User Comment: "create max user only, max storage and api rate limit per min"
              ============================================================== */}
          {activeTab === 'quotas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap size={22} color="#0284c7" />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Tenant Capacity &amp; Resource Envelope</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Configure hard limits for total user licenses, database cloud storage, and API gateway throughput.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* 1. Max Users */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} color="#2563eb" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Max Users (Total Seats)</h4>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Total user accounts across all roles</span>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsers}
                    onChange={(e) => handleChange('maxUsers', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 700 }}
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
                          padding: '4px 10px',
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
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Max Storage (GB)</h4>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Cloud database &amp; document quota</span>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="5"
                    value={formData.maxStorageGb}
                    onChange={(e) => handleChange('maxStorageGb', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 700 }}
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
                          padding: '4px 10px',
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
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>API Rate Limit (Req/min)</h4>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Throughput per tenant token</span>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="100"
                    value={formData.apiRateLimitPerMin}
                    onChange={(e) => handleChange('apiRateLimitPerMin', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '1.1rem', fontWeight: 700 }}
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
                          padding: '4px 10px',
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

          {/* ==============================================================
              TAB 5: PHARMA MODULES MATRIX
              ============================================================== */}
          {activeTab === 'modules' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                    Pharma SFA Module Entitlements
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Enable or restrict specific features for this company's MR and Admin portals
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const allOn = {};
                      Object.keys(formData.modules).forEach(k => { allOn[k] = true; });
                      setFormData(prev => ({ ...prev, modules: allOn }));
                    }}
                    style={{ fontSize: '0.74rem', padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Enable All
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {[
                  { key: 'dcr', label: 'Daily Call Reporting (DCR)', desc: 'Field MR doctor visit logs, chemist calls, and signature proof' },
                  { key: 'tourPlan', label: 'Tour Program & Route Scheduling', desc: 'Monthly tour calendar approval & deviation monitoring' },
                  { key: 'gpsLiveTracking', label: 'Field GPS Live Tracking', desc: 'Real-time telemetry, geo-fencing, and route playback' },
                  { key: 'doctorManagement', label: 'Doctor / HCP CRM Directory', desc: 'Specialty, hospital tagging, visit frequency, and birthdays' },
                  { key: 'chemistStockist', label: 'Chemist & Stockist Network', desc: 'Retailer tagging, secondary sales channels, and territory links' },
                  { key: 'orderManagement', label: 'Secondary Order Booking', desc: 'Direct product booking with stockists and price list tiers' },
                  { key: 'expenseManagement', label: 'Expense & Allowance Claims (TA/DA)', desc: 'Mileage calculation, daily allowances, and manager approval' },
                  { key: 'sampleDistribution', label: 'Sample & Gift Distribution', desc: 'Batch number tracking, doctor receipt acknowledgments' },
                  { key: 'visualAids', label: 'Digital E-Detailing & Visual Aids', desc: 'Interactive tablet presentations, doctor feedback timer' },
                  { key: 'aiAnalytics', label: 'AI Forecasting & Churn Analytics', desc: 'Predictive sales run-rates and target vs achievement modeling' },
                  { key: 'whatsappAlerts', label: 'Automated WhatsApp & SMS Relays', desc: 'Instant alerts to doctors, managers, and stockists' },
                  { key: 'offlineSync', label: 'Offline Mobile Sync Engine', desc: 'Enables rural MR visits without active cellular connectivity' }
                ].map(mod => {
                  const isEnabled = formData.modules[mod.key];
                  return (
                    <div
                      key={mod.key}
                      onClick={() => handleModuleToggle(mod.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${isEnabled ? '#93c5fd' : '#e2e8f0'}`,
                        background: isEnabled ? '#f8faff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => {}} // handled by parent div
                        style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isEnabled ? '#1e40af' : '#334155' }}>
                          {mod.label}
                        </div>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                          {mod.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 6: PRIMARY COMPANY ADMIN
              ============================================================== */}
          {activeTab === 'admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div style={{ gridColumn: '1 / -1', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#1d4ed8" />
                <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>
                  This user will be provisioned as the Root Company Administrator with master permissions over this tenant.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={formData.adminName}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Official Admin Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@novartis-pharma.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value.toLowerCase())}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Used for primary authentication &amp; emergency alerts</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Official Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Initial Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    style={{ fontSize: '0.72rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    🎲 Generate Strong
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter or generate temporary password"
                    value={formData.adminPassword}
                    onChange={(e) => handleChange('adminPassword', e.target.value)}
                    style={{ width: '100%', padding: '10px 38px 10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: showPassword ? 'monospace' : 'inherit' }}
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

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          {/* ==============================================================
              TAB 7: SECURITY & LAUNCH REVIEW
              ============================================================== */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Session Idle Timeout
                  </label>
                  <select
                    value={formData.sessionTimeoutMinutes}
                    onChange={(e) => handleChange('sessionTimeoutMinutes', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="5">5 Minutes (High Security)</option>
                    <option value="15">15 Minutes (Standard)</option>
                    <option value="30">30 Minutes (Recommended)</option>
                    <option value="60">60 Minutes (Relaxed)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Audit Log Retention Period
                  </label>
                  <select
                    value={formData.auditRetentionYears}
                    onChange={(e) => handleChange('auditRetentionYears', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="7">7 Years (Pharma Statutory Standard)</option>
                    <option value="10">10 Years (Enterprise Sovereign)</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    IP Whitelist CIDRs (Optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 103.21.144.0/24, 142.250.190.0/24"
                    value={formData.ipWhitelist}
                    onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Restricts web console access to authorized corporate IP blocks</span>
                </div>
              </div>

              {/* Review Summary Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '18px'
              }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#0284c7" />
                  Pre-Provisioning Configuration Summary
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Company:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{formData.name || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Tenant Slug:</span>
                    <strong style={{ display: 'block', color: '#0284c7', fontFamily: 'monospace' }}>{formData.code || 'auto-generated'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Country / Currency:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{formData.countryCode} &bull; {formData.currencyCode}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Plan Tier:</span>
                    <strong style={{ display: 'block', color: '#16a34a' }}>{formData.plan} (${formData.monthlyRate}/mo)</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Quotas:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{formData.maxUsers} Users &bull; {formData.maxStorageGb}GB</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Admin Account:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{formData.contactEmail || 'Not specified'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          padding: '16px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeTab !== 'identity' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                &larr; Back
              </button>
            )}

            {activeTab !== 'security' ? (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                }}
              >
                Next &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '9px 24px',
                  borderRadius: '8px',
                  background: isSubmitting ? '#94a3b8' : '#059669',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
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
  );
}
