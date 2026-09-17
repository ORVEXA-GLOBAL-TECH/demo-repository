import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

const server = http.createServer(app);

// Initialize Socket.io Server for Real-Time Telemetry & Instant Alerts
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Real-Time Socket: ${socket.id}`);

  socket.on('join_territory', (territory) => {
    socket.join(territory);
    console.log(`📡 Socket ${socket.id} joined territory room: ${territory}`);
  });

  socket.on('gps_telemetry_ping', (data) => {
    // Broadcast live GPS ping to manager dashboard in real-time
    io.emit('live_rep_ping', data);
  });

  socket.on('dcr_logged_event', (dcr) => {
    io.emit('new_dcr_notification', dcr);
  });

  socket.on('pob_order_event', (order) => {
    io.emit('new_order_notification', order);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Alleviare SFA Enterprise Node/Express Engine Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`📚 OpenAPI / Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔌 WebSockets (Socket.io): Real-Time Telemetry Enabled`);
  console.log(`⚙️ Environment: ${config.nodeEnv}`);
  console.log(`=======================================================`);
});
