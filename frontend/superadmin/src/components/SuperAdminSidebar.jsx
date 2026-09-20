import React from 'react';
import {
  Activity,
  Building2,
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
  AlertOctagon
} from 'lucide-react';

export default function SuperAdminSidebar({ activeTab, setActiveTab }) {
  const primaryNavGroups = [
    {
      label: 'Core Governance',
      items: [
        { id: 'dashboard', label: '1. Platform Dashboard', icon: Activity },
        { id: 'companies', label: '2. Company / Tenants', icon: Building2 },
        { id: 'platform-users', label: '3. Platform Users', icon: Users },
        { id: 'subscriptions', label: '4. Subscriptions & Billing', icon: CreditCard }
      ]
    },
    {
      label: 'Configuration & Control',
      items: [
        { id: 'features', label: '5. Features & Rollouts', icon: Layers },
        { id: 'settings', label: '6. Global Settings', icon: Settings },
        { id: 'roles', label: '7. Role Templates', icon: ShieldCheck },
        { id: 'integrations', label: '8. Integrations & APIs', icon: Radio },
        { id: 'app-management', label: '9. App Version Control', icon: Smartphone }
      ]
    },
    {
      label: 'Intelligence & Operations',
      items: [
        { id: 'analytics', label: '10. Platform Analytics', icon: BarChart3 },
        { id: 'security', label: '11. Security & Audit Logs', icon: Lock },
        { id: 'system-health', label: '12. System Health & Maintenance', icon: Server },
        { id: 'support', label: '13. Support Desk', icon: LifeBuoy },
        { id: 'communications', label: '14. Announcements', icon: Megaphone }
      ]
    },
    {
      label: 'Master Admin',
      items: [
        { id: 'emergency', label: '15. Emergency Kill-Switch', icon: AlertOctagon, isDanger: true },
        { id: 'my-account', label: '16. My Account & Security', icon: UserCircle }
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
