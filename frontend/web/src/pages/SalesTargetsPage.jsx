import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Target, DollarSign, Award, Plus, Search,
  Filter, CheckCircle2, ChevronRight, ArrowUpRight, BarChart2, X
} from 'lucide-react';
import { getSalesTargets, createTarget } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function SalesTargetsPage({ initialSubTab = 'targets' }) {
  const { activeTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [targets, setTargets] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTarget, setNewTarget] = useState({
    repName: 'Amit Verma (MR)',
    territory: 'South Delhi & Noida',
    quarter: 'Q4 2026 (Oct-Dec)',
    targetAmount: '500000',
    doctorCallTarget: '240',
    pobTarget: '200000'
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      const res = await getSalesTargets();
      if (res && res.data) {
        setTargets(res.data);
      }
    } catch (e) {
      console.warn('Targets load error:', e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `TGT-${Date.now()}`,
      repName: newTarget.repName,
      territory: newTarget.territory,
      quarter: newTarget.quarter,
      targetAmount: Number(newTarget.targetAmount) || 450000,
      achievedAmount: 0,
      pct: 0,
      doctorCallTarget: Number(newTarget.doctorCallTarget) || 200,
      doctorCallAchieved: 0,
      pobTarget: Number(newTarget.pobTarget) || 150000,
      pobAchieved: 0,
      status: 'NEW_ASSIGNED'
    };

    try {
      await createTarget(created);
    } catch (err) {
      console.warn('Local target create:', err);
    }

    setTargets([created, ...targets]);
    setShowAddModal(false);
  };

  const filteredTargets = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return targets;
    return targets.filter(t =>
      t.repName.toLowerCase().includes(q) ||
      t.territory.toLowerCase().includes(q) ||
      t.quarter.toLowerCase().includes(q)
    );
  }, [targets, search]);

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
              <TrendingUp size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Commercial Performance &amp; Quota Governance
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Sales Achievement &amp; Target Tracking Board
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Field Rep Revenue Quotas • POB Chemist Booking Milestones • Doctor Call Frequencies
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Set Quota Target</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'targets' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('targets')}
            >
              <Target size={16} />
              <span>Target vs Achievement</span>
              <span className="tab-badge">{targets.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('leaderboard')}
            >
              <Award size={16} />
              <span>Rep Leaderboard</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'brands' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('brands')}
            >
              <BarChart2 size={16} />
              <span>Brand Revenue Velocity</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search rep, territory, cycle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 1. Target vs Achievement Table */}
        {activeSubTab === 'targets' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Representative &amp; Territory</th>
                  <th style={{ padding: '12px 14px' }}>Evaluation Quarter</th>
                  <th style={{ padding: '12px 14px' }}>Target Revenue</th>
                  <th style={{ padding: '12px 14px' }}>Achieved Revenue</th>
                  <th style={{ padding: '12px 14px' }}>Achievement Progress</th>
                  <th style={{ padding: '12px 14px' }}>Doctor Call Target</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((t) => (
                  <tr key={t.id}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{t.repName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>📍 {t.territory}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>{t.quarter}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      ₹ {Number(t.targetAmount).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>
                      ₹ {Number(t.achievedAmount).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '150px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span>{t.pct}%</span>
                        <span style={{ color: t.pct >= 90 ? '#16a34a' : (t.pct >= 80 ? '#2563eb' : '#eab308') }}>
                          {t.pct >= 90 ? 'Outstanding' : (t.pct >= 80 ? 'On Track' : 'Needs Focus')}
                        </span>
                      </div>
                      <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, t.pct)}%`, height: '100%', background: t.pct >= 90 ? '#16a34a' : (t.pct >= 80 ? '#2563eb' : '#eab308'), borderRadius: '4px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#334155' }}>
                      <strong>{t.doctorCallAchieved}</strong> / {t.doctorCallTarget} Calls
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: t.status === 'STAR_PERFORMER' ? '#dcfce7' : '#eff6ff',
                          color: t.status === 'STAR_PERFORMER' ? '#15803d' : '#2563eb'
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Rep Leaderboard View */}
        {activeSubTab === 'leaderboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {targets.map((t, idx) => (
              <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', background: idx === 0 ? '#f0fdf4' : '#ffffff', position: 'relative' }}>
                {idx === 0 && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                    🏆 Top Rank #1
                  </span>
                )}
                <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>{t.repName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{t.territory}</div>
                <div style={{ marginTop: '14px', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                  {t.pct}% <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700' }}>Quota Achieved</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px' }}>
                  Revenue: <strong>₹ {Number(t.achievedAmount).toLocaleString()}</strong> / ₹ {Number(t.targetAmount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Brand Revenue Velocity View */}
        {activeSubTab === 'brands' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', background: '#ffffff' }}>
              <div style={{ fontWeight: '800', color: '#0f172a' }}>CardioShield 50mg</div>
              <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: '700' }}>Cardiology Specialty</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginTop: '10px' }}>₹ 1,45,000</div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '700' }}>97% of Monthly Brand Target</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', background: '#ffffff' }}>
              <div style={{ fontWeight: '800', color: '#0f172a' }}>GlucoMet Forte 500/5</div>
              <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: '700' }}>Diabetology Care</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginTop: '10px' }}>₹ 1,12,400</div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '700' }}>94% of Monthly Brand Target</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', background: '#ffffff' }}>
              <div style={{ fontWeight: '800', color: '#0f172a' }}>NeuroCalm Plus</div>
              <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: '700' }}>Neuro-Psychiatry</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginTop: '10px' }}>₹ 88,000</div>
              <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: '700' }}>88% of Monthly Brand Target</div>
            </div>
          </div>
        )}

      </div>

      {/* Add Target Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>+ Assign Quarterly Sales Quota</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Field Officer / Rep *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={newTarget.repName}
                  onChange={e => setNewTarget({ ...newTarget, repName: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Territory *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTarget.territory}
                    onChange={e => setNewTarget({ ...newTarget, territory: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Evaluation Period</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTarget.quarter}
                    onChange={e => setNewTarget({ ...newTarget, quarter: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Revenue Target (₹) *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTarget.targetAmount}
                    onChange={e => setNewTarget({ ...newTarget, targetAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Doctor Call Target</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTarget.doctorCallTarget}
                    onChange={e => setNewTarget({ ...newTarget, doctorCallTarget: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Save Quota Target</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
