import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, XCircle, RotateCcw, Clock, AlertCircle,
  Filter, Search, Check, X, ShieldCheck, FileText, ChevronRight
} from 'lucide-react';
import { getApprovals, decideApproval } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function ApprovalsPage({ initialType = 'ALL' }) {
  const { role, currentUser } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [approvals, setApprovals] = useState([]);
  const [filterType, setFilterType] = useState(initialType);
  const [search, setSearch] = useState('');
  const [reasonModal, setReasonModal] = useState({ isOpen: false, item: null, action: '' });
  const [reasonText, setReasonText] = useState('');

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const res = await getApprovals();
      if (res && res.data) {
        setApprovals(res.data);
      }
    } catch (e) {
      console.warn('Approvals load error:', e);
    }
  };

  const handleDecision = async (item, action) => {
    if (action === 'REJECT' || action === 'RETURN') {
      setReasonModal({ isOpen: true, item, action });
      return;
    }

    try {
      await decideApproval(item.id, action);
    } catch (err) {
      console.warn('Local approval decision:', err);
    }

    setApprovals(approvals.map(a => a.id === item.id ? { ...a, status: 'APPROVED' } : a));
  };

  const submitReasonDecision = async () => {
    const { item, action } = reasonModal;
    if (!item) return;

    try {
      await decideApproval(item.id, action, reasonText);
    } catch (err) {
      console.warn('Local approval reject/return:', err);
    }

    setApprovals(approvals.map(a => a.id === item.id ? { ...a, status: action === 'REJECT' ? 'REJECTED' : 'RETURNED_FOR_CORRECTION' } : a));
    setReasonModal({ isOpen: false, item: null, action: '' });
    setReasonText('');
  };

  const filteredApprovals = useMemo(() => {
    return approvals.filter(item => {
      const matchType = filterType === 'ALL' || item.type === filterType;
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.submitter.toLowerCase().includes(q) ||
        item.amountOrUnits.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [approvals, filterType, search]);

  const counts = useMemo(() => {
    return {
      all: approvals.length,
      dcr: approvals.filter(a => a.type === 'DCR').length,
      expense: approvals.filter(a => a.type === 'EXPENSE').length,
      order: approvals.filter(a => a.type === 'ORDER').length,
      leave: approvals.filter(a => a.type === 'LEAVE').length,
      tour: approvals.filter(a => a.type === 'TOUR_PLAN').length
    };
  }, [approvals]);

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
              <CheckCircle2 size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Multi-Tier Approval Governance • Dual Control
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Unified Approvals Command Center
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              One-Click Decisions for DCR Reports • Travel TA/DA Claims • POB Orders • Leave Submissions • Monthly Tour Plans
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '10px' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>
              Pending Action: {approvals.filter(a => a.status === 'PENDING').length} Items
            </span>
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
              className={`tab-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              <span>All Approvals</span>
              <span className="tab-badge">{counts.all}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'DCR' ? 'active' : ''}`}
              onClick={() => setFilterType('DCR')}
            >
              <span>DCR Reports</span>
              <span className="tab-badge">{counts.dcr}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'EXPENSE' ? 'active' : ''}`}
              onClick={() => setFilterType('EXPENSE')}
            >
              <span>Expense Claims</span>
              <span className="tab-badge">{counts.expense}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'ORDER' ? 'active' : ''}`}
              onClick={() => setFilterType('ORDER')}
            >
              <span>POB Orders</span>
              <span className="tab-badge">{counts.order}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'LEAVE' ? 'active' : ''}`}
              onClick={() => setFilterType('LEAVE')}
            >
              <span>Leaves</span>
              <span className="tab-badge">{counts.leave}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'TOUR_PLAN' ? 'active' : ''}`}
              onClick={() => setFilterType('TOUR_PLAN')}
            >
              <span>Tour Plans</span>
              <span className="tab-badge">{counts.tour}</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search submitter, type, amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Approvals Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table className="custom-table" style={{ margin: 0, width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px' }}>Approval Type &amp; Reference</th>
                <th style={{ padding: '12px 14px' }}>Submitter / Field Rep</th>
                <th style={{ padding: '12px 14px' }}>Details / Claim Value</th>
                <th style={{ padding: '12px 14px' }}>Submitted Timestamp</th>
                <th style={{ padding: '12px 14px' }}>Current State</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Decision Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                    <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.submitter}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Role: {item.role}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>{item.amountOrUnits}</strong>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b' }}>
                    🕒 {item.submittedAt}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: item.status === 'APPROVED' ? '#dcfce7' : (item.status === 'REJECTED' ? '#fee2e2' : '#fef3c7'),
                        color: item.status === 'APPROVED' ? '#15803d' : (item.status === 'REJECTED' ? '#b91c1c' : '#b45309')
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {item.status === 'PENDING' ? (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleDecision(item, 'APPROVE')}
                          style={{ background: '#16a34a', color: '#ffffff', padding: '3px 8px', fontSize: '0.74rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleDecision(item, 'RETURN')}
                          style={{ background: '#eab308', color: '#ffffff', padding: '3px 8px', fontSize: '0.74rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <RotateCcw size={12} /> Return
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleDecision(item, 'REJECT')}
                          style={{ background: '#dc2626', color: '#ffffff', padding: '3px 8px', fontSize: '0.74rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Decision Finalized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Rejection / Return Reason Modal */}
      {reasonModal.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              {reasonModal.action === 'REJECT' ? 'Reject Submission' : 'Return for Rep Correction'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
              Specify the compliance reason for audit trail recording.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <textarea
                className="form-control"
                rows={3}
                style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '0.82rem' }}
                placeholder="e.g. Missing toll receipt / incorrect doctor call duration..."
                value={reasonText}
                onChange={e => setReasonText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setReasonModal({ isOpen: false, item: null, action: '' })}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitReasonDecision}
                style={{ background: reasonModal.action === 'REJECT' ? '#dc2626' : '#eab308', color: '#ffffff' }}
              >
                Confirm {reasonModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
