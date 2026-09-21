import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-Memory Storage for Billing Microservice (Default Empty)
let IN_MEMORY_INVOICES = [];
let IN_MEMORY_PAYMENTS = [];
let IN_MEMORY_REFUNDS = [];
let IN_MEMORY_CONTACTS = [];
let IN_MEMORY_SUBSCRIPTION_HISTORY = [];

// Helper: Record Billing Audit
const recordAudit = async (action, targetEntity, entityId, details) => {
  try {
    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, ['superadmin@orvexa.com', 'SUPER_ADMIN', action, targetEntity, entityId, typeof details === 'object' ? JSON.stringify(details) : details]);
  } catch (err) {
    console.warn('[Audit Warning] Could not record billing audit log:', err.message);
  }
};

// ==============================================================================
// 1. GET /api/billing/overview - Master SaaS Revenue & Billing KPIs
// ==============================================================================
router.get('/overview', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const invRes = await query(`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) as total_collected,
          COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_amount,
          COALESCE(SUM(CASE WHEN status = 'FAILED' THEN amount ELSE 0 END), 0) as failed_amount,
          COUNT(*) as total_count,
          COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_count
        FROM platform_billing_invoices
      `);
      const refRes = await query(`SELECT COALESCE(SUM(amount), 0) as total_refunded FROM platform_billing_refunds`);
      const row = invRes.rows[0] || {};
      const refunded = Number(refRes.rows[0]?.total_refunded || 0);

      const totalCollected = Number(row.total_collected || 0);
      const pendingAmount = Number(row.pending_amount || 0);
      const failedAmount = Number(row.failed_amount || 0);
      const totalInvoices = Number(row.total_count || 0);
      const paidInvoices = Number(row.paid_count || 0);
      const collectionEff = (totalCollected + pendingAmount) > 0 ? ((totalCollected / (totalCollected + pendingAmount)) * 100).toFixed(1) : 0;

      return res.json({
        totalRevenueCollected: totalCollected,
        pendingReceivables: pendingAmount,
        failedTransactionsTotal: failedAmount,
        totalRefunded: refunded,
        totalInvoicesCount: totalInvoices,
        paidInvoicesCount: paidInvoices,
        failedPaymentsCount: 0,
        activeSubscribersCount: paidInvoices,
        collectionEfficiencyPercent: Number(collectionEff),
        currency: 'USD'
      });
    }
  } catch (err) {
    console.warn('⚠️ DB query failed for billing overview, fallback to empty:', err.message);
  }

  const totalInvoices = IN_MEMORY_INVOICES.length;
  const paidInvoices = IN_MEMORY_INVOICES.filter(i => i.status === 'PAID');
  const totalCollected = paidInvoices.reduce((acc, i) => acc + Number(i.amount), 0);
  const pendingAmount = IN_MEMORY_INVOICES.filter(i => i.status === 'PENDING').reduce((acc, i) => acc + Number(i.amount), 0);
  const failedAmount = IN_MEMORY_INVOICES.filter(i => i.status === 'FAILED').reduce((acc, i) => acc + Number(i.amount), 0);
  const refundedAmount = IN_MEMORY_REFUNDS.reduce((acc, r) => acc + Number(r.amount), 0);

  return res.json({
    totalRevenueCollected: totalCollected,
    pendingReceivables: pendingAmount,
    failedTransactionsTotal: failedAmount,
    totalRefunded: refundedAmount,
    totalInvoicesCount: totalInvoices,
    paidInvoicesCount: paidInvoices.length,
    failedPaymentsCount: 0,
    activeSubscribersCount: 0,
    collectionEfficiencyPercent: 0,
    currency: 'USD'
  });
});

