import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Award,
  Globe2,
  CheckCircle2,
  Building,
  Users,
  Check,
  Briefcase,
  Layers,
  Activity
} from 'lucide-react';

export default function DirectorDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant
}) {
  const { metrics = {}, zonalPerformance = [], divisionBreakdown = [], strategicExceptions = [], strategicApprovals = [] } = summary;
  const [concurrenceFeedback, setConcurrenceFeedback] = useState(null);
  const [approvedItems, setApprovedItems] = useState([]);

  const handleConcurApproval = (id, title) => {
    setApprovedItems(prev => [...prev, id]);
    setConcurrenceFeedback(`Director strategic concurrence granted for: "${title}". Forwarded to Finance.`);
    setTimeout(() => setConcurrenceFeedback(null), 4000);
  };

  return (
    <div>
      {/* Strategic Concurrence Feedback */}
      {concurrenceFeedback && (
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
          <span>{concurrenceFeedback}</span>
        </div>
      )}

      {/* Executive Command Context Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '16px 22px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            EXECUTIVE INTELLIGENCE COCKPIT
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>
              Strategic Business Oversight • Pan-India Company Scope
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Authoritative view of revenue velocity, zonal attainment, risk exceptions and strategic commitments
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
            onClick={() => setActiveTab('analytics')}
          >
            <Activity size={14} /> Sales Velocity Analytics
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
            onClick={() => setActiveTab('standard-reports')}
          >
            <Layers size={14} /> Board Reports
          </button>
        </div>
      </div>

      {/* High-Signal Executive KPIs */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <div className="stat-label">Enterprise YTD Net Revenue</div>
            <div className="stat-value">{currencySymbol}{(metrics.totalEnterpriseRevenue || 68500000).toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.quotaAchievementPct || 85.6}%`, backgroundColor: '#2563eb' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.quotaAchievementPct || 85.6}% of {currencySymbol}{(metrics.annualTarget || 80000000).toLocaleString('en-IN')} Annual Board Target
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div>
            <div className="stat-label">Pan-India Doctor Coverage (Tier 1 &amp; 2)</div>
            <div className="stat-value">{metrics.doctorCoveragePct || 91.2}% Active</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.totalRegisteredDoctors || 480} Enlisted Doctors • {metrics.totalHospitalsCovered || 142} Hospitals
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Highest Contributing Division</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{metrics.topDivision || 'Cardiovascular Care'}</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              42% of Portfolio Net Revenue
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div>
            <div className="stat-label">Field Execution Scale &amp; Exceptions</div>
            <div className="stat-value">{metrics.activeFieldForceCount || 52} Reps</div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', marginTop: '6px', fontWeight: '700' }}>
              {metrics.underperformingTerritoriesCount || 3} Territories Below 70% Quota
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Strategic Risk & Exceptions Radar */}
      <div className="card-section" style={{ border: '1px solid #fee2e2', backgroundColor: '#fffdfd' }}>
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#dc2626" />
            <h2 className="section-title" style={{ color: '#991b1b' }}>Strategic Risk &amp; Exception Radar</h2>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: '700' }}>3 Items Requiring Attention</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {strategicExceptions.map((exc) => (
            <div key={exc.id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    backgroundColor: exc.severity === 'HIGH' ? '#fee2e2' : exc.severity === 'ACTION_REQUIRED' ? '#fef3c7' : '#e0e7ff',
                    color: exc.severity === 'HIGH' ? '#b91c1c' : exc.severity === 'ACTION_REQUIRED' ? '#92400e' : '#3730a3',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {exc.severity}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>{exc.type}</span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>{exc.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>{exc.issue}</div>
              </div>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Impact: <strong>{exc.impact || 'Business'}</strong></span>
                <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => setActiveTab('analytics')}>
                  Investigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Zonal Commercial Performance & Therapeutic Division Contribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Zonal Commercial Performance */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Pan-India Zonal Attainment League</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Zonal targets vs realized revenue across Indian sales zones</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('zones')}>
              Zonal Detail <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Zone &amp; Leadership</th>
                <th>Realized Revenue</th>
                <th>Target Quota</th>
                <th>Attainment %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {zonalPerformance.map((zone, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{zone.zone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>RSM: {zone.rsm} • {zone.reps} Field Reps</div>
                  </td>
                  <td style={{ fontWeight: '800' }}>{currencySymbol}{(zone.achieved / 100000).toFixed(1)} Lakhs</td>
                  <td style={{ color: '#64748b' }}>{currencySymbol}{(zone.target / 100000).toFixed(1)} Lakhs</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-container" style={{ flex: 1, margin: 0, minWidth: '70px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(100, zone.pct)}%`,
                            backgroundColor: zone.pct >= 90 ? '#10b981' : zone.pct >= 80 ? '#3b82f6' : '#ef4444'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '800' }}>{zone.pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: zone.pct >= 90 ? '#ecfdf5' : zone.pct >= 80 ? '#eff6ff' : '#fef2f2',
                      color: zone.pct >= 90 ? '#059669' : zone.pct >= 80 ? '#2563eb' : '#dc2626'
                    }}>
                      {zone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Division Breakdown */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Therapeutic Division Contribution</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Portfolio share and YoY revenue trajectory by therapy</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('divisions')}>
              Divisions <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Division &amp; Top Formulation</th>
                <th>YTD Revenue</th>
                <th>Share %</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {divisionBreakdown.map((div, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{div.division}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Top Brand: {div.topProduct}</div>
                  </td>
                  <td style={{ fontWeight: '800' }}>{currencySymbol}{(div.revenue / 10000000).toFixed(2)} Cr</td>
                  <td>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '800'
                    }}>
                      {div.share}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#059669', fontWeight: '800', fontSize: '0.82rem' }}>
                      {div.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Concurrence & Board Approvals Queue */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Director Strategic Concurrence Queue</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>High-value institutional contracts, CME sponsorships, and strategic rate agreements</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('approvals')}>
            All Approvals <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          {strategicApprovals.map((appr) => {
            const isApproved = approvedItems.includes(appr.id);
            return (
              <div key={appr.id} style={{
                backgroundColor: '#ffffff',
                border: isApproved ? '1px solid #10b981' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {appr.category}
                    </span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', marginTop: '6px', color: '#0f172a' }}>
                      {appr.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                    {appr.value}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                  Requested by: <strong>{appr.requestedBy}</strong> • Date: {appr.date}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {isApproved ? (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#059669',
                      fontSize: '0.82rem',
                      fontWeight: '800'
                    }}>
                      <Check size={16} /> Strategic Concurrence Granted
                    </span>
                  ) : (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('standard-reports')}>
                        Review Financial Audit
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleConcurApproval(appr.id, appr.title)}
                      >
                        <Check size={14} /> Concur Approval
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
