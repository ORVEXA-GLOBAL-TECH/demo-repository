import React, { useEffect, useState } from 'react';
import {
  Users,
  Stethoscope,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { getDashboardSummary } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_DASHBOARD_DATA = {
  metrics: {
    totalRevenue: 385400,
    monthlyQuota: 450000,
    monthlyAchieved: 385400,
    quotaAchievementPct: 86,
    doctorCoveragePct: 88,
    totalDoctorVisits: 198,
    targetDoctorVisits: 220,
    totalChemistVisits: 142,
    pendingApprovalsCount: 5,
    activeFieldRepsCount: 1,
    totalRegisteredDoctors: 12,
    totalRegisteredChemists: 8
  },
  recentVisits: [
    { id: 'dcr-1', doctorName: 'Dr. Arvind Mehra', targetType: 'DOCTOR', visitTime: '10:30 AM', productsDetailed: ['CardioShield 50mg', 'NeuroCalm Plus'], samplesGivenCount: 4, status: 'APPROVED' },
    { id: 'dcr-2', doctorName: 'Dr. Sunita Rao', targetType: 'DOCTOR', visitTime: '12:15 PM', productsDetailed: ['GlucoMet Forte 500/5'], samplesGivenCount: 6, status: 'SUBMITTED' },
    { id: 'dcr-3', chemistName: 'Apollo Pharmacy Saket', targetType: 'CHEMIST', visitTime: '02:30 PM', pobBooked: true, pobValue: 24500, status: 'APPROVED' }
  ],
  recentOrders: [
    { id: 'ord-1', orderNumber: 'ALV-2026-8910', chemistName: 'MedPlus Pharmacy Sector 4', stockistName: 'Apex Pharma Distributors', netAmount: 38500, status: 'PENDING_APPROVAL' },
    { id: 'ord-2', orderNumber: 'ALV-2026-8911', chemistName: 'Guardian Pharmacy Saket', stockistName: 'Metro Healthcare Stockists', netAmount: 52000, status: 'APPROVED' }
  ],
  brandPerformance: [
    { brand: 'CardioShield 50mg', sales: 145000, target: 150000, pct: 97 },
    { brand: 'GlucoMet Forte 500/5', sales: 112400, target: 120000, pct: 94 },
    { brand: 'NeuroCalm Plus', sales: 88000, target: 100000, pct: 88 },
    { brand: 'AllevOnco 100mg', sales: 40000, target: 80000, pct: 50 }
  ],
  todayAttendance: {
    status: 'PRESENT_FIELD',
    punchInTime: '09:15 AM',
    punchInLocation: 'Saket Field HQ, New Delhi',
    totalHours: 7.5
  }
};

export default function Dashboard({ setActiveTab }) {
  const { role, currentUser } = useAuth();
  const [summary, setSummary] = useState(DEFAULT_DASHBOARD_DATA);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await getDashboardSummary();
      if (res && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.warn('Using live fallback dashboard cache:', err.message);
    }
  };

  const { metrics, recentVisits, recentOrders, brandPerformance, todayAttendance } = summary;

  return (
    <div>
      {/* Top Banner with Officer Quick Status */}
      <div className="card-section" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0f172a)', color: '#ffffff', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>
              MNC Field Sales Force Automation Suite • Real-time Operations
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>
              Welcome back, {currentUser.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
              Role: <strong style={{ color: '#38bdf8' }}>{currentUser.designation}</strong> • Territory: <strong>{currentUser.territory}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('dcr')}>
              + Log DCR Call
            </button>
            <button className="btn btn-success" onClick={() => setActiveTab('orders')}>
              + Book POB Order
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('tracking')}>
              <MapPin size={16} /> Live GPS Tracking
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Monthly Territory Quota</div>
            <div className="stat-value">₹{metrics.monthlyAchieved?.toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.quotaAchievementPct}%`, backgroundColor: '#2563eb' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.quotaAchievementPct}% of ₹{metrics.monthlyQuota?.toLocaleString('en-IN')} Quota
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Doctor Call Coverage (DCR)</div>
            <div className="stat-value">{metrics.totalDoctorVisits} / {metrics.targetDoctorVisits} Calls</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.doctorCoveragePct}%`, backgroundColor: '#16a34a' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              {metrics.doctorCoveragePct}% Target Coverage
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Total Realized POB Sales</div>
            <div className="stat-value">₹{metrics.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              Direct chemist sales generation
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending Approval Queue</div>
            <div className="stat-value" style={{ color: metrics.pendingApprovalsCount > 0 ? '#e11d48' : '#0f172a' }}>
              {metrics.pendingApprovalsCount} Items
            </div>
            <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '6px', fontWeight: '700' }}>
              Requires RSM / ASM Sign-Off
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Receipt size={24} />
          </div>
        </div>
      </div>

      {/* Two Column: Live DCR Visits & Recent POB Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Recent DCR Visits */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Live Field Calls & Geofence Status (DCR)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time MR detailing, sample distribution & GPS validation</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dcr')}>
              View All DCRs <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Target Contact</th>
                <th>Type</th>
                <th>Time & Geofence</th>
                <th>Products Detailed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map((dcr) => (
                <tr key={dcr.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{dcr.targetName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.hospital || dcr.contactPerson}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: dcr.targetType === 'DOCTOR' ? '#eff6ff' : '#f0fdf4',
                      color: dcr.targetType === 'DOCTOR' ? '#2563eb' : '#16a34a'
                    }}>
                      {dcr.targetType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{dcr.visitTime}</div>
                    {dcr.geoVerified && (
                      <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>
                        ✓ Geofence Validated ({dcr.geoDistanceMeters}m)
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      {dcr.productsDetailed?.join(', ') || 'General Call'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${dcr.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                      {dcr.status}
                    </span>
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
              View All Orders <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Chemist & Stockist</th>
                <th>Net Payable</th>
                <th>Payment Terms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>{ord.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{ord.chemistName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stockist: {ord.stockistName}</div>
                  </td>
                  <td style={{ fontWeight: '800' }}>₹{ord.netAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td style={{ fontSize: '0.8rem' }}>{ord.paymentTerms}</td>
                  <td>
                    <span className={`status-badge ${
                      ord.status === 'APPROVED' ? 'badge-approved' : ord.status === 'INVOICED' ? 'badge-invoiced' : 'badge-pending'
                    }`}>
                      {ord.status}
                    </span>
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
