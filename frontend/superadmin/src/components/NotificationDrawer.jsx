import React from 'react';
import { X, Bell, CheckCircle, Info, AlertTriangle, CheckCheck } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function NotificationDrawer({ isOpen, onClose, notifications = [], onRefresh }) {
  if (!isOpen) return null;

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'dcr': return <CheckCircle size={16} color="#10b981" />;
      case 'order': return <Info size={16} color="#3b82f6" />;
      case 'system': return <AlertTriangle size={16} color="#f59e0b" />;
      default: return <Bell size={16} color="#6366f1" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '380px',
      backgroundColor: '#ffffff',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.25s ease-out'
    }}>
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} color="#f59e0b" />
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Platform Security &amp; Activity</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #f1f5f9' }}>
        <button
          onClick={handleMarkAllRead}
          style={{
            background: 'none',
            border: 'none',
            color: '#f59e0b',
            fontSize: '0.76rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
            <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.86rem' }}>No new notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: n.read ? '#f8fafc' : '#fef3c7',
                border: `1px solid ${n.read ? '#e2e8f0' : '#fde68a'}`,
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {getIcon(n.type)}
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{n.title}</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                {n.time || 'Just now'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
