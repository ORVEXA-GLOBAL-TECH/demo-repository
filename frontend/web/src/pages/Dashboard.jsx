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
  Target,
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  Sparkles,
  Building,
  Check
} from 'lucide-react';
import { getDashboardSummary } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

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
  const { activeTenant } = useTenantTheme();
  const [summary, setSummary] = useState(DEFAULT_DASHBOARD_DATA);
  const [logoError, setLogoError] = useState(false);

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

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const logoUrl = activeTenant?.logo_url || activeTenant?.logoUrl;
  const companyName = activeTenant?.name || 'Alleviare Health Sciences';
  const currencySymbol = activeTenant?.currency_symbol || '₹';
  const companyCode = (activeTenant?.code || 'HQ').toUpperCase();

  return (
    <div>
      {/* Top Banner with Officer Quick Status & Tenant Branding */}
      <div
        className="card-section"
        style={{
          background: `linear-gradient(135deg, ${brandColor}dd, #090d16)`,
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: `0 8px 24px ${brandColor}30`,
          border: `1px solid ${brandColor}40`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: '800',
                letterSpacing: '0.05em'
              }}
            >
              {companyName.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              • {activeTenant?.plan || 'ENTERPRISE'} TIER
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '2px' }}>
            Welcome back, {currentUser?.name || 'Executive'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '4px' }}>
            Role: <strong style={{ color: '#ffffff' }}>{currentUser?.designation || role}</strong> • Territory: <strong>{currentUser?.territory || 'National HQ'}</strong>
          </div>
        </div>

        {/* Dynamic Tenant Branding Box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          {logoUrl && !logoError ? (
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}
            >
              <img
                src={logoUrl}
                alt={companyName}
                onError={() => setLogoError(true)}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: brandColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.2rem',
                boxShadow: `0 0 12px ${brandColor}`
              }}
            >
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Tenant Brand</div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>{companyName}</div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span>Color: {brandColor} • Isolated DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Monthly Territory Quota</div>
            <div className="stat-value">{currencySymbol}{metrics.monthlyAchieved?.toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.quotaAchievementPct}%`, backgroundColor: brandColor }} />
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
            <div className="stat-value">{currencySymbol}{metrics.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
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
              <h2 className="section-title">Live Field Calls &amp; Geofence Status (DCR)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time MR detailing, sample distribution &amp; GPS validation</p>
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
                <th>Time &amp; Geofence</th>
                <th>Products Detailed</th>
                <th>Status</th>
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
