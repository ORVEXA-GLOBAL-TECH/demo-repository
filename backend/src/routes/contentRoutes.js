import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory platform content articles store
let contentArticlesStore = [
  {
    id: 'art-001',
    contentType: 'HELP_CENTER',
    category: 'DCR_REPORTING',
    title: 'How to Submit Daily Call Reports (DCR) with Geofenced Doctor Verification',
    slug: 'submitting-dcr-with-geofence-verification',
    summary: 'Step-by-step guide for Medical Representatives to log doctor calls, take chemist POB orders, and verify within the hospital perimeter.',
    content: `# Submitting Daily Call Reports (DCR)\n\nMedical Representatives can record doctor visits, chemist meetings, and stockist interactions in 4 simple steps:\n\n1. **Open Mobile SFA App** and navigate to **Daily Call Plan**.\n2. **Select Doctor / Hospital**: The app checks your GPS position against the doctor's verified clinic perimeter (35m-50m radius).\n3. **Detail Products**: Log sample units distributed, visual detailing materials presented, and prescription commitment.\n4. **Tap Submit & Sync**: If online, the call syncs instantly to your Area Manager's approval queue. If offline, submissions are cryptographically encrypted in SQLite storage until cellular or WiFi connection resumes.`,
    version: '1.2.0',
    targetAudience: 'FIELD_REPS',
    status: 'PUBLISHED',
    viewsCount: 4820,
    helpfulVotes: 395,
    author: 'Orvexa Product & Clinical Training Team',
    publishedAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  },
  {
    id: 'art-002',
    contentType: 'HELP_CENTER',
    category: 'ORDERS_POB',
    title: 'Booking Chemist POB Orders & Stockist Credit Verification Guidelines',
    slug: 'chemist-pob-orders-and-stockist-credit-checks',
    summary: 'Guide for booking Chemist orders, calculating promotional slab discounts, and real-time stockist credit line checks.',
    content: `# Chemist POB Orders & Credit Guidelines\n\nWhen booking Primary Order Bookings (POB) at retail chemist counters:\n\n- **Live Catalog Search**: Search by Generic Formulation or Brand Trade Name.\n- **Slab Discounts**: Automated volume discount matrices (e.g. 10+1 free, 5% cash discount) are applied automatically.\n- **Credit Line Validation**: The system queries the linked Stockist ERP (SAP / NetSuite) to ensure the Chemist has not exceeded their 30-day outstanding invoice ceiling.`,
    version: '1.1.0',
    targetAudience: 'FIELD_REPS',
    status: 'PUBLISHED',
    viewsCount: 3210,
    helpfulVotes: 280,
    author: 'Commercial Operations Team',
    publishedAt: new Date(Date.now() - 45 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  },
  {
    id: 'art-003',
    contentType: 'APP_ANNOUNCEMENT',
    category: 'PRODUCT_SPOTLIGHT',
    title: 'Spotlight: AI-Powered Smart Route Optimization & Doctor Priority Planner',
    slug: 'ai-smart-route-optimization-spotlight',
    summary: 'Learn how the new AI engine reduces field travel time by up to 28% through cluster-based visit scheduling.',
    content: `# AI-Powered Smart Route Optimization\n\nOur latest v4.2 update introduces machine-learning route sequencing that groups nearby doctor clinics, hospital OPD timings, and chemist clusters into optimal driving corridors. Area Managers can review regional coverage heatmaps under the Operations Dashboard.`,
    version: '1.0.0',
    targetAudience: 'ALL',
    status: 'PUBLISHED',
    viewsCount: 6840,
    helpfulVotes: 512,
    author: 'AI Innovation Lab',
    publishedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString()
  }
];

let legalPoliciesStore = {
  PRIVACY_POLICY: {
    title: 'Platform Master Privacy Policy',
    effectiveDate: '2026-09-01',
    version: 'v4.2 (2026 Statutory Revision)',
    complianceFrameworks: ['GDPR', 'HIPAA', 'FDA 21 CFR Part 11', 'ISO 27001'],
    content: `# Platform Master Privacy Policy & Data Protection Charter\n\n**Effective Date:** September 1, 2026  \n**Version:** 4.2.0  \n\n## 1. Scope & Multi-Tenant Data Isolation\nOrvexa Global Tech provides multi-tenant enterprise software-as-a-service (SaaS) to life sciences and pharmaceutical organizations. All proprietary tenant records (doctor registries, chemist lists, prescription transaction volumes, sales targets) are strictly isolated with dedicated encryption keys (AES-256) and segregated logical databases.\n\n## 2. Field Telemetry & Geolocation Privacy\nGPS coordinates and telemetry pings captured by the Mobile SFA application are utilized solely during active duty hours for Doctor visit geofence verification, travel distance calculation for expense reimbursements, and route optimization. Background location tracking is automatically deactivated upon shift punch-out.\n\n## 3. Data Retention & Right to Be Forgotten\nUnder GDPR Article 17, tenants retain full ownership of their data with configurable statutory retention windows (e.g. 7 years for forensic audit ledgers and sales orders). Controlled data purge requests enforce a 7-day safety grace period with cryptographic two-step token verification.`,
    updatedBy: 'Akshyatraj Pati (Super Admin)',
    updatedAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  TERMS_CONDITIONS: {
    title: 'Master Subscription Agreement & Terms of Service',
    effectiveDate: '2026-09-01',
    version: 'v2026.3',
    complianceFrameworks: ['SOC 2 Type II', '99.99% Core API SLA'],
    content: `# Master Subscription Agreement (MSA) & Terms of Service\n\n**Effective Date:** September 1, 2026  \n**Governing Law:** Delaware, United States / English Commercial Law  \n\n## 1. Platform Service Level Agreement (SLA)\nOrvexa guarantees 99.99% monthly core API and cloud infrastructure availability, excluding scheduled maintenance windows announced at least 48 hours in advance. Disaster Recovery objectives mandate a Recovery Time Objective (RTO) of under 4 hours and Recovery Point Objective (RPO) of under 15 minutes.\n\n## 2. Fair Usage, Rate Limits & API Quotas\nAPI access tiers enforce granular rate limits (Starter: 120 RPM / 50k daily; Professional: 600 RPM / 200k daily; Enterprise: 1,200 RPM / 500k daily). Unused daily quotas do not roll over.\n\n## 3. Statutory Compliance & Auditability\nAll administrative mutations (user promotion, territorial realignment, stockist credit threshold revisions) enforce immutable forensic change diffs retained for statutory compliance.`,
    updatedBy: 'Akshyatraj Pati (Super Admin)',
    updatedAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  SUPPORT_INFO: {
    title: 'Enterprise Technical Support Matrix & Escalation Directory',
    effectiveDate: '2026-09-01',
    version: 'v2026.1',
    supportTiers: [
      { tier: 'L1 Operational Support', coverage: '24/7/365 Web & Chat', responseSLA: '15 Minutes', email: 'support@orvexa.com', phone: '+1 (800) 555-ORVEXA' },
      { tier: 'L2 Engineering & Integration Escalation', coverage: '24/5 Business Hours', responseSLA: '1 Hour', email: 'integrations@orvexa.com', phone: '+1 (800) 555-4321' },
      { tier: 'L3 Critical Infrastructure & Emergency On-Call', coverage: '24/7 Dedicated PagerDuty', responseSLA: '10 Minutes', email: 'security@orvexa.com', phone: '+1 (800) 555-9999' }
    ],
    operatingHours: 'Global Follow-the-Sun Support (US Eastern, CET Europe, IST India, SGT Singapore)',
    emergencyContact: 'Super Admin On-Call Command Center: +1 (800) 555-9999 (Code: MASTER-ADMIN-AUTH)',
    updatedBy: 'Akshyatraj Pati (Super Admin)',
    updatedAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
};

// ==============================================================================
// 1. CMS CONTENT OVERVIEW
// ==============================================================================
// GET /api/content/overview
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalHelpArticles: contentArticlesStore.filter(a => a.contentType === 'HELP_CENTER').length,
      totalAppAnnouncements: contentArticlesStore.filter(a => a.contentType === 'APP_ANNOUNCEMENT').length,
      privacyPolicyVersion: legalPoliciesStore.PRIVACY_POLICY.version,
      privacyPolicyEffectiveDate: legalPoliciesStore.PRIVACY_POLICY.effectiveDate,
      termsConditionsVersion: legalPoliciesStore.TERMS_CONDITIONS.version,
      termsEffectiveDate: legalPoliciesStore.TERMS_CONDITIONS.effectiveDate,
      supportTiersCount: legalPoliciesStore.SUPPORT_INFO.supportTiers.length,
      totalViewsAcrossArticles: contentArticlesStore.reduce((sum, a) => sum + (a.viewsCount || 0), 0)
    }
  });
});

