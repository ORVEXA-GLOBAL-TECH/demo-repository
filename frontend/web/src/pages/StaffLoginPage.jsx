import React, { useState } from 'react';
import {
  Users,
  Shield,
  Briefcase,
  TrendingUp,
  UserCheck,
  Calculator,
  Smartphone,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  Mail,
  Lock,
  AlertCircle,
  ChevronDown,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function StaffLoginPage() {
  const { login } = useAuth();
  const { activeTenant, setActiveTenant, tenants } = useTenantTheme();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [email, setEmail] = useState('admin@alleviare.com');
  const [password, setPassword] = useState('Staff@2026!Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileNotice, setMobileNotice] = useState(false);
  const [showCompanySelect, setShowCompanySelect] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const logoUrl = activeTenant?.logo_url || activeTenant?.logoUrl;
  const companyName = activeTenant?.name || 'Alleviare Health Sciences';
  const companyCode = (activeTenant?.code || 'HQ').toUpperCase();

  const getCountryFlag = (code) => {
    if (!code) return '🌐';
    const c = code.toUpperCase();
    if (c === 'IN') return '🇮🇳';
    if (c === 'US') return '🇺🇸';
    if (c === 'GB' || c === 'UK') return '🇬🇧';
    if (c === 'CH') return '🇨🇭';
    if (c === 'DE') return '🇩🇪';
    if (c === 'AE') return '🇦🇪';
    if (c === 'SG') return '🇸🇬';
    if (c === 'ZA') return '🇿🇦';
    return '🌐';
  };

  const staffPersonas = [
    {
      role: 'ADMIN',
      name: 'Dr. Rajesh Sharma',
      title: 'Corporate Admin',
      email: `admin@${activeTenant?.code || 'alleviare'}.com`,
      icon: Shield,
      color: brandColor,
      platform: 'Web Only'
    },
    {
      role: 'DIRECTOR',
      name: 'V. Singhania',
      title: 'Managing Director',
      email: `director@${activeTenant?.code || 'alleviare'}.com`,
      icon: Building,
      color: '#7c3aed',
      platform: 'Web & App'
    },
    {
      role: 'MANAGER',
      name: 'M. Sundaram',
      title: 'Operations Manager',
      email: `manager@${activeTenant?.code || 'alleviare'}.com`,
      icon: Briefcase,
      color: '#0d9488',
      platform: 'Web & App'
    },
    {
      role: 'SALES_MANAGER',
      name: 'Priya Mukherjee',
      title: 'Regional Sales Lead',
      email: `salesmanager@${activeTenant?.code || 'alleviare'}.com`,
      icon: TrendingUp,
      color: '#d97706',
      platform: 'Web & App'
    },
    {
      role: 'SALES_SUPERVISOR',
      name: 'Suresh Raina',
      title: 'Area Sales Supervisor',
      email: `salessupervisor@${activeTenant?.code || 'alleviare'}.com`,
      icon: UserCheck,
      color: '#0284c7',
      platform: 'Web & App'
    },
    {
      role: 'ACCOUNTANT',
      name: 'Rameshwar Gupta',
      title: 'Chief Accountant',
      email: `accountant@${activeTenant?.code || 'alleviare'}.com`,
      icon: Calculator,
      color: '#059669',
      platform: 'Web & App'
    },
    {
      role: 'MR',
      name: 'Amit Verma',
      title: 'Medical Rep (Field)',
      email: `mr@${activeTenant?.code || 'alleviare'}.com`,
      icon: Smartphone,
      color: '#ef4444',
      platform: 'App Only',
      isAppOnly: true
    }
  ];

  const handleSelectPersona = (p) => {
    setSelectedRole(p.role);
    setEmail(p.email);
    setErrorMessage('');

    if (p.isAppOnly) {
      setMobileNotice(true);
    } else {
      setMobileNotice(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (selectedRole === 'MR') {
      setMobileNotice(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login({
        email,
        role: selectedRole
      });
    } catch (err) {
      setErrorMessage(err.message || 'Staff login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-wrapper staff-theme"
      style={{
        background: `radial-gradient(circle at 10% 10%, ${brandColor}18 0%, transparent 40%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, ${brandColor}08 100%)`
      }}
    >
      {/* Background Decorators with Brand Color */}
      <div
        className="staff-bg-circle circle-top-left"
        style={{
          background: `radial-gradient(circle, ${brandColor}25 0%, transparent 70%)`
        }}
      />
      <div
        className="staff-bg-circle circle-bottom-right"
        style={{
          background: `radial-gradient(circle, ${brandColor}20 0%, transparent 70%)`
        }}
      />

      <div className="staff-login-card" style={{ borderColor: `${brandColor}30`, boxShadow: `0 20px 45px ${brandColor}15` }}>
        {/* Company Quick Picker Bar */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#090d16',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>{getCountryFlag(activeTenant?.country_code)}</span>
            <span style={{ color: '#94a3b8' }}>Target Tenant:</span>
            <strong style={{ color: '#ffffff' }}>{companyName}</strong>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowCompanySelect(!showCompanySelect)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: `1px solid ${brandColor}60`,
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Switch Company</span>
              <ChevronDown size={12} />
            </button>

            {showCompanySelect && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  width: '280px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                  padding: '8px',
                  zIndex: 200,
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Select Company Workspace
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {tenants.map(t => {
                    const isCur = t.id === activeTenant?.id || t.code === activeTenant?.code;
                    const cColor = t.brand_primary_color || t.brandPrimaryColor || '#2563eb';
                    return (
                      <button
                        key={t.id || t.code}
                        type="button"
                        onClick={() => {
                          setActiveTenant(t);
                          setShowCompanySelect(false);
                          setEmail(`admin@${t.code || 'alleviare'}.com`);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: isCur ? `1px solid ${cColor}` : '1px solid transparent',
                          backgroundColor: isCur ? `${cColor}10` : '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem' }}>{getCountryFlag(t.country_code)}</span>
                          <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a' }}>{t.name}</span>
                        </div>
                        {isCur && <Check size={14} color={cColor} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Banner */}
        <div className="staff-card-header">
          <div className="brand-logo-pill">
            {logoUrl && !logoError ? (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${brandColor}40`,
                  boxShadow: `0 2px 8px ${brandColor}30`,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={logoUrl}
                  alt={companyName}
                  onError={() => setLogoError(true)}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div
                className="brand-badge-small"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, #090d16)`,
                  boxShadow: `0 2px 8px ${brandColor}40`
                }}
              >
                {companyName.charAt(0)}
              </div>
            )}
            <div>
              <div className="brand-suite-title">{companyName}</div>
              <div className="brand-suite-sub">Enterprise Sales Force Automation (SFA) • {companyCode}</div>
            </div>
          </div>
          <div
            className="staff-portal-badge"
            style={{
              backgroundColor: `${brandColor}12`,
              borderColor: `${brandColor}30`,
              color: brandColor
            }}
          >
            <Users size={14} /> Company Admin &amp; Staff Portal
          </div>
        </div>

        <div className="login-card-body">
          <div className="text-center-heading">
            <h2 className="staff-heading">Staff &amp; Operations Sign In</h2>
            <p className="staff-subheading">
              Select your role profile or enter your employee enterprise credentials
            </p>
          </div>

          {/* 1-Click Persona Selector Chips */}
          <div className="persona-selector-section">
            <div className="section-mini-title">
              <span>Choose Staff Persona / Quick Login</span>
              <span className="pill-tag" style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}30` }}>Instant Switch</span>
            </div>
            <div className="persona-grid">
              {staffPersonas.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    className={`persona-card ${isSelected ? 'selected' : ''} ${p.isAppOnly ? 'app-restricted' : ''}`}
                    style={isSelected ? {
                      borderColor: p.color,
                      backgroundColor: `${p.color}08`,
                      boxShadow: `0 0 0 2px ${p.color}`
                    } : {}}
                    onClick={() => handleSelectPersona(p)}
                  >
                    <div className="persona-icon-box" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                      <Icon size={18} />
                    </div>
                    <div className="persona-text">
                      <div className="persona-name">{p.name}</div>
                      <div className="persona-role-label">{p.title}</div>
                    </div>
                    <span className="persona-platform-tag" style={{ color: p.color }}>
                      {p.platform}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {mobileNotice && (
            <div className="mobile-app-notice-card">
              <div className="notice-icon">
                <Smartphone size={24} color="#dc2626" />
              </div>
              <div className="notice-content">
                <strong>Medical Representative Web Access Restricted</strong>
                <p>
                  Field Medical Representatives (MRs) report visits, log GPS punches, and take chemist orders via the
                  <strong> {companyName} Field Mobile App</strong> on iOS and Android. Web portal access is reserved for managers, directors, and operational staff.
                </p>
                <div className="notice-actions">
                  <button
                    type="button"
                    className="notice-btn"
                    onClick={() => handleSelectPersona(staffPersonas[0])}
                  >
                    Switch to Corporate Admin (Dr. Rajesh Sharma)
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="auth-error-banner staff-error">
              <AlertCircle size={18} />
              <div>
                <strong>Sign In Failed</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="staff-email">
                Corporate Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="staff-email"
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`employee@${activeTenant?.code || 'alleviare'}.com`}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="staff-password">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="staff-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-helpers-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
              <label className="remember-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Remember on this computer</span>
              </label>
              <span className="forgot-password-link" style={{ color: brandColor, cursor: 'pointer' }}>Forgot password? Contact IT</span>
            </div>

            <button
              type="submit"
              className="submit-login-btn staff-btn"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${brandColor}ee)`,
                boxShadow: `0 4px 14px ${brandColor}40`
              }}
              disabled={isLoading || selectedRole === 'MR'}
            >
              {isLoading ? (
                <span>Signing in to SFA Workspace...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole.replace('_', ' ')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

