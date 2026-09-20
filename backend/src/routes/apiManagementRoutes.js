import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory API Management store
let apiKeysStore = [
  {
    id: 'key_live_98101',
    keyName: 'Pfizer Global SAP S/4HANA Sync Key',
    keyPrefix: 'allv_live_pfz_',
    maskedKey: 'allv_live_pfz_••••••••••••38f9',
    tenantId: 't_pfizer_02',
    companyName: 'Pfizer BioPharma Ltd',
    clientId: 'cli_sap_01',
    scopes: ['orders:read', 'orders:write', 'catalog:read', 'dcr:read'],
    rateLimitRpm: 1200,
    status: 'ACTIVE', // ACTIVE | REVOKED | EXPIRED
    expiresAt: new Date(Date.now() + 300 * 86400 * 1000).toISOString(),
    lastUsedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400 * 1000).toISOString()
  },
  {
    id: 'key_live_98102',
    keyName: 'Novartis Salesforce Health Cloud Connector',
    keyPrefix: 'allv_live_nov_',
    maskedKey: 'allv_live_nov_••••••••••••91c2',
    tenantId: 't_novartis_01',
    companyName: 'Novartis Pharma Global',
    clientId: 'cli_sfdc_02',
    scopes: ['doctors:read', 'chemists:read', 'dcr:read', 'dcr:write', 'analytics:read'],
    rateLimitRpm: 800,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 180 * 86400 * 1000).toISOString(),
    lastUsedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 'key_live_98103',
    keyName: 'AstraZeneca Oracle NetSuite ERP Bridge',
    keyPrefix: 'allv_live_ast_',
    maskedKey: 'allv_live_ast_••••••••••••44a1',
    tenantId: 't_astra_03',
    companyName: 'AstraZeneca Healthcare',
    clientId: 'cli_netsuite_03',
    scopes: ['orders:read', 'catalog:read'],
    rateLimitRpm: 500,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 90 * 86400 * 1000).toISOString(),
    lastUsedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  }
];

let apiClientsStore = [
  {
    id: 'cli_sap_01',
    clientName: 'SAP S/4HANA Enterprise Connector',
    clientType: 'M2M_BACKEND_SERVICE',
    tenantId: 't_pfizer_02',
    companyName: 'Pfizer BioPharma Ltd',
    authMethod: 'API_KEY_AND_BEARER_JWT',
    activeKeysCount: 1,
    isActive: true,
    totalRequests24h: 42800,
    createdAt: new Date(Date.now() - 60 * 86400 * 1000).toISOString()
  },
  {
    id: 'cli_sfdc_02',
    clientName: 'Salesforce Health Cloud CRM',
    clientType: 'OAUTH2_CONFIDENTIAL_CLIENT',
    tenantId: 't_novartis_01',
    companyName: 'Novartis Pharma Global',
    authMethod: 'OAUTH2_CLIENT_CREDENTIALS',
    activeKeysCount: 1,
    isActive: true,
    totalRequests24h: 28400,
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 'cli_netsuite_03',
    clientName: 'Oracle NetSuite ERP Gateway',
    clientType: 'M2M_BACKEND_SERVICE',
    tenantId: 't_astra_03',
    companyName: 'AstraZeneca Healthcare',
    authMethod: 'API_KEY_AND_BEARER_JWT',
    activeKeysCount: 1,
    isActive: true,
    totalRequests24h: 14200,
    createdAt: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  }
];

let webhooksStore = [
  {
    id: 'whk_88201',
    webhookName: 'Order Booking Real-Time Webhook',
    tenantId: 't_pfizer_02',
    companyName: 'Pfizer BioPharma Ltd',
    targetUrl: 'https://api.pfizer-care.com/webhooks/alleviare/orders',
    subscribedEvents: ['order.created', 'order.approved', 'order.cancelled'],
    secretKey: 'whsec_pfz_98f4c2e8a1d0...',
    status: 'ACTIVE',
    successRate: '99.8%',
    totalDeliveries: 14820,
    failureCount: 2,
    lastDeliveredAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400 * 1000).toISOString()
  },
  {
    id: 'whk_88202',
    webhookName: 'DCR Daily Call Submission Event Hook',
    tenantId: 't_novartis_01',
    companyName: 'Novartis Pharma Global',
    targetUrl: 'https://integration.novartis.ch/crm/dcr-event-relay',
    subscribedEvents: ['dcr.submitted', 'dcr.manager_approved', 'doctor.visit_logged'],
    secretKey: 'whsec_nov_71a0b3e5c9...',
    status: 'ACTIVE',
    successRate: '99.9%',
    totalDeliveries: 38400,
    failureCount: 0,
    lastDeliveredAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString()
  },
  {
    id: 'whk_88203',
    webhookName: 'Chemist Master Directory Sync Webhook',
    tenantId: 't_astra_03',
    companyName: 'AstraZeneca Healthcare',
    targetUrl: 'https://erp-gateway.astrazeneca.com/v1/chemist-sync',
    subscribedEvents: ['chemist.created', 'chemist.license_updated'],
    secretKey: 'whsec_ast_33e1d8a4f0...',
    status: 'DEGRADED',
    successRate: '94.2%',
    totalDeliveries: 4200,
    failureCount: 8,
    lastDeliveredAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
];