// ==============================================================================
// 2. LIST ARTICLES
// ==============================================================================
// GET /api/content/articles
router.get('/articles', async (req, res) => {
  const { type, category, search } = req.query;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      let sql = 'SELECT * FROM platform_content_articles WHERE 1=1';
      const params = [];
      if (type && type !== 'ALL') {
        params.push(type);
        sql += ` AND content_type = $${params.length}`;
      }
      if (category && category !== 'ALL') {
        params.push(category);
        sql += ` AND category = $${params.length}`;
      }
      sql += ' ORDER BY published_at DESC';
      const result = await query(sql, params);
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          count: result.rows.length,
          data: result.rows.map(r => ({
            id: r.id,
            contentType: r.content_type,
            category: r.category,
            title: r.title,
            slug: r.slug,
            summary: r.summary,
            content: r.content,
            version: r.version,
            targetAudience: r.target_audience,
            status: r.status,
            viewsCount: r.views_count,
            helpfulVotes: r.helpful_votes,
            author: r.author,
            publishedAt: r.published_at,
            updatedAt: r.updated_at
          }))
        });
      }
    }
  } catch (err) {
    console.warn('DB query error for articles, falling back to memory store:', err.message);
  }

  let filtered = [...contentArticlesStore];
  if (type && type !== 'ALL') {
    filtered = filtered.filter(a => a.contentType === type);
  }
  if (category && category !== 'ALL') {
    filtered = filtered.filter(a => a.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || (a.summary && a.summary.toLowerCase().includes(q)));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// ==============================================================================
// 3. CREATE ARTICLE
// ==============================================================================
// POST /api/content/articles
router.post('/articles', async (req, res) => {
  const { contentType, category, title, content, summary, version, targetAudience, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Article title and content are required.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100);
  const newArticle = {
    id: `art-${Date.now()}`,
    contentType: contentType || 'HELP_CENTER',
    category: category || 'GENERAL',
    title,
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    summary: summary || title,
    content,
    version: version || '1.0.0',
    targetAudience: targetAudience || 'ALL',
    status: 'PUBLISHED',
    viewsCount: 0,
    helpfulVotes: 0,
    author: author || 'Orvexa Global Super Admin HQ',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        `INSERT INTO platform_content_articles (
          content_type, category, title, slug, content, summary,
          version, target_audience, status, views_count, helpful_votes, author
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PUBLISHED', 0, 0, $9)`,
        [
          newArticle.contentType,
          newArticle.category,
          newArticle.title,
          newArticle.slug,
          newArticle.content,
          newArticle.summary,
          newArticle.version,
          newArticle.targetAudience,
          newArticle.author
        ]
      );
    }
  } catch (err) {
    console.warn('DB insert article failed, saved to memory:', err.message);
  }

  contentArticlesStore.unshift(newArticle);

  res.status(201).json({
    success: true,
    message: `Article "${newArticle.title}" published successfully.`,
    data: newArticle
  });
});

