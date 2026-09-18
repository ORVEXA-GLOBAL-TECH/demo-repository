import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  Globe2,
  Users,
  UserCog,
  CreditCard,
  CalendarClock,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Activity
} from 'lucide-react';

// Mock Multi-Tenant Enterprise Data for Super Admin
const INITIAL_METRICS = {
  totalCompanies: 148,
  activeCompanies: 126,
  suspendedCompanies: 8,
  trialCompanies: 11,
  expiredCompanies: 3,
  totalCountries: 24,
  totalUsers: 14850,
  totalCompanyAdmins: 1240,
  adminRoleBreakdown: {
    generalManagers: 290,
    operationsManagers: 310,
    fieldSupervisors: 380,
    financeAccountants: 260
  },
  activeSubscriptions: 137,
  expiringSubscriptions: 9,
  mrr: 486500,
  arr: 5838000,
  systemAlertsCount: 4
};

const INITIAL_ALERTS = [
  {
    id: 'alt-1',
    severity: 'CRITICAL',
    title: 'High Database Cluster Utilization',
    detail: 'PostgreSQL EU-Central Replica at 89% IOPS threshold. Scaling read-replicas recommended.',
    timestamp: '12 mins ago',
    source: 'Infrastructure Telemetry'
  },
  {
    id: 'alt-2',
    severity: 'WARNING',
    title: '9 Enterprise Subscriptions Expiring Soon',
    detail: 'Pfizer South Asia, Novartis APAC, and 7 other accounts expire within 30 days. Auto-renewal invoices generated.',
    timestamp: '45 mins ago',
    source: 'Billing & Subscriptions'
  },
  {
    id: 'alt-3',
    severity: 'WARNING',
    title: 'Compliance Audit Required (GCP-2026)',
    detail: 'SunHealth Corp added 140 new field reps in Mumbai zone without mandatory 2FA security enforcement.',
    timestamp: '2 hours ago',
    source: 'Security Policy Engine'
  },
  {
    id: 'alt-4',
    severity: 'INFO',
    title: 'Automated Daily Backup Complete',
    detail: '148 tenant databases backed up to Azure Geo-Redundant Vault (Total Size: 4.8 TB).',
    timestamp: '5 hours ago',
    source: 'Automated Backup Cron'
  }
];

const INITIAL_COMPANIES = [
  {
    id: 'cmp-01',
    name: 'Alleviare Life Sciences HQ',
    domain: 'alleviare.com',
    country: 'India (HQ)',
    region: 'South Asia',
    status: 'ACTIVE',
    plan: 'Enterprise Global Platinum',
    mrr: '$12,500',
    totalUsers: 1420,
    companyAdmins: 98,
    renewalDate: '2027-03-15',
    logoText: 'AL'
  },
  {
    id: 'cmp-02',
    name: 'Novartis APAC Healthcare',
    domain: 'novartis-apac.com',
    country: 'Singapore',
    region: 'Southeast Asia',
    status: 'ACTIVE',
    plan: 'Enterprise Platinum',
    mrr: '$18,400',
    totalUsers: 2850,
    companyAdmins: 145,
    renewalDate: '2026-10-12',
    renewalUrgent: true,
    logoText: 'NV'
  },
  {
    id: 'cmp-03',
    name: 'Cipla Bio Therapeutics',
    domain: 'ciplabio.com',
    country: 'India',
    region: 'South Asia',
    status: 'ACTIVE',
    plan: 'Enterprise Gold',
    mrr: '$8,200',
    totalUsers: 950,
    companyAdmins: 64,
    renewalDate: '2026-12-30',
    logoText: 'CB'
  },
  {
    id: 'cmp-04',
    name: 'Zydus Lifesciences Group',
    domain: 'zydusglobal.com',
    country: 'United Kingdom',
    region: 'Europe',
    status: 'TRIAL',
    plan: '30-Day Enterprise Trial',
    mrr: '$0 (Trial)',
    totalUsers: 180,
    companyAdmins: 14,
    renewalDate: '2026-10-01',
    logoText: 'ZL'
  },
  {
    id: 'cmp-05',
    name: 'Pfizer South Asia Division',
    domain: 'pfizer-sa.com',
    country: 'India / Sri Lanka',
    region: 'South Asia',
    status: 'ACTIVE',
    plan: 'Enterprise Global Platinum',
    mrr: '$22,000',
    totalUsers: 3400,
    companyAdmins: 210,
    renewalDate: '2026-10-08',
    renewalUrgent: true,
    logoText: 'PF'
  },
  {
    id: 'cmp-06',
    name: 'SunHealth Pharma Corp',
    domain: 'sunhealthcorp.com',
    country: 'United States',
    region: 'North America',
    status: 'SUSPENDED',
    plan: 'Standard Tier',
    mrr: '$4,500 (Paused)',
    totalUsers: 420,
    companyAdmins: 28,
    renewalDate: '2026-08-15',
    logoText: 'SH'
  },
  {
    id: 'cmp-07',
    name: 'Medicon Bio Labs',
    domain: 'mediconbiolabs.com',
    country: 'Germany',
    region: 'Europe',
    status: 'TRIAL',
    plan: '30-Day Enterprise Trial',
    mrr: '$0 (Trial)',
    totalUsers: 75,
    companyAdmins: 8,
    renewalDate: '2026-09-29',
    logoText: 'MB'
  },
  {
    id: 'cmp-08',
    name: 'BioGenix Specialty Drugs',
    domain: 'biogenixpharma.com',
    country: 'Australia',
    region: 'Oceania',
    status: 'EXPIRED',
    plan: 'Enterprise Standard',
    mrr: '$0 (Expired)',
    totalUsers: 310,
    companyAdmins: 22,
    renewalDate: '2026-07-20',
    logoText: 'BG'
  }
];

