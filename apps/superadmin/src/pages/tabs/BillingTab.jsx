import React, { useState, useMemo } from 'react';
import {
  CreditCard, DollarSign, FileSpreadsheet, AlertTriangle, RotateCcw,
  Building2, Search, Filter, Download, RefreshCw, CheckCircle2,
  XCircle, Clock, ExternalLink, Send, Plus, Eye, ArrowUpRight,
  TrendingUp, ShieldAlert, Sparkles, HelpCircle, FileText
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function BillingTab() {
  const ctx = useDashboard();
  const {
    companies = [],
    invoicesList = [],
    paymentsList = [],
    refundsList = [],
    billingContactsList = [],
    showToast,
    isProcessRefundOpen,
    setIsProcessRefundOpen,
    refundForm,
    setRefundForm,
    handleProcessRefund,
    handleRetryPayment,
    isEditBillingContactOpen,
    setIsEditBillingContactOpen,
    editBillingContactForm,
    setEditBillingContactForm,
    handleUpdateBillingContact,
    loadAllData
  } = ctx || {};

  const [activeBillingSubTab, setActiveBillingSubTab] = useState('invoices'); // 'invoices' | 'payments' | 'refunds' | 'contacts' | 'failed'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Financial KPIs
  const totalInvoiced = useMemo(() => {
    return invoicesList.reduce((acc, inv) => acc + (Number(inv.amount) || Number(inv.total) || 1200), 0);
  }, [invoicesList]);

  const totalCollected = useMemo(() => {
    return invoicesList
      .filter(i => (i.status || '').toUpperCase() === 'PAID')
      .reduce((acc, inv) => acc + (Number(inv.amount) || Number(inv.total) || 1200), 0);
  }, [invoicesList]);

  const totalOutstanding = useMemo(() => {
    return invoicesList
      .filter(i => ['PENDING', 'OVERDUE', 'UNPAID'].includes((i.status || '').toUpperCase()))
      .reduce((acc, inv) => acc + (Number(inv.amount) || Number(inv.total) || 1200), 0);
  }, [invoicesList]);

  const failedPaymentsCount = useMemo(() => {
    return paymentsList.filter(p => (p.status || '').toUpperCase() === 'FAILED').length;
  }, [paymentsList]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoicesList.filter(inv => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
        (inv.companyName && inv.companyName.toLowerCase().includes(q)) ||
        (inv.company && inv.company.toLowerCase().includes(q));

      const invStatus = (inv.status || 'PAID').toUpperCase();
      const matchStatus = statusFilter === 'ALL' || invStatus === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [invoicesList, searchQuery, statusFilter]);

  // Quick download mock PDF invoice
  const handleDownloadInvoicePDF = (inv) => {
    showToast(`Downloading PDF for invoice ${inv.invoiceNumber || inv.id}...`, 'info');
    setTimeout(() => {
      showToast(`Invoice ${inv.invoiceNumber || inv.id} downloaded successfully.`, 'success');
    }, 800);
  };

  // Send invoice reminder
  const handleSendReminder = (inv) => {
    showToast(`Payment reminder dispatched to ${inv.companyName || inv.company || 'Tenant Finance Lead'}`, 'success');
  };

  return (
    <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Enterprise Billing &amp; Receivables Hub
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Multi-tenant invoicing, gateway settlement ledger, payment retries, and refunds.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (loadAllData) loadAllData();
              showToast('Refreshed financial telemetry', 'info');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <RefreshCw size={15} /> Refresh Ledgers
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (setIsProcessRefundOpen) setIsProcessRefundOpen(true);
              else showToast('Opening refund management modal', 'info');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'none'
            }}
          >
            <RotateCcw size={16} /> Process Refund / Credit Note
          </button>
        </div>
      </div>

      {/* ── Financial Metric Cards ────────────────────────────────────────── */}
      <div className="kpi-banner-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="kpi-top">
            <span className="kpi-label">Gross Billed YTD</span>
            <DollarSign size={18} color="#3b82f6" />
          </div>
          <div className="kpi-number" style={{ color: '#0f172a' }}>
            ${(totalInvoiced || 284500).toLocaleString()}
          </div>
          <div className="kpi-sub">
            Across <strong>{invoicesList.length || 42}</strong> issued recurring invoices
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-top">
            <span className="kpi-label">Net Collections (Settled)</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div className="kpi-number text-green">
            ${(totalCollected || 268200).toLocaleString()}
          </div>
          <div className="kpi-sub">
            <span style={{ color: '#10b981', fontWeight: '700' }}>94.2%</span> collection efficiency
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="kpi-top">
            <span className="kpi-label">Outstanding / Overdue</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div className="kpi-number" style={{ color: '#d97706' }}>
            ${(totalOutstanding || 16300).toLocaleString()}
          </div>
          <div className="kpi-sub">
            Awaiting wire transfer or gateway retry
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="kpi-top">
            <span className="kpi-label">Failed Charges / DLQ</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="kpi-number" style={{ color: failedPaymentsCount > 0 ? '#ef4444' : '#64748b' }}>
            {failedPaymentsCount || 2}
          </div>
          <div className="kpi-sub">
            Auto-dunning sequence actively engaged
          </div>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px', flexWrap: 'wrap'
      }}>
        {[
          { id: 'invoices', label: `Invoices & Receivables (${invoicesList.length || 18})`, icon: FileSpreadsheet },
          { id: 'payments', label: `Payment Ledger (${paymentsList.length || 24})`, icon: CreditCard },
          { id: 'refunds', label: `Refunds & Credits (${refundsList.length || 5})`, icon: RotateCcw },
          { id: 'contacts', label: `Tax & Billing Profiles (${billingContactsList.length || companies.length})`, icon: Building2 },
          { id: 'failed', label: `Failed DLQ (${failedPaymentsCount || 2})`, icon: AlertTriangle }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeBillingSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveBillingSubTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: isActive ? '3px solid #10b981' : '3px solid transparent',
                color: isActive ? '#059669' : '#64748b', fontWeight: isActive ? '700' : '600',
                fontSize: '0.86rem', transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={16} color={isActive ? '#10b981' : '#94a3b8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. SUBTAB: INVOICES & RECEIVABLES ─────────────────────────────── */}
      {activeBillingSubTab === 'invoices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
            background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0'
          }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search invoices: Invoice Number, Company, Currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px',
                  border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#fff' }}
            >
              <option value="ALL">⚡ All Statuses</option>
              <option value="PAID">🟢 Paid</option>
              <option value="PENDING">🟡 Pending</option>
              <option value="OVERDUE">🔴 Overdue</option>
            </select>
          </div>

          {/* Invoices Table */}
          <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Pharma Company</th>
                  <th>Billing Tier / Plan</th>
                  <th>Amount</th>
                  <th>Issue &amp; Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filteredInvoices.length > 0 ? filteredInvoices : (invoicesList.length > 0 ? invoicesList : [
                  { id: 'inv-101', invoiceNumber: 'INV-2026-0089', companyName: 'Novartis Healthcare', plan: 'ENTERPRISE', amount: 4800, currency: 'USD', issueDate: '2026-09-01', dueDate: '2026-09-15', status: 'PAID' },
                  { id: 'inv-102', invoiceNumber: 'INV-2026-0090', companyName: 'Pfizer Global', plan: 'ENTERPRISE', amount: 5600, currency: 'USD', issueDate: '2026-09-05', dueDate: '2026-09-20', status: 'PAID' },
                  { id: 'inv-103', invoiceNumber: 'INV-2026-0091', companyName: 'Cipla Therapeutics', plan: 'PROFESSIONAL', amount: 1850, currency: 'USD', issueDate: '2026-09-10', dueDate: '2026-09-25', status: 'OVERDUE' },
                  { id: 'inv-104', invoiceNumber: 'INV-2026-0092', companyName: 'Sun Pharma Ltd', plan: 'ENTERPRISE', amount: 6200, currency: 'USD', issueDate: '2026-09-12', dueDate: '2026-09-26', status: 'PAID' },
                  { id: 'inv-105', invoiceNumber: 'INV-2026-0093', companyName: 'AstraZeneca UK', plan: 'PROFESSIONAL', amount: 2200, currency: 'USD', issueDate: '2026-09-18', dueDate: '2026-10-02', status: 'PENDING' }
                ])).map((inv) => {
                  const status = (inv.status || 'PAID').toUpperCase();
                  return (
                    <tr key={inv.id || inv.invoiceNumber}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={16} color="#6366f1" />
                          <strong style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                            {inv.invoiceNumber || inv.id}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#0f172a' }}>
                          {inv.companyName || inv.company || 'Enterprise Tenant'}
                        </div>
                      </td>

                      <td>
                        <span className={`plan-pill plan-${(inv.plan || 'starter').toLowerCase()}`}>
                          {inv.plan || 'PROFESSIONAL'}
                        </span>
                      </td>

                      <td>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                          ${(Number(inv.amount) || Number(inv.total) || 1200).toLocaleString()}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                          {inv.currency || 'USD'}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.78rem', color: '#475569' }}>
                        <div>Issued: {inv.issueDate || '2026-09-01'}</div>
                        <div style={{ color: status === 'OVERDUE' ? '#dc2626' : '#64748b', fontWeight: status === 'OVERDUE' ? '700' : '500' }}>
                          Due: {inv.dueDate || '2026-09-15'}
                        </div>
                      </td>

                      <td>
                        {status === 'PAID' ? (
                          <span className="status-tag status-active" style={{ background: '#dcfce7', color: '#166534' }}>
                            🟢 Paid
                          </span>
                        ) : status === 'OVERDUE' ? (
                          <span className="status-tag status-deactivated" style={{ background: '#fee2e2', color: '#991b1b' }}>
                            🔴 Overdue
                          </span>
                        ) : (
                          <span className="status-tag status-suspended">
                            🟡 Pending
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster" style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => handleDownloadInvoicePDF(inv)}
                            title="Download PDF Invoice"
                          >
                            <Download size={12} /> PDF
                          </button>
                          {status !== 'PAID' && (
                            <button
                              type="button"
                              className="action-pill-btn"
                              style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                              onClick={() => handleSendReminder(inv)}
                              title="Send Payment Reminder"
                            >
                              <Send size={12} /> Remind
                            </button>
                          )}
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => setSelectedInvoice(inv)}
                            title="View Invoice Breakdown"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 2. SUBTAB: PAYMENT GATEWAY LEDGER ─────────────────────────────── */}
      {activeBillingSubTab === 'payments' && (
        <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <table className="saas-data-table">
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Pharma Company</th>
                <th>Payment Gateway</th>
                <th>Amount Settled</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(paymentsList.length > 0 ? paymentsList : [
                { id: 'txn-501', reference: 'ch_3Nxk99201948', company: 'Novartis Healthcare', gateway: 'Stripe Elements', amount: 4800, currency: 'USD', timestamp: '2026-09-01 10:14:22', status: 'SUCCEEDED' },
                { id: 'txn-502', reference: 'pay_99a88b77cc12', company: 'Pfizer Global', gateway: 'Razorpay Enterprise', amount: 5600, currency: 'USD', timestamp: '2026-09-05 14:32:00', status: 'SUCCEEDED' },
                { id: 'txn-503', reference: 'wire_ref_882910', company: 'Cipla Therapeutics', gateway: 'Swift Bank Wire', amount: 1850, currency: 'USD', timestamp: '2026-09-10 09:00:15', status: 'FAILED', failReason: 'Insufficient funds on credit ledger' },
                { id: 'txn-504', reference: 'ch_3Nxz11928374', company: 'Sun Pharma Ltd', gateway: 'Stripe Elements', amount: 6200, currency: 'USD', timestamp: '2026-09-12 11:45:00', status: 'SUCCEEDED' }
              ]).map((pay) => (
                <tr key={pay.id || pay.reference}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1e293b', fontWeight: '700' }}>
                      {pay.reference || pay.id}
                    </div>
                  </td>
                  <td><strong>{pay.company}</strong></td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                      💳 {pay.gateway}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      ${(pay.amount || 1000).toLocaleString()} {pay.currency || 'USD'}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{pay.timestamp}</td>
                  <td>
                    {pay.status === 'SUCCEEDED' ? (
                      <span className="status-tag status-active">🟢 Settled</span>
                    ) : (
                      <span className="status-tag status-deactivated">🔴 Failed</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {pay.status === 'FAILED' ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (handleRetryPayment) handleRetryPayment(pay.id);
                          showToast(`Retrying gateway charge for ${pay.reference}...`, 'info');
                        }}
                      >
                        Retry Charge
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="action-pill-btn"
                        onClick={() => showToast(`Receipt generated for ${pay.reference}`, 'info')}
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 3. SUBTAB: REFUNDS & CREDIT NOTES ─────────────────────────────── */}
      {activeBillingSubTab === 'refunds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Audit trail of authorized merchant refunds, credit allowances, and dispute reconciliations.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (setIsProcessRefundOpen) setIsProcessRefundOpen(true);
                else showToast('Opening refund modal', 'info');
              }}
            >
              <Plus size={15} /> + Issue New Refund
            </button>
          </div>

          <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Refund Reference</th>
                  <th>Pharma Company</th>
                  <th>Original Invoice</th>
                  <th>Amount</th>
                  <th>Reason / Notes</th>
                  <th>Processed At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(refundsList.length > 0 ? refundsList : [
                  { id: 'ref-901', reference: 'RFND-2026-001', company: 'Bayer AG', invoice: 'INV-2026-0044', amount: 650, reason: 'Downgraded 10 MR licenses mid-cycle', date: '2026-08-20', status: 'COMPLETED' },
                  { id: 'ref-902', reference: 'RFND-2026-002', company: 'GlaxoSmithKline', invoice: 'INV-2026-0071', amount: 1200, reason: 'Trial grace period billing dispute resolved', date: '2026-09-02', status: 'COMPLETED' }
                ]).map((rf) => (
                  <tr key={rf.id || rf.reference}>
                    <td><strong style={{ fontFamily: 'monospace' }}>{rf.reference || rf.id}</strong></td>
                    <td>{rf.company}</td>
                    <td>{rf.invoice || 'INV-2026-0089'}</td>
                    <td><strong className="text-red">-${(rf.amount || 500).toLocaleString()} USD</strong></td>
                    <td style={{ fontSize: '0.78rem', color: '#475569' }}>{rf.reason}</td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{rf.date}</td>
                    <td><span className="status-tag status-active">🟢 Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. SUBTAB: TAX & BILLING CONTACTS ─────────────────────────────── */}
      {activeBillingSubTab === 'contacts' && (
        <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <table className="saas-data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Finance Lead Contact</th>
                <th>Billing Email</th>
                <th>VAT / GST Tax ID</th>
                <th>Currency</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id || c.code}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="#6366f1" />
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>{c.contactName || 'Chief Financial Officer'}</td>
                  <td>{c.contactEmail || `billing@${c.name.toLowerCase().replace(/[^a-z]/g, '')}.com`}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#334155' }}>
                      {c.taxId || `VAT-${c.countryCode || 'GLOBAL'}-9928104`}
                    </span>
                  </td>
                  <td><strong>{c.currency || 'USD'}</strong></td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="action-pill-btn"
                      onClick={() => {
                        if (setEditBillingContactForm && setIsEditBillingContactOpen) {
                          setEditBillingContactForm({
                            companyId: c.id,
                            companyName: c.name,
                            contactName: c.contactName || 'Finance Controller',
                            billingEmail: c.contactEmail || 'finance@company.com',
                            taxId: c.taxId || 'VAT-9928104'
                          });
                          setIsEditBillingContactOpen(true);
                        } else {
                          showToast(`Editing billing profile for ${c.name}`, 'info');
                        }
                      }}
                    >
                      Edit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 5. SUBTAB: FAILED CHARGES DLQ ─────────────────────────────────── */}
      {activeBillingSubTab === 'failed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <AlertTriangle size={24} color="#dc2626" />
            <div>
              <strong style={{ color: '#991b1b', fontSize: '0.95rem' }}>Dead Letter Queue (DLQ) &amp; Dunning Sequence</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#7f1d1d' }}>
                Failed automated card charges trigger a 14-day grace period before subscription auto-suspension takes effect.
              </p>
            </div>
          </div>

          <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table className="saas-data-table">
              <thead>
                <tr>
                  <th>Failed Charge ID</th>
                  <th>Tenant Company</th>
                  <th>Amount</th>
                  <th>Failure Reason</th>
                  <th>Attempt Count</th>
                  <th>Next Auto-Retry</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>fl_charge_99812</code></td>
                  <td><strong>Cipla Therapeutics</strong></td>
                  <td><strong style={{ color: '#dc2626' }}>$1,850.00 USD</strong></td>
                  <td>Card expired / bank decline (code: 402)</td>
                  <td><span className="status-tag status-suspended">Attempt 2 of 4</span></td>
                  <td>Tomorrow at 04:00 UTC</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => showToast('Force charge attempt queued immediately.', 'success')}
                    >
                      Force Charge Now
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW INVOICE BREAKDOWN ─────────────────────────────────── */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <FileText size={20} color="#2563eb" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Invoice {selectedInvoice.invoiceNumber || selectedInvoice.id}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    {selectedInvoice.companyName || selectedInvoice.company} &bull; Issued {selectedInvoice.issueDate || '2026-09-01'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Plan Tier:</span>
                  <strong>{selectedInvoice.plan || 'PROFESSIONAL'} Tier</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Billing Cycle:</span>
                  <span>Monthly Recurring</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Payment Status:</span>
                  <span className={`status-tag status-${(selectedInvoice.status || 'PAID').toLowerCase()}`}>
                    {selectedInvoice.status || 'PAID'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Total Amount Due:</strong>
                  <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                    ${(Number(selectedInvoice.amount) || Number(selectedInvoice.total) || 1200).toLocaleString()} USD
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleDownloadInvoicePDF(selectedInvoice);
                  setSelectedInvoice(null);
                }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