// ==============================================================================
// 4. UPDATE ARTICLE
// ==============================================================================
// PUT /api/content/articles/:id
router.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const idx = contentArticlesStore.findIndex(a => a.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  const updated = {
    ...contentArticlesStore[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  contentArticlesStore[idx] = updated;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        `UPDATE platform_content_articles SET
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          summary = COALESCE($3, summary),
          category = COALESCE($4, category),
          version = COALESCE($5, version),
          status = COALESCE($6, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7`,
        [req.body.title, req.body.content, req.body.summary, req.body.category, req.body.version, req.body.status, id]
      );
    }
  } catch (err) {
    console.warn('DB update article failed, saved to memory:', err.message);
  }

  res.json({
    success: true,
    message: `Article "${updated.title}" updated successfully.`,
    data: updated
  });
});

// ==============================================================================
// 5. DELETE ARTICLE
// ==============================================================================
// DELETE /api/content/articles/:id
router.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  contentArticlesStore = contentArticlesStore.filter(a => a.id !== id);

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query('DELETE FROM platform_content_articles WHERE id = $1', [id]);
    }
  } catch (err) {
    console.warn('DB delete article error:', err.message);
  }

  res.json({
    success: true,
    message: 'Article deleted successfully.'
  });
});

// ==============================================================================
// 6. LEGAL POLICIES & TERMS & SUPPORT INFO (GET & UPDATE)
// ==============================================================================
// GET /api/content/policy/:type
router.get('/policy/:type', (req, res) => {
  const { type } = req.params;
  const policyKey = type.toUpperCase().replace(/-/g, '_');
  const found = legalPoliciesStore[policyKey];

  if (!found) {
    return res.status(404).json({ success: false, message: `Legal content for ${type} not found` });
  }

  res.json({
    success: true,
    data: found
  });
});

// PUT /api/content/policy/:type
router.put('/policy/:type', (req, res) => {
  const { type } = req.params;
  const policyKey = type.toUpperCase().replace(/-/g, '_');

  if (!legalPoliciesStore[policyKey]) {
    return res.status(404).json({ success: false, message: `Legal content for ${type} not found` });
  }

  legalPoliciesStore[policyKey] = {
    ...legalPoliciesStore[policyKey],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: `${legalPoliciesStore[policyKey].title} successfully updated and published to all user portals.`,
    data: legalPoliciesStore[policyKey]
  });
});

export default router;
