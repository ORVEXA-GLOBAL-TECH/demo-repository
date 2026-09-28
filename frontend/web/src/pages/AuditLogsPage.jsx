import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Search, Filter, Clock, User,
  FileText, Activity, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { getAuditLogs } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function AuditLogsPage() {
  const { activeTenant } = useTenantTheme();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getAuditLogs();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      console.warn('Audit logs error:', e);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchAction = filterAction === 'ALL' || log.action === filterAction;
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        log.actorName.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q);
      return matchAction && matchSearch;
    });
  }, [logs, filterAction, search]);

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* Top Banner */}
      <div
        className="card-section"
        style={{
          background: `linear-gradient(135deg, ${brandColor}dd, #0f172a)`,
          color: '#ffffff',
          marginBottom: '20px',
          padding: '24px',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Immutable Enterprise Compliance Trail (WORM Storage)
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              System &amp; Field Operations Audit Log
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Actor Attribution • IP Address Tracking • Mutation State Transitions • Non-Repudiation
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#4ade80" />
            <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Audit Engine: Active &amp; Verified</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${filterAction === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterAction('ALL')}
            >
              <span>All Logs</span>
              <span className="tab-badge">{logs.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterAction === 'CREATE' ? 'active' : ''}`}
              onClick={() => setFilterAction('CREATE')}
            >
              <span>Creates</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterAction === 'UPDATE' ? 'active' : ''}`}
              onClick={() => setFilterAction('UPDATE')}
            >
              <span>Updates</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterAction === 'APPROVE' ? 'active' : ''}`}
              onClick={() => setFilterAction('APPROVE')}
            >
              <span>Approvals</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterAction === 'PUNCH_IN' ? 'active' : ''}`}
              onClick={() => setFilterAction('PUNCH_IN')}
            >
              <span>Attendance</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Filter audit entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table className="custom-table" style={{ margin: 0, width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px' }}>Timestamp</th>
                <th style={{ padding: '12px 14px' }}>Actor &amp; Role</th>
                <th style={{ padding: '12px 14px' }}>Action &amp; Target Entity</th>
                <th style={{ padding: '12px 14px' }}>Details / Mutation Summary</th>
                <th style={{ padding: '12px 14px' }}>Client IP &amp; Origin</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    🕒 {log.timestamp}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{log.actorName}</div>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700' }}>{log.actorRole}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        background: log.action === 'APPROVE' ? '#dcfce7' : (log.action === 'CREATE' ? '#eff6ff' : '#f1f5f9'),
                        color: log.action === 'APPROVE' ? '#15803d' : (log.action === 'CREATE' ? '#2563eb' : '#475569')
                      }}
                    >
                      {log.action}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{log.entity}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#334155' }}>
                    {log.details}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#64748b' }}>
                    🌐 {log.ipAddress}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.76rem' }}>● {log.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedLog(log)}
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    >
                      Payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Payload Inspection Modal */}
      {selectedLog && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Audit Entry: {selectedLog.id}</h3>
              <button type="button" onClick={() => setSelectedLog(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem' }}>
              <div><strong>Actor:</strong> {selectedLog.actorName} ({selectedLog.actorRole})</div>
              <div><strong>Timestamp:</strong> {selectedLog.timestamp}</div>
              <div><strong>IP:</strong> {selectedLog.ipAddress}</div>
              <div><strong>Target Entity:</strong> {selectedLog.entity} (ID: {selectedLog.entityId})</div>
            </div>
            <div style={{ background: '#0f172a', color: '#38bdf8', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem', marginBottom: '16px' }}>
              {JSON.stringify({ action: selectedLog.action, entity: selectedLog.entity, id: selectedLog.entityId, details: selectedLog.details, status: selectedLog.status }, null, 2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedLog(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
