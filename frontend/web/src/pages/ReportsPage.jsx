import React, { useState } from 'react';
import {
  FileText, Download, Filter, Calendar, Search,
  CheckCircle2, Printer, ChevronRight, BarChart3, Database
} from 'lucide-react';
import { useTenantTheme } from '../context/TenantThemeContext';
import { getLocalStore } from '../services/localDataStore';

export default function ReportsPage({ initialSubTab = 'standard-reports' }) {
  const { activeTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [reportType, setReportType] = useState('DOCTOR_COVERAGE');
  const [dateRange, setDateRange] = useState('September 2026');
  const [territory, setTerritory] = useState('ALL');

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  // Sample report rows
  const reportsData = [
    { id: 'R1', doctorName: 'Dr. Arvind Mehra', specialty: 'Cardiologist', hospital: 'Max Super Speciality Hospital', visitsCompleted: 3, visitsPlanned: 3, coveragePct: 100, samplesGiven: 12, lastVisitDate: '2026-09-28' },
    { id: 'R2', doctorName: 'Dr. Sunita Rao', specialty: 'Diabetologist', hospital: 'Fortis Escorts Heart Institute', visitsCompleted: 3, visitsPlanned: 3, coveragePct: 100, samplesGiven: 18, lastVisitDate: '2026-09-28' },
    { id: 'R3', doctorName: 'Dr. Vikram Sethi', specialty: 'Oncologist', hospital: 'Apollo Cancer Centre', visitsCompleted: 1, visitsPlanned: 2, coveragePct: 50, samplesGiven: 4, lastVisitDate: '2026-09-24' },
    { id: 'R4', doctorName: 'Dr. Rajesh K. Gupta', specialty: 'Cardiologist', hospital: 'Indraprastha Apollo Hospital', visitsCompleted: 2, visitsPlanned: 2, coveragePct: 100, samplesGiven: 8, lastVisitDate: '2026-09-26' },
    { id: 'R5', doctorName: 'Dr. Sneha Verma', specialty: 'Dermatologist', hospital: 'Kaya Skin Clinic', visitsCompleted: 1, visitsPlanned: 2, coveragePct: 50, samplesGiven: 6, lastVisitDate: '2026-09-25' }
  ];

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['Doctor Name', 'Specialty', 'Hospital / Clinic', 'Visits Completed', 'Visits Planned', 'Coverage %', 'Samples Given', 'Last Visit Date'];
    const rows = reportsData.map(r => [
      `"${r.doctorName}"`,
      `"${r.specialty}"`,
      `"${r.hospital}"`,
      r.visitsCompleted,
      r.visitsPlanned,
      `${r.coveragePct}%`,
      r.samplesGiven,
      r.lastVisitDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Alleviare_Report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <FileText size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operational &amp; Management Reporting
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Standard &amp; Custom SFA Reports Center
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Doctor Call Coverage • Call Frequency • Chemist Secondary Sales • TA/DA Expense Audit • Sample Consumption
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={handleExportCSV}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Report Template</label>
            <select
              className="form-control"
              style={{ height: '36px', borderRadius: '6px', fontSize: '0.82rem', padding: '0 10px' }}
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="DOCTOR_COVERAGE">HCP Coverage &amp; Frequency Report</option>
              <option value="CHEMIST_POB">Chemist POB Order Booking Report</option>
              <option value="EXPENSE_AUDIT">Monthly TA/DA Expense Summary</option>
              <option value="SAMPLE_LEDGER">Sample Batch Distribution Ledger</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Reporting Cycle</label>
            <select
              className="form-control"
              style={{ height: '36px', borderRadius: '6px', fontSize: '0.82rem', padding: '0 10px' }}
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option value="September 2026">Current Month (September 2026)</option>
              <option value="Q3 2026">Quarter 3 (Jul - Sep 2026)</option>
              <option value="August 2026">Last Month (August 2026)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Territory Filter</label>
            <select
              className="form-control"
              style={{ height: '36px', borderRadius: '6px', fontSize: '0.82rem', padding: '0 10px' }}
              value={territory}
              onChange={e => setTerritory(e.target.value)}
            >
              <option value="ALL">All Territories (National)</option>
              <option value="South Delhi">South Delhi &amp; Noida</option>
              <option value="Central Delhi">Central Delhi Belt</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table className="custom-table" style={{ margin: 0, width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px' }}>Doctor Name &amp; Specialty</th>
                <th style={{ padding: '12px 14px' }}>Hospital / Clinic Affiliation</th>
                <th style={{ padding: '12px 14px' }}>Visits Done vs Target</th>
                <th style={{ padding: '12px 14px' }}>Coverage Progress</th>
                <th style={{ padding: '12px 14px' }}>Samples Given</th>
                <th style={{ padding: '12px 14px' }}>Last Visited</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{r.doctorName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#2563eb' }}>{r.specialty}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#334155' }}>{r.hospital}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                    {r.visitsCompleted} / {r.visitsPlanned} Visits
                  </td>
                  <td style={{ padding: '12px 14px', minWidth: '140px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '700', marginBottom: '4px' }}>
                      <span>{r.coveragePct}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${r.coveragePct}%`, height: '100%', background: r.coveragePct >= 100 ? '#16a34a' : '#2563eb', borderRadius: '4px' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>{r.samplesGiven} Units</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#64748b' }}>📅 {r.lastVisitDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
