import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  MapPin,
  Calendar,
  Check,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { updateDcrStatus, updateExpenseStatus } from '../../services/api';

export default function ManagerDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { metrics = {}, teamRoster = [], pendingApprovalsList = [] } = summary;
  const [approvals, setApprovals] = useState(pendingApprovalsList);
  const [feedback, setFeedback] = useState(null);

  const handleApproveItem = async (item) => {
    try {
      if (item.type === 'DCR') {
        await updateDcrStatus(item.id, 'APPROVED');
      } else if (item.type === 'EXPENSE') {
        await updateExpenseStatus(item.id, 'APPROVED', 'Approved by Area Manager');
      }
      setApprovals(prev => prev.filter(a => a.id !== item.id));
      setFeedback(`Team ${item.type} request #${item.id} approved for ${item.employee}.`);
      setTimeout(() => setFeedback(null), 3500);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Action error: ${err.message}`);
    }
  };

  const handleRejectItem = (item) => {
    setApprovals(prev => prev.filter(a => a.id !== item.id));
    setFeedback(`${item.type} request returned with managerial feedback to ${item.employee}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div>
      {/* Feedback Toast */}
      {feedback && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Team Hierarchy Context Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            TEAM COMMAND CENTER
          </span>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
              Assigned Regional Team Hierarchy • North Zone Sector
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Direct oversight of 1 Supervisor &amp; 5 Field Medical Representatives
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('attendance')}>
            <Clock size={14} /> Team Attendance
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tour-plan')}>
            <Calendar size={14} /> Tour Plans (MTP)
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('approvals')}>
            <ShieldCheck size={14} /> Team Approvals ({approvals.length})
          </button>
        </div>
      </div>

      {/* Team KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div>
            <div className="stat-label">Team Monthly Quota Target</div>
            <div className="stat-value">{currencySymbol}{(metrics.teamAchieved || 1640000).toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.teamQuotaPct || 88.6}%`, backgroundColor: '#0284c7' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.teamQuotaPct || 88.6}% of {currencySymbol}{(metrics.teamQuotaTarget || 1850000).toLocaleString('en-IN')} Target
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div>
            <div className="stat-label">Today's Team Field Attendance</div>
            <div className="stat-value">
              {metrics.teamAttendancePresent || 5} / {metrics.teamAttendanceTotal || 6} On Duty
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              83% Active in Field • 1 on approved leave
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Team Doctor Calls Logged Today</div>
            <div className="stat-value">{metrics.teamVisitsToday || 38} In-Clinic Calls</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              Across 5 active reps • Avg 7.6 calls/rep
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div>
            <div className="stat-label">Pending Team Action Items</div>
            <div className="stat-value" style={{ color: approvals.length > 0 ? '#ea580c' : '#0f172a' }}>
              {approvals.length} Requests
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', marginTop: '6px', fontWeight: '700' }}>
              DCR Reviews, Leave &amp; Expenses
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Live Team Roster & Telemetry */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Live Field Team Roster &amp; Status</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned medical representatives and field supervisor status</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tracking')}>
            Live GPS Map <ArrowUpRight size={14} />
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Representative &amp; Role</th>
              <th>Assigned Territory</th>
              <th>Punch-In &amp; Attendance</th>
              <th>Calls Today</th>
              <th>Monthly Quota</th>
              <th>Current Activity</th>
            </tr>
          </thead>
          <tbody>
            {teamRoster.map((rep) => (
              <tr key={rep.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{rep.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    <span style={{
                      backgroundColor: rep.role === 'MR_SUPERVISOR' ? '#eff6ff' : '#f8fafc',
                      color: rep.role === 'MR_SUPERVISOR' ? '#2563eb' : '#475569',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '700'
                    }}>
                      {rep.role}
                    </span>
                    {' '}• {rep.id}
                  </div>
                </td>
                <td style={{ fontWeight: '600', color: '#334155' }}>{rep.territory}</td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    backgroundColor: rep.attendance === 'CHECKED_IN' ? '#ecfdf5' : '#fffbeb',
                    color: rep.attendance === 'CHECKED_IN' ? '#059669' : '#d97706'
                  }}>
                    {rep.attendance === 'CHECKED_IN' ? `✓ IN at ${rep.checkInTime}` : 'ON LEAVE'}
                  </span>
                </td>
                <td style={{ fontWeight: '800', fontSize: '0.96rem' }}>
                  {rep.visitsLogged} Calls
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-container" style={{ flex: 1, margin: 0, minWidth: '60px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${rep.targetAchievedPct}%`,
                          backgroundColor: rep.targetAchievedPct >= 90 ? '#10b981' : '#3b82f6'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.76rem', fontWeight: '800' }}>{rep.targetAchievedPct}%</span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    backgroundColor: '#f1f5f9',
                    color: '#1e293b'
                  }}>
                    {rep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team Pending Approvals Action Queue */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Team Workload &amp; Approvals Queue</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending daily call reports, leave requests, and field travel claims</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('approvals')}>
            Full Queue <ArrowUpRight size={14} />
          </button>
        </div>

        {approvals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: '700' }}>All Team Items Cleared!</div>
            <div style={{ fontSize: '0.8rem' }}>No pending approvals for your reporting hierarchy.</div>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item Type</th>
                <th>Team Member</th>
                <th>Summary Description</th>
                <th>Submitted Date</th>
                <th>Manager Decision</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((appr) => (
                <tr key={appr.id}>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: appr.type === 'DCR' ? '#eff6ff' : appr.type === 'LEAVE' ? '#fff7ed' : '#ecfdf5',
                      color: appr.type === 'DCR' ? '#2563eb' : appr.type === 'LEAVE' ? '#ea580c' : '#059669'
                    }}>
                      {appr.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700' }}>{appr.employee}</td>
                  <td>{appr.summary}</td>
                  <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{appr.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => handleApproveItem(appr)}
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#dc2626' }}
                        onClick={() => handleRejectItem(appr)}
                      >
                        <X size={12} /> Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
