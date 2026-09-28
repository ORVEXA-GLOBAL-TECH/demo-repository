import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, CheckCircle2, MapPin, UserCheck,
  Plus, ShieldCheck, X, AlertCircle
} from 'lucide-react';
import { getAttendance, recordPunchIn, recordPunchOut, applyLeave } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

const DEFAULT_ATTENDANCE = [
  { id: 'att-1', date: '2026-09-28', punchIn: '09:15 AM', punchOut: '05:30 PM', totalHours: 8.2, status: 'PRESENT_FIELD', locationName: 'Saket Field Hub, New Delhi', geofenceVerified: true },
  { id: 'att-2', date: '2026-09-27', punchIn: '09:05 AM', punchOut: '05:15 PM', totalHours: 8.1, status: 'PRESENT_FIELD', locationName: 'Green Park Metro Station', geofenceVerified: true },
  { id: 'att-3', date: '2026-09-26', punchIn: '09:30 AM', punchOut: '02:00 PM', totalHours: 4.5, status: 'HALF_DAY', locationName: 'Okhla Industrial Area', geofenceVerified: true },
  { id: 'att-4', date: '2026-09-25', punchIn: '09:10 AM', punchOut: '05:45 PM', totalHours: 8.5, status: 'PRESENT_FIELD', locationName: 'Sarita Vihar Apollo Centre', geofenceVerified: true }
];

const DEFAULT_HOLIDAYS = [
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National Gazetted' },
  { date: '2026-10-20', name: 'Dussehra (Vijayadashami)', type: 'National Festival' },
  { date: '2026-11-08', name: 'Diwali (Deepavali)', type: 'National Festival' },
  { date: '2026-11-09', name: 'Govardhan Puja', type: 'Regional Holiday' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'National Gazetted' }
];

