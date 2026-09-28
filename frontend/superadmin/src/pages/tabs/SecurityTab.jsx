import React, { useEffect, useMemo } from 'react';
import {
  ShieldCheck, Lock, AlertTriangle, FileText, RefreshCw, AlertOctagon, Save,
  Key, Clock, Smartphone, Globe2, CheckCircle2, Search, Download, Inbox,
  Eye, Check, Shield, User, HardDrive, ShieldAlert, Laptop
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function SecurityTab() {
  const ctx = useDashboard();

  const {
    activeTab,
    setActiveTab,
    securitySubTab,
    setSecuritySubTab,
    securityPolicies,
    setSecurityPolicies,
    isSavingSecurityPolicies,
    securityThreatAlerts,
    setSecurityThreatAlerts,
    auditLogsList,
    auditSearchQuery,
    setAuditSearchQuery,
    auditCompanyFilter,
    setAuditCompanyFilter,
    auditActionFilter,
    setAuditActionFilter,
    setSelectedAuditDiff,
    companies = [],
    handleSaveSecurityPolicies,
    handleResolveThreatAlert,
    handleExportAuditLogs,
    setIsEmergencyLogoutOpen,
    getSecurityAlerts,
    loadAllData,
    showToast
  } = ctx || {};

  // Synchronize sidebar activeTab with internal securitySubTab
  useEffect(() => {
    if (activeTab === 'audit-logs') {
      if (setSecuritySubTab) setSecuritySubTab('audit');
    } else if (activeTab === 'security') {
      if (securitySubTab === 'audit' && setSecuritySubTab) {
        setSecuritySubTab('policies');
      }
    }
  }, [activeTab]);

  const unresolvedAlertsCount = useMemo(() => {
    return (securityThreatAlerts || []).filter(a => a.status === 'UNRESOLVED').length;
  }, [securityThreatAlerts]);

  const filteredAuditLogs = useMemo(() => {
    return (auditLogsList || []).filter(log => {
      const q = (auditSearchQuery || '').toLowerCase().trim();
      const matchesSearch = !q ||
        (log.who && log.who.toLowerCase().includes(q)) ||
        (log.actorName && log.actorName.toLowerCase().includes(q)) ||
        (log.actorEmail && log.actorEmail.toLowerCase().includes(q)) ||
        (log.company && log.company.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.targetEntity && log.targetEntity.toLowerCase().includes(q)) ||
        (log.ip && log.ip.includes(q)) ||
        (log.device && log.device.toLowerCase().includes(q));

      const matchesCompany = auditCompanyFilter === 'ALL' ||
        log.tenantId === auditCompanyFilter ||
        log.company === auditCompanyFilter;

      const matchesAction = auditActionFilter === 'ALL' ||
        (log.action && log.action.toUpperCase().includes(auditActionFilter.toUpperCase()));

      return matchesSearch && matchesCompany && matchesAction;
    });
  }, [auditLogsList, auditSearchQuery, auditCompanyFilter, auditActionFilter]);

  // Tab switcher helper that also informs sidebar activeTab
  const handleSwitchSubTab = (tabKey) => {
    if (setSecuritySubTab) setSecuritySubTab(tabKey);
    if (tabKey === 'audit') {
      if (setActiveTab) setActiveTab('audit-logs');
    } else {
      if (setActiveTab) setActiveTab('security');
    }
  };

  // Safe fallback for securityPolicies
  const policies = securityPolicies || {
    mfaPolicy: { mode: 'MANDATORY_ADMINS', allowedMethods: ['TOTP', 'SMS', 'EMAIL'], gracePeriodDays: 7, enforceRememberDeviceDays: 30 },
    passwordPolicy: { minLength: 8, requireUppercase: true, requireLowercase: true, requireNumbers: true, requireSpecialChars: true, expiryDays: 90, preventReuseCount: 5 },
    sessionPolicy: { maxConcurrentSessions: 3, idleTimeoutMinutes: 60, absoluteTimeoutHours: 24, rememberMeDays: 30, invalidateOnPasswordChange: true },
    loginLimits: { maxFailedAttempts: 5, attemptWindowMinutes: 15 },
    accountLockout: { lockoutType: 'TEMPORARY', lockoutDurationMinutes: 30, autoNotifyAdmin: true, notifyUserEmail: true },
    ipRestrictions: { enabled: false, enforceForAdminsOnly: true, whitelist: ['103.21.144.0/24'], blacklist: ['185.220.101.5'] },
    deviceRestrictions: { enabled: true, allowedDeviceTypes: ['DESKTOP', 'MOBILE', 'TABLET'], maxDevicesPerUser: 3, blockRootedJailbroken: true, requireDeviceApproval: false },
    suspiciousLoginDetection: { enabled: true, alertOnNewCountry: true, alertOnNewDevice: true, impossibleTravelCheck: true, autoChallengeOtp: true, velocityThresholdKmPerHour: 500 }
  };

  const updatePolicy = (section, updates) => {
    if (!setSecurityPolicies) return;
    setSecurityPolicies({
      ...policies,
      [section]: {
        ...policies[section],
        ...updates
      }
    });
  };

  return (
    <div className="tab-pane-content" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* =====================================================================
          HEADER ACTION & EXECUTIVE STATUS BAR
          ===================================================================== */}
      <div
        className="card-section"
        style={{
          padding: '20px 24px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.15)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={22} color="#38bdf8" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>
                    Security &amp; Audit Governance
                  </h2>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ● ZERO-TRUST ACTIVE
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Centralized policy enforcement for MFA, password integrity, session timeouts, threat detection, and forensic audit logs.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (loadAllData) loadAllData();
                if (showToast) showToast('Security telemetry and audit records refreshed.', 'info');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh Telemetry</span>
            </button>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                if (setIsEmergencyLogoutOpen) setIsEmergencyLogoutOpen(true);
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                fontWeight: '700'
              }}
            >
              <AlertOctagon size={14} color="#f87171" />
              <span>Emergency Lockdown</span>
            </button>

            {securitySubTab === 'policies' && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveSecurityPolicies}
                disabled={isSavingSecurityPolicies}
                style={{
                  background: '#0284c7',
                  borderColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Save size={14} />
                <span>{isSavingSecurityPolicies ? 'Enforcing...' : 'Enforce & Save Policies'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Threat Alerts</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: unresolvedAlertsCount > 0 ? '#f87171' : '#34d399', marginTop: '2px' }}>
              {unresolvedAlertsCount} {unresolvedAlertsCount === 1 ? 'Alert' : 'Alerts'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Perimeter anomaly monitor</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>MFA Enforcement</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
              {policies.mfaPolicy?.mode === 'DISABLED' ? 'Disabled' : 'Enforced'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TOTP, SMS, Email OTP</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Session Concurrency</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#a78bfa', marginTop: '2px' }}>
              Max {policies.sessionPolicy?.maxConcurrentSessions || 3} Devices
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Idle limit: {policies.sessionPolicy?.idleTimeoutMinutes || 60}m</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Forensic Audit Ledger</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>
              {(auditLogsList || []).length} Logged Events
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Tamper-evident record</div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STREAMLINED SUB-NAV SWITCHBOARD
          ===================================================================== */}
      <div className="sub-nav-tabs" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`sub-nav-pill ${securitySubTab === 'policies' ? 'active' : ''}`}
          onClick={() => handleSwitchSubTab('policies')}
        >
          <Lock size={15} />
          <span>Security Governance &amp; Policies</span>
        </button>

        <button
          type="button"
          className={`sub-nav-pill ${securitySubTab === 'alerts' ? 'active' : ''}`}
          onClick={() => handleSwitchSubTab('alerts')}
        >
          <AlertTriangle size={15} />
          <span>Threat Alerts &amp; Anomalies</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: '800',
              background: unresolvedAlertsCount > 0 ? '#fee2e2' : '#f1f5f9',
              color: unresolvedAlertsCount > 0 ? '#dc2626' : '#64748b'
            }}
          >
            {unresolvedAlertsCount}
          </span>
        </button>

        <button
          type="button"
          className={`sub-nav-pill ${securitySubTab === 'audit' ? 'active' : ''}`}
          onClick={() => handleSwitchSubTab('audit')}
        >
          <FileText size={15} />
          <span>Forensic Audit Ledger</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: '800',
              background: '#eff6ff',
              color: '#1d4ed8'
            }}
          >
            {(auditLogsList || []).length}
          </span>
        </button>
      </div>

      {/* =====================================================================
          VIEW 1: CLEAN 4-PILLAR SECURITY POLICIES
          ===================================================================== */}
      {securitySubTab === 'policies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
          
          {/* Pillar 1: Multi-Factor Authentication */}
          <div className="card-section" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                  Multi-Factor Authentication (MFA)
                </h3>
              </div>
              <span className="status-badge-green" style={{ fontSize: '0.72rem' }}>
                {policies.mfaPolicy?.mode?.replace('_', ' ') || 'ACTIVE'}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
              Mandate two-step identity verification on privileged accounts and standard users.
            </p>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>Enforcement Scope</label>
              <select
                className="form-control"
                value={policies.mfaPolicy?.mode || 'MANDATORY_ADMINS'}
                onChange={(e) => updatePolicy('mfaPolicy', { mode: e.target.value })}
              >
                <option value="DISABLED">Disabled (Password Only)</option>
                <option value="OPTIONAL">Optional (User Selected)</option>
                <option value="MANDATORY_ADMINS">Mandatory for Super Admins &amp; Company Admins</option>
                <option value="MANDATORY_ALL">Mandatory for All Users Platform-Wide</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Allowed Verification Methods
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { key: 'TOTP', label: 'Authenticator App (TOTP)' },
                  { key: 'SMS', label: 'SMS Phone OTP' },
                  { key: 'EMAIL', label: 'Secure Email OTP' }
                ].map((m) => {
                  const allowed = policies.mfaPolicy?.allowedMethods || [];
                  const isChecked = allowed.includes(m.key);
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => {
                        const next = isChecked ? allowed.filter(k => k !== m.key) : [...allowed, m.key];
                        updatePolicy('mfaPolicy', { allowedMethods: next });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        background: isChecked ? '#eff6ff' : '#f8fafc',
                        border: isChecked ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        fontWeight: isChecked ? '700' : '500',
                        color: isChecked ? '#1e40af' : '#64748b',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: isChecked ? '#2563eb' : '#cbd5e1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isChecked && <Check size={10} color="#fff" />}
                      </span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Enforcement Grace Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  className="form-control"
                  value={policies.mfaPolicy?.gracePeriodDays ?? 7}
                  onChange={(e) => updatePolicy('mfaPolicy', { gracePeriodDays: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Remember Device Window (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className="form-control"
                  value={policies.mfaPolicy?.enforceRememberDeviceDays ?? 30}
                  onChange={(e) => updatePolicy('mfaPolicy', { enforceRememberDeviceDays: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Pillar 2: Credential & Password Governance */}
          <div className="card-section" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                  Password Complexity &amp; Rotation
                </h3>
              </div>
              <span className="plan-pill plan-pro" style={{ fontSize: '0.72rem' }}>
                Min {policies.passwordPolicy?.minLength || 8} Characters
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
              Set NIST-compliant credential policies to prevent weak passwords and dictionary attacks.
            </p>

            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Minimum Length (8-32 Chars)</label>
                <input
                  type="number"
                  min="8"
                  max="32"
                  className="form-control"
                  value={policies.passwordPolicy?.minLength ?? 8}
                  onChange={(e) => updatePolicy('passwordPolicy', { minLength: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Password Expiry (Days, 0=Never)</label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  className="form-control"
                  value={policies.passwordPolicy?.expiryDays ?? 90}
                  onChange={(e) => updatePolicy('passwordPolicy', { expiryDays: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {[
                { key: 'requireUppercase', label: 'Uppercase Letters (A-Z)' },
                { key: 'requireLowercase', label: 'Lowercase Letters (a-z)' },
                { key: 'requireNumbers', label: 'Numeric Digits (0-9)' },
                { key: 'requireSpecialChars', label: 'Special Symbols (!@#$)' }
              ].map((item) => {
                const isChecked = Boolean(policies.passwordPolicy?.[item.key]);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updatePolicy('passwordPolicy', { [item.key]: !isChecked })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      background: isChecked ? '#f0fdf4' : '#f8fafc',
                      border: isChecked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      fontWeight: isChecked ? '700' : '500',
                      color: isChecked ? '#166534' : '#64748b',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: isChecked ? '#16a34a' : '#cbd5e1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isChecked && <Check size={10} color="#fff" />}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.74rem', color: '#475569' }}>Password Reuse History Prevention</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="form-control"
                  style={{ maxWidth: '100px' }}
                  value={policies.passwordPolicy?.preventReuseCount ?? 5}
                  onChange={(e) => updatePolicy('passwordPolicy', { preventReuseCount: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>previous passwords cannot be reused</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Session Lifespan & Token Security */}
          <div className="card-section" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                  Session Lifespan &amp; Token Concurrency
                </h3>
              </div>
              <span className="plan-pill plan-enterprise" style={{ fontSize: '0.72rem' }}>
                Max {policies.sessionPolicy?.maxConcurrentSessions || 3} Sessions
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
              Govern token expiration intervals, idle timeouts, and concurrent multi-device logins.
            </p>

            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Max Concurrent Sessions</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={policies.sessionPolicy?.maxConcurrentSessions ?? 3}
                  onChange={(e) => updatePolicy('sessionPolicy', { maxConcurrentSessions: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Idle Session Timeout (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  className="form-control"
                  value={policies.sessionPolicy?.idleTimeoutMinutes ?? 60}
                  onChange={(e) => updatePolicy('sessionPolicy', { idleTimeoutMinutes: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Absolute Session Lifetime (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  className="form-control"
                  value={policies.sessionPolicy?.absoluteTimeoutHours ?? 24}
                  onChange={(e) => updatePolicy('sessionPolicy', { absoluteTimeoutHours: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Remember-Me Lifetime (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className="form-control"
                  value={policies.sessionPolicy?.rememberMeDays ?? 30}
                  onChange={(e) => updatePolicy('sessionPolicy', { rememberMeDays: Number(e.target.value) })}
                />
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => updatePolicy('sessionPolicy', { invalidateOnPasswordChange: !policies.sessionPolicy?.invalidateOnPasswordChange })}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
                  Force Token Invalidation on Password Reset
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Immediately terminates all active sessions across all devices when a password is changed
                </div>
              </div>
              <span
                style={{
                  width: '36px',
                  height: '20px',
                  borderRadius: '10px',
                  background: policies.sessionPolicy?.invalidateOnPasswordChange ? '#0284c7' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: policies.sessionPolicy?.invalidateOnPasswordChange ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'all 0.15s ease'
                  }}
                />
              </span>
            </div>
          </div>

          {/* Pillar 4: Perimeter Defense, Lockouts & Anomaly Engine */}
          <div className="card-section" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                  Perimeter Defense &amp; Account Lockouts
                </h3>
              </div>
              <span className="status-tag status-suspended" style={{ fontSize: '0.72rem' }}>
                Lockout @ {policies.loginLimits?.maxFailedAttempts || 5} Fails
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
              Mitigate brute-force attacks and prevent credential stuffing with smart rate-limiting.
            </p>

            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Max Failed Attempts Before Lockout</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  className="form-control"
                  value={policies.loginLimits?.maxFailedAttempts ?? 5}
                  onChange={(e) => updatePolicy('loginLimits', { maxFailedAttempts: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem', color: '#475569' }}>Lockout Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  className="form-control"
                  value={policies.accountLockout?.lockoutDurationMinutes ?? 30}
                  onChange={(e) => updatePolicy('accountLockout', { lockoutDurationMinutes: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {
                  key: 'impossibleTravelCheck',
                  title: 'Impossible Travel & Geovelocity Detection',
                  desc: 'Challenge identity when consecutive logins occur faster than commercial flight speeds'
                },
                {
                  key: 'alertOnNewDevice',
                  title: 'New Hardware / Unrecognized Device Alert',
                  desc: 'Require step-up verification when logging in from an unfamiliar browser fingerprint'
                },
                {
                  key: 'autoNotifyAdmin',
                  title: 'Real-Time Super Admin Alert on Account Lockout',
                  desc: 'Instantly notify security administrators upon multiple failed credential breaches',
                  section: 'accountLockout'
                }
              ].map((item) => {
                const section = item.section || 'suspiciousLoginDetection';
                const isChecked = Boolean(policies[section]?.[item.key]);
                return (
                  <div
                    key={item.key}
                    style={{
                      background: isChecked ? '#f8fafc' : '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => updatePolicy(section, { [item.key]: !isChecked })}
                  >
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                    <span
                      style={{
                        width: '32px',
                        height: '18px',
                        borderRadius: '9px',
                        background: isChecked ? '#0284c7' : '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        flexShrink: 0
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          transform: isChecked ? 'translateX(14px)' : 'translateX(0)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: STREAMLINED THREAT ALERTS & ANOMALIES
          ===================================================================== */}
      {securitySubTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="card-section"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#dc2626" />
                <span>Perimeter Threat Feed &amp; Incident Mitigation</span>
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Real-time anomaly monitoring for impossible travel, brute-force attempts, and unauthorized IP challenges.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (getSecurityAlerts && setSecurityThreatAlerts) {
                  getSecurityAlerts().then(data => setSecurityThreatAlerts(data));
                  if (showToast) showToast('Threat alert feed updated.', 'info');
                }
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh Alert Feed</span>
            </button>
          </div>

          {(securityThreatAlerts || []).length === 0 ? (
            <div className="card-section" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
              <ShieldCheck size={44} color="#10b981" style={{ margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>All Threat Feeds Clear</div>
              <p style={{ fontSize: '0.82rem', margin: '6px auto 0', maxWidth: '420px', color: '#64748b' }}>
                No active security threats, impossible travels, or brute force lockouts currently detected across your platform.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {securityThreatAlerts.map(alert => {
                const isResolved = alert.status === 'RESOLVED';
                const isCritical = alert.severity === 'CRITICAL';
                const isHigh = alert.severity === 'HIGH';

                return (
                  <div
                    key={alert.id}
                    className="card-section"
                    style={{
                      margin: 0,
                      padding: '18px 22px',
                      borderLeft: `5px solid ${isResolved ? '#10b981' : (isCritical ? '#dc2626' : (isHigh ? '#ea580c' : '#0284c7'))}`,
                      background: isResolved ? '#fcfdfd' : '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            background: isResolved ? '#dcfce7' : (isCritical ? '#fee2e2' : (isHigh ? '#ffedd5' : '#e0f2fe')),
                            color: isResolved ? '#166534' : (isCritical ? '#991b1b' : (isHigh ? '#9a3412' : '#0369a1'))
                          }}
                        >
                          {alert.severity}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{alert.title}</strong>
                        <code style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
                          {alert.id}
                        </code>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : ''}
                        </span>
                        {!isResolved ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 10px', fontSize: '0.74rem', color: '#166534', background: '#dcfce7', borderColor: '#bbf7d0', fontWeight: '700' }}
                            onClick={() => {
                              if (handleResolveThreatAlert) handleResolveThreatAlert(alert.id);
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Resolved</span>
                          </button>
                        ) : (
                          <span className="status-badge-green" style={{ fontSize: '0.72rem' }}>
                            ✓ RESOLVED
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#334155', margin: '0 0 12px', lineHeight: 1.4 }}>
                      {alert.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.76rem', color: '#475569', background: '#f8fafc', padding: '8px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div><strong>Target User:</strong> {alert.userEmail || 'Platform System'}</div>
                      <div><strong>Company:</strong> {alert.companyName || 'Global Platform'}</div>
                      <div><strong>Origin IP:</strong> <code style={{ color: '#0f172a' }}>{alert.ipAddress || 'Unknown'}</code></div>
                      <div style={{ color: '#0284c7' }}><strong>Enforced Action:</strong> {alert.actionTaken || 'Flagged'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          VIEW 3: CLEAN FORENSIC AUDIT LEDGER
          ===================================================================== */}
      {securitySubTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Audit Filter Strip */}
          <div
            className="card-section"
            style={{
              padding: '14px 18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              background: '#ffffff',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search actor, action, company, IP, target or device..."
                value={auditSearchQuery || ''}
                onChange={(e) => setAuditSearchQuery && setAuditSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Tenant:</span>
              <select
                className="form-control"
                style={{ height: '36px', fontSize: '0.8rem', minWidth: '160px' }}
                value={auditCompanyFilter || 'ALL'}
                onChange={(e) => setAuditCompanyFilter && setAuditCompanyFilter(e.target.value)}
              >
                <option value="ALL">All Companies</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Category:</span>
              <select
                className="form-control"
                style={{ height: '36px', fontSize: '0.8rem', minWidth: '160px' }}
                value={auditActionFilter || 'ALL'}
                onChange={(e) => setAuditActionFilter && setAuditActionFilter(e.target.value)}
              >
                <option value="ALL">All Action Types</option>
                <option value="SECURITY">Security &amp; Auth</option>
                <option value="SUBSCRIPTION">Billing &amp; Plans</option>
                <option value="ROLE">Roles &amp; Access</option>
                <option value="SETTINGS">Platform Settings</option>
                <option value="USER">User Directory</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportAuditLogs}
              style={{ marginLeft: 'auto', height: '36px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Clean Forensic Ledger Table */}
          <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="saas-table-container">
              {filteredAuditLogs.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  <Inbox size={40} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '0.96rem', color: '#0f172a' }}>No Audit Records Match Query</div>
                  <p style={{ fontSize: '0.8rem', margin: '4px auto 0', color: '#64748b' }}>
                    Adjust search terms or company filters to inspect forensic ledger events.
                  </p>
                </div>
              ) : (
                <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '170px' }}>Actor</th>
                      <th style={{ minWidth: '140px' }}>Tenant</th>
                      <th style={{ minWidth: '160px' }}>Event / Action</th>
                      <th style={{ minWidth: '140px' }}>Target Resource</th>
                      <th style={{ minWidth: '130px' }}>Date / Time</th>
                      <th style={{ minWidth: '110px' }}>Origin IP</th>
                      <th style={{ textAlign: 'right', minWidth: '90px' }}>Forensics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.map(log => {
                      const actionUpper = (log.action || '').toUpperCase();
                      const isDanger = actionUpper.includes('LOCK') || actionUpper.includes('SUSPEND') || actionUpper.includes('DELETE') || actionUpper.includes('TERMINAT');
                      const isUpgrade = actionUpper.includes('UPGRADE') || actionUpper.includes('CREATE') || actionUpper.includes('RESTORE');
                      const isSecurity = actionUpper.includes('SECURITY') || actionUpper.includes('AUTH') || actionUpper.includes('PASS');

                      return (
                        <tr key={log.id}>
                          {/* Actor */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '800',
                                  fontSize: '0.74rem'
                                }}
                              >
                                {(log.actorName || log.who || 'S').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>
                                  {log.actorName || log.who || 'Super Admin'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                  {log.actorEmail || 'platform@orvexa.io'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Company / Tenant */}
                          <td>
                            <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1e293b' }}>
                              {log.company || 'Global Platform'}
                            </div>
                            {log.tenantId && (
                              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                                {log.tenantId}
                              </div>
                            )}
                          </td>

                          {/* Action */}
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
                          </td>

                          {/* Target Resource */}
                          <td>
                            <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                              {log.targetEntity || log.detail || 'Platform Resource'}
                            </div>
                          </td>

                          {/* Date / Time */}
                          <td>
                            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
                              {log.time || (log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                              {log.createdAt ? new Date(log.createdAt).toISOString().slice(0, 10) : ''}
                            </div>
                          </td>

                          {/* Origin IP */}
                          <td>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '0.74rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {log.ip || '127.0.0.1'}
                            </span>
                          </td>

                          {/* Details / Action Inspector */}
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                              onClick={() => setSelectedAuditDiff && setSelectedAuditDiff(log)}
                            >
                              <Eye size={12} />
                              <span>Diff</span>
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
    </div>
  );
}
