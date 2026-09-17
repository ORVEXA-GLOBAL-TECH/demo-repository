import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, MapPin, UserCheck, Plus } from 'lucide-react';
import { getAttendance, recordPunchIn, recordPunchOut, applyLeave } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AttendancePage() {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'CASUAL_LEAVE',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const res = await getAttendance();
      setRecords(res.data || []);
      setLeaves(res.leaves || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePunchIn = async () => {
    try {
      await recordPunchIn({ locationName: 'Saket Field Hub (28.5284, 77.2185)', mrName: currentUser.name, mrId: currentUser.id });
      loadAttendanceData();
      alert('GPS Punch-In Recorded Successfully!');
    } catch (e) {
      alert('Failed to record punch-in');
    }
  };

  const handlePunchOut = async () => {
    try {
      await recordPunchOut({ locationName: 'Green Park Metro Station (28.5588, 77.2028)' });
      loadAttendanceData();
      alert('GPS Punch-Out Recorded Successfully!');
    } catch (e) {
      alert('Failed to record punch-out');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(leaveForm);
      setShowLeaveModal(false);
      loadAttendanceData();
      alert('Leave application submitted for approval.');
    } catch (e) {
      alert('Failed to apply leave');
    }
  };

  return (
    <div>
      {/* Attendance & Punch-In Bar */}
      <div className="card-section" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '800' }}>
              Field Rep Attendance & Geofence
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>
              Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
              <MapPin size={15} color="#38bdf8" />
              <span>Current Geolocation: <strong>Saket Sector 4 (South Delhi)</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-success" onClick={handlePunchIn}>
              <Clock size={16} /> Record Punch-In
            </button>
            <button className="btn btn-danger" onClick={handlePunchOut}>
              <Clock size={16} /> Record Punch-Out
            </button>
            <button className="btn btn-secondary" onClick={() => setShowLeaveModal(true)}>
              <Calendar size={16} /> Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Leave Balances Grid */}
      {leaves && (
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-label">Casual Leave (CL)</div>
              <div className="stat-value" style={{ color: '#2563eb' }}>
                {leaves.casualLeaveTotal - leaves.casualLeaveUsed} / {leaves.casualLeaveTotal} Days
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {leaves.casualLeaveUsed} Days Utilized
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Sick Leave (SL)</div>
              <div className="stat-value" style={{ color: '#059669' }}>
                {leaves.sickLeaveTotal - leaves.sickLeaveUsed} / {leaves.sickLeaveTotal} Days
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {leaves.sickLeaveUsed} Days Utilized
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Earned / Privilege Leave (EL)</div>
              <div className="stat-value" style={{ color: '#7c3aed' }}>
                {leaves.earnedLeaveTotal - leaves.earnedLeaveUsed} / {leaves.earnedLeaveTotal} Days
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Accrued annual quota
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Field Duty Compliance</div>
              <div className="stat-value" style={{ color: '#0d9488' }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: '700' }}>
                ✓ Top 5% in North Zone
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Logs Table */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Field Attendance & Working Hours Log</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              GPS punch-in/out stamps, field call count and POB sales booked during duty
            </p>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Officer Name</th>
              <th>Punch-In (Time & Geo)</th>
              <th>Punch-Out (Time & Geo)</th>
              <th>Total Hours</th>
              <th>Duty Status</th>
              <th>DCR Calls Done</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td style={{ fontWeight: '700' }}>{rec.date}</td>
                <td>
                  <div style={{ fontWeight: '600' }}>{rec.mrName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>{rec.mrId}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700', color: '#16a34a' }}>{rec.punchInTime || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.punchInLocation}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700', color: '#dc2626' }}>{rec.punchOutTime || 'Active In Field'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.punchOutLocation || '—'}</div>
                </td>
                <td style={{ fontWeight: '800' }}>{rec.totalHours ? `${rec.totalHours} hrs` : 'In Progress'}</td>
                <td>
                  <span className={`status-badge ${rec.status === 'PRESENT_FIELD' ? 'badge-approved' : 'badge-pending'}`}>
                    {rec.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: '#2563eb' }}>{rec.callsCompleted} Visits</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Apply For Field Leave</h3>
            <form onSubmit={handleApplyLeave}>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  className="form-control"
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                >
                  <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
                  <option value="SICK_LEAVE">Sick Leave (SL)</option>
                  <option value="EARNED_LEAVE">Earned Leave (EL)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={leaveForm.fromDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={leaveForm.toDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Leave</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder="State reason for absence..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