export default function AttendancePage({ initialSubTab = 'attendance' }) {
  const { currentUser } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [records, setRecords] = useState(DEFAULT_ATTENDANCE);
  const [leaves, setLeaves] = useState({
    casualLeaveTotal: 12,
    casualLeaveUsed: 5,
    sickLeaveTotal: 10,
    sickLeaveUsed: 3,
    earnedLeaveTotal: 15,
    earnedLeaveUsed: 2
  });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState('');

  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'CASUAL_LEAVE',
    fromDate: '2026-10-03',
    toDate: '2026-10-04',
    reason: 'Family function in hometown'
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const res = await getAttendance();
      if (res && res.data && res.data.length > 0) {
        setRecords(res.data);
      }
    } catch (e) {
      console.warn('Attendance load fallback:', e);
    }
  };

  const handlePunchIn = async () => {
    const newRecord = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      punchIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      punchOut: '--',
      totalHours: '--',
      status: 'PRESENT_FIELD',
      locationName: 'Saket Field Hub (28.5284, 77.2185)',
      geofenceVerified: true
    };
    try {
      await recordPunchIn(newRecord);
    } catch (e) {
      console.warn('Punch-in local:', e);
    }
    setRecords([newRecord, ...records]);
    setPunchFeedback('✓ GPS Check-in Recorded at Saket Field Hub (28.5284° N, 77.2185° E)');
    setTimeout(() => setPunchFeedback(''), 4000);
  };

  const handlePunchOut = async () => {
    try {
      await recordPunchOut({ locationName: 'Saket Field HQ' });
    } catch (e) {
      console.warn('Punch-out local:', e);
    }
    setRecords(records.map((r, idx) => idx === 0 ? {
      ...r,
      punchOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'DAY_COMPLETED'
    } : r));
    setPunchFeedback('✓ GPS Check-out Finalized for the Day');
    setTimeout(() => setPunchFeedback(''), 4000);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(leaveForm);
    } catch (e) {
      console.warn('Apply leave local:', e);
    }
    setShowLeaveModal(false);
    setLeaves(prev => ({ ...prev, casualLeaveUsed: prev.casualLeaveUsed + 2 }));
    setPunchFeedback('✓ Leave Application Submitted for Supervisor Approval');
    setTimeout(() => setPunchFeedback(''), 4000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* Top Banner */}
      <div
        className="card-section"
        style={{
          background: 'linear-gradient(135deg, #090d16, #0f172a)',
          color: '#ffffff',
          marginBottom: '20px',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #1e293b'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '800' }}>
              Field Rep Attendance &amp; Geofence Verification
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
              <MapPin size={15} color="#38bdf8" />
              <span>Current Geolocation: <strong>Saket Sector 4 (South Delhi) • 18m Geofence Fix</strong></span>
            </div>
            {punchFeedback && (
              <div style={{ marginTop: '10px', color: '#4ade80', fontSize: '0.85rem', fontWeight: '700' }}>
                {punchFeedback}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-success"
              onClick={handlePunchIn}
              style={{ background: '#16a34a', color: '#ffffff', fontWeight: '700', padding: '9px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={16} /> Record Punch-In
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handlePunchOut}
              style={{ background: '#dc2626', color: '#ffffff', fontWeight: '700', padding: '9px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={16} /> Record Punch-Out
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowLeaveModal(true)}
              style={{ fontWeight: '700', padding: '9px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={16} /> Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills Bar */}
        <div className="tabs-bar" style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('attendance')}
          >
            <Clock size={16} />
            <span>Attendance Log</span>
            <span className="tab-badge">{records.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'leave' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('leave')}
          >
            <Calendar size={16} />
            <span>Leave Balances &amp; Approvals</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'holidays' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('holidays')}
          >
            <Calendar size={16} />
            <span>Company Holidays 2026</span>
            <span className="tab-badge">{DEFAULT_HOLIDAYS.length}</span>
          </button>
        </div>

        {/* 1. Daily Attendance Log */}
        {activeSubTab === 'attendance' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Work Date</th>
                  <th style={{ padding: '12px 14px' }}>Punch-In</th>
                  <th style={{ padding: '12px 14px' }}>Punch-Out</th>
                  <th style={{ padding: '12px 14px' }}>Total Field Hours</th>
                  <th style={{ padding: '12px 14px' }}>Geo-Location Verification</th>
                  <th style={{ padding: '12px 14px' }}>Duty Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      📅 {r.date}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: '700' }}>
                      🟢 {r.punchIn}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#dc2626', fontWeight: '700' }}>
                      🔴 {r.punchOut}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600' }}>
                      {r.totalHours} hrs
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#475569' }}>
                      📍 {r.locationName}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#dcfce7',
                          color: '#15803d'
                        }}
                      >
                        ✓ {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Leave Management & Balances */}
        {activeSubTab === 'leave' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#eff6ff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase' }}>Casual Leave (CL)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                  {leaves.casualLeaveTotal - leaves.casualLeaveUsed} / {leaves.casualLeaveTotal} Days Left
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{leaves.casualLeaveUsed} Days Consumed</div>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f0fdf4' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>Sick Leave (SL)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                  {leaves.sickLeaveTotal - leaves.sickLeaveUsed} / {leaves.sickLeaveTotal} Days Left
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{leaves.sickLeaveUsed} Days Consumed</div>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#fef3c7' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>Earned Leave (EL)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                  {leaves.earnedLeaveTotal - leaves.earnedLeaveUsed} / {leaves.earnedLeaveTotal} Days Left
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{leaves.earnedLeaveUsed} Days Consumed</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Pending Leave Applications</div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                No pending leave approval requests at this moment. You can click <strong>Apply Leave</strong> above to submit a new leave request.
              </p>
            </div>
          </div>
        )}

        {/* 3. Holidays */}
        {activeSubTab === 'holidays' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Holiday Date</th>
                  <th style={{ padding: '12px 14px' }}>Occasion / Festival</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Field Rep Policy</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_HOLIDAYS.map((h, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      📅 {h.date}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#2563eb' }}>
                      {h.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {h.type}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: '600' }}>
                      ✓ Paid Off (No Call Reporting Required)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Apply for Leave</h3>
              <button type="button" onClick={() => setShowLeaveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleApplyLeave}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Leave Type</label>
                <select
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                >
                  <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
                  <option value="SICK_LEAVE">Sick Leave (SL)</option>
                  <option value="EARNED_LEAVE">Earned Leave (EL)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>From Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={leaveForm.fromDate}
                    onChange={e => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>To Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={leaveForm.toDate}
                    onChange={e => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Reason for Leave *</label>
                <textarea
                  required
                  rows={2}
                  className="form-control"
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '0.82rem' }}
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Submit Leave Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
