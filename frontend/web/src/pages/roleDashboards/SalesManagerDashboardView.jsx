import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Target,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  Check,
  X,
  Building,
  Activity,
  Users
} from 'lucide-react';
import { updateOrderStatus } from '../../services/api';

export default function SalesManagerDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { metrics = {}, repLeaderboard = [], competitorPulse = [], pendingCommercialOrders = [], brandPerformance = [] } = summary;
  const [ordersList, setOrdersList] = useState(pendingCommercialOrders);
  const [feedback, setFeedback] = useState(null);

  const handleApproveCommercialOrder = async (orderId, chemist) => {
    try {
      await updateOrderStatus(orderId, 'APPROVED');
      setOrdersList(prev => prev.filter(o => o.id !== orderId));
      setFeedback(`Commercial order #${orderId} for ${chemist} approved and routed to Stockist.`);
      setTimeout(() => setFeedback(null), 3500);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
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

      {/* Commercial Performance Context Bar */}
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
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            COMMERCIAL PERFORMANCE COCKPIT
          </span>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
              Commercial Operations &amp; Secondary Sales Velocity
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Scope: POB order generation, stockist fulfillment, competitor share &amp; quota leaderboard
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={14} /> Orders Desk
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('competitors')}>
            <Activity size={14} /> Market Share
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('achievement')}>
            <Award size={14} /> Quota Leaderboard
          </button>
        </div>
      </div>

      {/* Commercial KPIs */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Commercial Net Revenue Target</div>
            <div className="stat-value">{currencySymbol}{(metrics.commercialRevenue || 16400000).toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.commercialPct || 88.6}%`, backgroundColor: '#7c3aed' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.commercialPct || 88.6}% of {currencySymbol}{(metrics.commercialTarget || 18500000).toLocaleString('en-IN')} Target
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div>
            <div className="stat-label">MoM Commercial Revenue Growth</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>
              +{metrics.momGrowthPct || 12.4}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              Solid expansion across cardiovascular &amp; metabolic lines
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <div className="stat-label">POB Order Velocity (Secondary Sales)</div>
            <div className="stat-value">{metrics.pobOrdersCount || 148} Orders</div>
            <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '6px', fontWeight: '700' }}>
              {currencySymbol}{(metrics.pobOrdersValue || 4850000).toLocaleString('en-IN')} Routed to Stockists
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div>
            <div className="stat-label">Top Territory Commercial Milestone</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{metrics.topTerritory || 'Delhi NCR (112%)'}</div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', marginTop: '6px', fontWeight: '700' }}>
              Top Brand: {metrics.topBrand || 'CardioShield 50mg'}
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Two Column: Rep Commercial Leaderboard & Competitor Intelligence Pulse */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Rep Commercial Leaderboard */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Field Rep Commercial Quota Leaderboard</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Representative quota rankings and chemist order generation</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('achievement')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank &amp; Representative</th>
                <th>Territory</th>
                <th>Target vs Realized</th>
                <th>Attainment</th>
                <th>POB Orders</th>
              </tr>
            </thead>
            <tbody>
              {repLeaderboard.map((rep) => (
                <tr key={rep.rank}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: rep.rank === 1 ? '#fef08a' : rep.rank === 2 ? '#e2e8f0' : '#ffedd5',
                        color: rep.rank === 1 ? '#854d0e' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '0.75rem'
                      }}>
                        #{rep.rank}
                      </span>
                      <span style={{ fontWeight: '700' }}>{rep.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.82rem' }}>{rep.territory}</td>
                  <td>
                    <div style={{ fontWeight: '800' }}>{currencySymbol}{rep.achieved.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Quota: {currencySymbol}{rep.target.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      backgroundColor: rep.pct >= 90 ? '#ecfdf5' : '#eff6ff',
                      color: rep.pct >= 90 ? '#059669' : '#2563eb'
                    }}>
                      {rep.pct}%
                    </span>
                  </td>
                  <td style={{ fontWeight: '700' }}>{rep.ordersCount} Orders</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Competitor Market Share Pulse */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Competitor Prescription &amp; Share Radar</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Market share comparisons with competing molecules</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('competitors')}>
              Competitors <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Our Brand (Share %)</th>
                <th>Top Competitor Molecule</th>
                <th>Competitor Share</th>
                <th>Share Shift</th>
              </tr>
            </thead>
            <tbody>
              {competitorPulse.map((comp, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#7c3aed' }}>{comp.brand}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Our Market Share: <strong>{comp.ourShare}%</strong></div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{comp.competitor}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {comp.compShare}%
                    </span>
                  </td>
                  <td>
                    <span style={{
                      color: '#059669',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      backgroundColor: '#ecfdf5',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {comp.delta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commercial Orders Clearance Queue */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Chemist POB Commercial Orders Clearance</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Authorize special chemist institutional discounts and release orders to stockists</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('orders')}>
            All Orders <ArrowUpRight size={14} />
          </button>
        </div>

        {ordersList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px', color: '#64748b' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: '700' }}>All Commercial Orders Cleared!</div>
            <div style={{ fontSize: '0.8rem' }}>No orders currently awaiting commercial clearance.</div>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order # &amp; Chemist</th>
                <th>Assigned Wholesale Stockist</th>
                <th>Order Value</th>
                <th>Special Discount</th>
                <th>Commercial Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#7c3aed' }}>{ord.id}</div>
                    <div style={{ fontSize: '0.78rem', color: '#0f172a' }}>{ord.chemist}</div>
                  </td>
                  <td style={{ color: '#475569', fontWeight: '600' }}>{ord.stockist}</td>
                  <td style={{ fontWeight: '800', fontSize: '0.96rem' }}>
                    {currencySymbol}{ord.value.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb'
                    }}>
                      {ord.discount} Off
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                      onClick={() => handleApproveCommercialOrder(ord.id, ord.chemist)}
                    >
                      <Check size={12} /> Clear &amp; Route Order
                    </button>
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
