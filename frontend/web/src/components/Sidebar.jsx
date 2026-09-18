import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Receipt,
  BookOpen,
  CalendarCheck,
  Radio,
  Clock,
  TrendingUp,
  Sparkles,
  FileCode2,
  Building2,
  Globe2,
  UserCog,
  CreditCard,
  Layers,
  Database,
  Server,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role } = useAuth();

  // Super Admin SaaS Platform Governance Navigation
  const saasNav = [
    { id: 'saas-overview', label: '1. Global SaaS Overview', icon: Activity },
    { id: 'saas-companies', label: '2. Company Management', icon: Building2 },
    { id: 'saas-countries', label: '3. Country Management', icon: Globe2 },
    { id: 'saas-admins', label: '4. Company Admins', icon: UserCog },
    { id: 'saas-subscriptions', label: '5. Subscriptions & Billing', icon: CreditCard },
    { id: 'saas-features', label: '6. Feature / Module Toggles', icon: Layers },
    { id: 'saas-tenants', label: '7. Tenant Isolation', icon: Database },
    { id: 'saas-system-health', label: '8. System Health & Security', icon: Server }
  ];

  // Company Admin & Operational Staff Navigation
  const coreNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'dcr', label: 'DCR & Detailing 360°', icon: ClipboardList },
    { id: 'orders', label: 'POB Orders & Stockists', icon: ShoppingCart },
    { id: 'expenses', label: 'TA / DA Smart Expenses', icon: Receipt }
  ];

  const opsNav = [
    { id: 'catalog', label: 'Master Registries 360°', icon: BookOpen },
    { id: 'tour-plan', label: 'Tour Plans & Beats (MTP)', icon: CalendarCheck },
    { id: 'tracking', label: 'Live GPS & Geofence', icon: Radio },
    { id: 'attendance', label: 'Attendance & Leaves', icon: Clock },
    { id: 'analytics', label: 'Quota & Sales Analytics', icon: TrendingUp },
    { id: 'ai-tools', label: 'AI Studio & Route TSP', icon: Sparkles }
  ];

  const isSuperAdmin = role === 'SUPER_ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge" style={{ background: isSuperAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
          {isSuperAdmin ? '👑' : 'A'}
        </div>
        <div>
          <h1 className="brand-title">{isSuperAdmin ? 'Orvexa Global' : 'Alleviare SFA'}</h1>
          <p className="brand-subtitle">{isSuperAdmin ? 'Multi-Tenant SaaS HQ' : 'Company Operations'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isSuperAdmin ? (
          <>
            <div className="nav-section-label" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} />
              <span>SaaS Platform Governance</span>
            </div>
            {saasNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.08))',
                    borderColor: '#f59e0b',
                    color: '#fbbf24'
                  } : {}}
                >
                  <Icon size={18} color={isActive ? '#fbbf24' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="nav-section-label" style={{ marginTop: '12px', color: '#64748b' }}>
              <span>Tenant View Shortcut</span>
            </div>
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{ fontSize: '0.78rem', color: '#94a3b8' }}
            >
              <LayoutDashboard size={16} />
              <span>Inspect Company SFA Portal &rarr;</span>
            </button>
          </>
        ) : (
          <>
            <div className="nav-section-label">Core Field Operations</div>
            {coreNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="nav-section-label" style={{ marginTop: '6px' }}>Enterprise Intelligence</div>
            {opsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        )}

        <div className="nav-section-label" style={{ marginTop: '8px' }}>API &amp; Platform Docs</div>
        <a
          href="http://localhost:5000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
          style={{ color: '#38bdf8' }}
        >
          <FileCode2 size={18} />
          <span>Swagger API Docs ↗</span>
        </a>
      </nav>
    </aside>
  );
}
