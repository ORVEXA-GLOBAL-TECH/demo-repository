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
      label: 'Core Governance',
      items: [
        { id: 'dashboard', label: 'Platform Dashboard', icon: Activity },
        { id: 'companies', label: 'Company / Tenants', icon: Building2 },
        { id: 'jurisdictions', label: 'Countries, Timezones & FX', icon: Globe2 },
        { id: 'platform-users', label: 'Company Admins & Users', icon: Users },
        { id: 'user-sessions', label: 'Active User Sessions', icon: Monitor },
        { id: 'subscriptions', label: 'Billing & Subscriptions', icon: CreditCard }
      ]
    },
    {
      label: 'Configuration & Control',
      items: [
        { id: 'features', label: 'Features & Rollouts', icon: Layers },
        { id: 'settings', label: 'Global Settings', icon: Settings },
        { id: 'roles', label: 'Role Templates', icon: ShieldCheck },
        { id: 'integrations', label: 'API & Integrations', icon: Radio },
        { id: 'app-management', label: 'Mobile App Version Control', icon: Smartphone }
      ]
    },
    {
      label: 'Intelligence & Operations',
      items: [
        { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        { id: 'security', label: 'Security & Audit Logs', icon: Lock },
        { id: 'system-health', label: 'System Health & Telemetry', icon: Server },
        { id: 'data-management', label: 'Data Management & Backups', icon: Database },
        { id: 'support', label: 'Support Tickets & Content CMS', icon: LifeBuoy },
        { id: 'communications', label: 'Notification & Announcements', icon: Megaphone }
      ]
    },
    {
      label: 'Master Admin',
      items: [
        { id: 'emergency', label: 'Emergency Kill-Switch', icon: AlertOctagon, isDanger: true },
        { id: 'my-account', label: 'My Account & Security', icon: UserCircle }
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
          <div key={gIdx} style={{ marginBottom: '6px' }}>
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
                  className={`nav-link ${isActive ? 'active' : ''} ${item.isDanger ? 'danger-link' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={item.isDanger ? { color: isActive ? '#ef4444' : '#f87171' } : {}}
                >
                  <Icon size={17} color={isActive ? (item.isDanger ? '#ef4444' : '#fbbf24') : (item.isDanger ? '#f87171' : '#94a3b8')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: '10px' }}>API &amp; System Docs</div>
        <a
          href="http://localhost:5000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
          style={{ color: '#fbbf24' }}
        >
          <FileCode2 size={17} />
          <span>Swagger API Docs ↗</span>
        </a>
      </nav>
    </aside>
  );
}
