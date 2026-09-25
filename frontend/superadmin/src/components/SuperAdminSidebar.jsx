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
  Monitor
} from 'lucide-react';

export default function SuperAdminSidebar({ activeTab, setActiveTab }) {
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
        { id: 'integrations', label: 'Integrations', icon: Radio },
        { id: 'api-management', label: 'API Management', icon: FileCode2 },
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
        {primaryNavGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '8px' }}>
            <div className="nav-section-label">
              <span>{group.label}</span>
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
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
