import React, { useState, useMemo } from 'react';
import {
  Sliders, Plus, CheckCircle2, XCircle, AlertTriangle, Sparkles,
  Building2, ToggleLeft, ToggleRight, Search, Filter, ShieldCheck,
  Zap, Layers, Compass, RefreshCw, Eye, Edit, Trash2, Check, ArrowRight
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function FeaturesTab() {
  const ctx = useDashboard();
  const {
    companies = [],
    featureFlags = [],
    setFeatureFlags,
    showToast,
    loadAllData
  } = ctx || {};

  const [activeSubTab, setActiveSubTab] = useState('modules'); // 'modules' | 'canary' | 'overrides'
  const [selectedTenantForOverride, setSelectedTenantForOverride] = useState('');
  const [tenantOverrides, setTenantOverrides] = useState({
    'ci-001': { dcr: true, gps: true, sampleStock: true, aiStudio: false },
    'ci-002': { dcr: true, gps: true, sampleStock: false, aiStudio: true }
  });
  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);
  const [newFlagForm, setNewFlagForm] = useState({
    name: '',
    key: '',
    description: '',
    rolloutPercent: 25,
    status: 'BETA'
  });

  // Enterprise Feature Modules catalogue
  const [featureModules, setFeatureModules] = useState([
    {
      id: 'mod-sfa',
      name: 'Field Sales Automation (SFA)',
      code: 'MODULE_SFA',
      category: 'Commercial Execution',
      description: 'Daily field visit logging, chemist mapping, doctor calling, and schedule beat planning.',
      enabled: true,
      minTier: 'STARTER',
      icon: '🚗'
    },
    {
      id: 'mod-dcr',
      name: 'Daily Call Reporting (DCR)',
      code: 'MODULE_DCR',
      category: 'Field Activity',
      description: 'Instant submission of daily call logs with joint work tracking and digital signature capture.',
      enabled: true,
      minTier: 'STARTER',
      icon: '📋'
    },
    {
      id: 'mod-gps',
      name: 'Real-Time GPS Tracking & Geofencing',
      code: 'MODULE_GPS',
      category: 'Location & Telemetry',
      description: 'Continuous geofence validation for doctor visits, automated distance calculation & travel allowance.',
      enabled: true,
      minTier: 'PROFESSIONAL',
      icon: '📍'
    },
    {
      id: 'mod-samples',
      name: 'Sample Inventory & Stock Allocation',
      code: 'MODULE_SAMPLES',
      category: 'Product Governance',
      description: 'End-to-end batch tracking of medical samples, promotional inputs, and doctor acknowledgments.',
      enabled: true,
      minTier: 'PROFESSIONAL',
      icon: '💊'
    },
    {
      id: 'mod-pob',
      name: 'Chemist Order Booking (POB)',
      code: 'MODULE_POB',
      category: 'Secondary Sales',
      description: 'Real-time booking of chemist orders, stockist dispatch tracking, and secondary revenue audit.',
      enabled: true,
      minTier: 'STARTER',
      icon: '📦'
    },
    {
      id: 'mod-sovereign',
      name: 'Sovereign Multi-Jurisdiction Residency',
      code: 'MODULE_SOVEREIGN',
      category: 'Security & Compliance',
      description: 'Restricts medical data strictly to domestic data centers with zero international egress.',
      enabled: true,
      minTier: 'ENTERPRISE',
      icon: '🌐'
    },
    {
      id: 'mod-ai-route',
      name: 'AI Predictive Beat Route Optimization',
      code: 'MODULE_AI_ROUTE',
      category: 'Commercial Intelligence',
      description: 'Machine learning routing to prioritize high-prescribing HCPs and reduce travel fatigue.',
      enabled: true,
      minTier: 'ENTERPRISE',
      icon: '🧠'
    },
    {
      id: 'mod-fx',
      name: 'Multi-Currency & Automated FX Hedging',
      code: 'MODULE_FX',
      category: 'Monetization',
      description: 'Instant multi-currency exchange conversion with central bank rate parity synchronization.',
      enabled: true,
      minTier: 'PROFESSIONAL',
      icon: '💱'
    },
    {
      id: 'mod-audit',
      name: '21 CFR Part 11 Regulatory Compliance',
      code: 'MODULE_21CFR11',
      category: 'Regulatory Governance',
      description: 'Cryptographically hashed audit trails, dual signature sign-offs, and compliance archival.',
      enabled: true,
      minTier: 'ENTERPRISE',
      icon: '🛡️'
    }
  ]);

  // Default canary flags if empty
  const activeFlags = useMemo(() => {
    if (featureFlags && featureFlags.length > 0) return featureFlags;
    return [
      { id: 'flag-1', name: 'AI Voice DCR Transcriber', key: 'ai_voice_dcr', rolloutPercent: 35, status: 'BETA', description: 'Permits medical reps to dictate doctor visits and auto-transcribe medical terminology.' },
      { id: 'flag-2', name: 'Instant WhatsApp POB Dispatch', key: 'wa_pob_dispatch', rolloutPercent: 75, status: 'PILOT', description: 'Dispatches instant order confirmation PDFs directly to stocking chemists via WhatsApp Business API.' },
      { id: 'flag-3', name: 'Offline Geo-Cache Synchronization', key: 'offline_geocache', rolloutPercent: 100, status: 'GA', description: 'Caches offline GPS breadcrumbs during rural field routes with seamless sync upon reconnect.' },
      { id: 'flag-4', name: 'Prescription Share of Voice AI', key: 'rx_sov_ai', rolloutPercent: 15, status: 'CANARY', description: 'Analyzes competitive doctor prescription habits using predictive econometric modeling.' }
    ];
  }, [featureFlags]);

  // Toggle global module
  const handleToggleModule = (modId) => {
    setFeatureModules(prev => prev.map(m => {
      if (m.id === modId) {
        const nextState = !m.enabled;
        showToast(`${m.name} is now ${nextState ? 'Globally Enabled' : 'Globally Disabled'}`, nextState ? 'success' : 'warning');
        return { ...m, enabled: nextState };
      }
      return m;
    }));
  };

  // Change rollout percent for a flag
  const handleUpdateRollout = (flagId, newPercent) => {
    const clamped = Math.max(0, Math.min(100, newPercent));
    if (setFeatureFlags) {
      setFeatureFlags(prev => prev.map(f => f.id === flagId ? { ...f, rolloutPercent: clamped } : f));
    }
    showToast(`Updated rollout to ${clamped}%`, 'info');
  };

  // Create new flag
  const handleCreateFlagSubmit = (e) => {
    e.preventDefault();
    if (!newFlagForm.name || !newFlagForm.key) {
      showToast('Name and flag key are required', 'error');
      return;
    }

    const newFlag = {
      id: 'flag-' + Date.now(),
      name: newFlagForm.name,
      key: newFlagForm.key.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      description: newFlagForm.description || 'Canary feature flag',
      rolloutPercent: Number(newFlagForm.rolloutPercent) || 25,
      status: newFlagForm.status || 'BETA'
    };

    if (setFeatureFlags) {
      setFeatureFlags(prev => [newFlag, ...prev]);
    }
    setIsCreateFlagModalOpen(false);
    showToast(`Created feature flag ${newFlag.name}`, 'success');
    setNewFlagForm({
      name: '',
      key: '',
      description: '',
      rolloutPercent: 25,
      status: 'BETA'
    });
  };

  return (
    <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
            }}>
              <Sliders size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Feature Modules &amp; Canary Release Governance
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Manage platform capability modules, tenant-specific overrides, and progressive rollout percentages.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (loadAllData) loadAllData();
              showToast('Refreshed feature flag definitions', 'info');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <RefreshCw size={15} /> Sync Flags
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateFlagModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none'
            }}
          >
            <Plus size={16} /> + Create Feature Flag
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards ──────────────────────────────────────────────── */}
      <div className="kpi-banner-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div className="kpi-top">
            <span className="kpi-label">Core Feature Modules</span>
            <Layers size={18} color="#7c3aed" />
          </div>
          <div className="kpi-number" style={{ color: '#0f172a' }}>{featureModules.length}</div>
          <div className="kpi-sub">
            <strong className="text-green">{featureModules.filter(m => m.enabled).length} Enabled</strong> across platform
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="kpi-top">
            <span className="kpi-label">Canary Flags Active</span>
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div className="kpi-number" style={{ color: '#d97706' }}>{activeFlags.length}</div>
          <div className="kpi-sub">
            Progressive percentage-based tenant rollouts
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-top">
            <span className="kpi-label">General Availability (GA)</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div className="kpi-number text-green">
            {activeFlags.filter(f => f.rolloutPercent === 100).length + featureModules.filter(m => m.enabled).length}
          </div>
          <div className="kpi-sub">
            100% tenant coverage without restrictions
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="kpi-top">
            <span className="kpi-label">Active Tenants Governed</span>
            <Building2 size={18} color="#3b82f6" />
          </div>
          <div className="kpi-number" style={{ color: '#2563eb' }}>{companies.length || 8}</div>
          <div className="kpi-sub">
            Capable of per-tenant feature toggling
          </div>
        </div>
      </div>

      {/* ── Sub-Navigation ────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px', flexWrap: 'wrap'
      }}>
        {[
          { id: 'modules', label: `Enterprise Modules Directory (${featureModules.length})`, icon: Layers },
          { id: 'canary', label: `Canary Flags & Rollouts (${activeFlags.length})`, icon: Sliders },
          { id: 'overrides', label: `Tenant-Specific Overrides`, icon: Building2 }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                color: isActive ? '#7c3aed' : '#64748b', fontWeight: isActive ? '700' : '600',
                fontSize: '0.86rem', transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={16} color={isActive ? '#7c3aed' : '#94a3b8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. SUBTAB: MODULES DIRECTORY ──────────────────────────────────── */}
      {activeSubTab === 'modules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {featureModules.map((mod) => (
            <div
              key={mod.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: mod.enabled ? '1px solid #e2e8f0' : '1px dashed #cbd5e1',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                opacity: mod.enabled ? 1 : 0.75,
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{mod.icon}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#0f172a', fontWeight: '800' }}>
                        {mod.name}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                        {mod.category} &bull; <code>{mod.code}</code>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleModule(mod.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: mod.enabled ? '#16a34a' : '#94a3b8'
                    }}
                    title={mod.enabled ? 'Click to Disable Globally' : 'Click to Enable Globally'}
                  >
                    {mod.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#475569', margin: '8px 0 14px', lineHeight: '1.4' }}>
                  {mod.description}
                </p>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '12px', borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px',
                  background: mod.minTier === 'ENTERPRISE' ? '#f3e8ff' : '#eff6ff',
                  color: mod.minTier === 'ENTERPRISE' ? '#6b21a8' : '#1d4ed8'
                }}>
                  Tier: {mod.minTier}+
                </span>

                <span style={{ fontSize: '0.74rem', color: mod.enabled ? '#16a34a' : '#64748b', fontWeight: '700' }}>
                  {mod.enabled ? '🟢 Active Platform-Wide' : '⚪ Disabled Platform-Wide'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 2. SUBTAB: CANARY FLAGS & PROGRESSIVE ROLLOUTS ─────────────────── */}
      {activeSubTab === 'canary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
          }}>
            <div>
              <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>Canary Feature Flag Engine</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Safely release upcoming features to a fraction of tenant organizations before full general availability.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCreateFlagModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none' }}
            >
              <Plus size={15} /> + New Feature Flag
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {activeFlags.map((flag) => {
              const pct = flag.rolloutPercent || 0;
              return (
                <div
                  key={flag.id || flag.key}
                  style={{
                    background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#0f172a', fontWeight: '800' }}>
                        {flag.name}
                      </h4>
                      <code style={{ fontSize: '0.74rem', color: '#7c3aed', background: '#f5f3ff', padding: '2px 6px', borderRadius: '4px' }}>
                        {flag.key}
                      </code>
                    </div>

                    <span className="status-tag status-trial" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                      {flag.status || 'BETA'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: '1.4' }}>
                    {flag.description}
                  </p>

                  {/* Progress Bar & Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600' }}>Active Rollout:</span>
                      <strong style={{ fontSize: '0.88rem', color: pct === 100 ? '#16a34a' : '#7c3aed' }}>
                        {pct}% of Tenants
                      </strong>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`, height: '100%',
                          background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Preset Step Buttons */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {[
                      { label: '0%', val: 0 },
                      { label: '25%', val: 25 },
                      { label: '50%', val: 50 },
                      { label: '75%', val: 75 },
                      { label: '100% GA', val: 100 }
                    ].map(step => (
                      <button
                        key={step.val}
                        type="button"
                        onClick={() => handleUpdateRollout(flag.id, step.val)}
                        style={{
                          flex: 1, padding: '6px 8px', borderRadius: '6px',
                          border: pct === step.val ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                          background: pct === step.val ? '#f5f3ff' : '#f8fafc',
                          color: pct === step.val ? '#6d28d9' : '#475569',
                          fontWeight: pct === step.val ? '700' : '500',
                          fontSize: '0.74rem', cursor: 'pointer'
                        }}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. SUBTAB: TENANT-SPECIFIC OVERRIDES ───────────────────────────── */}
      {activeSubTab === 'overrides' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#ffffff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0',
            display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Select Organization to Configure Feature Entitlements:
              </label>
              <select
                value={selectedTenantForOverride}
                onChange={(e) => setSelectedTenantForOverride(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="">-- Choose Pharma Company --</option>
                {companies.map(c => (
                  <option key={c.id || c.code} value={c.id || c.code}>
                    {c.name} ({c.code}) &bull; {c.plan || 'Plan'} &bull; {c.country || 'Global'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTenantForOverride ? (
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                Custom Feature Overrides for Tenant
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>
                Toggle individual module permissions specifically for this organization, overriding global tier defaults.
              </p>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Module Name</th>
                      <th>Category</th>
                      <th>Global State</th>
                      <th>Tenant Custom Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureModules.map((mod) => (
                      <tr key={mod.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{mod.icon}</span>
                            <strong>{mod.name}</strong>
                          </div>
                        </td>
                        <td>{mod.category}</td>
                        <td>
                          {mod.enabled ? (
                            <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.8rem' }}>🟢 Enabled</span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>⚪ Disabled</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontWeight: '700' }}
                            onClick={() => showToast(`Saved custom entitlement for ${mod.name}`, 'success')}
                          >
                            ✓ Entitled &amp; Active
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ padding: '48px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <Building2 size={36} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>No Company Selected</div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                Select an enrolled pharmaceutical company from the dropdown above to inspect or modify its feature entitlements.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL: CREATE NEW FEATURE FLAG ────────────────────────────────── */}
      {isCreateFlagModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Sliders size={20} color="#7c3aed" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Create Canary Feature Flag</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Configure a progressive rollout flag for zero-downtime feature delivery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsCreateFlagModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlagSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Feature Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Sample Reconciliation Engine"
                    value={newFlagForm.name}
                    onChange={(e) => setNewFlagForm({ ...newFlagForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Flag Key (Programmatic Identifier) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ai_sample_reconciliation"
                    value={newFlagForm.key}
                    onChange={(e) => setNewFlagForm({ ...newFlagForm, key: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explain what this feature flag gates and its intended rollout criteria..."
                    value={newFlagForm.description}
                    onChange={(e) => setNewFlagForm({ ...newFlagForm, description: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Initial Rollout %
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newFlagForm.rolloutPercent}
                      onChange={(e) => setNewFlagForm({ ...newFlagForm, rolloutPercent: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Status Tag
                    </label>
                    <select
                      value={newFlagForm.status}
                      onChange={(e) => setNewFlagForm({ ...newFlagForm, status: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="CANARY">CANARY</option>
                      <option value="BETA">BETA</option>
                      <option value="PILOT">PILOT</option>
                      <option value="GA">GA (100%)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateFlagModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none' }}
                >
                  Create Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
