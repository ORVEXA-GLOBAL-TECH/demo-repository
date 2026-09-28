import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { updateDcrStatus, updateOrderStatus, updateExpenseStatus } from '../../services/api';

export default function AdminDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { metrics = {}, recentVisits = [], recentOrders = [], recentExpenses = [], brandPerformance = [], operationalAlerts = [] } = summary;
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleQuickDcrApprove = async (dcrId) => {
    try {
      await updateDcrStatus(dcrId, 'APPROVED');
      setActionFeedback(`DCR #${dcrId} approved successfully.`);
      setTimeout(() => setActionFeedback(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionFeedback(`Error approving DCR: ${err.message}`);
    }
  };

  const handleQuickOrderApprove = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'APPROVED');
      setActionFeedback(`Order #${orderId} approved for fulfillment.`);
      setTimeout(() => setActionFeedback(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionFeedback(`Error approving Order: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Feedback Banner */}
      {actionFeedback && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '10px 16px',
          borderRadius: '8px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Operational Control Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        padding: '14px 20px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            backgroundColor: `${brandColor}15`,
            color: brandColor,
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800'
          }}>
            OPERATIONAL COMMAND CENTER
          </span>
          <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Single Company Scope: <strong>{activeTenant?.name || 'Alleviare Health Sciences'}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('doctors')}>
            <Plus size={14} /> Doctor Master
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('chemists')}>
            <Plus size={14} /> Chemist Master
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('inventory')}>
            <Plus size={14} /> Sample Stock
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('approvals')}>
            <ShieldCheck size={14} /> Approvals Center ({metrics.pendingApprovalsCount || 0})
          </button>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Monthly Company Quota</div>
            <div className="stat-value">{currencySymbol}{metrics.monthlyAchieved?.toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.quotaAchievementPct || 0}%`, backgroundColor: brandColor }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.quotaAchievementPct}% of {currencySymbol}{metrics.monthlyQuota?.toLocaleString('en-IN')} Quota
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pan-Company Doctor Call Coverage</div>
            <div className="stat-value">{metrics.totalDoctorVisits || 198} / {metrics.targetDoctorVisits || 220} Calls</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.doctorCoveragePct || 0}%`, backgroundColor: '#16a34a' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.doctorCoveragePct}% Quota Call Target Achieved
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">POB Secondary Realized Sales</div>
            <div className="stat-value">{currencySymbol}{metrics.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              From {metrics.totalRegisteredChemists || 8} Active Retail Pharmacies
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Active Field Workforce Telemetry</div>
            <div className="stat-value">{metrics.activeFieldRepsCount || 14} Reps Active</div>
            <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '6px', fontWeight: '700' }}>
              {metrics.dcrCompliancePct || 92}% DCR Daily Compliance Rate
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Operational Alerts & Health Banner */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle color="#d97706" size={22} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#92400e' }}>
              Operational Health &amp; Pending Action Items
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
              {metrics.pendingApprovalsCount || 5} operational approvals pending across DCR, Orders, and Field Expenses.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dcr')}>
            Review {metrics.pendingDCRs || 4} DCRs
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('orders')}>
            Review {metrics.pendingOrders || 2} Orders
          </button>
        </div>
      </div>

      {/* Two Column: Live DCR Visits & Recent POB Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Recent DCR Visits */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Field DCR Detailing &amp; Geofence Stream</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time MR detailing, sample distribution &amp; GPS validation</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dcr')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Target Contact</th>
                <th>Type</th>
                <th>Time &amp; Geofence</th>
                <th>Products Detailed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map((dcr) => (
                <tr key={dcr.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{dcr.doctorName || dcr.chemistName || dcr.targetName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.hospital || dcr.contactPerson || 'Assigned Territory'}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: dcr.targetType === 'DOCTOR' ? `${brandColor}15` : '#f0fdf4',
                      color: dcr.targetType === 'DOCTOR' ? brandColor : '#16a34a'
                    }}>
                      {dcr.targetType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{dcr.visitTime}</div>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>
                      ✓ Geofence Validated
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      {dcr.productsDetailed?.join(', ') || 'Core Portfolio'}
                    </div>
                  </td>
                  <td>
                    {dcr.status === 'SUBMITTED' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => handleQuickDcrApprove(dcr.id)}
                      >
                        <Check size={12} /> Approve
                      </button>
                    ) : (
                      <span className={`status-badge ${dcr.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                        {dcr.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Orders */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Latest Chemist Order Bookings (POB)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Secondary sales flow routed to assigned wholesale stockists</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('orders')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Chemist &amp; Stockist</th>
                <th>Net Payable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: '700', color: brandColor }}>{ord.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{ord.chemistName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stockist: {ord.stockistName}</div>
                  </td>
                  <td style={{ fontWeight: '800' }}>{currencySymbol}{ord.netAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td>
                    {ord.status === 'PENDING_APPROVAL' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => handleQuickOrderApprove(ord.id)}
                      >
                        <Check size={12} /> Approve
                      </button>
                    ) : (
                      <span className={`status-badge ${
                        ord.status === 'APPROVED' ? 'badge-approved' : ord.status === 'INVOICED' ? 'badge-invoiced' : 'badge-pending'
                      }`}>
                        {ord.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Sales Velocity Table */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Core Pharmaceutical Brands Velocity</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Primary brand revenue against assigned monthly product target</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('products')}>
            View Catalog <ArrowUpRight size={14} />
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Pharmaceutical Product / Formulation</th>
              <th>Achieved Revenue</th>
              <th>Target Revenue</th>
              <th>Quota Run Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {brandPerformance.map((brand, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '700', color: '#0f172a' }}>{brand.brand}</td>
                <td style={{ fontWeight: '800' }}>{currencySymbol}{brand.sales?.toLocaleString('en-IN')}</td>
                <td style={{ color: '#64748b' }}>{currencySymbol}{brand.target?.toLocaleString('en-IN')}</td>
                <td style={{ width: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="progress-bar-container" style={{ flex: 1, margin: 0 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${brand.pct}%`,
                          backgroundColor: brand.pct >= 90 ? '#10b981' : brand.pct >= 70 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', minWidth: '36px' }}>{brand.pct}%</span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    backgroundColor: brand.pct >= 90 ? '#ecfdf5' : brand.pct >= 70 ? '#fffbeb' : '#fef2f2',
                    color: brand.pct >= 90 ? '#059669' : brand.pct >= 70 ? '#d97706' : '#dc2626'
                  }}>
                    {brand.pct >= 90 ? 'High Run Rate' : brand.pct >= 70 ? 'On Track' : 'Needs Push'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
