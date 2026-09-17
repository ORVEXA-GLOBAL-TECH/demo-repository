import React from 'react';
import { X, Check, Bell, ShoppingBag, Stethoscope, Receipt, Truck } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function NotificationDrawer({ isOpen, onClose, notifications = [], onRefresh }) {
  if (!isOpen) return null;

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadSingle = async (id) => {
    try {
      await markNotificationRead(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag size={16} color="#2563eb" />;
      case 'DCR': return <Stethoscope size={16} color="#16a34a" />;
      case 'EXPENSE': return <Receipt size={16} color="#d97706" />;
      default: return <Truck size={16} color="#7c3aed" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        style={{
          width: '380px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          animation: 'slideIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Real-Time Alerts</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '10px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {notifications.filter(n => !n.read).length} Unread Notifications
          </span>
          <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }} onClick={handleMarkAll}>
            Mark All Read
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleReadSingle(n.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: n.read ? '#ffffff' : '#eff6ff',
                border: n.read ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {getIcon(n.type)}
                <span style={{ fontWeight: '700', fontSize: '0.86rem', color: '#0f172a' }}>{n.title}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>{n.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
