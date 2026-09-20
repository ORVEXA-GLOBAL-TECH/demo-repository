import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-Memory Seed Storage for Billing Microservice
let IN_MEMORY_INVOICES = [
  {
    id: '00000000-0000-0000-0000-000000000801',
    invoice_number: 'INV-2026-0891',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    plan_tier: 'ENTERPRISE',
    subtotal: 2500.00,
    tax_amount: 125.00,
    amount: 2625.00,
    currency: 'USD',
    status: 'PAID',
    issue_date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    due_date: new Date(Date.now() + 11 * 24 * 3600 * 1000).toISOString(),
    paid_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    payment_method: 'CORPORATE_ACH',
    billing_contact_name: 'Vikram Malhotra',
    billing_contact_email: 'finance@pfizerbiopharma.com',
    tax_id: 'US-EIN-94-2849102',
    pdf_url: '/invoices/INV-2026-0891.pdf',
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000802',
    invoice_number: 'INV-2026-0892',
    tenant_id: '00000000-0000-0000-0000-000000000002',
    company_name: 'Novartis Pharma Global',
    plan_tier: 'PROFESSIONAL',
    subtotal: 1000.00,
    tax_amount: 50.00,
    amount: 1050.00,
    currency: 'USD',
    status: 'PAID',
    issue_date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    due_date: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    paid_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    payment_method: 'STRIPE_CREDIT_CARD',
    billing_contact_name: 'Elena Rostova',
    billing_contact_email: 'finance@novartispharma.com',
    tax_id: 'CHE-105.842.190-MWST',
    pdf_url: '/invoices/INV-2026-0892.pdf',
    created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000803',
    invoice_number: 'INV-2026-0893',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    company_name: 'AstraZeneca Healthcare',
    plan_tier: 'ENTERPRISE',
    subtotal: 2500.00,
    tax_amount: 125.00,
    amount: 2625.00,
    currency: 'USD',
    status: 'PENDING',
    issue_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    due_date: new Date(Date.now() + 13 * 24 * 3600 * 1000).toISOString(),
    paid_at: null,
    payment_method: 'BANK_WIRE_TRANSFER',
    billing_contact_name: 'Dr. James Sterling',
    billing_contact_email: 'treasury@astrazeneca.com',
    tax_id: 'GB-VAT-582-9014-22',
    pdf_url: '/invoices/INV-2026-0893.pdf',
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000804',
    invoice_number: 'INV-2026-0894',
    tenant_id: '00000000-0000-0000-0000-000000000004',
    company_name: 'Cipla Therapeutics Ltd',
    plan_tier: 'STARTER',
    subtotal: 100.00,
    tax_amount: 18.00,
    amount: 118.00,
    currency: 'USD',
    status: 'FAILED',
    issue_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    due_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    paid_at: null,
    payment_method: 'STRIPE_CREDIT_CARD',
    billing_contact_name: 'Ramesh Gupta',
    billing_contact_email: 'accounts@ciplatherapeutics.com',
    tax_id: '27AAACC1206M1ZV',
    pdf_url: '/invoices/INV-2026-0894.pdf',
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

let IN_MEMORY_PAYMENTS = [
  {
    id: '00000000-0000-0000-0000-000000000821',
    payment_ref: 'PAY-2026-9901',
    invoice_id: '00000000-0000-0000-0000-000000000801',
    invoice_number: 'INV-2026-0891',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    amount: 2625.00,
    currency: 'USD',
    gateway: 'STRIPE',
    payment_method: 'Visa •••• 4242 (3D Secure)',
    transaction_hash: 'ch_3N8zLp2eZvKYlo2C1g90xK1A',
    status: 'SUCCEEDED',
    decline_code: null,
    failure_reason: null,
    retry_count: 0,
    last_attempt_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000822',
    payment_ref: 'PAY-2026-9902',
    invoice_id: '00000000-0000-0000-0000-000000000002',
    invoice_number: 'INV-2026-0892',
    tenant_id: '00000000-0000-0000-0000-000000000002',
    company_name: 'Novartis Pharma Global',
    amount: 1050.00,
    currency: 'USD',
    gateway: 'STRIPE',
    payment_method: 'Mastercard •••• 8812',
    transaction_hash: 'ch_3N9aKq4eZvKYlo2C2h11wP2B',
    status: 'SUCCEEDED',
    decline_code: null,
    failure_reason: null,
    retry_count: 0,
    last_attempt_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000823',
    payment_ref: 'PAY-2026-9903',
    invoice_id: '00000000-0000-0000-0000-000000000004',
    invoice_number: 'INV-2026-0894',
    tenant_id: '00000000-0000-0000-0000-000000000004',
    company_name: 'Cipla Therapeutics Ltd',
    amount: 118.00,
    currency: 'USD',
    gateway: 'RAZORPAY',
    payment_method: 'Corporate Card •••• 9920',
    transaction_hash: 'pay_Nz891lKa90Xl28',
    status: 'FAILED',
    decline_code: 'card_declined_insufficient_funds',
    failure_reason: 'Transaction declined by issuing bank: Insufficient credit allowance on corporate card.',
    retry_count: 2,
    last_attempt_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

let IN_MEMORY_REFUNDS = [
  {
    id: '00000000-0000-0000-0000-000000000841',
    refund_ref: 'REF-2026-4401',
    payment_id: '00000000-0000-0000-0000-000000000821',
    invoice_number: 'INV-2026-0870',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    amount: 500.00,
    currency: 'USD',
    reason: 'PLAN_DOWNGRADE_PRORATION',
    status: 'PROCESSED',
    processed_by: 'Super Admin HQ',
    processed_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  }
];

let IN_MEMORY_BILLING_CONTACTS = [
  {
    id: '00000000-0000-0000-0000-000000000861',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    primary_contact_name: 'Vikram Malhotra',
    primary_billing_email: 'finance@pfizerbiopharma.com',
    secondary_billing_email: 'ap-invoices@pfizer.com',
    tax_id: 'US-EIN-94-2849102',
    tax_scheme: 'US Statutory / No State Sales Tax (B2B SaaS)',
    billing_address: '235 East 42nd Street, New York, NY 10017',
    city: 'New York',
    country: 'United States',
    preferred_currency: 'USD',
    po_number: 'PO-PFZ-2026-992'
  },
  {
    id: '00000000-0000-0000-0000-000000000862',
    tenant_id: '00000000-0000-0000-0000-000000000002',
    company_name: 'Novartis Pharma Global',
    primary_contact_name: 'Elena Rostova',
    primary_billing_email: 'finance@novartispharma.com',
    secondary_billing_email: 'accounting@novartis.ch',
    tax_id: 'CHE-105.842.190-MWST',
    tax_scheme: 'Swiss Federal VAT 8.1%',
    billing_address: 'Lichtstrasse 35, 4056 Basel',
    city: 'Basel',
    country: 'Switzerland',
    preferred_currency: 'USD',
    po_number: 'PO-NOV-2026-441'
  },
  {
    id: '00000000-0000-0000-0000-000000000863',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    company_name: 'AstraZeneca Healthcare',
    primary_contact_name: 'Dr. James Sterling',
    primary_billing_email: 'treasury@astrazeneca.com',
    secondary_billing_email: 'uk-finance@astrazeneca.com',
    tax_id: 'GB-VAT-582-9014-22',
    tax_scheme: 'UK Standard VAT 20%',
    billing_address: '1 Francis Crick Avenue, Cambridge Biomedical Campus',
    city: 'Cambridge',
    country: 'United Kingdom',
    preferred_currency: 'USD',
    po_number: 'PO-AZ-2026-880'
  }
];

let IN_MEMORY_SUBSCRIPTION_HISTORY = [
  {
    id: '00000000-0000-0000-0000-000000000881',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    event_type: 'TIER_UPGRADE',
    from_tier: 'PROFESSIONAL',
    to_tier: 'ENTERPRISE',
    mrr_delta: 1500.00,
    amount_billed: 2500.00,
    notes: 'Super Admin upgraded tier to Enterprise for AI Studio & Multi-Region access.',
    actor_email: 'superadmin@orvexa.com',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000882',
    tenant_id: '00000000-0000-0000-0000-000000000002',
    company_name: 'Novartis Pharma Global',
    event_type: 'RENEWAL_PROCESSED',
    from_tier: 'PROFESSIONAL',
    to_tier: 'PROFESSIONAL',
    mrr_delta: 0.00,
    amount_billed: 1000.00,
    notes: 'Annual recurring subscription renewal executed successfully.',
    actor_email: 'billing-cron@orvexa.com',
    created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000883',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    company_name: 'AstraZeneca Healthcare',
    event_type: 'VALIDITY_EXTENDED',
    from_tier: 'ENTERPRISE',
    to_tier: 'ENTERPRISE',
    mrr_delta: 0.00,
    amount_billed: 0.00,
    notes: 'Super Admin added +30 days courtesy extension for contract audit.',
    actor_email: 'superadmin@orvexa.com',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }
];

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
    const totalInvoices = IN_MEMORY_INVOICES.length;
    const paidInvoices = IN_MEMORY_INVOICES.filter(i => i.status === 'PAID');
    const totalCollected = paidInvoices.reduce((acc, i) => acc + Number(i.amount), 0);
    const pendingAmount = IN_MEMORY_INVOICES.filter(i => i.status === 'PENDING').reduce((acc, i) => acc + Number(i.amount), 0);
    const failedAmount = IN_MEMORY_INVOICES.filter(i => i.status === 'FAILED').reduce((acc, i) => acc + Number(i.amount), 0);
    const refundedAmount = IN_MEMORY_REFUNDS.reduce((acc, r) => acc + Number(r.amount), 0);

    res.json({
      totalRevenueCollected: totalCollected,
      pendingReceivables: pendingAmount,
      failedTransactionsTotal: failedAmount,
      totalRefunded: refundedAmount,
      totalInvoicesCount: totalInvoices,
      paidInvoicesCount: paidInvoices.length,
      failedPaymentsCount: IN_MEMORY_PAYMENTS.filter(p => p.status === 'FAILED').length,
      activeSubscribersCount: 24,
      collectionEfficiencyPercent: 97.2,
      currency: 'USD'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