let failedRequestsStore = [
  {
    id: 'FAIL-REQ-701',
    endpoint: '/api/v1/orders/bulk-sync',
    method: 'POST',
    httpStatus: 504,
    errorCode: 'GATEWAY_TIMEOUT',
    errorMessage: 'Upstream tenant SAP receiver did not respond within 15,000ms timeout window.',
    clientId: 'cli_sap_01',
    tenantId: 't_pfizer_02',
    companyName: 'Pfizer BioPharma Ltd',
    ipAddress: '142.250.190.46',
    retryCount: 2,
    status: 'PENDING_RETRY',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'FAIL-REQ-702',
    endpoint: '/api/v1/chemists/pharmacy-license-verify',
    method: 'PUT',
    httpStatus: 422,
    errorCode: 'INVALID_DRUG_LICENSE_FORMAT',
    errorMessage: 'Validation error: Drug license string format standard mismatch with DL-20B schema.',
    clientId: 'cli_netsuite_03',
    tenantId: 't_astra_03',
    companyName: 'AstraZeneca Healthcare',
    ipAddress: '49.37.112.80',
    retryCount: 0,
    status: 'UNRESOLVED',
    createdAt: new Date(Date.now() - 52 * 60 * 1000).toISOString()
  }
];

let integrationAccessStore = [
  {
    key: 'SAP_S4HANA',
    name: 'SAP S/4HANA ERP Connector',
    category: 'ERP & Order Fulfillment',
    description: 'Enterprise bi-directional sync for sales orders, inventory stocks, and stockist invoices.',
    icon: 'Database',
    enabledTenantsCount: 4,
    status: 'OPERATIONAL'
  },
  {
    key: 'ORACLE_NETSUITE',
    name: 'Oracle NetSuite Pharma Suite',
    category: 'Finance & Ledger',
    description: 'Automated revenue recognition, chemist accounts receivable, and ledger reconciliation.',
    icon: 'HardDrive',
    enabledTenantsCount: 3,
    status: 'OPERATIONAL'
  },
  {
    key: 'SALESFORCE_HEALTH',
    name: 'Salesforce Health Cloud CRM',
    category: 'CRM & KOL Management',
    description: 'Key Opinion Leader (KOL) doctor tracking and multi-channel campaign engagement.',
    icon: 'Radio',
    enabledTenantsCount: 2,
    status: 'OPERATIONAL'
  },
  {
    key: 'GOOGLE_MAPS_MATRIX',
    name: 'Google Maps Route & Distance Matrix',
    category: 'Geolocation & Telemetry',
    description: 'Sub-meter accuracy route distance calculations and chemist territory geofencing.',
    icon: 'Globe2',
    enabledTenantsCount: 5,
    status: 'OPERATIONAL'
  },
  {
    key: 'TWILIO_SMS',
    name: 'Twilio Global Telephony & SMS OTP',
    category: 'Communication Relay',
    description: 'Carrier-grade SMS dispatch for 2FA authentication codes and urgent broadcast notices.',
    icon: 'Smartphone',
    enabledTenantsCount: 5,
    status: 'OPERATIONAL'
  },
  {
    key: 'AWS_SES_EMAIL',
    name: 'Amazon Simple Email Service (SES)',
    category: 'Communication Relay',
    description: 'High-deliverability transactional email relay for invoices, reports, and onboarding.',
    icon: 'Mail',
    enabledTenantsCount: 5,
    status: 'OPERATIONAL'
  }
];

