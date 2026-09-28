import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Building,
  Users,
  Check,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import { updateExpenseStatus } from '../../services/api';

export default function AccountantDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { metrics = {}, claimsAging = {}, categorySpend = [], pendingClaimsQueue = [], recentReimbursements = [] } = summary;
  const [claimsList, setClaimsList] = useState(pendingClaimsQueue);
  const [feedback, setFeedback] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const handleApproveClaim = async (claimId, employee) => {
    try {
      await updateExpenseStatus(claimId, 'APPROVED', 'Verified against expense policy & receipts');
      setClaimsList(prev => prev.filter(c => c.id !== claimId));
      setFeedback(`Expense Claim #${claimId} (${employee}) verified & passed for bank payout batch.`);
      setTimeout(() => setFeedback(null), 3500);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Error verifying claim: ${err.message}`);
    }
  };

  const handleRejectClaim = async (claimId, employee) => {
    const reason = window.prompt(`Provide audit rejection reason for Claim #${claimId}:`, 'Policy exception: Hotel tariff exceeds metropolitan daily cap');
    if (!reason) return;

    try {
      await updateExpenseStatus(claimId, 'REJECTED', reason);
      setClaimsList(prev => prev.filter(c => c.id !== claimId));
      setFeedback(`Expense Claim #${claimId} rejected and returned to ${employee} with audit note.`);
      setTimeout(() => setFeedback(null), 3500);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleExportBankCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Batch_ID,Employee_Code,Employee_Name,Category,Amount_INR,Bank_Account_Number,IFSC_Code,Audit_Status\n"
      + "BATCH-2026-09B,ALV-E104,Priya Mukherjee,Zonal Airfare,14200,9928172615,HDFC000182,VERIFIED_APPROVED\n"
      + "BATCH-2026-09B,ALV-E105,Suresh Raina,Daily Allowance,8900,8819201918,ICIC000042,VERIFIED_APPROVED\n"
      + "BATCH-2026-09B,ALV-E107,Amit Verma,Travel Allowance,3450,5519201912,SBIN000412,VERIFIED_APPROVED";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Alleviare_Bank_NEFT_Settlement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback("Bank NEFT reimbursement payout file successfully generated & downloaded.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredClaims = filterCategory === 'ALL'
    ? claimsList
    : claimsList.filter(c => (c.category || '').toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div>
      {/* Action Feedback Banner */}
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

      {/* Financial Operations Context Bar */}
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
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.04em'
          }}>
            FINANCE &amp; EXPENSE OPERATIONS
          </span>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
              Claims Verification &amp; Reimbursement Center
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Company Financial Scope • Real-time policy audits &amp; bank settlement register
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('policies')}>
            <FileText size={14} /> TA/DA Policy Rules
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('claims')}>
            <Receipt size={14} /> All Claims Register
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportBankCsv}>
            <Download size={14} /> Export NEFT Settlement Batch
          </button>
        </div>
      </div>

      {/* Financial KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #059669' }}>
          <div>
            <div className="stat-label">Total Claims Submitted This Month</div>
            <div className="stat-value">{currencySymbol}{(metrics.totalClaimsValueMonth || 485000).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              Across {categorySpend.length || 4} Expense Categories
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <Receipt size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div>
            <div className="stat-label">Claims Awaiting Verification</div>
            <div className="stat-value" style={{ color: '#d97706' }}>
              {claimsList.length || metrics.claimsAwaitingVerificationCount || 8} Claims
            </div>
            <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '6px', fontWeight: '700' }}>
              {currencySymbol}{(metrics.claimsAwaitingVerificationValue || 64200).toLocaleString('en-IN')} Outstanding Verification
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <div className="stat-label">Approved Pending Bank Payout</div>
            <div className="stat-value">{currencySymbol}{(metrics.approvedPendingPayoutValue || 128500).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '6px', fontWeight: '700' }}>
              {metrics.approvedPendingPayoutCount || 14} Claims in Next Batch
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Total Disbursed (YTD Month)</div>
            <div className="stat-value">{currencySymbol}{(metrics.totalDisbursedMonth || 292300).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '6px', fontWeight: '700' }}>
              Avg Audit Turnaround: {metrics.averageTurnaroundDays || 2.1} Days
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Claims Aging & Policy Exceptions Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>Claims Aging Spectrum</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>{claimsAging.under3Days || 12}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>&lt; 3 Days</span>
              </div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#d97706' }}>{claimsAging.days3to7 || 6}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>3 - 7 Days</span>
              </div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#dc2626' }}>{claimsAging.over7Days || 1}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>&gt; 7 Days</span>
              </div>
            </div>
          </div>
          <Clock size={28} color="#64748b" />
        </div>

        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fef3c7',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: '700' }}>Policy Compliance Radar</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>
              {metrics.policyViolationCount || 3} Policy Flagged Items
            </div>
            <div style={{ fontSize: '0.74rem', color: '#78350f' }}>
              Hotel cap breaches &amp; out-of-station mileage exceptions
            </div>
          </div>
          <AlertTriangle size={28} color="#d97706" />
        </div>
      </div>

      {/* Two Column: Category Spend Breakdown & Recent Reimbursements Batches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Category Spend */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Expense Category Spend Distribution</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Breakdown of verified claims by corporate accounting head</p>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense Head</th>
                <th>Amount Disbursed</th>
                <th>Share %</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {categorySpend.map((cat, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700' }}>{cat.category}</td>
                  <td style={{ fontWeight: '800' }}>{currencySymbol}{cat.amount.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.74rem',
                      fontWeight: '800'
                    }}>
                      {cat.share}%
                    </span>
                  </td>
                  <td style={{ width: '140px' }}>
                    <div className="progress-bar-container" style={{ margin: 0 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${cat.share * 2}%`, backgroundColor: '#059669' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Reimbursement Batches */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Processed NEFT Reimbursement Batches</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Audited salary &amp; expense payout batches sent to corporate banking</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleExportBankCsv}>
              <Download size={14} /> Settlement Log
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Batch # &amp; Date</th>
                <th>Claims Settled</th>
                <th>Disbursed Value</th>
                <th>Bank Reference</th>
              </tr>
            </thead>
            <tbody>
              {recentReimbursements.map((batch, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#2563eb' }}>{batch.batchId}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{batch.date}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{batch.count} Claims</td>
                  <td style={{ fontWeight: '800', color: '#059669' }}>
                    {currencySymbol}{batch.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46'
                    }}>
                      {batch.bankRef}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Claims Verification Queue */}
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Interactive Claims Verification Queue</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Audit employee claims, receipts, and policy compliance before bank disbursement</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              style={{
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1'
              }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Travel">Travel Allowance (TA)</option>
              <option value="Daily">Daily Allowance (DA)</option>
              <option value="Hotel">Hotel &amp; Lodging</option>
            </select>
          </div>
        </div>

        {filteredClaims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontWeight: '700', fontSize: '0.96rem' }}>All Expense Claims Verified!</div>
            <div style={{ fontSize: '0.82rem' }}>No pending claims currently in the verification queue.</div>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Claim # &amp; Employee</th>
                <th>Category &amp; Dates</th>
                <th>Amount Claimed</th>
                <th>Policy Compliance</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{claim.employee || claim.employeeName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {claim.id} • {claim.territory || claim.employeeCode || 'Field Rep'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{claim.category}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{claim.dates || claim.expenseDate || 'Current Month'}</div>
                  </td>
                  <td style={{ fontWeight: '800', fontSize: '0.96rem' }}>
                    {currencySymbol}{(claim.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td>
                    {claim.policyStatus === 'FLAGGED_OVER_LIMIT' ? (
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          display: 'inline-block'
                        }}>
                          FLAGGED: EXCEEDS LIMIT
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#b91c1c', marginTop: '2px' }}>
                          {claim.limitNote}
                        </div>
                      </div>
                    ) : (
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        backgroundColor: '#ecfdf5',
                        color: '#065f46'
                      }}>
                        ✓ POLICY COMPLIANT
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem', backgroundColor: '#059669', borderColor: '#059669' }}
                        onClick={() => handleApproveClaim(claim.id, claim.employee)}
                      >
                        <Check size={12} /> Verify &amp; Pass
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => handleRejectClaim(claim.id, claim.employee)}
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
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
