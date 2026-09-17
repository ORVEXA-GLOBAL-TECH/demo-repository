import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Alleviare SFA Node/Express API Server Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`⚙️ Environment: ${config.nodeEnv}`);
  console.log(`=================================================`);
});
