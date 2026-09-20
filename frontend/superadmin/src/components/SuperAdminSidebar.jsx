import React from 'react';
import {
  Activity,
  Building2,
  Globe2,
  UserCog,
  CreditCard,
  Layers,
  Database,
  Server,
  FileCode2,
  ShieldCheck
} from 'lucide-react';

export default function SuperAdminSidebar({ activeTab, setActiveTab }) {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          👑
        </div>
        <div>
          <h1 className="brand-title">Orvexa Global</h1>
          <p className="brand-subtitle">Super Admin Console</p>
        </div>
      </div>

      <nav className="sidebar-nav">
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
            >
              <Icon size={18} color={isActive ? '#fbbf24' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: '14px' }}>API &amp; System Docs</div>
        <a
          href="http://localhost:5000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
          style={{ color: '#fbbf24' }}
        >
          <FileCode2 size={18} />
          <span>Swagger API Docs ↗</span>
        </a>
      </nav>
    </aside>
  );
}
