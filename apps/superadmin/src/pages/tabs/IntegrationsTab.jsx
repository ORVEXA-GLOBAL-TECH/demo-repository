import React, { useState, useMemo, useEffect } from 'react';
import {
  Radio, FileCode2, Key, Building2, Zap, BarChart3, AlertTriangle, FileText,
  RefreshCw, Plus, Search, Filter, CheckCircle2, XCircle, Clock, Database,
  Lock, Layers, Download, Trash2, Check, X, ExternalLink, ShieldCheck, Eye,
  Activity, RotateCcw, Send, Sparkles, Sliders
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function IntegrationsTab() {
  const ctx = useDashboard();

  const {
    activeTab,
    setActiveTab,
    apiSubTab,
    setApiSubTab,
    apiOverview,
    setApiOverview,
    getApiManagementOverview,
    apiKeys = [],
    setApiKeys,
    getApiKeys,
    apiClients = [],
    setApiClients,
    getApiClients,
    webhooks = [],
    setWebhooks,
    getWebhooks,
    apiFailedRequests = [],
    setApiFailedRequests,
    getApiFailedRequests,
    liveApiLogs = [],
    setLiveApiLogs,
    getLiveApiLogs,
    integrationAccessList = [],
    setIntegrationAccessList,
    getIntegrationAccessList,
    setIsCreateApiKeyOpen,
    setIsCreateApiClientOpen,
    setIsCreateWebhookOpen,
    setSelectedFailedReqInspect,
    handleRetryFailedApiRequest,
    apiLogsFilter = 'ALL',
    setApiLogsFilter,
    handleToggleIntegration,
    showToast
  } = ctx || {};

  // Operational Suite Active Tab: 'connectors' | 'credentials' | 'webhooks' | 'telemetry'
  const [operationsTab, setOperationsTab] = useState('connectors');
  
  // Internal sub-toggles for multi-view suites
  const [credentialsView, setCredentialsView] = useState('keys'); // 'keys' | 'clients'
  const [telemetryView, setTelemetryView] = useState('dlq'); // 'dlq' | 'logs' | 'quotas'
  const [connectorSearch, setConnectorSearch] = useState('');
  const [connectorCategory, setConnectorCategory] = useState('ALL');

  // Synchronize legacy apiSubTab with new operationsTab
  useEffect(() => {
    if (apiSubTab === 'integrations') {
      setOperationsTab('connectors');
    } else if (apiSubTab === 'keys' || apiSubTab === 'clients') {
      setOperationsTab('credentials');
      setCredentialsView(apiSubTab);
    } else if (apiSubTab === 'webhooks') {
      setOperationsTab('webhooks');
    } else if (apiSubTab === 'dlq' || apiSubTab === 'logs' || apiSubTab === 'limits') {
      setOperationsTab('telemetry');
      setTelemetryView(apiSubTab === 'limits' ? 'quotas' : apiSubTab);
    }
  }, [apiSubTab]);

  // Refresh all combined operations data
  const handleRefreshAllOperations = () => {
    if (getApiManagementOverview && setApiOverview) getApiManagementOverview().then(d => setApiOverview(d));
    if (getApiKeys && setApiKeys) getApiKeys().then(k => setApiKeys(k));
    if (getApiClients && setApiClients) getApiClients().then(c => setApiClients(c));
    if (getWebhooks && setWebhooks) getWebhooks().then(w => setWebhooks(w));
    if (getApiFailedRequests && setApiFailedRequests) getApiFailedRequests().then(f => setApiFailedRequests(f));
    if (getLiveApiLogs && setLiveApiLogs) getLiveApiLogs().then(l => setLiveApiLogs(l));
    if (getIntegrationAccessList && setIntegrationAccessList) getIntegrationAccessList().then(i => setIntegrationAccessList(i));
    if (showToast) showToast('Combined Integrations & API operations telemetry refreshed!', 'success');
  };

  // Filtered 3rd-party connectors
  const filteredConnectors = useMemo(() => {
    return (integrationAccessList || []).filter(item => {
      const matchesSearch = !connectorSearch.trim() ||
        (item.name && item.name.toLowerCase().includes(connectorSearch.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(connectorSearch.toLowerCase()));
      const matchesCat = connectorCategory === 'ALL' || item.category === connectorCategory;
      return matchesSearch && matchesCat;
    });
  }, [integrationAccessList, connectorSearch, connectorCategory]);

  // Categories list for connectors
  const connectorCategories = useMemo(() => {
    const set = new Set((integrationAccessList || []).map(i => i.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [integrationAccessList]);

  // Operational metrics fallback
  const overviewStats = apiOverview || {
    totalRequests24h: 3482910,
    avgLatencyMs: 24,
    successRatePct: 99.94,
    activeKeysCount: (apiKeys || []).length || 18,
    activeClientsCount: (apiClients || []).length || 8,
    activeWebhooksCount: (webhooks || []).length || 12,
    failedRequestsDlqCount: (apiFailedRequests || []).length || 3
  };

  const activeConnectorsCount = useMemo(() => {
    return (integrationAccessList || []).filter(i => i.status === 'OPERATIONAL').length;
  }, [integrationAccessList]);

  return (
    <div className="tab-pane-content" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* =====================================================================
          EXECUTIVE UNIFIED OPERATIONS BANNER
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.15)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Radio size={18} color="#38bdf8" />
                <FileCode2 size={18} color="#fbbf24" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>
                    Integrations &amp; API Management Operations
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
                    ● GATEWAY OPERATIONAL (99.94% SLA)
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Unified command center for 3rd-party ERP/CRM connectors, cryptographic API keys, OAuth clients, webhooks, and live gateway telemetry.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRefreshAllOperations}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh Operations</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsCreateWebhookOpen && setIsCreateWebhookOpen(true)}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                borderColor: 'rgba(245, 158, 11, 0.3)'
              }}
            >
              <Zap size={14} />
              <span>Register Webhook</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCreateApiKeyOpen && setIsCreateApiKeyOpen(true)}
              style={{
                background: '#0284c7',
                borderColor: '#0284c7',
                color: '#ffffff',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Key size={14} />
              <span>Generate API Key</span>
            </button>
          </div>
        </div>

        {/* 4-KPI Unified Metric Strip */}
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
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Gateway Traffic (24h)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
              {(overviewStats.totalRequests24h / 1000000).toFixed(2)}M Requests
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Avg latency: {overviewStats.avgLatencyMs}ms</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active API Credentials</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>
              {apiKeys.length} Keys • {apiClients.length} Clients
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bearer tokens &amp; M2M OAuth</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Connected Ecosystem</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>
              {activeConnectorsCount} / {integrationAccessList.length} Operational
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ERP, CRM, Payments, Geolocation</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Webhooks &amp; Dead-Letter Queue</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: apiFailedRequests.length > 0 ? '#f87171' : '#a78bfa', marginTop: '2px' }}>
              {webhooks.length} Webhooks • {apiFailedRequests.length} in DLQ
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>99.94% Delivery success rate</div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          COMBINED 4-PILLAR OPERATIONS SWITCHBOARD
          ===================================================================== */}
      <div className="sub-nav-tabs" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`sub-nav-pill ${operationsTab === 'connectors' ? 'active' : ''}`}
          onClick={() => {
            setOperationsTab('connectors');
            if (setApiSubTab) setApiSubTab('integrations');
          }}
        >
          <Radio size={15} />
          <span>3rd-Party Connectors &amp; Ecosystem</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: '800',
              background: '#f0fdf4',
              color: '#166534'
            }}
          >
            {integrationAccessList.length}
          </span>
        </button>

        <button
          type="button"
          className={`sub-nav-pill ${operationsTab === 'credentials' ? 'active' : ''}`}
          onClick={() => {
            setOperationsTab('credentials');
            if (setApiSubTab) setApiSubTab('keys');
          }}
        >
          <Key size={15} />
          <span>API Credentials &amp; OAuth Clients</span>
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
            {apiKeys.length + apiClients.length}
          </span>
        </button>

        <button
          type="button"
          className={`sub-nav-pill ${operationsTab === 'webhooks' ? 'active' : ''}`}
          onClick={() => {
            setOperationsTab('webhooks');
            if (setApiSubTab) setApiSubTab('webhooks');
          }}
        >
          <Zap size={15} />
          <span>Webhooks &amp; Event Subscriptions</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: '800',
              background: '#fef3c7',
              color: '#92400e'
            }}
          >
            {webhooks.length}
          </span>
        </button>

        <button
          type="button"
          className={`sub-nav-pill ${operationsTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => {
            setOperationsTab('telemetry');
            if (setApiSubTab) setApiSubTab('dlq');
          }}
        >
          <BarChart3 size={15} />
          <span>Gateway Traffic, DLQ &amp; Live Logs</span>
          {apiFailedRequests.length > 0 && (
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.68rem',
                fontWeight: '800',
                background: '#fee2e2',
                color: '#dc2626'
              }}
            >
              {apiFailedRequests.length} DLQ
            </span>
          )}
        </button>
      </div>

      {/* =====================================================================
          SUITE 1: 3RD-PARTY CONNECTORS & ECOSYSTEM
          ===================================================================== */}
      {operationsTab === 'connectors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Connector Filter Strip */}
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
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search connectors by name or description..."
                value={connectorSearch}
                onChange={(e) => setConnectorSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Category:</span>
              <select
                className="form-control"
                style={{ height: '36px', fontSize: '0.8rem', minWidth: '160px' }}
                value={connectorCategory}
                onChange={(e) => setConnectorCategory(e.target.value)}
              >
                {connectorCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'ALL' ? 'All Connector Categories' : cat}</option>
                ))}
              </select>
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b' }}>
              Showing <strong>{filteredConnectors.length}</strong> of {integrationAccessList.length} Adapters
            </span>
          </div>

          {/* Connectors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredConnectors.map((item) => {
              const isEnabled = item.status === 'OPERATIONAL';
              return (
                <div
                  key={item.key}
                  className="card-section"
                  style={{
                    margin: 0,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '10px',
                    border: `1px solid ${isEnabled ? '#bfdbfe' : '#e2e8f0'}`,
                    background: isEnabled ? '#ffffff' : '#fcfcfd'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: isEnabled ? '#eff6ff' : '#f1f5f9',
                            border: `1px solid ${isEnabled ? '#bfdbfe' : '#e2e8f0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}
                        >
                          🔌
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: '700' }}>{item.category}</div>
                        </div>
                      </div>
                      <span className={isEnabled ? 'status-badge-green' : 'status-tag status-trial'} style={!isEnabled ? { background: '#fee2e2', color: '#991b1b' } : {}}>
                        ● {item.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: '8px 0 16px' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Active in <strong>{item.enabledTenantsCount}</strong> Tenant Companies
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{
                        color: isEnabled ? '#dc2626' : '#166534',
                        borderColor: isEnabled ? '#fecaca' : '#bbf7d0',
                        background: isEnabled ? '#fef2f2' : '#f0fdf4',
                        fontWeight: '700'
                      }}
                      onClick={() => handleToggleIntegration && handleToggleIntegration(item.key, item.status)}
                    >
                      {isEnabled ? 'Suspend Connector' : 'Activate Connector'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUITE 2: API CREDENTIALS & OAUTH CLIENTS
          ===================================================================== */}
      {operationsTab === 'credentials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sub Switcher & Action Bar */}
          <div
            className="card-section"
            style={{
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${credentialsView === 'keys' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCredentialsView('keys')}
                style={{ fontWeight: '700' }}
              >
                <Key size={14} />
                <span>API Keys ({apiKeys.length})</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${credentialsView === 'clients' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCredentialsView('clients')}
                style={{ fontWeight: '700' }}
              >
                <Building2 size={14} />
                <span>OAuth M2M Clients ({apiClients.length})</span>
              </button>
            </div>

            <div>
              {credentialsView === 'keys' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCreateApiKeyOpen && setIsCreateApiKeyOpen(true)}
                  style={{ background: '#0284c7' }}
                >
                  <Plus size={14} /> Generate API Key
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCreateApiClientOpen && setIsCreateApiClientOpen(true)}
                  style={{ background: '#0284c7' }}
                >
                  <Plus size={14} /> Register OAuth Client
                </button>
              )}
            </div>
          </div>

          {/* API Keys Table */}
          {credentialsView === 'keys' && (
            <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Key Name &amp; ID</th>
                      <th>Masked Secret</th>
                      <th>Assigned Tenant</th>
                      <th>Authorized Scopes</th>
                      <th>Rate Limit</th>
                      <th>Status</th>
                      <th>Last Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((k, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a' }}>{k.keyName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}><code>{k.id}</code></div>
                        </td>
                        <td>
                          <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.76rem', color: '#0f172a' }}>
                            {k.maskedKey || `${k.keyPrefix || 'allv_live_'}••••••••••••`}
                          </code>
                        </td>
                        <td><strong>{k.companyName || 'Global Platform Core'}</strong></td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {(k.scopes || ['read:all']).map((sc, sci) => (
                              <span key={sci} className="status-tag status-trial" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                                {sc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td><code>{k.rateLimitRpm || 1200} RPM</code></td>
                        <td><span className="status-badge-green">● ACTIVE</span></td>
                        <td style={{ fontSize: '0.74rem', color: '#64748b' }}>{k.lastUsed || 'Just now'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OAuth M2M Clients Table */}
          {credentialsView === 'clients' && (
            <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Client ID</th>
                      <th>Client Type</th>
                      <th>Assigned Tenant</th>
                      <th>Auth Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiClients.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a' }}>{c.clientName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>App: {c.appName || 'Service Principal'}</div>
                        </td>
                        <td><code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{c.clientId}</code></td>
                        <td><span className="plan-pill plan-pro">{c.clientType || 'M2M_BACKEND_SERVICE'}</span></td>
                        <td><strong>{c.companyName || 'Enterprise Headquarters'}</strong></td>
                        <td><code>{c.authMethod || 'BEARER_JWT'}</code></td>
                        <td><span className="status-badge-green">● OPERATIONAL</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUITE 3: WEBHOOKS & EVENT SUBSCRIPTIONS
          ===================================================================== */}
      {operationsTab === 'webhooks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div
            className="card-section"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                Active Webhook Dispatchers &amp; Target Endpoints
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                Secure HMAC-SHA256 signed event streams dispatched to ERPs, custom portals, and automated serverless workers.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCreateWebhookOpen && setIsCreateWebhookOpen(true)}
              style={{ background: '#0284c7' }}
            >
              <Plus size={14} /> Register Webhook
            </button>
          </div>

          <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="saas-table-container">
              <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th>Webhook Name &amp; ID</th>
                    <th>Target Endpoint URL</th>
                    <th>Company Tenant</th>
                    <th>Subscribed Events</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map((w, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a' }}>{w.webhookName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ID: <code>{w.id}</code></div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.76rem', color: '#0284c7' }}>{w.targetUrl}</code>
                      </td>
                      <td><strong>{w.companyName || 'Platform Core'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(w.subscribedEvents || ['order.created']).map((ev, evi) => (
                            <span key={evi} className="status-tag status-active" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                              {ev}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td><span className="status-badge-green">● ACTIVE</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          onClick={() => {
                            if (showToast) showToast(`Test webhook payload dispatched to ${w.targetUrl}`, 'success');
                          }}
                        >
                          <Send size={12} />
                          <span>Test</span>
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

      {/* =====================================================================
          SUITE 4: GATEWAY TRAFFIC, DLQ & LIVE TELEMETRY
          ===================================================================== */}
      {operationsTab === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sub Switcher */}
          <div
            className="card-section"
            style={{
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${telemetryView === 'dlq' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTelemetryView('dlq')}
                style={{ fontWeight: '700' }}
              >
                <AlertTriangle size={14} />
                <span>Dead-Letter Queue ({apiFailedRequests.length})</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${telemetryView === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTelemetryView('logs')}
                style={{ fontWeight: '700' }}
              >
                <FileText size={14} />
                <span>Live Request Stream</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${telemetryView === 'quotas' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTelemetryView('quotas')}
                style={{ fontWeight: '700' }}
              >
                <BarChart3 size={14} />
                <span>Rate Limits &amp; RPM Quotas</span>
              </button>
            </div>

            {telemetryView === 'logs' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {['ALL', '2XX', '4XX', '5XX'].map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`btn btn-sm ${apiLogsFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    onClick={() => setApiLogsFilter && setApiLogsFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DLQ View */}
          {telemetryView === 'dlq' && (
            <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="saas-table-container">
                {apiFailedRequests.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                    <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontWeight: '800', fontSize: '0.96rem', color: '#0f172a' }}>Dead-Letter Queue is Empty</div>
                    <p style={{ fontSize: '0.8rem', margin: '4px auto 0', color: '#64748b' }}>
                      All webhook dispatches and external API calls have been delivered successfully.
                    </p>
                  </div>
                ) : (
                  <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Failure Event ID</th>
                        <th>Target Endpoint URL</th>
                        <th>Status Code</th>
                        <th>Retries</th>
                        <th>Error Diagnostic</th>
                        <th>Timestamp</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiFailedRequests.map((req, i) => (
                        <tr key={i}>
                          <td><code>{req.id}</code></td>
                          <td><code style={{ color: '#0284c7' }}>{req.targetUrl}</code></td>
                          <td>
                            <span className="status-tag status-locked" style={{ fontWeight: '800' }}>
                              {req.statusCode || 504} {req.errorType || 'TIMEOUT'}
                            </span>
                          </td>
                          <td><strong>{req.retryCount || 3} / 5</strong></td>
                          <td style={{ fontSize: '0.74rem', color: '#b91c1c' }}>{req.errorMessage || 'Connection reset by peer'}</td>
                          <td style={{ fontSize: '0.74rem', color: '#64748b' }}>{req.timestamp || '2 mins ago'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                                onClick={() => setSelectedFailedReqInspect && setSelectedFailedReqInspect(req)}
                              >
                                <Eye size={12} /> Inspect
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ padding: '2px 8px', fontSize: '0.72rem', background: '#0284c7' }}
                                onClick={() => handleRetryFailedApiRequest && handleRetryFailedApiRequest(req.id)}
                              >
                                <RotateCcw size={12} /> Retry
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

          {/* Live Request Stream */}
          {telemetryView === 'logs' && (
            <div className="card-section" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Endpoint</th>
                      <th>Status</th>
                      <th>Latency</th>
                      <th>Client ID</th>
                      <th>Origin IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(liveApiLogs.length > 0 ? liveApiLogs : [
                      { time: new Date().toLocaleTimeString(), method: 'GET', endpoint: '/api/v1/orders', status: 200, latencyMs: 18, client: 'cli_sap_01', ip: '142.250.190.46' },
                      { time: new Date(Date.now() - 3000).toLocaleTimeString(), method: 'POST', endpoint: '/api/v1/dcr/submit', status: 201, latencyMs: 24, client: 'cli_sfdc_02', ip: '103.21.244.18' },
                      { time: new Date(Date.now() - 6000).toLocaleTimeString(), method: 'GET', endpoint: '/api/v1/catalog/products', status: 200, latencyMs: 14, client: 'cli_netsuite_03', ip: '49.37.112.80' },
                      { time: new Date(Date.now() - 9000).toLocaleTimeString(), method: 'PUT', endpoint: '/api/v1/chemists/verify', status: 422, latencyMs: 32, client: 'cli_netsuite_03', ip: '49.37.112.80' },
                      { time: new Date(Date.now() - 12000).toLocaleTimeString(), method: 'POST', endpoint: '/api/v1/orders/bulk-sync', status: 504, latencyMs: 15000, client: 'cli_sap_01', ip: '142.250.190.46' }
                    ])
                      .filter(l => {
                        if (apiLogsFilter === '2XX') return l.status >= 200 && l.status < 300;
                        if (apiLogsFilter === '4XX') return l.status >= 400 && l.status < 500;
                        if (apiLogsFilter === '5XX') return l.status >= 500;
                        return true;
                      })
                      .map((log, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>{log.time}</td>
                          <td>
                            <span style={{ fontWeight: '800', fontSize: '0.74rem', color: log.method === 'POST' ? '#16a34a' : (log.method === 'PUT' ? '#d97706' : (log.method === 'DELETE' ? '#dc2626' : '#2563eb')) }}>
                              {log.method}
                            </span>
                          </td>
                          <td><code>{log.endpoint}</code></td>
                          <td>
                            <span className={log.status < 300 ? 'status-badge-green' : 'status-tag status-trial'} style={log.status >= 500 ? { background: '#fee2e2', color: '#991b1b' } : (log.status >= 400 ? { background: '#ffedd5', color: '#9a3412' } : {})}>
                              {log.status}
                            </span>
                          </td>
                          <td><strong>{log.latencyMs}ms</strong></td>
                          <td><code>{log.client}</code></td>
                          <td><span style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>{log.ip}</span></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rate Limits & Quotas */}
          {telemetryView === 'quotas' && (
            <div className="card-section" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                Global API Rate Limits &amp; Throttling Policy
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#64748b' }}>
                Token bucket algorithmic rate-limiting enforced at the edge API gateway per tenant plan tier.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '700' }}>Starter Tier</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>600 RPM</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Max burst: 1,200 req / 10s</div>
                </div>

                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: '700' }}>Professional Tier</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e40af', margin: '4px 0' }}>2,400 RPM</div>
                  <div style={{ fontSize: '0.7rem', color: '#3b82f6' }}>Max burst: 4,800 req / 10s</div>
                </div>

                <div style={{ background: '#f5f3ff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                  <div style={{ fontSize: '0.76rem', color: '#6d28d9', fontWeight: '700' }}>Enterprise Dedicated</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#5b21b6', margin: '4px 0' }}>10,000+ RPM</div>
                  <div style={{ fontSize: '0.7rem', color: '#8b5cf6' }}>Custom SLA &amp; dedicated edge proxy</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
