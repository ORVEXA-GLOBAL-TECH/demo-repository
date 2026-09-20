import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Server, AlertTriangle, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('superadmin@alleviare.com');
  const [password, setPassword] = useState('••••••••••••');
  const [securityPin, setSecurityPin] = useState('984021');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login({
        email,
        password
      });
    } catch (err) {
      setErrorMessage(err.message || 'Super Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneClickSuperAdmin = () => {
    setEmail('superadmin@alleviare.com');
    setPassword('SuperAdmin@2026!GlobalHQ');
    setSecurityPin('984021');
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  return (
    <div className="login-wrapper superadmin-theme">
      {/* Cyber Grid & Glow Orbs */}
      <div className="cyber-grid-overlay" />
      <div className="glow-orb orb-gold" />
      <div className="glow-orb orb-indigo" />

      <div className="superadmin-login-card">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="terminal-title">TIER-0 EXECUTIVE COMMAND PROTOCOL</div>
          <div className="terminal-status">
            <span className="pulse-indicator" /> SECURE GATEWAY
          </div>
        </div>

        {/* Card Content */}
        <div className="login-card-body">
          <div className="brand-security-lockup">
            <div className="shield-icon-container">
              <ShieldCheck size={38} className="shield-svg" />
            </div>
            <h1 className="login-main-title">Super Admin Console</h1>
            <p className="login-subtitle">
              Orvexa Global HQ &bull; Multi-Tenant SaaS Governance &bull; Master Data Control
            </p>
          </div>

          {/* Security Clearance Alert Pill */}
          <div className="clearance-pill">
            <Sparkles size={14} color="#f59e0b" />
            <span>Strict Access: Executive Board &amp; Super Administrators Only</span>
          </div>

          {errorMessage && (
            <div className="auth-error-banner">
              <AlertTriangle size={18} />
              <div>
                <strong>Authentication Blocked</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="sa-email">
                Executive Super Admin ID / Email
              </label>
              <div className="input-with-icon">
                <Server size={18} className="input-icon" />
                <input
                  id="sa-email"
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@alleviare.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sa-password">
                Master Security Passphrase
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="sa-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter cryptographic passphrase"
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

            <div className="form-group">
              <label className="form-label" htmlFor="sa-pin">
                <span>Hardware Token / 2FA Passcode</span>
                <span className="label-helper">Auto-synced for demo</span>
              </label>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  id="sa-pin"
                  type="text"
                  className="login-input"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="6-digit token code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-login-btn superadmin-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Validating Cryptographic Session...</span>
              ) : (
                <>
                  <span>Authenticate Super Admin Access</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Access Demo Bar */}
          <div className="demo-quick-bar" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div className="demo-bar-label" style={{ fontSize: '0.74rem', color: '#94a3b8' }}>⚡ Rapid Evaluation Shortcut:</div>
            <button
              type="button"
              className="quick-fill-btn"
              onClick={handleOneClickSuperAdmin}
            >
              <CheckCircle2 size={16} color="#10b981" />
              <span>1-Click Super Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
