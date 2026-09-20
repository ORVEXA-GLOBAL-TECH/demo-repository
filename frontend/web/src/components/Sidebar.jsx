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
  FileCode2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role } = useAuth();

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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
          A
        </div>
        <div>
          <h1 className="brand-title">Alleviare SFA</h1>
          <p className="brand-subtitle">Company Operations</p>
        </div>
      </div>

      <nav className="sidebar-nav">
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