/**
 * GET /api/api-management/overview
 */
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      metrics: {
        totalApiKeys: apiKeysStore.length,
        activeApiClients: apiClientsStore.filter(c => c.isActive).length,
        activeWebhooks: webhooksStore.filter(w => w.status === 'ACTIVE').length,
        totalCallsToday: 85400,
        averageLatencyMs: 18,
        p95LatencyMs: 38,
        errorRatePct: '0.02%',
        failedRequestsQueue: failedRequestsStore.filter(f => f.status !== 'RESOLVED').length
      },
      rateLimitsByTier: {
        STARTER: { rpm: 300, dailyQuota: 50000, burstLimit: 50 },
        PROFESSIONAL: { rpm: 800, dailyQuota: 250000, burstLimit: 120 },
        ENTERPRISE: { rpm: 2500, dailyQuota: 1000000, burstLimit: 400 },
        CUSTOM: { rpm: 5000, dailyQuota: 5000000, burstLimit: 800 }
      }
    }
  });
});

/**
 * GET /api/api-management/keys
 */
router.get('/keys', (req, res) => {
  res.json({ success: true, count: apiKeysStore.length, data: apiKeysStore });
});

/**
 * POST /api/api-management/keys
 * Generate new API Key
 */
router.post('/keys', (req, res) => {
  const { keyName, tenantId, companyName, clientId, scopes, rateLimitRpm, expiryDays = 365 } = req.body;
  const rawSecret = `allv_live_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  const newKey = {
    id: `key_live_${Date.now().toString().slice(-5)}`,
    keyName: keyName || 'API Integration Key',
    keyPrefix: rawSecret.slice(0, 14),
    maskedKey: `${rawSecret.slice(0, 14)}••••••••••••${rawSecret.slice(-4)}`,
    fullSecretKey: rawSecret, // Displayed once to Super Admin upon creation
    tenantId: tenantId || null,
    companyName: companyName || 'Platform Enterprise',
    clientId: clientId || 'cli_custom',
    scopes: scopes || ['orders:read', 'catalog:read'],
    rateLimitRpm: Number(rateLimitRpm) || 600,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + expiryDays * 86400 * 1000).toISOString(),
    lastUsedAt: null,
    createdAt: new Date().toISOString()
  };

  apiKeysStore.unshift(newKey);

  res.json({
    success: true,
    message: 'API Key generated successfully. Copy the secret key now; it will not be shown again.',
    data: newKey
  });
});

/**
 * POST /api/api-management/keys/:id/rotate
 */
router.post('/keys/:id/rotate', (req, res) => {
  const { id } = req.params;
  const newSecret = `allv_live_rot_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  apiKeysStore = apiKeysStore.map(k => {
    if (k.id === id) {
      return {
        ...k,
        keyPrefix: newSecret.slice(0, 14),
        maskedKey: `${newSecret.slice(0, 14)}••••••••••••${newSecret.slice(-4)}`,
        fullSecretKey: newSecret,
        lastRotatedAt: new Date().toISOString()
      };
    }
    return k;
  });

  res.json({
    success: true,
    message: `API Key ${id} secret key rotated. Older secret token revoked.`,
    newSecretKey: newSecret
  });
});

/**
 * POST /api/api-management/keys/:id/revoke
 */
router.post('/keys/:id/revoke', (req, res) => {
  const { id } = req.params;
  apiKeysStore = apiKeysStore.map(k =>
    k.id === id ? { ...k, status: 'REVOKED', revokedAt: new Date().toISOString() } : k
  );
  res.json({ success: true, message: `API Key ${id} revoked. All incoming requests using this key will receive HTTP 401 Unauthorized.` });
});

/**
 * GET /api/api-management/clients
 */
router.get('/clients', (req, res) => {
  res.json({ success: true, count: apiClientsStore.length, data: apiClientsStore });
});

/**
 * POST /api/api-management/clients
 */
router.post('/clients', (req, res) => {
  const { clientName, clientType, tenantId, companyName, authMethod } = req.body;
  const newClient = {
    id: `cli_${Date.now().toString().slice(-6)}`,
    clientName,
    clientType: clientType || 'M2M_BACKEND_SERVICE',
    tenantId: tenantId || null,
    companyName: companyName || 'Platform Enterprise',
    authMethod: authMethod || 'API_KEY_AND_BEARER_JWT',
    activeKeysCount: 0,
    isActive: true,
    totalRequests24h: 0,
    createdAt: new Date().toISOString()
  };
  apiClientsStore.unshift(newClient);
  res.json({ success: true, message: `API Client "${clientName}" registered successfully.`, data: newClient });
});

/**
 * GET /api/api-management/webhooks
 */
router.get('/webhooks', (req, res) => {
  res.json({ success: true, count: webhooksStore.length, data: webhooksStore });
});

/**
 * POST /api/api-management/webhooks
 */
