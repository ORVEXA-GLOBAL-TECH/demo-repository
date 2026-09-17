import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Receipt,
  BookOpen,
  CalendarCheck,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role, switchRole } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'dcr', label: 'Daily Call Reports (DCR)', icon: ClipboardList },
    { id: 'orders', label: 'POB & Order Bookings', icon: ShoppingCart },
    { id: 'expenses', label: 'TA / DA Expense Claims', icon: Receipt },
    { id: 'catalog', label: 'Master Directory (Docs/Chems)', icon: BookOpen },
    { id: 'tour-plan', label: 'Tour Plans & Routing', icon: CalendarCheck }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">A</div>
        <div>
          <h1 className="brand-title">Alleviare SFA</h1>
          <p className="brand-subtitle">Pharma Enterprise Suite</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="role-switcher-card">
          <div className="role-label">Preview Role / Perspective</div>
          <select
            className="role-select"
            value={role}
            onChange={(e) => switchRole(e.target.value)}
          >
            <option value="ADMIN">🛡️ Admin / Director</option>
            <option value="MANAGER">👔 Regional Sales Manager</option>
            <option value="MR">🚗 Field Rep / MR (Amit)</option>
          </select>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
            Active: <strong style={{ color: '#38bdf8' }}>{currentUser.name}</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}
