import React from 'react';
import { Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

const ROLE_BADGE = {
  SUPER_ADMIN: 'badge-approved',
  ADMIN: 'badge-approved',
  DIRECTOR: 'badge-approved',
  ACCOUNTANT: 'badge-approved',
  MANAGER: 'badge-pending',
  SALES_MANAGER: 'badge-pending',
  MR_SUPERVISOR: 'badge-invoiced',
  SALES_SUPERVISOR: 'badge-invoiced',
  MR: 'badge-submitted'
};

export default function Navbar({ title, unreadCount = 0, onToggleNotifications }) {
  const { currentUser, role, logout } = useAuth();
  const { activeTenant } = useTenantTheme();

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const initials = currentUser?.avatar && currentUser.avatar.length <= 3
    ? currentUser.avatar
    : (currentUser?.name || 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="top-navbar">
      <div className="page-title" title={title}>
        <span>{title}</span>
      </div>

      <div className="top-actions">
        {/* The signed-in user's company is fixed by their account. */}
        <div className="tenant-chip" title="Your company workspace">
          <span className="tenant-dot" style={{ backgroundColor: brandColor, boxShadow: `0 0 6px ${brandColor}` }} />
          <span>{activeTenant?.name || currentUser?.companyName || 'Alleviare'}</span>
        </div>

        <span className={`status-badge ${ROLE_BADGE[role] || 'badge-submitted'}`}>
          <Shield size={13} /> {role?.replace(/_/g, ' ')}
        </span>

        <button type="button" onClick={onToggleNotifications} className="nav-icon-btn" title="Notifications & Alerts">
          <Bell size={18} color="#475569" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', color: '#fff',
                fontSize: '0.68rem', fontWeight: 800, borderRadius: 9999, minWidth: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                border: '2px solid #fff'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <div className="user-chip">
          <div className="nav-avatar" style={{ background: `linear-gradient(135deg, ${brandColor}, #090d16)` }}>
            {initials}
          </div>
          <div className="user-chip-text">
            <div className="user-chip-name">{currentUser?.name || 'User'}</div>
            <div className="user-chip-sub" title={`${currentUser?.designation || ''} • ${currentUser?.territory || ''}`}>
              {currentUser?.designation || role}
            </div>
          </div>
        </div>

        <button type="button" onClick={logout} className="logout-btn-nav" title="Sign out of current session">
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
