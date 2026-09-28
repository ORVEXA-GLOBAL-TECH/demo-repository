import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2, Users, DollarSign, Database, Activity, AlertTriangle,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download, Calendar,
  Shield, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock,
  FileText, ExternalLink, ChevronRight, Sparkles, Filter, Search,
  Radio, HardDrive, Bell, Ban, Lock, Server, Cpu, Layers, UserPlus,
  Send, Megaphone, Smartphone, HelpCircle, LifeBuoy, ArrowRight,
  TrendingUp, BarChart3, Check
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

// Mini SVG Sparkline component for KPI cards
const MiniSparkline = ({ color = '#3b82f6', d = 'M 2 13 Q 12 11, 20 13 T 34 7 T 44 3' }) => (
  <svg width="46" height="18" viewBox="0 0 46 18" style={{ overflow: 'visible', flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DashboardTab() {
  const ctx = useDashboard();
  const {
    companies = [],
    admins = [],
    platformUsers = [],
    plans = [],
    invoices = [],
    systemAlerts = [],
    recentActivities = [],
    supportTickets = [],
    showToast,
    setActiveTab,
    setIsCreateCompanyOpen,
    setIsCreateUserOpen,
    setIsCreatePlanOpen,
    setIsAnnouncementModalOpen,
    loadAllData
  } = ctx || {};

  // Timeframe filter state ('7D' | '30D' | '90D' | '1Y')
  const [timeframe, setTimeframe] = useState('30D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartHoverIndex, setChartHoverIndex] = useState(null);
  const [dateRangeText, setDateRangeText] = useState('01 Aug 2026 - 25 Sep 2026');
  const [lastUpdatedSec, setLastUpdatedSec] = useState(20);

  // Auto-increment last updated seconds counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSec(prev => (prev >= 60 ? 5 : prev + 5));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLastUpdatedSec(0);
    if (loadAllData) {
      try { await loadAllData(); } catch (e) { /* ignore */ }
    }
    setTimeout(() => {
      setIsRefreshing(false);
      showToast && showToast('Platform command telemetry synchronized', 'success');
    }, 600);
  };

  // Export command centre summary
  const handleExportSummary = () => {
    const summaryData = {
      timestamp: new Date().toISOString(),
      platform: 'Orvexa Super Admin Command Centre',
      totalTenants: companies.length || 24,
      totalUsers: platformUsers.length || 1284,
      mrrUsd: 184600,
      arrUsd: 2210000,
      uptime: '99.98%',
      storageTB: 8.7,
      securityAlerts: 7,
      supportTickets: 12
    };
    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `command_centre_intelligence_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast && showToast('Exported platform command intelligence dossier', 'success');
  };

  // KPI Calculations
  const totalTenantsCount = companies.length || 24;
  const activeTenantsCount = companies.filter(c => (c.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length || 18;
  const trialTenantsCount = companies.filter(c => (c.status || '').toUpperCase() === 'TRIAL' || (c.plan || '').includes('TRIAL')).length || 4;
  const suspendedTenantsCount = companies.filter(c => ['SUSPENDED', 'DEACTIVATED', 'INACTIVE'].includes((c.status || '').toUpperCase())).length || 2;

  const totalUsersCount = platformUsers.length > 50 ? platformUsers.length : 1284;
  const mrUsersCount = platformUsers.length > 50 ? platformUsers.filter(u => u.role && (u.role.includes('MR') || u.role.includes('REP'))).length : 1041;
  const adminUsersCount = admins.length > 20 ? admins.length : 86;
  const otherUsersCount = Math.max(0, totalUsersCount - mrUsersCount - adminUsersCount) || 157;

  // Chart Data: 13-14 months of MRR and Tenant Growth (matches image)
  const chartData = useMemo(() => {
    if (timeframe === '7D') {
      return [
        { month: 'Mon', mrr: 178, tenants: 22 },
        { month: 'Tue', mrr: 179, tenants: 23 },
        { month: 'Wed', mrr: 181, tenants: 23 },
        { month: 'Thu', mrr: 182, tenants: 24 },
        { month: 'Fri', mrr: 183, tenants: 24 },
        { month: 'Sat', mrr: 184, tenants: 24 },
        { month: 'Sun', mrr: 184.6, tenants: 24 }
      ];
    }
    if (timeframe === '90D') {
      return [
        { month: 'Jun 2026', mrr: 154, tenants: 18 },
        { month: 'Jul 2026', mrr: 165, tenants: 20 },
        { month: 'Aug 2026', mrr: 176, tenants: 22 },
        { month: 'Sep 2026', mrr: 184.6, tenants: 24 }
      ];
    }
    if (timeframe === '1Y') {
      return [
        { month: 'Q4 2025', mrr: 88, tenants: 12 },
        { month: 'Q1 2026', mrr: 124, tenants: 16 },
        { month: 'Q2 2026', mrr: 155, tenants: 20 },
        { month: 'Q3 2026', mrr: 184.6, tenants: 24 }
      ];
    }
    // Default 30D / 13-month curve matching screenshot exactly
    return [
      { month: 'Aug 2025', mrr: 75, tenants: 12 },
      { month: 'Sep 2025', mrr: 88, tenants: 14 },
      { month: 'Oct 2025', mrr: 104, tenants: 16 },
      { month: 'Nov 2025', mrr: 118, tenants: 18 },
      { month: 'Dec 2025', mrr: 132, tenants: 20 },
      { month: 'Jan 2026', mrr: 144, tenants: 21 },
      { month: 'Feb 2026', mrr: 152, tenants: 22 },
      { month: 'Mar 2026', mrr: 160, tenants: 23 },
      { month: 'Apr 2026', mrr: 168, tenants: 24 },
      { month: 'May 2026', mrr: 174, tenants: 25 },
      { month: 'Jun 2026', mrr: 182, tenants: 26 },
      { month: 'Aug 2026', mrr: 202, tenants: 28 },
      { month: 'Sep 2026', mrr: 235, tenants: 34 }
    ];
  }, [timeframe]);

  // Tenant Health Matrix rows (exact match to target screenshot)
  const tenantHealthRows = useMemo(() => {
    return [
      {
        id: 'c-novartis',
        name: 'Novartis Pharma Global',
        plan: 'Enterprise',
        health: 'Healthy',
        healthColor: '#16a34a',
        users: 312,
        mrr: '$48,200',
        activityPercent: 92,
        renewal: '12 Jan 2027',
        risk: 'Low',
        riskColor: '#16a34a',
        logoText: '🔴'
      },
      {
        id: 'c-pfizer',
        name: 'Pfizer BioPharma',
        plan: 'Pro',
        health: 'Healthy',
        healthColor: '#16a34a',
        users: 198,
        mrr: '$32,450',
        activityPercent: 74,
        renewal: '03 Feb 2027',
        risk: 'Low',
        riskColor: '#16a34a',
        logoText: '🔵'
      },
      {
        id: 'c-astrazeneca',
        name: 'AstraZeneca Healthcare',
        plan: 'Business',
        health: 'Attention',
        healthColor: '#d97706',
        users: 164,
        mrr: '$28,760',
        activityPercent: 68,
        renewal: '18 Dec 2026',
        risk: 'Medium',
        riskColor: '#d97706',
        logoText: '🟡'
      },
      {
        id: 'c-roche',
        name: 'Roche Pharma',
        plan: 'Enterprise',
        health: 'Healthy',
        healthColor: '#16a34a',
        users: 142,
        mrr: '$25,310',
        activityPercent: 62,
        renewal: '27 Jan 2027',
        risk: 'Low',
        riskColor: '#16a34a',
        logoText: '🔷'
      },
      {
        id: 'c-sanofi',
        name: 'Sanofi Global',
        plan: 'Pro',
        health: 'At Risk',
        healthColor: '#dc2626',
        users: 96,
        mrr: '$18,420',
        activityPercent: 42,
        renewal: '09 Nov 2026',
        risk: 'High',
        riskColor: '#dc2626',
        logoText: '🟣'
      }
    ];
  }, []);

  // Real-Time Global Activity Stream (exact match to target screenshot)
  const activityStreamRows = [
    { time: '14:31', event: 'Company provisioned', actor: 'superadmin', tenant: 'Novartis Pharma Global', severity: 'Info', color: '#2563eb' },
    { time: '14:27', event: 'Subscription upgraded', actor: 'company_admin', tenant: 'Pfizer BioPharma', severity: 'Success', color: '#16a34a' },
    { time: '14:22', event: 'Role permission changed', actor: 'superadmin', tenant: 'AstraZeneca Healthcare', severity: 'Warning', color: '#d97706' },
    { time: '14:18', event: 'Platform setting updated', actor: 'superadmin', tenant: 'Global', severity: 'Info', color: '#2563eb' },
    { time: '14:12', event: 'Feature-flag enabled', actor: 'superadmin', tenant: 'Roche Pharma', severity: 'Info', color: '#2563eb' },
    { time: '14:05', event: 'App version released', actor: 'devops', tenant: 'Global', severity: 'Info', color: '#2563eb' },
    { time: '13:58', event: 'Audit log accessed', actor: 'auditor', tenant: 'Sanofi Global', severity: 'Info', color: '#2563eb' }
  ];

  // Support Command Queue (exact match to target screenshot)
  const supportQueueRows = [
    { id: '#TK-4821', title: 'Login issue for MR', tenant: 'Pfizer', priority: 'High', priorityColor: '#fee2e2', priorityTextColor: '#b91c1c', age: '2h' },
    { id: '#TK-4817', title: 'Subscription not active', tenant: 'Roche', priority: 'Medium', priorityColor: '#fef3c7', priorityTextColor: '#b45309', age: '5h' },
    { id: '#TK-4809', title: 'Data export failure', tenant: 'AstraZeneca', priority: 'High', priorityColor: '#fee2e2', priorityTextColor: '#b91c1c', age: '7h' },
    { id: '#TK-4793', title: 'Feature request', tenant: 'Sanofi', priority: 'Low', priorityColor: '#dcfce7', priorityTextColor: '#166534', age: '11h' }
  ];

  // SVG Chart computation helper
  const svgWidth = 620;
  const svgHeight = 220;
  const paddingLeft = 52;
  const paddingRight = 40;
  const paddingTop = 22;
  const paddingBottom = 34;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const maxMrr = 250;
  const maxTenants = 40;

  const pointsMrr = chartData.map((d, i) => {
    const x = paddingLeft + (i / (chartData.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight - (d.mrr / maxMrr) * plotHeight;
    return { x, y, ...d };
  });

  const pointsTenants = chartData.map((d, i) => {
    const x = paddingLeft + (i / (chartData.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight - (d.tenants / maxTenants) * plotHeight;
    return { x, y, ...d };
  });

  const mrrPathD = pointsMrr.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsMrr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const tenantsPathD = pointsTenants.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsTenants[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const mrrAreaD = `${mrrPathD} L ${pointsMrr[pointsMrr.length - 1].x} ${paddingTop + plotHeight} L ${pointsMrr[0].x} ${paddingTop + plotHeight} Z`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      color: '#0f172a'
    }}>
      
      {/* ── Title Banner with Date Range & Controls ───────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '2px 0 4px 0'
      }}>
        {/* Left: Shield & Heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
            flexShrink: 0
          }}>
            <Shield size={22} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}>
              Platform Command Centre
            </h1>
            <p style={{
              fontSize: '0.8rem',
              color: '#64748b',
              margin: '2px 0 0 0',
              fontWeight: '500'
            }}>
              Global operational, commercial, security and tenant intelligence
            </p>
          </div>
        </div>

        {/* Right: Date Picker, Timeframe segmented control, Refresh & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Date Picker Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#334155',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}>
            <Calendar size={14} color="#64748b" />
            <span>{dateRangeText}</span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>▼</span>
          </div>

          {/* Timeframe Selector Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            {['7D', '30D', '90D', '1Y'].map(tf => {
              const isActive = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    setTimeframe(tf);
                    if (tf === '7D') setDateRangeText('19 Sep 2026 - 25 Sep 2026');
                    if (tf === '30D') setDateRangeText('01 Aug 2026 - 25 Sep 2026');
                    if (tf === '90D') setDateRangeText('01 Jul 2026 - 25 Sep 2026');
                    if (tf === '1Y') setDateRangeText('01 Oct 2025 - 25 Sep 2026');
                  }}
                  style={{
                    border: 'none',
                    padding: '5px 11px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: isActive ? '700' : '600',
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#2563eb' : '#64748b',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tf}
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportSummary}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── ROW 1: 6 Top Executive KPI Cards (Exact match to target image) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: '10px',
        alignItems: 'stretch',
        width: '100%'
      }}>
        
        {/* Card 1: Active Companies / Tenants */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.74rem', fontWeight: '700' }}>
              <Building2 size={14} color="#64748b" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Active Companies / Tenants</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  {totalTenantsCount}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 4px',
                  borderRadius: '8px',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  marginTop: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  <ArrowUpRight size={10} />
                  <span>+8.6%</span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '500' }}>vs. 30d</span>
                </div>
              </div>

              {/* Mini Sparkline Curve */}
              <MiniSparkline color="#3b82f6" d="M 2 13 Q 12 11, 20 13 T 34 7 T 44 3" />
            </div>

            {/* Tri-Color Segmented Progress Bar */}
            <div style={{
              display: 'flex',
              height: '4px',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '8px',
              gap: '2px'
            }}>
              <div style={{ flex: activeTenantsCount, background: '#10b981', borderRadius: '1px' }} title="Active" />
              <div style={{ flex: trialTenantsCount, background: '#f59e0b', borderRadius: '1px' }} title="Trial" />
              <div style={{ flex: suspendedTenantsCount, background: '#ef4444', borderRadius: '1px' }} title="Suspended" />
            </div>
          </div>

          {/* Breakdown Legend */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.64rem',
            fontWeight: '600',
            marginTop: '7px',
            color: '#64748b',
            whiteSpace: 'nowrap'
          }}>
            <span><strong style={{ color: '#166534' }}>● {activeTenantsCount}</strong> Active</span>
            <span><strong style={{ color: '#b45309' }}>● {trialTenantsCount}</strong> Trial</span>
            <span><strong style={{ color: '#991b1b' }}>● {suspendedTenantsCount}</strong> Susp</span>
          </div>
        </div>

        {/* Card 2: Platform Users */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.74rem', fontWeight: '700' }}>
              <Users size={14} color="#6366f1" style={{ flexShrink: 0 }} />
              <span>Platform Users</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  {totalUsersCount.toLocaleString()}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 4px',
                  borderRadius: '8px',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  marginTop: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  <ArrowUpRight size={10} />
                  <span>+11.3%</span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '500' }}>vs. 30d</span>
                </div>
              </div>

              {/* Mini Sparkline Curve */}
              <MiniSparkline color="#6366f1" d="M 2 14 Q 12 11, 20 9 T 34 5 T 44 2" />
            </div>
          </div>

          {/* Breakdown with Mini Indicator Bars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '6px',
            marginTop: '6px'
          }}>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>MRs</span>
              <strong style={{ fontSize: '0.74rem', color: '#0f172a' }}>{mrUsersCount.toLocaleString()}</strong>
              <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
                <div style={{ width: '81%', height: '100%', background: '#3b82f6' }} />
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>Admins</span>
              <strong style={{ fontSize: '0.74rem', color: '#0f172a' }}>{adminUsersCount}</strong>
              <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
                <div style={{ width: '7%', height: '100%', background: '#f59e0b' }} />
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>Others</span>
              <strong style={{ fontSize: '0.74rem', color: '#0f172a' }}>{otherUsersCount}</strong>
              <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', background: '#94a3b8' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Subscription MRR */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.74rem', fontWeight: '700' }}>
              <DollarSign size={14} color="#0284c7" style={{ flexShrink: 0 }} />
              <span>Subscription MRR</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  $184.6K
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 4px',
                  borderRadius: '8px',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  marginTop: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  <ArrowUpRight size={10} />
                  <span>+12.4%</span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '500' }}>vs. 30d</span>
                </div>
              </div>

              {/* Mini Sparkline Curve */}
              <MiniSparkline color="#0284c7" d="M 2 13 Q 13 11, 22 12 T 34 5 T 44 1" />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '6px',
            marginTop: '6px'
          }}>
            <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>ARR</span>
            <strong style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.02rem' }}>$2.21M</strong>
          </div>
        </div>

        {/* Card 4: Storage & Multi-Tenancy */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.74rem', fontWeight: '700' }}>
              <Database size={14} color="#8b5cf6" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Storage &amp; Multi-Tenancy</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  8.7 TB
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600', marginTop: '3px' }}>
                  68% used
                </div>
              </div>

              {/* Mini Sparkline Curve */}
              <MiniSparkline color="#8b5cf6" d="M 2 14 Q 12 12, 22 11 T 34 6 T 44 3" />
            </div>

            {/* Storage Bar */}
            <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.66rem', color: '#475569', marginTop: '6px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            24 tenant databases / partitions
          </div>
        </div>

        {/* Card 5: Platform Health */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.74rem', fontWeight: '700' }}>
              <Activity size={14} color="#10b981" style={{ flexShrink: 0 }} />
              <span>Platform Health</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  99.98%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600', marginTop: '3px' }}>
                  Uptime
                </div>
              </div>

              {/* Mini Sparkline Curve */}
              <MiniSparkline color="#10b981" d="M 2 12 Q 13 10, 22 12 T 34 5 T 44 2" />
            </div>

            {/* Latencies */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.68rem', color: '#475569' }}>
              <span>API <strong style={{ color: '#0f172a' }}>142ms</strong></span>
              <span>DB <strong style={{ color: '#0f172a' }}>38ms</strong></span>
            </div>
          </div>

          <div style={{ fontSize: '0.66rem', color: '#16a34a', marginTop: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            ● All systems operational
          </div>
        </div>

        {/* Card 6: Risk & Attention */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '136px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '0.74rem', fontWeight: '700' }}>
              <AlertTriangle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>Risk &amp; Attention</span>
            </div>

            {/* Dual Red & Amber stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#dc2626', lineHeight: 1 }}>7</div>
                <div style={{ fontSize: '0.64rem', color: '#dc2626', fontWeight: '600', marginTop: '3px', whiteSpace: 'nowrap' }}>Security alerts</div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#d97706', lineHeight: 1 }}>12</div>
                <div style={{ fontSize: '0.64rem', color: '#d97706', fontWeight: '600', marginTop: '3px', whiteSpace: 'nowrap' }}>Support tickets</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', fontWeight: '700', marginTop: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#dc2626' }}>● 5 Failed jobs</span>
            <span style={{ color: '#d97706' }}>● 3 Expiring subs</span>
          </div>
        </div>

      </div>

      {/* ── ROW 2: MRR & Tenant Growth Chart + Tenant Health Matrix ───────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '14px',
        alignItems: 'stretch'
      }}>
        
        {/* Left: MRR & Tenant Growth Chart */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={17} color="#2563eb" />
              <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                MRR &amp; Tenant Growth
              </h3>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                <span>MRR (USD)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
                <span>Total Tenants</span>
              </div>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div style={{ width: '100%', position: 'relative' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '220px', overflow: 'visible', display: 'block' }}>
              <defs>
                <linearGradient id="mrrGradExact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines & Left Y-Axis */}
              {[0, 50, 100, 150, 200, 250].map(val => {
                const y = paddingTop + plotHeight - (val / maxMrr) * plotHeight;
                return (
                  <g key={val}>
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                      ${val}K
                    </text>
                  </g>
                );
              })}

              {/* Right Y-Axis: Tenants (0 to 40) */}
              {[0, 8, 16, 24, 32, 40].map(val => {
                const y = paddingTop + plotHeight - (val / maxTenants) * plotHeight;
                return (
                  <text key={val} x={svgWidth - paddingRight + 8} y={y + 3} textAnchor="start" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                    {val}
                  </text>
                );
              })}

              {/* X Axis Month Labels */}
              {chartData.map((d, i) => {
                const x = paddingLeft + (i / (chartData.length - 1)) * plotWidth;
                return (
                  <text key={i} x={x} y={svgHeight - 10} textAnchor="middle" fontSize="8.2" fill="#94a3b8" fontWeight="500">
                    {d.month}
                  </text>
                );
              })}

              {/* Area under MRR */}
              <path d={mrrAreaD} fill="url(#mrrGradExact)" />

              {/* MRR Line (Blue) */}
              <path d={mrrPathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

              {/* Tenants Line (Purple) */}
              <path d={tenantsPathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

              {/* MRR Data Points */}
              {pointsMrr.map((p, idx) => (
                <circle
                  key={`m-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setChartHoverIndex(idx)}
                  onMouseLeave={() => setChartHoverIndex(null)}
                />
              ))}

              {/* Tenants Data Points */}
              {pointsTenants.map((p, idx) => (
                <circle
                  key={`t-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setChartHoverIndex(idx)}
                  onMouseLeave={() => setChartHoverIndex(null)}
                />
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {chartHoverIndex !== null && chartData[chartHoverIndex] && (
              <div style={{
                position: 'absolute',
                top: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0f172a',
                color: '#fff',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: '600',
                pointerEvents: 'none',
                display: 'flex',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <span>{chartData[chartHoverIndex].month}</span>
                <span style={{ color: '#60a5fa' }}>MRR: ${chartData[chartHoverIndex].mrr}K</span>
                <span style={{ color: '#c084fc' }}>Tenants: {chartData[chartHoverIndex].tenants}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tenant Health Matrix */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={17} color="#2563eb" />
                <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Tenant Health Matrix
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Last updated {lastUpdatedSec} sec ago 🔄
              </span>
            </div>

            {/* Matrix Table with fixed column widths and clean alignment */}
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.74rem',
                tableLayout: 'fixed'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '25%' }}>Company</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '12%' }}>Plan</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '13%' }}>Health</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '11%' }}>Users</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '11%' }}>MRR</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '11%' }}>Activity</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '12%' }}>Renewal</th>
                    <th style={{ padding: '6px 6px', fontWeight: '700', color: '#64748b', width: '5%' }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantHealthRows.map((t) => (
                    <tr
                      key={t.id}
                      style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', height: '38px' }}
                      onClick={() => setActiveTab && setActiveTab('companies')}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8faff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '7px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.78rem' }}>{t.logoText}</span>
                          <strong style={{ fontSize: '0.78rem', color: '#1e293b' }}>{t.name}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '7px 8px', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {t.plan}
                      </td>
                      <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          color: t.healthColor,
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: t.health === 'Healthy' ? '#dcfce7' : t.health === 'Attention' ? '#fef3c7' : '#fee2e2',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontSize: '0.68rem'
                        }}>
                          ● {t.health}
                        </span>
                      </td>
                      <td style={{ padding: '7px 8px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>
                        {t.users}
                      </td>
                      <td style={{ padding: '7px 8px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {t.mrr}
                      </td>
                      <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>
                        <div style={{ width: '42px', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${t.activityPercent}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '7px 8px', color: '#64748b', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                        {t.renewal}
                      </td>
                      <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          color: t.riskColor,
                          fontWeight: '700',
                          fontSize: '0.68rem',
                          background: t.risk === 'Low' ? '#dcfce7' : t.risk === 'Medium' ? '#fef3c7' : '#fee2e2',
                          padding: '2px 6px',
                          borderRadius: '8px'
                        }}>
                          {t.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '6px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('companies')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View all tenants &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* ── ROW 3: Platform Usage & Capacity + System Health + Security Pulse ─ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '14px',
        alignItems: 'stretch'
      }}>
        
        {/* Col 1: Platform Usage & Capacity */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HardDrive size={17} color="#0284c7" />
                <h3 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Platform Usage &amp; Capacity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('system-health')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View details &rarr;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Meter 1: API Requests */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>⚡ API Requests</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>2.4M / 5M (48%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '48%', height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Meter 2: Storage Usage */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>💾 Storage Usage</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>8.7 TB / 12 TB (73%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '73%', height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Meter 3: Active Sessions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>👥 Active Sessions</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>1,243 / 2,000 (62%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: '#06b6d4', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Meter 4: File / Media Usage */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>📁 File / Media Usage</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>342 GB / 1 TB (34%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '34%', height: '100%', background: '#f97316', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Meter 5: Export Jobs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>📥 Export Jobs</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>48 / 100 (48%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '48%', height: '100%', background: '#64748b', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: System Health */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={17} color="#10b981" />
                <h3 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  System Health
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('system-health')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View details &rarr;
              </button>
            </div>

            {/* Strict 3-Columns x 2-Rows Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {[
                { name: 'API Gateway', ms: '142ms', status: 'Healthy', icon: Server },
                { name: 'Database', ms: '38ms', status: 'Healthy', icon: Database },
                { name: 'Auth Service', ms: '96ms', status: 'Healthy', icon: Lock },
                { name: 'File / Image', ms: '210ms', status: 'Healthy', icon: HardDrive },
                { name: 'Queue / Jobs', ms: '124ms', status: 'Healthy', icon: Clock },
                { name: 'Notifications', ms: '86ms', status: 'Healthy', icon: Bell }
              ].map((svc, sIdx) => {
                const SvcIcon = svc.icon;
                return (
                  <div
                    key={sIdx}
                    style={{
                      background: '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <SvcIcon size={13} color="#64748b" />
                      <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>{svc.name}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a', margin: '1px 0' }}>
                      {svc.ms}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ● {svc.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 3: Security & Compliance Pulse */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={17} color="#2563eb" />
                <h3 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Security &amp; Compliance Pulse
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('security')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View details &rarr;
              </button>
            </div>

            {/* 3 Metric Mini Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#dc2626', fontSize: '0.68rem', fontWeight: '700' }}>
                  <ShieldAlert size={12} /> Alerts
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#dc2626', margin: '2px 0' }}>7</div>
                <span style={{ fontSize: '0.62rem', color: '#b91c1c', whiteSpace: 'nowrap' }}>↑ 3 new (24h)</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '0.68rem', fontWeight: '700' }}>
                  <Ban size={12} /> Blocked
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>1,243</div>
                <span style={{ fontSize: '0.62rem', color: '#dc2626', whiteSpace: 'nowrap' }}>↑ 18% (24h)</span>
              </div>

              <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#16a34a', fontSize: '0.68rem', fontWeight: '700' }}>
                  <ShieldCheck size={12} /> MFA
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#16a34a', margin: '2px 0' }}>96%</div>
                <span style={{ fontSize: '0.62rem', color: '#15803d', whiteSpace: 'nowrap' }}>↑ 2% (7d)</span>
              </div>
            </div>

            {/* Recent Policy Changes */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                Recent Policy Changes
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>🔒 RLS policy updated - platform_users</span>
                  <span style={{ color: '#94a3b8' }}>2h ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>🌐 New IP allowlist rule added</span>
                  <span style={{ color: '#94a3b8' }}>6h ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>🔑 Password policy strengthened</span>
                  <span style={{ color: '#94a3b8' }}>1d ago</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '10px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('security')}
              style={{
                background: '#1e3a8a',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Review all alerts &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* ── ROW 4: Real-Time Stream + Support Queue + Release Watch + Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.45fr 1.05fr 0.85fr 0.75fr',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        
        {/* Col 1: Real-Time Global Activity Stream */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={16} color="#2563eb" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Real-Time Global Activity Stream
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('audit-logs')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View all &rarr;
              </button>
            </div>

            <div style={{ width: '100%', overflow: 'hidden' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.71rem',
                tableLayout: 'fixed'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '5px 4px', fontWeight: '700', color: '#64748b', width: '12%', whiteSpace: 'nowrap' }}>Time</th>
                    <th style={{ padding: '5px 4px', fontWeight: '700', color: '#64748b', width: '32%', whiteSpace: 'nowrap' }}>Event</th>
                    <th style={{ padding: '5px 4px', fontWeight: '700', color: '#64748b', width: '19%', whiteSpace: 'nowrap' }}>Actor</th>
                    <th style={{ padding: '5px 4px', fontWeight: '700', color: '#64748b', width: '22%', whiteSpace: 'nowrap' }}>Tenant</th>
                    <th style={{ padding: '5px 4px', fontWeight: '700', color: '#64748b', width: '15%', whiteSpace: 'nowrap' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {activityStreamRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', height: '29px' }}>
                      <td style={{ padding: '4px 4px', color: '#64748b', fontFamily: 'monospace', fontSize: '0.69rem', whiteSpace: 'nowrap' }}>
                        {row.time}
                      </td>
                      <td style={{ padding: '4px 4px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.event}>
                        {row.event}
                      </td>
                      <td style={{ padding: '4px 4px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.actor}>
                        {row.actor}
                      </td>
                      <td style={{ padding: '4px 4px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.tenant}>
                        <strong>{row.tenant}</strong>
                      </td>
                      <td style={{ padding: '4px 4px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          color: row.color,
                          fontWeight: '700',
                          fontSize: '0.64rem',
                          background: row.severity === 'Success' ? '#dcfce7' : row.severity === 'Warning' ? '#fef3c7' : '#eff6ff',
                          padding: '1px 5px',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          ● {row.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Col 2: Support Command Queue */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LifeBuoy size={16} color="#0284c7" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Support Command Queue
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('support')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View all &rarr;
              </button>
            </div>

            {/* Metric counters */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <div style={{ flex: 1, background: '#eff6ff', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#1e40af', display: 'block' }}>Open</span>
                <strong style={{ fontSize: '0.95rem', color: '#1d4ed8' }}>12</strong>
              </div>
              <div style={{ flex: 1, background: '#fef2f2', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#991b1b', display: 'block' }}>Escalated</span>
                <strong style={{ fontSize: '0.95rem', color: '#b91c1c' }}>3</strong>
              </div>
              <div style={{ flex: 1, background: '#fffbeb', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#92400e', display: 'block' }}>SLA Risk</span>
                <strong style={{ fontSize: '0.95rem', color: '#d97706' }}>2</strong>
              </div>
            </div>

            {/* Ticket items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {supportQueueRows.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTab && setActiveTab('support')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{t.id}</strong>
                      <span style={{ color: '#0f172a', fontWeight: '600' }}>{t.title}</span>
                    </div>
                    <span style={{ fontSize: '0.66rem', color: '#64748b' }}>{t.tenant}</span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      background: t.priorityColor,
                      color: t.priorityTextColor,
                      fontSize: '0.64rem',
                      fontWeight: '700',
                      padding: '1px 5px',
                      borderRadius: '6px'
                    }}>
                      {t.priority}
                    </span>
                    <span style={{ fontSize: '0.64rem', color: '#94a3b8', display: 'block', marginTop: '1px' }}>{t.age}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Release & Integration Watch */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} color="#8b5cf6" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Release &amp; Integration Watch
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('app-management')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View details &rarr;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Latest App Version</span>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>v2.8.3</strong>
                <span style={{ fontSize: '0.66rem', color: '#94a3b8', display: 'block' }}>Released 22 Sep 2026</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Deployment Status</span>
                <span style={{ color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ● Healthy
                </span>
                <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Last deploy: 22 Sep 2026, 14:18</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>API / Webhook Health</span>
                <strong style={{ color: '#16a34a' }}>● 99.97%</strong>
                <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>All endpoints healthy</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Integration Failures</span>
                <strong style={{ color: '#dc2626' }}>🔴 2</strong>
                <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}> (PayPal, SendGrid)</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '6px', fontSize: '0.68rem', color: '#64748b', marginTop: '6px' }}>
            Production &bull; Azure West Europe
          </div>
        </div>

        {/* Col 4: Quick Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Sparkles size={16} color="#f59e0b" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Quick Actions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                {
                  label: 'Provision Trial',
                  desc: 'Create new company trial',
                  icon: Building2,
                  action: () => setIsCreateCompanyOpen && setIsCreateCompanyOpen(true)
                },
                {
                  label: 'Add Company Admin',
                  desc: 'Assign admin to tenant',
                  icon: UserPlus,
                  action: () => setIsCreateUserOpen && setIsCreateUserOpen(true)
                },
                {
                  label: 'Create Plan',
                  desc: 'Configure subscription plan',
                  icon: Layers,
                  action: () => setIsCreatePlanOpen && setIsCreatePlanOpen(true)
                },
                {
                  label: 'Broadcast Notice',
                  desc: 'Send global announcement',
                  icon: Megaphone,
                  action: () => setIsAnnouncementModalOpen && setIsAnnouncementModalOpen(true)
                },
                {
                  label: 'Review Security Alerts',
                  desc: 'View and manage security events',
                  icon: ShieldAlert,
                  action: () => setActiveTab && setActiveTab('security')
                }
              ].map((act, aIdx) => {
                const ActIcon = act.icon;
                return (
                  <button
                    key={aIdx}
                    type="button"
                    onClick={act.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ActIcon size={14} color="#2563eb" style={{ flexShrink: 0 }} />
                      <div>
                        <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>{act.label}</strong>
                        <span style={{ fontSize: '0.66rem', color: '#64748b' }}>{act.desc}</span>
                      </div>
                    </div>
                    <ChevronRight size={13} color="#94a3b8" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
