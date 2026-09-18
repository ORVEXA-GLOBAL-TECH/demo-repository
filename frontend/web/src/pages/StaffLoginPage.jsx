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
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StaffLoginPage() {
  const { login, switchLoginPortal, defaultUsers } = useAuth();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [email, setEmail] = useState('admin@alleviare.com');
  const [password, setPassword] = useState('Staff@2026!Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileNotice, setMobileNotice] = useState(false);

  const staffPersonas = [
    {
      role: 'ADMIN',
      name: 'Dr. Rajesh Sharma',
      title: 'Corporate Admin',
      email: 'admin@alleviare.com',
      icon: Shield,
      color: '#2563eb',
      platform: 'Web Only'
    },
    {
      role: 'DIRECTOR',
      name: 'V. Singhania',
      title: 'Managing Director',
      email: 'director@alleviare.com',
      icon: Building,
      color: '#7c3aed',
      platform: 'Web & App'
    },
    {
      role: 'MANAGER',
      name: 'M. Sundaram',
      title: 'Operations Manager',
      email: 'manager@alleviare.com',
      icon: Briefcase,
      color: '#0d9488',
      platform: 'Web & App'
    },
    {
      role: 'SALES_MANAGER',
      name: 'Priya Mukherjee',
      title: 'Regional Sales Lead',
      email: 'salesmanager@alleviare.com',
      icon: TrendingUp,
      color: '#d97706',
      platform: 'Web & App'
    },
    {
      role: 'SALES_SUPERVISOR',
      name: 'Suresh Raina',
      title: 'Area Sales Supervisor',
      email: 'salessupervisor@alleviare.com',
      icon: UserCheck,
      color: '#0284c7',
      platform: 'Web & App'
    },
    {
      role: 'ACCOUNTANT',
      name: 'Rameshwar Gupta',
      title: 'Chief Accountant',
      email: 'accountant@alleviare.com',
      icon: Calculator,
      color: '#059669',
      platform: 'Web & App'
    },
    {
      role: 'MR',
      name: 'Amit Verma',
      title: 'Medical Rep (Field)',
      email: 'mr@alleviare.com',
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
        role: selectedRole,
        portalType: 'staff'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Staff login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper staff-theme">
      {/* Background Decorators */}
      <div className="staff-bg-circle circle-top-left" />
      <div className="staff-bg-circle circle-bottom-right" />

      <div className="staff-login-card">
        {/* Brand Banner */}
        <div className="staff-card-header">
          <div className="brand-logo-pill">
            <div className="brand-badge-small">A</div>
            <div>
              <div className="brand-suite-title">Alleviare Health Sciences</div>
              <div className="brand-suite-sub">Enterprise Sales Force Automation (SFA)</div>
            </div>
          </div>
          <div className="staff-portal-badge">
            <Users size={14} /> Corporate Staff Portal
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
              <span className="pill-tag">Instant Switch</span>
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
                  <strong> Alleviare Field Mobile App</strong> on iOS and Android. Web portal access is reserved for managers, directors, and operational staff.
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
                  placeholder="employee@alleviare.com"
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

            <div className="login-helpers-row">
              <label className="remember-checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Remember on this computer</span>
              </label>
              <span className="forgot-password-link">Forgot password? Contact IT</span>
            </div>

            <button
              type="submit"
              className="submit-login-btn staff-btn"
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

          {/* Super Admin Switcher Link Footer */}
          <div className="portal-switch-footer staff-footer">
            <div className="super-admin-teaser">
              <Sparkles size={16} color="#d97706" />
              <span>Are you a member of the Executive Board or Super Admin?</span>
            </div>
            <button
              type="button"
              className="switch-to-superadmin-btn"
              onClick={() => switchLoginPortal('superadmin')}
            >
              <Shield size={16} />
              <span>Go to Tier-0 Super Admin Portal &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
