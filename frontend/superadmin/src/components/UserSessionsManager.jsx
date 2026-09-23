import React, { useState, useEffect } from 'react';
import {
  Monitor,
  RefreshCw,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
  Clock,
  User,
  Laptop,
  Smartphone,
  Trash2,
  Lock
} from 'lucide-react';
import {
  getUserSessions,
  revokeUserSession,
  revokeAllUserSessions,
  revokeAllOtherSessions
} from '../services/api';

export default function UserSessionsManager() {
  const [sessions, setSessions] = useState([]);
  const [metrics, setMetrics] = useState({
    activeSessions: 0,
    activeUsers: 0,
    revokedSessions: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'revoked'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 15000); // Live poll every 15s
    return () => clearInterval(interval);
  }, [filterStatus]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadSessions = async () => {
    try {
      const res = await getUserSessions({ status: filterStatus });
      if (res && res.success) {
        setSessions(res.sessions || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to load user sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSingle = async (sessionId, userName) => {
    if (!window.confirm(`Are you sure you want to terminate the active session for ${userName}? Their window will be closed immediately.`)) {
      return;
    }

    setActionLoading(sessionId);
    try {
      await revokeUserSession(sessionId);
      showToast(`Session for ${userName} terminated successfully.`);
      await loadSessions();
    } catch (err) {
      showToast(`Failed to revoke session: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAllUser = async (userId, userName) => {
    if (!window.confirm(`Terminate ALL active sessions for ${userName} across all browsers and devices?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await revokeAllUserSessions(userId);
      showToast(`All sessions for ${userName} terminated.`);
      await loadSessions();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    if (!window.confirm('⚠️ EMERGENCY ACTION: Terminate ALL active sessions on the entire platform except your current Super Admin window?')) {
      return;
    }

    setActionLoading('bulk');
    try {
      await revokeAllOtherSessions();
      showToast('All other platform sessions have been revoked.');
      await loadSessions();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Client-side filtering
  const filteredSessions = sessions.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (
      (s.user_name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.ip_address || '').toLowerCase().includes(q) ||
      (s.role || '').toLowerCase().includes(q)
    );
    if (!matchSearch) return false;
    if (filterStatus === 'active') return s.is_active;
    if (filterStatus === 'revoked') return !s.is_active;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toastMessage.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          {toastMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <Monitor size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
              Live User Sessions & Window Oversight
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Single-session enforcement monitor. View online users and instantly terminate unauthorized or concurrent windows.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={loadSessions}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'background 0.2s'
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleRevokeAllOthers}
            disabled={actionLoading === 'bulk'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
            }}
          >
            <ShieldAlert size={15} />
            {actionLoading === 'bulk' ? 'Terminating...' : 'Revoke All Other Sessions'}
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Sessions
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
              {metrics.activeSessions}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Live open windows
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Monitor size={20} color="#10b981" />
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Unique Active Users
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
              {metrics.activeUsers}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Online accounts
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} color="#38bdf8" />
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Revoked Sessions
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f87171', marginTop: '6px' }}>
              {metrics.revokedSessions}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Closed / terminated
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <XCircle size={20} color="#f87171" />
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Recorded
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
              {metrics.totalSessions}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              All history
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={20} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: `All (${metrics.totalSessions})` },
            { id: 'active', label: `Active (${metrics.activeSessions})` },
            { id: 'revoked', label: `Revoked (${metrics.revokedSessions})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                background: filterStatus === tab.id ? '#3b82f6' : '#0f172a',
                color: filterStatus === tab.id ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by user, email, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Sessions Table */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>User & Identity</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>IP & Device</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Login / Activity</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    {loading ? 'Loading user sessions...' : 'No user sessions found.'}
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr
                    key={session.session_id}
                    style={{
                      borderBottom: '1px solid #334155',
                      background: session.is_active ? 'transparent' : 'rgba(15, 23, 42, 0.4)'
                    }}
                  >
                    {/* User info */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: session.is_active ? 'linear-gradient(135deg, #10b981, #059669)' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>
                          {(session.user_name || session.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {session.user_name || 'Administrator'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {session.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: session.role === 'SUPER_ADMIN' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: session.role === 'SUPER_ADMIN' ? '#fbbf24' : '#60a5fa',
                        border: session.role === 'SUPER_ADMIN' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(59, 130, 246, 0.4)'
                      }}>
                        {session.role || 'USER'}
                      </span>
                    </td>

                    {/* IP & Device */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0' }}>
                        <Globe size={13} color="#94a3b8" />
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{session.ip_address || '127.0.0.1'}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                        {session.device_info?.browser || 'Browser'} • {session.device_info?.os || 'Desktop'}
                      </div>
                    </td>

                    {/* Timestamps */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '12px' }}>
                        <Clock size={13} color="#94a3b8" />
                        <span>{new Date(session.last_active_at || session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 18px' }}>
                      {session.is_active ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                            boxShadow: '0 0 8px #10b981'
                          }} />
                          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '12px' }}>
                            Online / Active
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171'
                          }}>
                            {session.invalidated_reason === 'CONCURRENT_LOGIN_DETECTED'
                              ? 'Logged Out (New Window)'
                              : session.invalidated_reason === 'ADMIN_REVOKED'
                              ? 'Revoked by Admin'
                              : session.invalidated_reason || 'Closed'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {session.is_active ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleRevokeSingle(session.session_id, session.user_name || session.email)}
                            disabled={actionLoading === session.session_id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
                            }}
                          >
                            <Trash2 size={13} />
                            {actionLoading === session.session_id ? 'Revoking...' : 'Revoke'}
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Terminated</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
