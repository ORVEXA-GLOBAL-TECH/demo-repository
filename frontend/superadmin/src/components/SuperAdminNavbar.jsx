import React from 'react';
import { Bell, Shield, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminNavbar({ title, unreadCount = 0, onToggleNotifications }) {
  const { currentUser, role, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div className="page-title">
        <span>{title}</span>
      </div>

      <div className="top-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem' }}>
          <Globe size={16} color="#f59e0b" />
          <span>SaaS Scope: <strong>Global Sovereign Multi-Tenant HQ</strong></span>
        </div>

        <span className="status-badge badge-approved" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
          <Shield size={13} /> TIER-0 SUPER ADMIN
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
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
          }}>
            👑
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>{currentUser?.name || 'Super Admin'}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser?.designation || 'Global Enterprise Super Administrator'}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="logout-btn-nav"
          title="Sign out of current Super Admin session"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
