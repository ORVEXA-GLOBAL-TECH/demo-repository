import React from 'react';
import { Bell, Building2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, unreadCount = 0, onToggleNotifications }) {
  const { currentUser, role } = useAuth();

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'ADMIN': return 'badge-approved';
      case 'RSM': return 'badge-pending';
      case 'ASM': return 'badge-invoiced';
      default: return 'badge-submitted';
    }
  };

  return (
    <header className="top-navbar">
      <div className="page-title">
        <span>{title}</span>
      </div>

      <div className="top-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem' }}>
          <Building2 size={16} />
          <span>HQ: <strong>{currentUser.territory}</strong></span>
        </div>

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
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}>
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser.designation}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
