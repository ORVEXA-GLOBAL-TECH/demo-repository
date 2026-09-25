import { getCache, setCache } from '../config/redis.js';

/**
 * Express middleware to cache GET endpoint responses in Azure Redis
 * @param {number} durationSeconds - Cache time to live in seconds (default 300 = 5 minutes)
 */
export const cacheMiddleware = (durationSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Build unique cache key using request path and query parameters
    const tenantId = req.headers['x-tenant-id'] || 'default';
    const cacheKey = `cache:${tenantId}:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getCache(cacheKey);

      if (cachedResponse) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }

      // Intercept res.json to cache response payload before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        res.setHeader('X-Cache', 'MISS');
        // Cache success responses (200 OK)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, body, durationSeconds);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.warn('Cache middleware fallback to database query:', err.message);
      next();
    }
  };
};

export default cacheMiddleware;
