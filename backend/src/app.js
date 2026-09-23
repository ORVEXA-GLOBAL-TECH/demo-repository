import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';
import { config } from './config/index.js';
import { checkDbHealth } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import dcrRoutes from './routes/dcrRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import systemHealthRoutes from './routes/systemHealthRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import dataManagementRoutes from './routes/dataManagementRoutes.js';
import apiManagementRoutes from './routes/apiManagementRoutes.js';
import appVersionRoutes from './routes/appVersionRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: false // Allows Swagger UI inline scripts
}));

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Middlewares
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// OpenAPI / Swagger Documentation endpoint
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'Alleviare Pharma SFA Enterprise Core Engine (Node.js + Express)',
    version: '2.5.0-enterprise',
    swaggerDocs: '/api/docs',
    timestamp: new Date().toISOString()
  });
});

// Database Health & Telemetry endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    const dbStatus = await checkDbHealth();
    res.status(dbStatus.status === 'CONNECTED' ? 200 : 503).json({
      success: dbStatus.status === 'CONNECTED',
      database: dbStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/dcr', dcrRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/tour-plans', tourRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sovereign-countries', countryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/plans', subscriptionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/system-health', systemHealthRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/data-management', dataManagementRoutes);
app.use('/api/api-management', apiManagementRoutes);
app.use('/api/app-versions', appVersionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/support-tickets', ticketRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', auditRoutes);
app.use('/api', tenantRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Enterprise API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
