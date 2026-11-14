import React from 'react';
import {
  Activity,
  Building2,
  Globe2,
  Users,
  CreditCard,
  Layers,
  Settings,
  ShieldCheck,
  Radio,
  Smartphone,
  BarChart3,
  Lock,
  Server,
  LifeBuoy,
  Megaphone,
  UserCircle,
  FileCode2,
  AlertOctagon,
  Database,
  Monitor,
  Blocks
} from 'lucide-react';
import { OrvexaLogoIcon } from './OrvexaLogo';

export default function SuperAdminSidebar({ activeTab, setActiveTab, isSidebarCollapsed = false }) {
  const primaryNavGroups = [
    {
      label: 'Tenant Governance',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'company-admins', label: 'Company Admins', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'plans', label: 'Plans', icon: Layers },
        { id: 'features', label: 'Features', icon: Layers }
      ]
    },
    {
      label: 'Platform Operations',
      items: [
        { id: 'platform-users', label: 'Platform Users', icon: Users },
        { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck },
        { id: 'integrations', label: 'Integrations & APIs', icon: Blocks },
        { id: 'app-versions', label: 'App Versions', icon: Smartphone },
        { id: 'system-health', label: 'System Health', icon: Server }
      ]
    },
    {
      label: 'Support & Administration',
      items: [
        { id: 'support', label: 'Support', icon: LifeBuoy },
        { id: 'notifications', label: 'Notifications', icon: Megaphone },
        { id: 'global-masters', label: 'Global Masters', icon: Globe2 },
        { id: 'data-governance', label: 'Data Governance', icon: Database },
        { id: 'feature-flags', label: 'Feature Flags', icon: AlertOctagon },
        { id: 'settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div
        className="sidebar-header"
        onClick={() => setActiveTab('dashboard')}
        style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
        title="Orvexa Global - Click to return to Command Centre Dashboard"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('dashboard'); }}
      >
        <div className="brand-badge" style={{ background: 'transparent', padding: 0 }}>
          <OrvexaLogoIcon size={34} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 className="brand-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Orvexa
            </h1>
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f59e0b', letterSpacing: '-0.02em' }}>
              Global
            </span>
          </div>
          <p className="brand-subtitle" style={{ margin: '2px 0 0', fontSize: '0.66rem', color: '#fbbf24', letterSpacing: '0.05em', fontWeight: '700' }}>
            Super Admin Console
          </p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {primaryNavGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '8px' }}>
            <div className="nav-section-label">
              <span>{group.label}</span>
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'integrations' && activeTab === 'api-management');
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} color={isActive ? '#fbbf24' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
