import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory announcements store with rich initial seed records across all 6 announcement types
let announcementsStore = [
  {
    id: 'ann-maint-01',
    announcementCode: 'ANN-MAINT-2026-001',
    title: 'Scheduled Core Infrastructure Maintenance Window: DB Engine Upgrade to PostgreSQL 16',
    type: 'MAINTENANCE',
    category: 'INFRASTRUCTURE',
    priority: 'HIGH',
    content: 'Our cloud engineering team will be performing scheduled database engine upgrades and high-availability replica failover testing on Sunday between 02:00 UTC and 04:00 UTC. During this 120-minute window, the platform API may experience intermittent 30-second read-only modes. Field Medical Representatives can continue capturing offline DCRs which will automatically sync once connectivity resumes.',
    summary: 'Sunday 02:00-04:00 UTC maintenance window for PostgreSQL 16 engine upgrade. Offline mobile syncing supported.',
    targetAudience: 'ALL_COMPANIES',
    targetTenantIds: [],
    targetRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'AREA_MANAGER', 'MEDICAL_REP'],
    channels: ['IN_APP_BANNER', 'POPUP_MODAL', 'EMAIL_BROADCAST'],
    isPinnedBanner: true,
    requiresAcknowledgment: false,
    actionCtaText: 'View Maintenance Schedule',
    actionCtaUrl: 'https://status.orvexa.com/incidents/maint-2026-001',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 86400 * 1000).toISOString(),
    totalSent: 14850,
    totalRead: 11420,
    totalAcknowledged: 0,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann-feat-02',
    announcementCode: 'ANN-FEAT-2026-002',
    title: 'Release 4.2.0: AI-Powered Field Route Optimization & Real-Time Doctor Geofencing',
    type: 'NEW_FEATURE',
    category: 'PRODUCT_UPDATE',
    priority: 'INFO',
    content: 'We are thrilled to announce Platform Release 4.2.0! This major update brings automated AI-driven daily route planning for Medical Reps, dynamic Chemist POB credit risk scoring, and sub-50m perimeter geofence validation for Doctor call submissions. Company Admins can enable Route Optimization under Catalog & Operations.',
    summary: 'Platform v4.2.0 is live: AI Route Planning, Chemist Credit Risk Scoring, and Automated Geofence Validation.',
    targetAudience: 'ALL_COMPANIES',
    targetTenantIds: [],
    targetRoles: ['COMPANY_ADMIN', 'AREA_MANAGER', 'MEDICAL_REP'],
    channels: ['IN_APP_BANNER', 'POPUP_MODAL', 'EMAIL_BROADCAST', 'PUSH_NOTIFICATION'],
    isPinnedBanner: false,
    requiresAcknowledgment: false,
    actionCtaText: 'Explore Release Notes',
    actionCtaUrl: 'https://docs.orvexa.com/releases/v4.2.0',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
    totalSent: 14850,
    totalRead: 8930,
    totalAcknowledged: 0,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann-sec-03',
    announcementCode: 'ANN-SEC-2026-003',
    title: 'Mandatory Two-Factor Authentication (2FA) Policy Activation for All Tenant Administrators',
    type: 'SECURITY',
    category: 'COMPLIANCE_DEFENSE',
    priority: 'CRITICAL',
    content: 'In accordance with SOC2 Type II and ISO 27001 platform security requirements, multi-factor authentication (MFA) will be strictly enforced for all Company Admin accounts effective October 1, 2026. Admins who have not bound an authenticator app (Google Authenticator, Microsoft Authenticator, or TOTP hardware token) will be prompted during next login.',
    summary: 'Mandatory 2FA enforcement for all Company Administrators effective Oct 1, 2026. Please bind TOTP app.',
    targetAudience: 'ADMINS_ONLY',
    targetTenantIds: [],
    targetRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    channels: ['POPUP_MODAL', 'EMAIL_BROADCAST'],
    isPinnedBanner: true,
    requiresAcknowledgment: true,
    actionCtaText: 'Configure 2FA Now',
    actionCtaUrl: '/security/mfa-setup',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    totalSent: 420,
    totalRead: 395,
    totalAcknowledged: 312,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann-ver-04',
    announcementCode: 'ANN-VER-2026-004',
    title: 'Mobile SFA Android & iOS App Version 3.4.1 Rolled Out to Production App Stores',
    type: 'VERSION_UPDATE',
    category: 'MOBILE_CLIENT',
    priority: 'INFO',
    content: 'Mobile SFA App Version 3.4.1 (Build 184) is now live on Google Play Store and Apple App Store. Fixes intermittent background GPS telemetry drift on Android 14 and optimizes SQLite local database caching for doctor prescription catalogs with over 50,000 SKUs.',
    summary: 'Mobile SFA v3.4.1 released on Play Store and App Store with GPS drift fix & 50k SKU catalog speedup.',
    targetAudience: 'FIELD_REPS_ONLY',
    targetTenantIds: [],
    targetRoles: ['MEDICAL_REP', 'AREA_MANAGER'],
    channels: ['IN_APP_BANNER', 'PUSH_NOTIFICATION'],
    isPinnedBanner: false,
    requiresAcknowledgment: false,
    actionCtaText: 'Update Mobile App',
    actionCtaUrl: 'https://play.google.com/store/apps/details?id=com.orvexa.sfa',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 86400 * 1000).toISOString(),
    totalSent: 13200,
    totalRead: 9840,
    totalAcknowledged: 0,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann-pol-05',
    announcementCode: 'ANN-POL-2026-005',
    title: 'Platform Data Privacy & Statutory Audit Compliance Policy Update (FDA 21 CFR Part 11)',
    type: 'PLATFORM_POLICY',
    category: 'REGULATORY',
    priority: 'WARNING',
    content: 'We have updated our platform data handling and audit ledger policy to meet US FDA 21 CFR Part 11 electronic signature compliance and European EMA Annex 11 validation guidelines. All administrative mutations (user promotion, territorial realignment, stockist credit threshold revisions) now enforce immutable forensic change diffs retained for 7 years.',
    summary: 'Updated Data Governance policy complying with FDA 21 CFR Part 11 and EMA Annex 11 audit guidelines.',
    targetAudience: 'ALL_COMPANIES',
    targetTenantIds: [],
    targetRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR'],
    channels: ['POPUP_MODAL', 'EMAIL_BROADCAST'],
    isPinnedBanner: false,
    requiresAcknowledgment: true,
    actionCtaText: 'Review Policy Document',
    actionCtaUrl: 'https://legal.orvexa.com/policies/fda-21-cfr-part-11',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 45 * 86400 * 1000).toISOString(),
    totalSent: 14850,
    totalRead: 8210,
    totalAcknowledged: 6420,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann-trm-06',
    announcementCode: 'ANN-TRM-2026-006',
    title: 'Master Subscription Agreement (MSA) & Terms of Service 2026 Revision',
    type: 'TERMS_UPDATE',
    category: 'LEGAL_TERMS',
    priority: 'HIGH',
    content: 'Our Master Subscription Agreement (MSA), Service Level Agreement (SLA), and Data Processing Addendum (DPA) have been updated for 2026. The revised terms formalize 99.99% core API uptime commitments, 4-hour disaster recovery RTO objectives, and sub-processor transparency clauses.',
    summary: '2026 MSA & Terms update with 99.99% SLA commitment and 4-hour disaster recovery RTO.',
    targetAudience: 'ADMINS_ONLY',
    targetTenantIds: [],
    targetRoles: ['COMPANY_ADMIN'],
    channels: ['POPUP_MODAL', 'EMAIL_BROADCAST'],
    isPinnedBanner: false,
    requiresAcknowledgment: true,
    actionCtaText: 'Read Full Terms of Service',
    actionCtaUrl: 'https://legal.orvexa.com/terms/2026-msa',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
    totalSent: 420,
    totalRead: 408,
    totalAcknowledged: 388,
    createdBy: 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  }
];

