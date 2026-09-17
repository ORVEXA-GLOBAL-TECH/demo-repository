import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'alleviare_jwt_secret_default_key',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
