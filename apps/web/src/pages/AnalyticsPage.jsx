import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, BarChart3, PieChart, Users, Stethoscope } from 'lucide-react';
import { getAnalytics } from '../services/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setData(res.data || null);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Territory Analytics...</div>;

  const { quotas, doctorCoverageStats, topDoctorsByPrescription, monthlyTrend } = data;
  const achievementPct = Math.round((quotas.monthlyAchievedRevenue / quotas.monthlyTargetRevenue) * 100);

  return (
    <div>
      {/* Top Quota Gauge / KPI */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <div className="stat-label">Monthly Sales Target (Sept 2026)</div>
            <div className="stat-value">₹{quotas.monthlyTargetRevenue.toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${achievementPct}%`, backgroundColor: '#2563eb' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              Achieved: ₹{quotas.monthlyAchievedRevenue.toLocaleString('en-IN')} ({achievementPct}%)
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Target size={26} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #059669' }}>
          <div>
            <div className="stat-label">Doctor Call Quota Target</div>
            <div className="stat-value">{quotas.completedDoctorVisits} / {quotas.targetDoctorVisits} Calls</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${Math.round((quotas.completedDoctorVisits/quotas.targetDoctorVisits)*100)}%`, backgroundColor: '#059669' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              90.0% Coverage (22 calls left)
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#059669' }}>
            <Stethoscope size={26} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Chemist Secondary Audit</div>
            <div className="stat-value">{quotas.completedChemistVisits} / {quotas.targetChemistVisits} Audits</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${Math.round((quotas.completedChemistVisits/quotas.targetChemistVisits)*100)}%`, backgroundColor: '#7c3aed' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              92.5% Target Achieved
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <Award size={26} />
          </div>
        </div>
      </div>

      {/* Brand-Wise Sales Performance Matrix */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Brand-Wise Sales Velocity & Quota Matrix</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Units sold, secondary revenue generated and month-over-month growth by therapeutic brand
            </p>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Therapeutic Brand</th>
              <th>Target Units</th>
              <th>Sold Units</th>
              <th>Unit Fulfillment (%)</th>
              <th>Revenue Generated</th>
              <th>MoM Growth</th>
            </tr>
          </thead>
          <tbody>
            {(quotas.brandPerformance || []).map((bp, idx) => {
              const fulfill = Math.round((bp.soldQty / bp.targetQty) * 100);
              return (
                <tr key={idx}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{bp.brand}</td>
                  <td>{bp.targetQty} packs</td>
                  <td style={{ fontWeight: '600' }}>{bp.soldQty} packs</td>
                  <td style={{ width: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-container" style={{ margin: 0 }}>
                        <div className="progress-bar-fill" style={{ width: `${fulfill}%`, backgroundColor: fulfill >= 90 ? '#16a34a' : '#2563eb' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>{fulfill}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#0f172a' }}>₹{bp.revenue.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '800' }}>
                      {bp.growth}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Two Column: Top Prescribing Doctors & 5-Month Sales Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Top Doctors by Prescription Index */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Top 4 Prescribing Key Opinion Leaders (KOLs)</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Prescription index score & brand alignment
              </p>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Doctor & Hospital</th>
                <th>Specialty</th>
                <th>Prescription Index</th>
                <th>Key Product</th>
              </tr>
            </thead>
            <tbody>
              {topDoctorsByPrescription.map((doc, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.hospital}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{doc.specialty}</td>
                  <td>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '800' }}>
                      {doc.rxIndex} / 100
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{doc.keyProduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5-Month Revenue Trend */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">5-Month Sales Revenue Trend</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Historical Target vs Realized Sales Revenue
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {monthlyTrend.map((m, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span>{m.month}</span>
                  <span>₹{m.achieved.toLocaleString('en-IN')} / ₹{m.target.toLocaleString('en-IN')}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, Math.round((m.achieved / m.target) * 100))}%`,
                      backgroundColor: m.achieved >= m.target ? '#16a34a' : '#3b82f6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