// ==============================================================================
// 2. GET /api/billing/invoices - List all enterprise SaaS invoices
// ==============================================================================
router.get('/invoices', async (req, res) => {
  try {
    const { tenantId, status } = req.query;
    let list = [...IN_MEMORY_INVOICES];
    if (tenantId && tenantId !== 'ALL') list = list.filter(i => i.tenant_id === tenantId);
    if (status && status !== 'ALL') list = list.filter(i => i.status === status);

    res.json(list.map(r => ({
      id: r.id,
      invoiceNumber: r.invoice_number,
      tenantId: r.tenant_id,
      companyName: r.company_name,
      planTier: r.plan_tier,
      subtotal: r.subtotal,
      taxAmount: r.tax_amount,
      amount: r.amount,
      currency: r.currency,
      status: r.status,
      issueDate: r.issue_date,
      dueDate: r.due_date,
      paidAt: r.paid_at,
      paymentMethod: r.payment_method,
      billingContactName: r.billing_contact_name,
      billingContactEmail: r.billing_contact_email,
      taxId: r.tax_id,
      pdfUrl: r.pdf_url
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 3. GET /api/billing/payments - List all payment transactions
// ==============================================================================
router.get('/payments', async (req, res) => {
  try {
    const { status, tenantId } = req.query;
    let list = [...IN_MEMORY_PAYMENTS];
    if (status && status !== 'ALL') list = list.filter(p => p.status === status);
    if (tenantId && tenantId !== 'ALL') list = list.filter(p => p.tenant_id === tenantId);

    res.json(list.map(p => ({
      id: p.id,
      paymentRef: p.payment_ref,
      invoiceId: p.invoice_id,
      invoiceNumber: p.invoice_number,
      tenantId: p.tenant_id,
      companyName: p.company_name,
      amount: p.amount,
      currency: p.currency,
      gateway: p.gateway,
      paymentMethod: p.payment_method,
      transactionHash: p.transaction_hash,
      status: p.status,
      declineCode: p.decline_code,
      failureReason: p.failure_reason,
      retryCount: p.retry_count,
      lastAttemptAt: p.last_attempt_at,
      createdAt: p.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 4. POST /api/billing/failed-payments/:id/retry - Retry charging failed payment
// ==============================================================================
router.post('/failed-payments/:id/retry', async (req, res) => {
  try {
    const { id } = req.params;
    const pIdx = IN_MEMORY_PAYMENTS.findIndex(p => p.id === id || p.payment_ref === id);

    if (pIdx === -1) {
      return res.status(404).json({ error: 'Payment transaction record not found.' });
    }

    // Simulate instant gateway re-charge
    IN_MEMORY_PAYMENTS[pIdx].status = 'SUCCEEDED';
    IN_MEMORY_PAYMENTS[pIdx].retry_count = (IN_MEMORY_PAYMENTS[pIdx].retry_count || 0) + 1;
    IN_MEMORY_PAYMENTS[pIdx].last_attempt_at = new Date().toISOString();
    IN_MEMORY_PAYMENTS[pIdx].decline_code = null;
    IN_MEMORY_PAYMENTS[pIdx].failure_reason = null;

    // Update associated invoice status to PAID
    const invIdx = IN_MEMORY_INVOICES.findIndex(i => i.invoice_number === IN_MEMORY_PAYMENTS[pIdx].invoice_number);
    if (invIdx !== -1) {
      IN_MEMORY_INVOICES[invIdx].status = 'PAID';
      IN_MEMORY_INVOICES[invIdx].paid_at = new Date().toISOString();
    }

    await recordAudit('FAILED_PAYMENT_RETRIED', 'Billing Gateway', id, { paymentRef: IN_MEMORY_PAYMENTS[pIdx].payment_ref, amount: IN_MEMORY_PAYMENTS[pIdx].amount });

    res.json({
      success: true,
      message: `Payment ${IN_MEMORY_PAYMENTS[pIdx].payment_ref} successfully re-charged via ${IN_MEMORY_PAYMENTS[pIdx].gateway}. Invoice marked as PAID.`,
      payment: IN_MEMORY_PAYMENTS[pIdx]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 5. GET /api/billing/refunds - List all refunded transactions
// ==============================================================================
router.get('/refunds', async (req, res) => {
  try {
    res.json(IN_MEMORY_REFUNDS.map(r => ({
      id: r.id,
      refundRef: r.refund_ref,
      paymentId: r.payment_id,
      invoiceNumber: r.invoice_number,
      tenantId: r.tenant_id,
      companyName: r.company_name,
      amount: r.amount,
      currency: r.currency,
      reason: r.reason,
      status: r.status,
      processedBy: r.processed_by,
      processedAt: r.processed_at,
      createdAt: r.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 6. POST /api/billing/refunds/process - Issue refund to customer
// ==============================================================================
router.post('/refunds/process', async (req, res) => {
  try {
    const { tenantId, companyName, invoiceNumber, amount, reason = 'CUSTOMER_REQUEST' } = req.body;

    if (!invoiceNumber || !amount) {
      return res.status(400).json({ error: 'Invoice number and refund amount are mandatory.' });
    }

    const refundRef = `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRefund = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      refund_ref: refundRef,
      payment_id: '00000000-0000-0000-0000-000000000821',
      invoice_number: invoiceNumber,
      tenant_id: tenantId || '00000000-0000-0000-0000-000000000001',
      company_name: companyName || 'Pharma Tenant',
      amount: Number(amount),
      currency: 'USD',
      reason,
      status: 'PROCESSED',
      processed_by: 'Super Admin HQ',
      processed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    IN_MEMORY_REFUNDS.unshift(newRefund);

    // Update invoice status
    const invIdx = IN_MEMORY_INVOICES.findIndex(i => i.invoice_number === invoiceNumber);
    if (invIdx !== -1) {
      IN_MEMORY_INVOICES[invIdx].status = 'REFUNDED';
    }

    await recordAudit('REFUND_ISSUED', 'Billing Gateway', newRefund.id, { refundRef, invoiceNumber, amount, reason });

    res.status(201).json({
      success: true,
      message: `Refund ${refundRef} of $${amount} USD processed back to original payment method.`,
      refund: newRefund
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 7. GET /api/billing/subscription-history - Master timeline of plan changes
// ==============================================================================
router.get('/subscription-history', async (req, res) => {
  try {
    const { tenantId } = req.query;
    let list = [...IN_MEMORY_SUBSCRIPTION_HISTORY];
    if (tenantId && tenantId !== 'ALL') list = list.filter(s => s.tenant_id === tenantId);

    res.json(list.map(s => ({
      id: s.id,
      tenantId: s.tenant_id,
      companyName: s.company_name,
      eventType: s.event_type,
      fromTier: s.from_tier,
      toTier: s.to_tier,
      mrrDelta: s.mrr_delta,
      amountBilled: s.amount_billed,
      notes: s.notes,
      actorEmail: s.actor_email,
      createdAt: s.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 8. GET /api/billing/contacts - List all tenant billing profiles & tax info
// ==============================================================================
router.get('/contacts', async (req, res) => {
  try {
    res.json(IN_MEMORY_BILLING_CONTACTS.map(c => ({
      id: c.id,
      tenantId: c.tenant_id,
      companyName: c.company_name,
      primaryContactName: c.primary_contact_name,
      primaryBillingEmail: c.primary_billing_email,
      secondaryBillingEmail: c.secondary_billing_email,
      taxId: c.tax_id,
      taxScheme: c.tax_scheme,
      billingAddress: c.billing_address,
      city: c.city,
      country: c.country,
      preferredCurrency: c.preferred_currency,
      poNumber: c.po_number
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 9. PUT /api/billing/contacts/:tenantId - Update company billing details & tax ID
// ==============================================================================
router.put('/contacts/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { primaryContactName, primaryBillingEmail, secondaryBillingEmail, taxId, taxScheme, billingAddress, preferredCurrency, poNumber } = req.body;

    const cIdx = IN_MEMORY_BILLING_CONTACTS.findIndex(c => c.tenant_id === tenantId);
    if (cIdx !== -1) {
      if (primaryContactName) IN_MEMORY_BILLING_CONTACTS[cIdx].primary_contact_name = primaryContactName;
      if (primaryBillingEmail) IN_MEMORY_BILLING_CONTACTS[cIdx].primary_billing_email = primaryBillingEmail;
      if (secondaryBillingEmail !== undefined) IN_MEMORY_BILLING_CONTACTS[cIdx].secondary_billing_email = secondaryBillingEmail;
      if (taxId) IN_MEMORY_BILLING_CONTACTS[cIdx].tax_id = taxId;
      if (taxScheme) IN_MEMORY_BILLING_CONTACTS[cIdx].tax_scheme = taxScheme;
      if (billingAddress) IN_MEMORY_BILLING_CONTACTS[cIdx].billing_address = billingAddress;
      if (preferredCurrency) IN_MEMORY_BILLING_CONTACTS[cIdx].preferred_currency = preferredCurrency;
      if (poNumber !== undefined) IN_MEMORY_BILLING_CONTACTS[cIdx].po_number = poNumber;

      await recordAudit('BILLING_CONTACT_UPDATED', 'Billing Profiles', tenantId, { primaryBillingEmail, taxId });
      return res.json({ success: true, message: 'Billing contact & tax information updated.', contact: IN_MEMORY_BILLING_CONTACTS[cIdx] });
    }

    const newContact = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      tenant_id: tenantId,
      company_name: 'Pharma Company',
      primary_contact_name: primaryContactName || 'Finance Controller',
      primary_billing_email: primaryBillingEmail || 'billing@company.com',
      secondary_billing_email: secondaryBillingEmail || '',
      tax_id: taxId || 'N/A',
      tax_scheme: taxScheme || 'Standard VAT 5%',
      billing_address: billingAddress || '',
      city: 'Global',
      country: 'Global',
      preferred_currency: preferredCurrency || 'USD',
      po_number: poNumber || ''
    };

    IN_MEMORY_BILLING_CONTACTS.push(newContact);
    await recordAudit('BILLING_CONTACT_CREATED', 'Billing Profiles', tenantId, { primaryBillingEmail, taxId });

    res.json({ success: true, message: 'Billing profile created.', contact: newContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
