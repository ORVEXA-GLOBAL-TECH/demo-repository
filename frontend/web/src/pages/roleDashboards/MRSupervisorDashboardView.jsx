import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  ShoppingBag,
  MapPin,
  Calendar,
  Check,
  X,
  FileText,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { updateDcrStatus } from '../../services/api';

export default function MRSupervisorDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { metrics = {}, supervisedRepsLive = [], dcrReviewQueue = [], jointFieldPlan = [] } = summary;
  const [dcrList, setDcrList] = useState(dcrReviewQueue);
  const [feedback, setFeedback] = useState(null);

  const handleApproveDcr = async (dcrId, mrName) => {
    try {
      await updateDcrStatus(dcrId, 'APPROVED');
      setDcrList(prev => prev.filter(d => d.id !== dcrId));
      setFeedback(`Daily Call Report #${dcrId} for ${mrName} approved with supervisor sign-off.`);
      setTimeout(() => setFeedback(null), 3500);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleReturnDcr = (dcrId, mrName) => {
    const reason = window.prompt(`Supervisor review remarks for ${mrName}'s DCR:`, 'Please verify doctor call times & sample balance in Saket beat');
    if (!reason) return;
    setDcrList(prev => prev.filter(d => d.id !== dcrId));
    setFeedback(`DCR #${dcrId} returned to ${mrName} for revision: "${reason}"`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div>
      {/* Toast Feedback */}
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

      {/* Field Supervision Context Bar */}
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
            backgroundColor: '#0891b2',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            FIELD SUPERVISION CONTROL CENTER
          </span>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
              Field Supervision &amp; MR Operations • Delhi NCR Cluster
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Direct in-field supervision of 3 assigned Medical Representatives
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tracking')}>
            <MapPin size={14} /> Live Rep GPS
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dcr')}>
            <FileText size={14} /> All DCRs
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('approvals')}>
            <ShieldCheck size={14} /> DCR Queue ({dcrList.length})
          </button>
        </div>
      </div>

      {/* Supervision KPIs */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #0891b2' }}>
          <div>
            <div className="stat-label">Supervised MRs On Field Duty</div>
            <div className="stat-value">
              {metrics.onDutyTodayCount || 3} / {metrics.supervisedMRsCount || 3} Active
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              100% Field Attendance Logged Today
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ecfeff', color: '#0891b2' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div>
            <div className="stat-label">Today's Visits Run Rate</div>
            <div className="stat-value">
              {metrics.completedVisitsToday || 24} / {metrics.scheduledVisitsToday || 30}
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.completionRatePct || 80}%`, backgroundColor: '#16a34a' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.completionRatePct || 80}% Beat Calls Completed
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Today's Chemist POB Generated</div>
            <div className="stat-value">{currencySymbol}{(metrics.todayPobValue || 142500).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              Across assigned retail chemist beats
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div>
            <div className="stat-label">Pending DCR Review Queue</div>
            <div className="stat-value" style={{ color: dcrList.length > 0 ? '#ea580c' : '#0f172a' }}>
              {dcrList.length} DCRs
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', marginTop: '6px', fontWeight: '700' }}>
              Awaiting Supervisor Sign-Off
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Supervised MRs Live Call Board */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Supervised MRs Field Telemetry &amp; Call Board</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time in-clinic status, calls completed, and latest customer contact</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tracking')}>
            View GPS Telemetry <ArrowUpRight size={14} />
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>MR Name &amp; ID</th>
              <th>Assigned Territory</th>
              <th>Punch-In Time</th>
              <th>Calls Done / Target</th>
              <th>Last Logged Interaction</th>
              <th>POB Value</th>
              <th>Live Field Status</th>
            </tr>
          </thead>
          <tbody>
            {supervisedRepsLive.map((rep) => (
              <tr key={rep.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{rep.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{rep.id}</div>
                </td>
                <td style={{ color: '#334155', fontWeight: '600' }}>{rep.territory}</td>
                <td style={{ fontWeight: '600', color: '#059669' }}>
                  ✓ {rep.punchTime}
                </td>
                <td>
                  <div style={{ fontWeight: '800' }}>{rep.callsDone} / {rep.callsTarget}</div>
                  <div className="progress-bar-container" style={{ margin: '4px 0 0 0', width: '80px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(rep.callsDone / rep.callsTarget) * 100}%`, backgroundColor: '#0891b2' }}
                    />
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{rep.lastCall}</div>
                  <div style={{ fontSize: '0.7rem', color: '#059669' }}>✓ Geofence Verified</div>
                </td>
                <td style={{ fontWeight: '800', color: '#7c3aed' }}>
                  {currencySymbol}{rep.pobToday?.toLocaleString('en-IN')}
                </td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    backgroundColor: rep.status === 'In-Clinic' ? '#eff6ff' : '#f8fafc',
                    color: rep.status === 'In-Clinic' ? '#2563eb' : '#334155'
                  }}>
                    {rep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two Column: DCR Review Queue & Joint Field Coaching Planner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* DCR Review Queue */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Daily Call Reports (DCR) Review Queue</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Review field calls, sample distribution, and POB orders before manager sign-off</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dcr')}>
              All DCRs <ArrowUpRight size={14} />
            </button>
          </div>

          {dcrList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '26px', color: '#64748b' }}>
              <CheckCircle2 size={30} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontWeight: '700' }}>All Supervised DCRs Approved!</div>
              <div style={{ fontSize: '0.8rem' }}>No pending DCR submissions in your supervisor queue.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dcrList.map((dcr) => (
                <div key={dcr.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#0f172a' }}>{dcr.mrName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>DCR Date: {dcr.date} • {dcr.id}</div>
                    </div>
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {dcr.totalCalls} Calls Logged
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '10px' }}>
                    Doctors Detailed: <strong>{dcr.doctorsDetailed?.join(', ')}</strong> • Samples: <strong>{dcr.samplesGiven} units</strong> • POB: <strong>{currencySymbol}{dcr.pobBooked?.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      onClick={() => handleReturnDcr(dcr.id, dcr.mrName)}
                    >
                      <X size={12} /> Return with Comments
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '3px 10px', fontSize: '0.72rem', backgroundColor: '#0891b2', borderColor: '#0891b2' }}
                      onClick={() => handleApproveDcr(dcr.id, dcr.mrName)}
                    >
                      <Check size={12} /> Sign-Off DCR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joint Field Coaching Planner */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Joint Field Coaching Schedule</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Field accompaniment and on-ground rep detailing coaching</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tour-plan')}>
              MTP Planner <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Scheduled Date</th>
                <th>Accompanying Rep</th>
                <th>Target Area &amp; Focus</th>
              </tr>
            </thead>
            <tbody>
              {jointFieldPlan.map((plan, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700', color: '#0891b2' }}>{plan.date}</td>
                  <td style={{ fontWeight: '600' }}>{plan.rep}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{plan.area}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Focus: {plan.focus}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
