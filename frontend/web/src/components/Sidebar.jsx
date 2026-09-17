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
  Monitor,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role, switchRole } = useAuth();

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

  const isWebOnly = role === 'SUPER_ADMIN' || role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">A</div>
        <div>
          <h1 className="brand-title">Alleviare SFA</h1>
          <p className="brand-subtitle">MNC Pharma Suite</p>
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

        <div className="nav-section-label" style={{ marginTop: '6px' }}>API & Developer</div>
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

      <div className="sidebar-footer">
        <div className="role-switcher-card">
          <div className="role-label">Switch Persona / Role</div>
          <select
            className="role-select"
            value={role}
            onChange={(e) => switchRole(e.target.value)}
          >
            <option value="SUPER_ADMIN">👑 Super Admin (Web Only)</option>
            <option value="ADMIN">🛡️ Admin (Web Only)</option>
            <option value="DIRECTOR">🏛️ Director (Web + App)</option>
            <option value="MANAGER">💼 Manager (Web + App)</option>
            <option value="SALES_MANAGER">👔 Sales Manager (Web + App)</option>
            <option value="SALES_SUPERVISOR">📋 Sales Supervisor (Web + App)</option>
            <option value="ACCOUNTANT">💰 Accountant (Web + App)</option>
            <option value="MR">🚗 MR (App Only - Restricted on Web)</option>
          </select>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Access:</span>
            {isWebOnly ? (
              <strong style={{ color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Monitor size={12} /> Web Portal Only
              </strong>
            ) : role === 'MR' ? (
              <strong style={{ color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Smartphone size={12} /> Mobile App Only
              </strong>
            ) : (
              <strong style={{ color: '#4ade80', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Monitor size={12} /><Smartphone size={12} /> Web + Mobile App
              </strong>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
