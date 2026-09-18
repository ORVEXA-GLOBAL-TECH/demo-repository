import React from 'react';
import { Bell, Building2, Shield, Monitor, Smartphone, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, unreadCount = 0, onToggleNotifications }) {
  const { currentUser, role, logout } = useAuth();

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'SUPER_ADMIN': return 'badge-approved';
      case 'ADMIN': return 'badge-approved';
      case 'DIRECTOR': return 'badge-approved';
      case 'MANAGER': return 'badge-pending';
      case 'SALES_MANAGER': return 'badge-pending';
      case 'SALES_SUPERVISOR': return 'badge-invoiced';
      case 'ACCOUNTANT': return 'badge-approved';
      default: return 'badge-submitted';
    }
  };

  const isWebOnly = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const isAppOnly = role === 'MR';

  return (
    <header className="top-navbar">
      <div className="page-title">
        <span>{title}</span>
      </div>

      <div className="top-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem' }}>
          <Building2 size={16} />
          <span>HQ: <strong>{currentUser?.territory || 'Enterprise HQ'}</strong></span>
        </div>

        {/* Platform Entitlement Chip */}
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          fontWeight: '700',
          backgroundColor: isWebOnly ? '#fef3c7' : isAppOnly ? '#fee2e2' : '#dcfce7',
          color: isWebOnly ? '#92400e' : isAppOnly ? '#991b1b' : '#166534',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isWebOnly ? (
            <><Monitor size={12} /> Web Only</>
          ) : isAppOnly ? (
            <><Smartphone size={12} /> Mobile App Only</>
          ) : (
            <><Monitor size={12} /> + <Smartphone size={12} /> Web & App</>
          )}
        </span>

        <span className={`status-badge ${getRoleBadgeClass()}`}>
          <Shield size={13} /> {role}
        </span>

        {/* Notification Bell Button */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: 'relative',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Notifications & Alerts"
        >
          <Bell size={18} color="#475569" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: '800',
              borderRadius: '9999px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid #ffffff'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px', borderLeft: '1px solid #e2e8f0' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: role === 'SUPER_ADMIN' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: role === 'SUPER_ADMIN' ? '0 2px 8px rgba(217, 119, 6, 0.4)' : '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}>
            {currentUser?.avatar || (currentUser?.name ? currentUser.name.charAt(0) : 'U')}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>{currentUser?.name || 'User'}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser?.designation || role}</div>
          </div>
        </div>

        {/* Explicit Sign Out Button */}
        <button
          onClick={logout}
          className="logout-btn-nav"
          title="Sign out of current session"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
