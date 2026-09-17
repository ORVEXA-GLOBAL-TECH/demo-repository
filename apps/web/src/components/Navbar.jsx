import React from 'react';
import { Bell, Search, Activity, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title }) {
  const { currentUser, role } = useAuth();

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'ADMIN': return 'badge-approved';
      case 'MANAGER': return 'badge-pending';
      default: return 'badge-submitted';
    }
  };

  return (
    <header className="top-navbar">
      <div className="page-title">
        <span>{title}</span>
      </div>

      <div className="top-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
          <Building2 size={16} />
          <span>Territory: <strong>{currentUser.territory}</strong></span>
        </div>

        <span className={`status-badge ${getRoleBadgeClass()}`}>
          Role: {role}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid #e2e8f0' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#e0e7ff',
            color: '#3730a3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser.designation}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
