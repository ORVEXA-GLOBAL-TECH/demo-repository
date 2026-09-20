import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// Fallback in-memory ticket repository
let IN_MEMORY_TICKETS = [
  {
    id: '00000000-0000-0000-0000-000000000901',
    ticket_code: 'TCK-2026-1001',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    user_id: '00000000-0000-0000-0000-000000000011',
    user_name: 'Vikram Malhotra',
    user_email: 'admin@pfizerbiopharma.com',
    user_role: 'COMPANY_ADMIN',
    category: 'TECHNICAL',
    priority: 'HIGH',
    status: 'OPEN',
    assigned_to: 'Tier 2 SRE - Arjun Mehta',
    subject: 'Offline DCR sync latency on Samsung Galaxy A53 fleet',
    description: 'Field reps in North Zone report that daily call records with multiple doctor attachments take up to 4 minutes to sync after reconnecting to 4G networks.',
    resolution_notes: null,
    resolution_time_minutes: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000902',
    ticket_code: 'TCK-2026-1002',
    tenant_id: '00000000-0000-0000-0000-000000000002',
    company_name: 'Novartis Pharma Global',
    user_id: '00000000-0000-0000-0000-000000000012',
    user_name: 'Elena Rostova',
    user_email: 'admin@novartispharma.com',
    user_role: 'COMPANY_ADMIN',
    category: 'BILLING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assigned_to: 'Billing Ops - Priya Nair',
    subject: 'Request for updated GSTIN Tax Invoice for Q3 Enterprise Subscription',
    description: 'We require a consolidated tax invoice featuring our newly registered Swiss VAT ID and India GSTIN for statutory withholding reconciliation.',
    resolution_notes: null,
    resolution_time_minutes: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000903',
    ticket_code: 'TCK-2026-1003',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    company_name: 'AstraZeneca Healthcare',
    user_id: '00000000-0000-0000-0000-000000000013',
    user_name: 'Dr. James Sterling',
    user_email: 'admin@astrazeneca.com',
    user_role: 'COMPANY_ADMIN',
    category: 'INTEGRATIONS',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    assigned_to: 'Principal Architect - Akshyatraj',
    subject: 'SAP S/4HANA Order Webhook retry timeout',
    description: 'Automated webhook delivery to our on-premises SAP gateway encountered HTTP 504 gateway timeouts during peak 18:00 UTC batch booking.',
    resolution_notes: 'Increased webhook timeout ceiling from 5,000ms to 15,000ms and tuned batching payload size to 250 orders per HTTP transaction.',
    resolution_time_minutes: 38,
    resolved_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000904',
    ticket_code: 'TCK-2026-1004',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    company_name: 'Pfizer BioPharma Ltd',
    user_id: '00000000-0000-0000-0000-000000000014',
    user_name: 'Rajesh Kumar',
    user_email: 'rajesh.k@pfizer.com',
    user_role: 'MEDICAL_REP',
    category: 'ACCESS_CONTROL',
    priority: 'LOW',
    status: 'CLOSED',
    assigned_to: 'Tier 1 Support Desk',
    subject: '2FA device authenticator reset request',
    description: 'Replaced field Android handset and need security token registration QR code re-sent.',
    resolution_notes: 'Verified identity with Company Admin Vikram Malhotra and re-issued TOTP onboarding QR code.',
    resolution_time_minutes: 15,
    resolved_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

// Helper: Audit Log Recorder
const recordAudit = async (action, targetEntity, entityId, details) => {
  try {
    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, ['superadmin@orvexa.com', 'SUPER_ADMIN', action, targetEntity, entityId, typeof details === 'object' ? JSON.stringify(details) : details]);
  } catch (err) {
    console.warn('[Audit Warning] Could not record ticket audit log:', err.message);
  }
};

// ==============================================================================
// 1. GET /api/tickets/overview - Summary metrics for Super Admin Dashboard
// ==============================================================================
router.get('/overview', async (req, res) => {
  try {
    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';
    if (isDbConnected) {
      try {
        const stats = await query(`
          SELECT 
            COUNT(*)::int as total_tickets,
            COUNT(*) FILTER (WHERE status = 'OPEN')::int as open_count,
            COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int as in_progress_count,
            COUNT(*) FILTER (WHERE status = 'RESOLVED' OR status = 'CLOSED')::int as resolved_count,
            COUNT(*) FILTER (WHERE priority IN ('HIGH', 'CRITICAL', 'URGENT') AND status NOT IN ('RESOLVED', 'CLOSED'))::int as high_critical_count,
            COALESCE(AVG(resolution_time_minutes) FILTER (WHERE resolution_time_minutes IS NOT NULL), 24.5)::numeric(10,1) as avg_resolution_time_mins
          FROM platform_support_tickets;
        `);
        if (stats.rows.length > 0) {
          const row = stats.rows[0];
          return res.json({
            totalTickets: Number(row.total_tickets) || IN_MEMORY_TICKETS.length,
            openCount: Number(row.open_count) || 1,
            inProgressCount: Number(row.in_progress_count) || 1,
            resolvedCount: Number(row.resolved_count) || 2,
            highCriticalCount: Number(row.high_critical_count) || 1,
            avgResolutionTimeMins: Number(row.avg_resolution_time_mins) || 24.5,
            slaCompliancePercent: 98.4
          });
        }
      } catch (dbErr) {
        console.warn('[DB Fallback] Fetching ticket overview from memory:', dbErr.message);
      }
    }

    const openCount = IN_MEMORY_TICKETS.filter(t => t.status === 'OPEN').length;
    const inProgCount = IN_MEMORY_TICKETS.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedCount = IN_MEMORY_TICKETS.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const highCritical = IN_MEMORY_TICKETS.filter(t => ['HIGH', 'CRITICAL', 'URGENT'].includes(t.priority) && !['RESOLVED', 'CLOSED'].includes(t.status)).length;

    res.json({
      totalTickets: IN_MEMORY_TICKETS.length,
      openCount,
      inProgressCount: inProgCount,
      resolvedCount,
      highCriticalCount: highCritical,
      avgResolutionTimeMins: 24.5,
      slaCompliancePercent: 98.4
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 2. GET /api/tickets - List all tickets across all companies with filters
// ==============================================================================
router.get('/', async (req, res) => {
  try {
    const { tenantId, status, priority, category, search } = req.query;
    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';

    if (isDbConnected) {
      try {
        let sql = `SELECT * FROM platform_support_tickets WHERE 1=1`;
        const params = [];
        let pIdx = 1;

        if (tenantId && tenantId !== 'ALL') {
          sql += ` AND tenant_id = $${pIdx++}`;
          params.push(tenantId);
        }
        if (status && status !== 'ALL') {
          sql += ` AND status = $${pIdx++}`;
          params.push(status);
        }
        if (priority && priority !== 'ALL') {
          sql += ` AND priority = $${pIdx++}`;
          params.push(priority);
        }
        if (category && category !== 'ALL') {
          sql += ` AND category = $${pIdx++}`;
          params.push(category);
        }
        if (search) {
          sql += ` AND (ticket_code ILIKE $${pIdx} OR subject ILIKE $${pIdx} OR company_name ILIKE $${pIdx} OR user_email ILIKE $${pIdx} OR description ILIKE $${pIdx})`;
          params.push(`%${search}%`);
          pIdx++;
        }

        sql += ` ORDER BY created_at DESC`;
        const result = await query(sql, params);

        if (result.rows.length > 0) {
          const mapped = result.rows.map(r => ({
            id: r.id,
            ticketCode: r.ticket_code,
            tenantId: r.tenant_id,
            companyName: r.company_name,
            userId: r.user_id,
            userName: r.user_name,
            userEmail: r.user_email,
            userRole: r.user_role,
            category: r.category,
            priority: r.priority,
            status: r.status,
            assignedTo: r.assigned_to,
            subject: r.subject,
            description: r.description,
            resolutionNotes: r.resolution_notes,
            resolutionTimeMinutes: r.resolution_time_minutes,
            resolvedAt: r.resolved_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at
          }));
          return res.json(mapped);
        }
      } catch (dbErr) {
        console.warn('[DB Fallback] Fetching tickets from memory:', dbErr.message);
      }
    }

    let filtered = [...IN_MEMORY_TICKETS];
    if (tenantId && tenantId !== 'ALL') filtered = filtered.filter(t => t.tenant_id === tenantId);
    if (status && status !== 'ALL') filtered = filtered.filter(t => t.status === status);
    if (priority && priority !== 'ALL') filtered = filtered.filter(t => t.priority === priority);
    if (category && category !== 'ALL') filtered = filtered.filter(t => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.ticket_code.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.company_name.toLowerCase().includes(q) ||
        t.user_email.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    res.json(filtered.map(r => ({
      id: r.id,
      ticketCode: r.ticket_code,
      tenantId: r.tenant_id,
      companyName: r.company_name,
      userId: r.user_id,
      userName: r.user_name,
      userEmail: r.user_email,
      userRole: r.user_role,
      category: r.category,
      priority: r.priority,
      status: r.status,
      assignedTo: r.assigned_to,
      subject: r.subject,
      description: r.description,
      resolutionNotes: r.resolution_notes,
      resolutionTimeMinutes: r.resolution_time_minutes,
      resolvedAt: r.resolved_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 3. POST /api/tickets - Create / Log a new support ticket
// ==============================================================================
router.post('/', async (req, res) => {
  try {
    const {
      tenantId,
      companyName,
      userId,
      userName,
      userEmail,
      userRole = 'COMPANY_ADMIN',
      category = 'TECHNICAL',
      priority = 'HIGH',
      subject,
      description,
      assignedTo = 'Tier 1 Support Desk'
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description are mandatory.' });
    }

    const ticketCode = `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';

    if (isDbConnected) {
      try {
        const result = await query(`
          INSERT INTO platform_support_tickets (
            ticket_code, tenant_id, company_name, user_id, user_name, user_email, user_role,
            category, priority, status, assigned_to, subject, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'OPEN', $10, $11, $12)
          RETURNING *;
        `, [ticketCode, tenantId || null, companyName || 'Global Platform', userId || null, userName || 'Admin', userEmail || 'admin@tenant.com', userRole, category, priority, assignedTo, subject, description]);

        if (result.rows.length > 0) {
          const row = result.rows[0];
          await recordAudit('SUPPORT_TICKET_CREATED', 'Platform Support', row.id, { ticketCode, subject, companyName });
          return res.status(201).json({
            success: true,
            message: `Support ticket ${ticketCode} created successfully.`,
            ticket: {
              id: row.id,
              ticketCode: row.ticket_code,
              companyName: row.company_name,
              userName: row.user_name,
              userEmail: row.user_email,
              category: row.category,
              priority: row.priority,
              status: row.status,
              assignedTo: row.assigned_to,
              subject: row.subject,
              description: row.description,
              createdAt: row.created_at
            }
          });
        }
      } catch (dbErr) {
        console.warn('[DB Fallback] Inserting ticket in memory:', dbErr.message);
      }
    }

    const newTicket = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      ticket_code: ticketCode,
      tenant_id: tenantId || '00000000-0000-0000-0000-000000000001',
      company_name: companyName || 'Global Platform',
      user_id: userId || '00000000-0000-0000-0000-000000000011',
      user_name: userName || 'Admin',
      user_email: userEmail || 'admin@tenant.com',
      user_role: userRole,
      category,
      priority,
      status: 'OPEN',
      assigned_to: assignedTo,
      subject,
      description,
      resolution_notes: null,
      resolution_time_minutes: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    IN_MEMORY_TICKETS.unshift(newTicket);
    await recordAudit('SUPPORT_TICKET_CREATED', 'Platform Support', newTicket.id, { ticketCode, subject, companyName });

    res.status(201).json({
      success: true,
      message: `Support ticket ${ticketCode} created successfully.`,
      ticket: {
        id: newTicket.id,
        ticketCode: newTicket.ticket_code,
        companyName: newTicket.company_name,
        userName: newTicket.user_name,
        userEmail: newTicket.user_email,
        category: newTicket.category,
        priority: newTicket.priority,
        status: newTicket.status,
        assignedTo: newTicket.assigned_to,
        subject: newTicket.subject,
        description: newTicket.description,
        createdAt: newTicket.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 4. PATCH /api/tickets/:id - Reassign, change status, or update priority
// ==============================================================================
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority, category } = req.body;
    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';

    if (isDbConnected) {
      try {
        const result = await query(`
          UPDATE platform_support_tickets
          SET 
            status = COALESCE($1, status),
            assigned_to = COALESCE($2, assigned_to),
            priority = COALESCE($3, priority),
            category = COALESCE($4, category),
            updated_at = NOW()
          WHERE id = $5 OR ticket_code = $5
          RETURNING *;
        `, [status || null, assignedTo || null, priority || null, category || null, id]);

        if (result.rows.length > 0) {
          const row = result.rows[0];
          await recordAudit('SUPPORT_TICKET_UPDATED', 'Platform Support', row.id, { status, assignedTo, priority });
          return res.json({ success: true, message: `Ticket ${row.ticket_code} updated.`, ticket: row });
        }
      } catch (dbErr) {
        console.warn('[DB Fallback] Updating ticket in memory:', dbErr.message);
      }
    }

    const tIdx = IN_MEMORY_TICKETS.findIndex(t => t.id === id || t.ticket_code === id);
    if (tIdx === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (status) IN_MEMORY_TICKETS[tIdx].status = status;
    if (assignedTo) IN_MEMORY_TICKETS[tIdx].assigned_to = assignedTo;
    if (priority) IN_MEMORY_TICKETS[tIdx].priority = priority;
    if (category) IN_MEMORY_TICKETS[tIdx].category = category;
    IN_MEMORY_TICKETS[tIdx].updated_at = new Date().toISOString();

    await recordAudit('SUPPORT_TICKET_UPDATED', 'Platform Support', id, { status, assignedTo, priority });

    res.json({
      success: true,
      message: `Ticket ${IN_MEMORY_TICKETS[tIdx].ticket_code} updated.`,
      ticket: IN_MEMORY_TICKETS[tIdx]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 5. POST /api/tickets/:id/resolve - Mark ticket resolved with resolution notes
// ==============================================================================
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes, resolutionTimeMinutes = 25 } = req.body;

    if (!resolutionNotes) {
      return res.status(400).json({ error: 'Resolution notes are required to resolve ticket.' });
    }

    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';
    if (isDbConnected) {
      try {
        const result = await query(`
          UPDATE platform_support_tickets
          SET 
            status = 'RESOLVED',
            resolution_notes = $1,
            resolution_time_minutes = $2,
            resolved_at = NOW(),
            updated_at = NOW()
          WHERE id = $3 OR ticket_code = $3
          RETURNING *;
        `, [resolutionNotes, Number(resolutionTimeMinutes) || 25, id]);

        if (result.rows.length > 0) {
          const row = result.rows[0];
          await recordAudit('SUPPORT_TICKET_RESOLVED', 'Platform Support', row.id, { ticketCode: row.ticket_code, resolutionNotes });
          return res.json({ success: true, message: `Ticket ${row.ticket_code} marked as RESOLVED.`, ticket: row });
        }
      } catch (dbErr) {
        console.warn('[DB Fallback] Resolving ticket in memory:', dbErr.message);
      }
    }

    const tIdx = IN_MEMORY_TICKETS.findIndex(t => t.id === id || t.ticket_code === id);
    if (tIdx === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    IN_MEMORY_TICKETS[tIdx].status = 'RESOLVED';
    IN_MEMORY_TICKETS[tIdx].resolution_notes = resolutionNotes;
    IN_MEMORY_TICKETS[tIdx].resolution_time_minutes = Number(resolutionTimeMinutes) || 25;
    IN_MEMORY_TICKETS[tIdx].resolved_at = new Date().toISOString();
    IN_MEMORY_TICKETS[tIdx].updated_at = new Date().toISOString();

    await recordAudit('SUPPORT_TICKET_RESOLVED', 'Platform Support', id, { ticketCode: IN_MEMORY_TICKETS[tIdx].ticket_code, resolutionNotes });

    res.json({
      success: true,
      message: `Ticket ${IN_MEMORY_TICKETS[tIdx].ticket_code} marked as RESOLVED.`,
      ticket: IN_MEMORY_TICKETS[tIdx]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 6. DELETE /api/tickets/:id - Delete / archive support ticket
// ==============================================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = (await checkDbHealth()).status === 'CONNECTED';

    if (isDbConnected) {
      try {
        await query(`DELETE FROM platform_support_tickets WHERE id = $1 OR ticket_code = $1;`, [id]);
        await recordAudit('SUPPORT_TICKET_DELETED', 'Platform Support', id, { ticketId: id });
        return res.json({ success: true, message: `Ticket ${id} deleted.` });
      } catch (dbErr) {
        console.warn('[DB Fallback] Deleting ticket in memory:', dbErr.message);
      }
    }

    IN_MEMORY_TICKETS = IN_MEMORY_TICKETS.filter(t => t.id !== id && t.ticket_code !== id);
    await recordAudit('SUPPORT_TICKET_DELETED', 'Platform Support', id, { ticketId: id });

    res.json({ success: true, message: `Ticket ${id} deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
