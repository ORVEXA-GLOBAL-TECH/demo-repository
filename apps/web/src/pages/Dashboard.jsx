import React, { useEffect, useState } from 'react';
import {
  Users,
  Stethoscope,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getDcrReports, getOrders, getExpenses, getDoctors } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState({
    dcrCount: 0,
    ordersTotal: 0,
    pendingExpenses: 0,
    doctorsCovered: 0
  });
  const [recentDcrs, setRecentDcrs] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dcrRes, orderRes, expRes, docRes] = await Promise.all([
        getDcrReports(),
        getOrders(),
        getExpenses(),
        getDoctors()
      ]);

      const totalOrderVal = (orderRes.data || []).reduce((acc, o) => acc + (o.netAmount || 0), 0);
      const pendingExp = (expRes.data || []).filter(e => e.status === 'SUBMITTED').length;

      setStats({
        dcrCount: dcrRes.count || 0,
        ordersTotal: totalOrderVal,
        pendingExpenses: pendingExp,
        doctorsCovered: docRes.count || 0
      });

      setRecentDcrs((dcrRes.data || []).slice(0, 5));
      setRecentOrders((orderRes.data || []).slice(0, 4));
    } catch (err) {
      console.error('Failed loading dashboard stats:', err);
    }
  };

  return (
    <div>
      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total DCR Calls Today</div>
            <div className="stat-value">{stats.dcrCount} Calls</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
              ↑ 100% Target Met (North Zone)
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Total POB Orders Booked</div>
            <div className="stat-value">₹{stats.ordersTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
              ↑ 14.8% vs last week
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Doctor Master Coverage</div>
            <div className="stat-value">{stats.doctorsCovered} Specialists</div>
            <div style={{ fontSize: '0.78rem', color: '#6366f1', marginTop: '4px', fontWeight: '600' }}>
              Saket, Okhla & Noida
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-value" style={{ color: stats.pendingExpenses > 0 ? '#e11d48' : '#0f172a' }}>
              {stats.pendingExpenses} Claims
            </div>
            <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '4px', fontWeight: '600' }}>
              Requires Manager Sign-off
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <Receipt size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Recent DCR Visits */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Live Field Visits & Calls (DCR)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time MR call log & detailing updates</p>
            </div>
            <span className="status-badge badge-approved">Live Sync</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Target / Doctor</th>
                <th>Type</th>
                <th>Time</th>
                <th>Samples / Detailing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDcrs.map((dcr) => (
                <tr key={dcr.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{dcr.targetName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.hospital || dcr.contactPerson}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: dcr.targetType === 'DOCTOR' ? '#eff6ff' : '#f0fdf4',
                      color: dcr.targetType === 'DOCTOR' ? '#2563eb' : '#16a34a'
                    }}>
                      {dcr.targetType}
                    </span>
                  </td>
                  <td>{dcr.visitTime}</td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      {dcr.productsDetailed?.join(', ') || 'N/A'}
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
              <h2 className="section-title">Latest Personal Order Bookings (POB)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Direct chemist order flow & stockist distribution</p>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Chemist</th>
                <th>Net Amount</th>
                <th>Payment Terms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: '600', color: '#2563eb' }}>{ord.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{ord.chemistName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stockist: {ord.stockistName}</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{ord.netAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: '0.8rem' }}>{ord.paymentTerms}</td>
                  <td>
                    <span className={`status-badge ${ord.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>
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