let acknowledgmentsStore = [
  {
    id: 'ack-001',
    announcementId: 'ann-sec-03',
    announcementTitle: 'Mandatory Two-Factor Authentication (2FA) Policy Activation',
    userEmail: 'admin@pfizerbiopharma.com',
    userName: 'Vikram Malhotra',
    role: 'COMPANY_ADMIN',
    companyName: 'Pfizer BioPharma Ltd',
    ipAddress: '142.250.190.46',
    acknowledgedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'ack-002',
    announcementId: 'ann-sec-03',
    announcementTitle: 'Mandatory Two-Factor Authentication (2FA) Policy Activation',
    userEmail: 'admin@novartispharma.com',
    userName: 'Elena Rostova',
    role: 'COMPANY_ADMIN',
    companyName: 'Novartis Pharma Global',
    ipAddress: '194.230.145.22',
    acknowledgedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  },
  {
    id: 'ack-003',
    announcementId: 'ann-trm-06',
    announcementTitle: 'Master Subscription Agreement (MSA) & Terms of Service 2026 Revision',
    userEmail: 'admin@pfizerbiopharma.com',
    userName: 'Vikram Malhotra',
    role: 'COMPANY_ADMIN',
    companyName: 'Pfizer BioPharma Ltd',
    ipAddress: '142.250.190.46',
    acknowledgedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  },
  {
    id: 'ack-004',
    announcementId: 'ann-pol-05',
    announcementTitle: 'Platform Data Privacy & Statutory Audit Compliance Policy Update',
    userEmail: 'auditor@astrazeneca.com',
    userName: 'Dr. James Sterling',
    role: 'AUDITOR',
    companyName: 'AstraZeneca Healthcare',
    ipAddress: '51.148.172.90',
    acknowledgedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString()
  }
];

