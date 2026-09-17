export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Alleviare Pharma SFA Enterprise API Engine',
    version: '2.0.0',
    description: 'Enterprise RESTful API Engine for Medical Representatives, Area Managers, and National Sales Directors. Includes Live WebSockets, Geofence Tracking, AI Route Optimization, and POB Ordering.',
    contact: {
      name: 'Alleviare Enterprise Engineering Team',
      email: 'tech@alleviare.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Core Server'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Service Health Check',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'API Engine is running cleanly'
          }
        }
      }
    },
    '/api/dashboard/summary': {
      get: {
        summary: 'Executive Dashboard KPI Metrics',
        tags: ['Dashboard'],
        responses: {
          '200': {
            description: 'Aggregated revenue, doctor visits, quota progress & pending approvals'
          }
        }
      }
    },
    '/api/dcr': {
      get: {
        summary: 'List Daily Call Reports (DCR)',
        tags: ['DCR Operations'],
        parameters: [
          { name: 'targetType', in: 'query', schema: { type: 'string', enum: ['ALL', 'DOCTOR', 'CHEMIST'] } },
          { name: 'status', in: 'query', schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'List of field visit reports' } }
      },
      post: {
        summary: 'Submit New Field DCR Call',
        tags: ['DCR Operations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  targetType: { type: 'string', example: 'DOCTOR' },
                  targetName: { type: 'string', example: 'Dr. Arvind Mehra' },
                  productsDetailed: { type: 'array', items: { type: 'string' } },
                  feedback: { type: 'string', example: 'Good response on CardioShield' },
                  geoLat: { type: 'number', example: 28.5284 },
                  geoLng: { type: 'number', example: 77.2185 }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'DCR submitted and validated' } }
      }
    },
    '/api/orders': {
      get: {
        summary: 'List POB Chemist Orders',
        tags: ['Orders & POB'],
        responses: { '200': { description: 'List of booked orders' } }
      },
      post: {
        summary: 'Book New Chemist POB Order',
        tags: ['Orders & POB'],
        responses: { '201': { description: 'Order routed to stockist' } }
      }
    },
    '/api/expenses': {
      get: {
        summary: 'List TA / DA Field Expense Claims',
        tags: ['Expenses'],
        responses: { '200': { description: 'List of expense claims' } }
      },
      post: {
        summary: 'File Daily TA/DA Claim',
        tags: ['Expenses'],
        responses: { '201': { description: 'Claim filed for manager sign-off' } }
      }
    },
    '/api/ai/optimize-route': {
      post: {
        summary: 'AI Smart Beat Route Optimizer',
        tags: ['AI Services'],
        description: 'Calculates the optimal clinic visit sequence and estimated travel distance to maximize doctor call coverage.',
        responses: { '200': { description: 'Optimized visit sequence and fuel saving metric' } }
      }
    },
    '/api/ai/ocr-prescription': {
      post: {
        summary: 'AI Digital Prescription OCR Scanner',
        tags: ['AI Services'],
        description: 'Extracts drug molecules, strengths, and dosage instructions from prescription scans.',
        responses: { '200': { description: 'Extracted molecules & matched Alleviare catalog brands' } }
      }
    },
    '/api/tracking': {
      get: {
        summary: 'Live Satellite Telemetry & Field Rep Breadcrumbs',
        tags: ['Live Tracking & Geofence'],
        responses: { '200': { description: 'Active field officer locations and GPS history' } }
      }
    },
    '/api/attendance': {
      get: {
        summary: 'Attendance Logs & Leave Balances',
        tags: ['Attendance & HR'],
        responses: { '200': { description: 'Working hours, punch records, and leave quotas' } }
      }
    },
    '/api/analytics': {
      get: {
        summary: 'Territory Quota & Sales Velocity Matrix',
        tags: ['Analytics & BI'],
        responses: { '200': { description: 'Brand performance and historical trend data' } }
      }
    },
    '/api/notifications': {
      get: {
        summary: 'List Real-Time Push Notifications',
        tags: ['Notifications'],
        responses: { '200': { description: 'Unread alerts, orders, and approval updates' } }
      }
    }
  }
};