export default function SuperAdminDashboard() {
  const [metrics] = useState(INITIAL_METRICS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [companies] = useState(INITIAL_COMPANIES);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const filteredCompanies = companies.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  const dismissAlert = (id) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="status-pill status-active"><CheckCircle2 size={12} /> Active</span>;
      case 'TRIAL':
        return <span className="status-pill status-trial"><Clock size={12} /> 30-Day Trial</span>;
      case 'SUSPENDED':
        return <span className="status-pill status-suspended"><PauseCircle size={12} /> Suspended</span>;
      case 'EXPIRED':
        return <span className="status-pill status-expired"><XCircle size={12} /> Expired</span>;
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  return (
    <div className="superadmin-dashboard-root">
      {/* Header Banner */}
      <div className="sa-command-banner">
        <div className="sa-banner-content">
          <div className="sa-badge-row">
            <span className="sa-crown-badge">
              <Sparkles size={13} /> Tier-0 Global Command Center
            </span>
            <span className="sa-cluster-status">
              <Activity size={13} color="#10b981" /> 148 Tenants Multi-Region Mesh: Healthy
            </span>
          </div>
          <h1 className="sa-banner-title">Super Admin Master Operations</h1>
          <p className="sa-banner-subtitle">
            Global multi-tenant lifecycle control, subscription economics, infrastructure telemetry, and enterprise admin monitoring.
          </p>
        </div>

        <div className="sa-banner-actions">
          <div className="mrr-quick-stat">
            <div className="stat-mini-label">Monthly Recurring Revenue</div>
            <div className="stat-highlight-val">{formatCurrency(metrics.mrr)}</div>
            <div className="stat-growth-tag">
              <ArrowUpRight size={13} /> +14.2% YoY
            </div>
          </div>
          <div className="arr-quick-stat">
            <div className="stat-mini-label">Annual Run-Rate (ARR)</div>
            <div className="stat-highlight-val">{formatCurrency(metrics.arr)}</div>
            <div className="stat-sub-note">137 Active SaaS Subscriptions</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          METRICS GRID (ALL 13 REQUIRED METRICS)
          ========================================================================= */}

      {/* ROW 1: COMPANY LIFECYCLE METRICS (1-5) */}
      <div className="section-label-bar">
        <span>1. Company Lifecycle Management</span>
        <span className="badge-count">Total: {metrics.totalCompanies} Enterprises</span>
      </div>

      <div className="metrics-grid-5">
        {/* Metric 1: Total Companies */}
        <div className="metric-card metric-primary">
          <div className="metric-header">
            <span className="metric-title">Total Companies</span>
            <div className="metric-icon-box bg-blue">
              <Building2 size={20} />
            </div>
          </div>
          <div className="metric-val">{metrics.totalCompanies}</div>
          <div className="metric-sub">
            <span>Global pharmaceutical enterprises enrolled</span>
          </div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: '100%', background: '#2563eb' }} />
          </div>
        </div>

        {/* Metric 2: Active Companies */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Companies</span>
            <div className="metric-icon-box bg-green">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-val text-green">{metrics.activeCompanies}</div>
          <div className="metric-sub">
            <span>85.1% of global tenant portfolio</span>
          </div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: `${(metrics.activeCompanies / metrics.totalCompanies) * 100}%`, background: '#10b981' }} />
          </div>
        </div>

        {/* Metric 3: Suspended Companies */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Suspended Companies</span>
            <div className="metric-icon-box bg-amber">
              <PauseCircle size={20} />
            </div>
          </div>
          <div className="metric-val text-amber">{metrics.suspendedCompanies}</div>
          <div className="metric-sub">
            <span>Non-compliance / billing hold</span>
          </div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: `${(metrics.suspendedCompanies / metrics.totalCompanies) * 100}%`, background: '#f59e0b' }} />
          </div>
        </div>

        {/* Metric 4: Trial Companies */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Trial Companies</span>
            <div className="metric-icon-box bg-purple">
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-val text-purple">{metrics.trialCompanies}</div>
          <div className="metric-sub">
            <span>30-Day enterprise POC evaluations</span>
          </div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: `${(metrics.trialCompanies / metrics.totalCompanies) * 100}%`, background: '#8b5cf6' }} />
          </div>
        </div>

        {/* Metric 5: Expired Companies */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expired Companies</span>
            <div className="metric-icon-box bg-rose">
              <XCircle size={20} />
            </div>
          </div>
          <div className="metric-val text-rose">{metrics.expiredCompanies}</div>
          <div className="metric-sub">
            <span>License lapsed without renewal</span>
          </div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: `${(metrics.expiredCompanies / metrics.totalCompanies) * 100}%`, background: '#ef4444' }} />
          </div>
        </div>
      </div>

      {/* ROW 2: GLOBAL SCALE, USERS & COMPANY ADMINS (6, 7, 8) */}
      <div className="section-label-bar" style={{ marginTop: '24px' }}>
        <span>2. Global Reach, Seat Utilization &amp; Company Admins</span>
      </div>

      <div className="metrics-grid-3">
        {/* Metric 6: Total Countries */}
        <div className="metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-title">Total Countries</span>
              <p className="metric-caption">Global sovereign regulatory jurisdictions</p>
            </div>
            <div className="metric-icon-box bg-cyan">
              <Globe2 size={22} />
            </div>
          </div>
          <div className="metric-val">{metrics.totalCountries}</div>
          <div className="countries-pill-row">
            <span className="badge-country">🇮🇳 India</span>
            <span className="badge-country">🇸🇬 Singapore</span>
            <span className="badge-country">🇬🇧 UK</span>
            <span className="badge-country">🇺🇸 USA</span>
            <span className="badge-country">🇩🇪 Germany</span>
            <span className="badge-country">+19 More</span>
          </div>
        </div>

        {/* Metric 7: Total Users */}
        <div className="metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-title">Total Users (Global Seats)</span>
              <p className="metric-caption">Active enterprise user credentials across tenants</p>
            </div>
            <div className="metric-icon-box bg-blue">
              <Users size={22} />
            </div>
          </div>
          <div className="metric-val">{metrics.totalUsers.toLocaleString()}</div>
          <div className="metric-sub">
            <span className="text-green font-bold">● 13,890 Active This Month</span>
            <span> &bull; 93.5% Engagement Rate</span>
          </div>
        </div>

        {/* Metric 8: Total Company Admins & Staff Hierarchy */}
        <div className="metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-title">Total Company Admins &amp; Staff</span>
              <p className="metric-caption">Total users across companies managing operations</p>
            </div>
            <div className="metric-icon-box bg-indigo">
              <UserCog size={22} />
            </div>
          </div>
          <div className="metric-val">{metrics.totalCompanyAdmins.toLocaleString()}</div>
          <div className="role-breakdown-tags">
            <span className="role-chip">👔 GMs: <strong>{metrics.adminRoleBreakdown.generalManagers}</strong></span>
            <span className="role-chip">💼 Managers: <strong>{metrics.adminRoleBreakdown.operationsManagers}</strong></span>
            <span className="role-chip">📋 Supervisors: <strong>{metrics.adminRoleBreakdown.fieldSupervisors}</strong></span>
            <span className="role-chip">💰 Accountants: <strong>{metrics.adminRoleBreakdown.financeAccountants}</strong></span>
          </div>
        </div>
      </div>

      {/* ROW 3: SUBSCRIPTIONS & REVENUE (9, 10, 11, 12) */}
      <div className="section-label-bar" style={{ marginTop: '24px' }}>
        <span>3. Subscription Economics &amp; Recurring Revenue</span>
      </div>

      <div className="metrics-grid-4">
        {/* Metric 9: Active Subscriptions */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Subscriptions</span>
            <div className="metric-icon-box bg-green">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="metric-val text-green">{metrics.activeSubscriptions}</div>
          <div className="metric-sub">
            <span>Active licensed tenant contracts</span>
          </div>
        </div>

        {/* Metric 10: Expiring Subscriptions */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expiring Subscriptions</span>
            <div className="metric-icon-box bg-amber">
              <CalendarClock size={20} />
            </div>
          </div>
          <div className="metric-val text-amber">{metrics.expiringSubscriptions}</div>
          <div className="metric-sub">
            <span className="text-amber font-bold">&le; 30 Days remaining</span>
          </div>
        </div>

        {/* Metric 11: Monthly Recurring Revenue (MRR) */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Monthly Recurring Revenue</span>
            <div className="metric-icon-box bg-blue">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="metric-val text-blue">{formatCurrency(metrics.mrr)}</div>
          <div className="metric-sub">
            <span>Current MRR run rate</span>
          </div>
        </div>

        {/* Metric 12: Annual Recurring Revenue (ARR) */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Annual Recurring Revenue</span>
            <div className="metric-icon-box bg-purple">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-val text-purple">{formatCurrency(metrics.arr)}</div>
          <div className="metric-sub">
            <span>Projected annualized contract value</span>
          </div>
        </div>
      </div>

      {/* ROW 4: SYSTEM ALERTS (METRIC 13) */}
      <div className="section-label-bar" style={{ marginTop: '24px' }}>
        <span>4. Real-Time System &amp; Compliance Alerts</span>
        <span className="badge-alert-count">
          <ShieldAlert size={14} /> {activeAlerts.length} Active Alerts
        </span>
      </div>

      <div className="system-alerts-card">
        <div className="alerts-card-header">
          <div className="alerts-title-group">
            <Bell size={20} color="#f59e0b" />
            <div>
              <h3 className="alerts-heading">Central Alert Center (Metric #13)</h3>
              <p className="alerts-sub">Security policies, database thresholds, and expiring licenses</p>
            </div>
          </div>
          <div className="alerts-filter-pills">
            <span className="alert-count-tag critical">1 Critical</span>
            <span className="alert-count-tag warning">2 Warning</span>
            <span className="alert-count-tag info">1 Info</span>
          </div>
        </div>

        <div className="alerts-list">
          {activeAlerts.length === 0 ? (
            <div className="no-alerts-placeholder">
              <CheckCircle2 size={32} color="#10b981" />
              <p>All system alerts have been acknowledged. System is nominal.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className={`alert-row severity-${alert.severity.toLowerCase()}`}>
                <div className="alert-severity-indicator">
                  {alert.severity === 'CRITICAL' ? (
                    <AlertTriangle size={18} color="#ef4444" />
                  ) : alert.severity === 'WARNING' ? (
                    <ShieldAlert size={18} color="#f59e0b" />
                  ) : (
                    <Server size={18} color="#3b82f6" />
                  )}
                </div>
                <div className="alert-body">
                  <div className="alert-title-row">
                    <span className="alert-title-text">{alert.title}</span>
                    <span className="alert-badge">{alert.severity}</span>
                    <span className="alert-timestamp">{alert.timestamp}</span>
                  </div>
                  <div className="alert-detail-text">{alert.detail}</div>
                  <div className="alert-source-tag">Source: {alert.source}</div>
                </div>
                <div className="alert-actions">
                  <button
                    type="button"
                    className="alert-dismiss-btn"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================================================
          MULTI-TENANT COMPANIES MANAGEMENT DIRECTORY
          ========================================================================= */}
      <div className="section-label-bar" style={{ marginTop: '28px' }}>
        <span>5. Multi-Tenant Enterprise Company Directory</span>
        <span className="badge-count">Showing {filteredCompanies.length} Companies</span>
      </div>

      <div className="companies-table-wrapper">
        <div className="table-controls-bar">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search companies by name, domain, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="companies-search-input"
            />
          </div>

          <div className="filter-pill-group">
            <span className="filter-label"><Filter size={14} /> Filter Status:</span>
            {['ALL', 'ACTIVE', 'TRIAL', 'SUSPENDED', 'EXPIRED'].map((s) => (
              <button
                key={s}
                type="button"
                className={`table-filter-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All (148)' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="companies-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Country / Region</th>
                <th>Status</th>
                <th>Tier / Plan</th>
                <th>Total Users</th>
                <th>Company Admins</th>
                <th>MRR</th>
                <th>Renewal Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="company-name-cell">
                      <div className="company-avatar-box">{c.logoText}</div>
                      <div>
                        <div className="company-full-name">{c.name}</div>
                        <div className="company-domain">{c.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="country-cell">
                      <span>{c.country}</span>
                      <span className="region-sub">{c.region}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td>
                    <span className="plan-tag">{c.plan}</span>
                  </td>
                  <td>
                    <strong>{c.totalUsers.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className="admins-tag">
                      <UserCog size={13} /> {c.companyAdmins} Admins
                    </span>
                  </td>
                  <td>
                    <span className="mrr-cell">{c.mrr}</span>
                  </td>
                  <td>
                    <div className="renewal-cell">
                      <span className={c.renewalUrgent ? 'text-amber font-bold' : ''}>
                        {c.renewalDate}
                      </span>
                      {c.renewalUrgent && <span className="expiring-badge">Expiring Soon</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="manage-company-btn"
                      onClick={() => alert(`Opening Master Governance console for ${c.name}`)}
                    >
                      <span>Manage</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
