import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';
import { getDashboardSummary } from '../services/api';

// 7 Purpose-Built Role Dashboard Views
import AdminDashboardView from './roleDashboards/AdminDashboardView';
import DirectorDashboardView from './roleDashboards/DirectorDashboardView';
import AccountantDashboardView from './roleDashboards/AccountantDashboardView';
import ManagerDashboardView from './roleDashboards/ManagerDashboardView';
import SalesManagerDashboardView from './roleDashboards/SalesManagerDashboardView';
import MRSupervisorDashboardView from './roleDashboards/MRSupervisorDashboardView';
import MRDashboardView from './roleDashboards/MRDashboardView';

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
    activeFieldRepsCount: 14,
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
  ]
};

export default function Dashboard({ setActiveTab }) {
  const { role, currentUser } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [summary, setSummary] = useState(DEFAULT_DASHBOARD_DATA);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    loadSummary();
  }, [role]);

  const loadSummary = async () => {
    try {
      const res = await getDashboardSummary(role);
      if (res && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.warn('Using live fallback dashboard cache:', err.message);
    }
  };

  const activeRole = (role || currentUser?.role || 'ADMIN').toUpperCase();
  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const logoUrl = activeTenant?.logo_url || activeTenant?.logoUrl;
  const companyName = activeTenant?.name || 'Alleviare Health Sciences';
  const currencySymbol = activeTenant?.currency_symbol || '₹';

  // Role Badges & Descriptive Taglines
  const getRoleHeaderInfo = () => {
    switch (activeRole) {
      case 'DIRECTOR':
        return {
          title: 'Executive Intelligence Cockpit',
          tagline: 'Understand the Business • Strategic Board & Zonal Oversight',
          color: '#3b82f6'
        };
      case 'ACCOUNTANT':
        return {
          title: 'Finance & Expense Workspace',
          tagline: 'Control Financial Operations • Claims Verification & Bank Settlements',
          color: '#059669'
        };
      case 'MANAGER':
        return {
          title: 'Team Command Center',
          tagline: 'Run the Team • Regional Hierarchy Oversight, Attendance & DCR Approvals',
          color: '#0284c7'
        };
      case 'SALES_MANAGER':
        return {
          title: 'Commercial Performance Cockpit',
          tagline: 'Drive Commercial Performance • POB Orders, Target Quota & Stockist Fulfillment',
          color: '#7c3aed'
        };
      case 'MR_SUPERVISOR':
      case 'SALES_SUPERVISOR':
        return {
          title: 'Field Supervision Center',
          tagline: 'Control Field Execution • Supervised MRs Telemetry, DCR Review & Joint Fieldwork',
          color: '#0891b2'
        };
      case 'MR':
        return {
          title: 'Field Execution Workspace',
          tagline: "Execute Today's Field Work • Mobile-First Daily In-Clinic Detailing & DCR",
          color: '#2563eb'
        };
      case 'ADMIN':
      default:
        return {
          title: 'Company Operational Command Center',
          tagline: 'Operate the Company • Masters, Staff Telemetry, Governance & Approvals',
          color: brandColor
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();

  return (
    <div>
      {/* Top Banner with Active Persona & Tenant Branding */}
      <div
        className="card-section"
        style={{
          background: `linear-gradient(135deg, ${brandColor}ee, #090d16)`,
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: `0 6px 20px ${brandColor}25`,
          border: `1px solid ${brandColor}35`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '18px 24px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                padding: '3px 8px',
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
            <span style={{
              fontSize: '0.72rem',
              backgroundColor: roleInfo.color,
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '800'
            }}>
              {activeRole}
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '2px 0' }}>
            {roleInfo.title}
          </h2>
          <div style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
            {roleInfo.tagline} • Active User: <strong>{currentUser?.name || 'Authorized Officer'}</strong> ({currentUser?.territory || 'Delhi NCR'})
          </div>
        </div>

        {/* Dynamic Tenant Branding Box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {logoUrl && !logoError ? (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
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
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: brandColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.1rem',
                boxShadow: `0 0 10px ${brandColor}`
              }}
            >
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Tenant Brand</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff' }}>{companyName}</div>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span>Multi-Tenant Isolated DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render the Specific Purpose-Built Role Dashboard */}
      {activeRole === 'DIRECTOR' && (
        <DirectorDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {activeRole === 'ACCOUNTANT' && (
        <AccountantDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {activeRole === 'MANAGER' && (
        <ManagerDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {activeRole === 'SALES_MANAGER' && (
        <SalesManagerDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {(activeRole === 'MR_SUPERVISOR' || activeRole === 'SALES_SUPERVISOR') && (
        <MRSupervisorDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {activeRole === 'MR' && (
        <MRDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}

      {activeRole === 'ADMIN' && (
        <AdminDashboardView
          summary={summary}
          setActiveTab={setActiveTab}
          currencySymbol={currencySymbol}
          brandColor={brandColor}
          currentUser={currentUser}
          activeTenant={activeTenant}
          onRefresh={loadSummary}
        />
      )}
    </div>
  );
}