let userInboxNotifications = [
  {
    id: 'notif-1',
    title: 'New POB Order Booked',
    message: 'Amit Verma booked ₹16,743 POB for Apollo Medplus Pharmacy.',
    type: 'ORDER',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'DCR Visit Verified with Geofence',
    message: 'Dr. Arvind Mehra call verified within 35m perimeter of Max Hospital.',
    type: 'DCR',
    timestamp: '45 mins ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'TA/DA Expense Approval Required',
    message: 'Claim #EXP-701 for ₹659 is waiting for Regional Manager sign-off.',
    type: 'EXPENSE',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Stockist Delivery Dispatched',
    message: 'MedLife Distributors dispatched Order #ALV-2026-0903 for Fortis Hospital.',
    type: 'STOCKIST',
    timestamp: 'Yesterday',
    read: true
  }
];

// ==============================================================================
// 1. INBOX NOTIFICATIONS (USER-LEVEL)
// ==============================================================================
// GET /api/notifications
router.get('/', (req, res) => {
  const unreadCount = userInboxNotifications.filter(n => !n.read).length;
  res.json({
    success: true,
    unreadCount,
    data: userInboxNotifications
  });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const item = userInboxNotifications.find(n => n.id === id);
  if (item) item.read = true;
  res.json({ success: true, data: item });
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req, res) => {
  userInboxNotifications.forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// ==============================================================================
// 2. NOTIFICATION DELIVERY OVERVIEW & TELEMETRY
// ==============================================================================
// GET /api/notifications/overview
router.get('/overview', (req, res) => {
  const totalPublished = announcementsStore.filter(a => a.status === 'PUBLISHED').length;
  const totalPinnedBanners = announcementsStore.filter(a => a.isPinnedBanner && a.status === 'PUBLISHED').length;
  const totalSentAcrossAll = announcementsStore.reduce((acc, curr) => acc + (curr.totalSent || 0), 0);
  const totalReadAcrossAll = announcementsStore.reduce((acc, curr) => acc + (curr.totalRead || 0), 0);
  const totalAcksAcrossAll = announcementsStore.reduce((acc, curr) => acc + (curr.totalAcknowledged || 0), 0);

  const readRate = totalSentAcrossAll > 0 ? ((totalReadAcrossAll / totalSentAcrossAll) * 100).toFixed(1) : '82.4';
  const ackRate = totalReadAcrossAll > 0 ? ((totalAcksAcrossAll / totalReadAcrossAll) * 100).toFixed(1) : '94.2';

  res.json({
    success: true,
    data: {
      totalAnnouncements: announcementsStore.length,
      publishedCount: totalPublished,
      pinnedBannersCount: totalPinnedBanners,
      totalDispatched: totalSentAcrossAll,
      totalRead: totalReadAcrossAll,
      totalAcknowledged: totalAcksAcrossAll,
      readRatePercent: parseFloat(readRate),
      acknowledgmentRatePercent: parseFloat(ackRate),
      channelHealth: {
        inAppWebSockets: { status: 'OPERATIONAL', activeConnections: 1248, latencyMs: 12 },
        emailRelay: { status: 'OPERATIONAL', provider: 'AWS SES + SMTP', deliveryRatePercent: 99.8 },
        mobilePushFCM: { status: 'OPERATIONAL', provider: 'Firebase FCM / APNs', deliveredToday: 13200 },
        smsGateway: { status: 'OPERATIONAL', provider: 'Twilio Telephony', deliveredToday: 340 }
      },
      typeDistribution: {
        MAINTENANCE: announcementsStore.filter(a => a.type === 'MAINTENANCE').length,
        NEW_FEATURE: announcementsStore.filter(a => a.type === 'NEW_FEATURE').length,
        SECURITY: announcementsStore.filter(a => a.type === 'SECURITY').length,
        VERSION_UPDATE: announcementsStore.filter(a => a.type === 'VERSION_UPDATE').length,
        PLATFORM_POLICY: announcementsStore.filter(a => a.type === 'PLATFORM_POLICY').length,
        TERMS_UPDATE: announcementsStore.filter(a => a.type === 'TERMS_UPDATE').length
      }
    }
  });
});

// ==============================================================================
// 3. GLOBAL ANNOUNCEMENTS (LIST & SEARCH)
// ==============================================================================
// GET /api/notifications/announcements
router.get('/announcements', async (req, res) => {
  const { type, priority, status, audience, isPinned } = req.query;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      let sql = 'SELECT * FROM platform_global_announcements WHERE 1=1';
      const params = [];

      if (type && type !== 'ALL') {
        params.push(type);
        sql += ` AND type = $${params.length}`;
      }
      if (priority && priority !== 'ALL') {
        params.push(priority);
        sql += ` AND priority = $${params.length}`;
      }
      if (status && status !== 'ALL') {
        params.push(status);
        sql += ` AND status = $${params.length}`;
      }
      if (isPinned === 'true') {
        sql += ' AND is_pinned_banner = true';
      }

      sql += ' ORDER BY created_at DESC';
      const result = await query(sql, params);
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          count: result.rows.length,
          data: result.rows.map(row => ({
            id: row.id,
            announcementCode: row.announcement_code,
            title: row.title,
            type: row.type,
            category: row.category,
            priority: row.priority,
            content: row.content,
            summary: row.summary,
            targetAudience: row.target_audience,
            targetTenantIds: row.target_tenant_ids || [],
            targetRoles: row.target_roles || [],
            channels: row.channels || [],
            isPinnedBanner: row.is_pinned_banner,
            requiresAcknowledgment: row.requires_acknowledgment,
            actionCtaText: row.action_cta_text,
            actionCtaUrl: row.action_cta_url,
            status: row.status,
            scheduledAt: row.scheduled_at,
            expiresAt: row.expires_at,
            totalSent: row.total_sent || 0,
            totalRead: row.total_read || 0,
            totalAcknowledged: row.total_acknowledged || 0,
            createdBy: row.created_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }))
        });
      }
    }
  } catch (err) {
    console.error('Announcements DB query error, falling back to memory store:', err.message);
  }

  // Filter in-memory store
  let filtered = [...announcementsStore];
  if (type && type !== 'ALL') {
    filtered = filtered.filter(a => a.type === type);
  }
  if (priority && priority !== 'ALL') {
    filtered = filtered.filter(a => a.priority === priority);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(a => a.status === status);
  }
  if (isPinned === 'true') {
    filtered = filtered.filter(a => a.isPinnedBanner);
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// ==============================================================================
// 4. PUBLISH GLOBAL ANNOUNCEMENT (CREATE & BROADCAST)
// ==============================================================================
// POST /api/notifications/announcements
router.post('/announcements', async (req, res) => {
  const {
    title,
    type,
    category,
    priority,
    content,
    summary,
    targetAudience,
    targetTenantIds,
    targetRoles,
    channels,
    isPinnedBanner,
    requiresAcknowledgment,
    actionCtaText,
    actionCtaUrl,
    scheduledAt,
    expiresAt,
    createdBy
  } = req.body;

  if (!title || !type || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title, announcement type, and content are required.'
    });
  }

  const validTypes = ['MAINTENANCE', 'NEW_FEATURE', 'SECURITY', 'VERSION_UPDATE', 'PLATFORM_POLICY', 'TERMS_UPDATE'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid announcement type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  const announcementId = `ann-${type.toLowerCase().slice(0, 4)}-${Date.now()}`;
  const announcementCode = `ANN-${type.slice(0, 4)}-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newAnnouncement = {
    id: announcementId,
    announcementCode,
    title,
    type,
    category: category || 'GENERAL',
    priority: priority || 'INFO',
    content,
    summary: summary || title,
    targetAudience: targetAudience || 'ALL_COMPANIES',
    targetTenantIds: Array.isArray(targetTenantIds) ? targetTenantIds : [],
    targetRoles: Array.isArray(targetRoles) && targetRoles.length > 0 ? targetRoles : ['SUPER_ADMIN', 'COMPANY_ADMIN', 'AREA_MANAGER', 'MEDICAL_REP'],
    channels: Array.isArray(channels) && channels.length > 0 ? channels : ['IN_APP_BANNER', 'POPUP_MODAL'],
    isPinnedBanner: Boolean(isPinnedBanner),
    requiresAcknowledgment: Boolean(requiresAcknowledgment),
    actionCtaText: actionCtaText || null,
    actionCtaUrl: actionCtaUrl || null,
    status: 'PUBLISHED',
    scheduledAt: scheduledAt || new Date().toISOString(),
    expiresAt: expiresAt || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    totalSent: targetAudience === 'ADMINS_ONLY' ? 420 : 14850,
    totalRead: 0,
    totalAcknowledged: 0,
    createdBy: createdBy || 'Akshyatraj Pati (Super Admin)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        `INSERT INTO platform_global_announcements (
          announcement_code, title, type, category, priority, content, summary,
          target_audience, target_tenant_ids, target_roles, channels,
          is_pinned_banner, requires_acknowledgment, action_cta_text, action_cta_url,
          status, scheduled_at, expires_at, total_sent, total_read, total_acknowledged, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 0, 0, $20)`,
        [
          newAnnouncement.announcementCode,
          newAnnouncement.title,
          newAnnouncement.type,
          newAnnouncement.category,
          newAnnouncement.priority,
          newAnnouncement.content,
          newAnnouncement.summary,
          newAnnouncement.targetAudience,
          JSON.stringify(newAnnouncement.targetTenantIds),
          JSON.stringify(newAnnouncement.targetRoles),
          JSON.stringify(newAnnouncement.channels),
          newAnnouncement.isPinnedBanner,
          newAnnouncement.requiresAcknowledgment,
          newAnnouncement.actionCtaText,
          newAnnouncement.actionCtaUrl,
          newAnnouncement.status,
          newAnnouncement.scheduledAt,
          newAnnouncement.expiresAt,
          newAnnouncement.totalSent,
          newAnnouncement.createdBy
        ]
      );
    }
  } catch (err) {
    console.warn('Could not insert announcement into DB, saved to memory:', err.message);
  }

  // Prepend to in-memory store
  announcementsStore.unshift(newAnnouncement);

  // If user inbox notification requested, broadcast to userInboxNotifications
  userInboxNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: `[${type.replace('_', ' ')}] ${title}`,
    message: summary || title,
    type: type.slice(0, 8),
    timestamp: 'Just now',
    read: false
  });

  res.status(201).json({
    success: true,
    message: `Global announcement [${announcementCode}] published successfully across selected channels.`,
    data: newAnnouncement
  });
});

// ==============================================================================
// 5. GET ANNOUNCEMENT DETAILS
// ==============================================================================
// GET /api/notifications/announcements/:id
router.get('/announcements/:id', (req, res) => {
  const { id } = req.params;
  const found = announcementsStore.find(a => a.id === id || a.announcementCode === id);

  if (!found) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  const relatedAcks = acknowledgmentsStore.filter(ack => ack.announcementId === found.id);

  res.json({
    success: true,
    data: {
      ...found,
      acknowledgmentsList: relatedAcks
    }
  });
});

// ==============================================================================
// 6. UPDATE ANNOUNCEMENT
// ==============================================================================
// PUT /api/notifications/announcements/:id
router.put('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const index = announcementsStore.findIndex(a => a.id === id || a.announcementCode === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  const updated = {
    ...announcementsStore[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  announcementsStore[index] = updated;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        `UPDATE platform_global_announcements SET
          title = COALESCE($1, title),
          priority = COALESCE($2, priority),
          content = COALESCE($3, content),
          summary = COALESCE($4, summary),
          is_pinned_banner = COALESCE($5, is_pinned_banner),
          requires_acknowledgment = COALESCE($6, requires_acknowledgment),
          expires_at = COALESCE($7, expires_at),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9 OR announcement_code = $9`,
        [
          req.body.title,
          req.body.priority,
          req.body.content,
          req.body.summary,
          req.body.isPinnedBanner,
          req.body.requiresAcknowledgment,
          req.body.expiresAt,
          req.body.status,
          id
        ]
      );
    }
  } catch (err) {
    console.warn('DB update failed, in-memory updated:', err.message);
  }

  res.json({
    success: true,
    message: 'Announcement updated successfully.',
    data: updated
  });
});

// ==============================================================================
// 7. TOGGLE PINNED TOP BANNER
// ==============================================================================
// PATCH /api/notifications/announcements/:id/pin
router.patch('/announcements/:id/pin', async (req, res) => {
  const { id } = req.params;
  const item = announcementsStore.find(a => a.id === id || a.announcementCode === id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  item.isPinnedBanner = !item.isPinnedBanner;
  item.updatedAt = new Date().toISOString();

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        'UPDATE platform_global_announcements SET is_pinned_banner = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 OR announcement_code = $2',
        [item.isPinnedBanner, id]
      );
    }
  } catch (err) {
    console.warn('DB pin toggle error:', err.message);
  }

  res.json({
    success: true,
    message: `Announcement ${item.isPinnedBanner ? 'pinned as global platform banner' : 'unpinned from platform banner'}.`,
    isPinnedBanner: item.isPinnedBanner
  });
});

// ==============================================================================
// 8. DELETE / ARCHIVE ANNOUNCEMENT
// ==============================================================================
// DELETE /api/notifications/announcements/:id
router.delete('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const initialLength = announcementsStore.length;
  announcementsStore = announcementsStore.filter(a => a.id !== id && a.announcementCode !== id);

  if (announcementsStore.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query('DELETE FROM platform_global_announcements WHERE id = $1 OR announcement_code = $1', [id]);
    }
  } catch (err) {
    console.warn('DB delete announcement error:', err.message);
  }

  res.json({
    success: true,
    message: 'Announcement deleted successfully.'
  });
});

// ==============================================================================
// 9. SEND TEST DISPATCH NOTIFICATION
// ==============================================================================
// POST /api/notifications/announcements/:id/test-dispatch
router.post('/announcements/:id/test-dispatch', (req, res) => {
  const { id } = req.params;
  const item = announcementsStore.find(a => a.id === id || a.announcementCode === id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  res.json({
    success: true,
    message: `Test notification preview for "${item.title}" successfully dispatched to Super Admin test channels (WebSocket In-App & Admin Email).`,
    dispatchedAt: new Date().toISOString(),
    channelsSimulated: ['IN_APP_POPUP', 'ADMIN_EMAIL_PREVIEW']
  });
});

// ==============================================================================
// 10. NOTIFICATION CHANNELS HEALTH
// ==============================================================================
// GET /api/notifications/channels
router.get('/channels', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        channelKey: 'IN_APP_WEBSOCKET',
        name: 'In-App Live WebSocket Broadcast',
        provider: 'Socket.io Cluster',
        status: 'OPERATIONAL',
        latencyMs: 12,
        throughput: '1,420 msgs/sec',
        activeSubscribers: 14850,
        description: 'Instant header banner and modal alerts dispatched directly to active web sessions.'
      },
      {
        channelKey: 'EMAIL_RELAY',
        name: 'Transactional Email Dispatcher',
        provider: 'AWS SES + SMTP Gateway',
        status: 'OPERATIONAL',
        latencyMs: 110,
        throughput: '350 emails/min',
        activeSubscribers: 14850,
        description: 'Formatted HTML email broadcasts sent to company administrators and user inboxes.'
      },
      {
        channelKey: 'MOBILE_PUSH',
        name: 'Mobile SFA Push Notification Relay',
        provider: 'Firebase Cloud Messaging (FCM) & APNs',
        status: 'OPERATIONAL',
        latencyMs: 45,
        throughput: '2,800 pushes/sec',
        activeSubscribers: 13200,
        description: 'Native mobile notifications triggering lock-screen updates for field Medical Reps.'
      },
      {
        channelKey: 'SMS_GATEWAY',
        name: 'Urgent Security & Lockout SMS',
        provider: 'Twilio Cloud Telephony',
        status: 'OPERATIONAL',
        latencyMs: 85,
        throughput: '60 SMS/min',
        activeSubscribers: 420,
        description: 'High-priority SMS alerts for critical infrastructure downtime and 2FA lockouts.'
      }
    ]
  });
});

// ==============================================================================
// 11. AUDIT OF ACKNOWLEDGMENTS
// ==============================================================================
// GET /api/notifications/acknowledgments
router.get('/acknowledgments', (req, res) => {
  res.json({
    success: true,
    count: acknowledgmentsStore.length,
    data: acknowledgmentsStore
  });
});

// POST /api/notifications/announcements/:id/acknowledge
router.post('/announcements/:id/acknowledge', (req, res) => {
  const { id } = req.params;
  const { userEmail, userName, role, companyName } = req.body;

  const found = announcementsStore.find(a => a.id === id || a.announcementCode === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  const existingAck = acknowledgmentsStore.find(ack => (ack.announcementId === found.id || ack.announcementId === id) && ack.userEmail === (userEmail || 'master.admin@orvexa.com'));
  if (existingAck) {
    return res.json({ success: true, message: 'Already acknowledged', data: existingAck });
  }

  const newAck = {
    id: `ack-${Date.now()}`,
    announcementId: found.id,
    announcementTitle: found.title,
    userEmail: userEmail || 'master.admin@orvexa.com',
    userName: userName || 'Super Admin',
    role: role || 'SUPER_ADMIN',
    companyName: companyName || 'Platform HQ',
    ipAddress: req.ip || '127.0.0.1',
    acknowledgedAt: new Date().toISOString()
  };

  acknowledgmentsStore.unshift(newAck);
  found.totalAcknowledged = (found.totalAcknowledged || 0) + 1;

  res.json({
    success: true,
    message: 'Announcement terms acknowledged successfully.',
    data: newAck
  });
});

export default router;