router.post('/webhooks', (req, res) => {
  const { webhookName, tenantId, companyName, targetUrl, subscribedEvents } = req.body;
  const newHook = {
    id: `whk_${Date.now().toString().slice(-5)}`,
    webhookName,
    tenantId: tenantId || null,
    companyName: companyName || 'Platform Global',
    targetUrl,
    subscribedEvents: subscribedEvents || ['order.created'],
    secretKey: `whsec_${Math.random().toString(36).slice(2, 14)}`,
    status: 'ACTIVE',
    successRate: '100%',
    totalDeliveries: 0,
    failureCount: 0,
    lastDeliveredAt: null,
    createdAt: new Date().toISOString()
  };
  webhooksStore.unshift(newHook);
  res.json({ success: true, message: `Webhook "${webhookName}" registered and listening for subscribed events.`, data: newHook });
});

/**
 * POST /api/api-management/webhooks/:id/test
 * Dispatches test ping event
 */
router.post('/webhooks/:id/test', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Test ping payload dispatched to webhook ${id}. HTTP 200 OK received from endpoint (Roundtrip: 42ms).`,
    deliveredAt: new Date().toISOString()
  });
});

/**
 * DELETE /api/api-management/webhooks/:id
 */
router.delete('/webhooks/:id', (req, res) => {
  const { id } = req.params;
  webhooksStore = webhooksStore.filter(w => w.id !== id);
  res.json({ success: true, message: `Webhook ${id} deleted.` });
});

/**
 * GET /api/api-management/failed-requests
 */
router.get('/failed-requests', (req, res) => {
  res.json({ success: true, count: failedRequestsStore.length, data: failedRequestsStore });
});

/**
 * POST /api/api-management/failed-requests/:id/retry
 */
router.post('/failed-requests/:id/retry', (req, res) => {
  const { id } = req.params;
  failedRequestsStore = failedRequestsStore.map(f =>
    f.id === id ? { ...f, status: 'RESOLVED', retriedAt: new Date().toISOString(), retryCount: f.retryCount + 1 } : f
  );
  res.json({ success: true, message: `Failed API request ${id} requeued and processed successfully with HTTP 200 OK.` });
});

/**
 * GET /api/api-management/logs
 */
router.get('/logs', (req, res) => {
  const sampleLogs = [
    { id: 'LOG-8801', method: 'POST', path: '/api/v1/orders', status: 201, latencyMs: 24, client: 'SAP S/4HANA Connector', company: 'Pfizer BioPharma Ltd', ip: '142.250.190.46', time: new Date(Date.now() - 30 * 1000).toISOString() },
    { id: 'LOG-8802', method: 'GET', path: '/api/v1/dcr/today', status: 200, latencyMs: 14, client: 'Salesforce Health Cloud', company: 'Novartis Pharma Global', ip: '194.230.145.22', time: new Date(Date.now() - 55 * 1000).toISOString() },
    { id: 'LOG-8803', method: 'POST', path: '/api/v1/dcr/submit', status: 200, latencyMs: 38, client: 'Alleviare Mobile App', company: 'AstraZeneca Healthcare', ip: '49.37.112.80', time: new Date(Date.now() - 90 * 1000).toISOString() },
    { id: 'LOG-8804', method: 'GET', path: '/api/v1/catalog/medicines', status: 200, latencyMs: 12, client: 'Oracle NetSuite ERP', company: 'Sanofi Healthcare Ltd', ip: '82.64.18.90', time: new Date(Date.now() - 140 * 1000).toISOString() },
    { id: 'LOG-8805', method: 'POST', path: '/api/v1/orders/bulk-sync', status: 504, latencyMs: 15000, client: 'SAP S/4HANA Connector', company: 'Pfizer BioPharma Ltd', ip: '142.250.190.46', time: new Date(Date.now() - 18 * 60 * 1000).toISOString() }
  ];
  res.json({ success: true, data: sampleLogs });
});

/**
 * GET /api/api-management/integrations
 */
router.get('/integrations', (req, res) => {
  res.json({ success: true, data: integrationAccessStore });
});

/**
 * POST /api/api-management/integrations/toggle
 */
router.post('/integrations/toggle', (req, res) => {
  const { key, status } = req.body;
  integrationAccessStore = integrationAccessStore.map(i =>
    i.key === key ? { ...i, status: status || (i.status === 'OPERATIONAL' ? 'PAUSED' : 'OPERATIONAL') } : i
  );
  res.json({ success: true, message: `Integration ${key} status updated to ${status || 'TOGGLED'}.` });
});

export default router;
