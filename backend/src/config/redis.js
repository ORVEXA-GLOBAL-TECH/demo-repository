import Redis from 'ioredis';
import { config } from './index.js';

let redisClient = null;

/**
 * Initializes and returns the Redis client instance configured for Azure Cache for Redis or local Redis.
 */
export const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisConfig = config.redis;

  // If REDIS_URL is provided (e.g., rediss://:key@yourname.redis.cache.windows.net:6380)
  if (redisConfig.url) {
    redisClient = new Redis(redisConfig.url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      tls: redisConfig.url.startsWith('rediss://') ? {} : undefined
    });
  } else {
    // Individual connection params (host, port, password, tls)
    const options = {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      }
    };

    // Azure Cache for Redis requires TLS/SSL on port 6380
    if (redisConfig.tls || redisConfig.port === 6380 || redisConfig.host.includes('.redis.cache.windows.net')) {
      options.tls = {
        servername: redisConfig.host
      };
    }

    redisClient = new Redis(options);
  }

  redisClient.on('connect', () => {
    console.log('✅ Connected to Redis / Azure Cache for Redis successfully.');
  });

  redisClient.on('error', (err) => {
    console.error('⚠️ Redis Connection Error:', err.message);
  });

  return redisClient;
};

/**
 * Helper to get cached value (parsed JSON if applicable)
 */
export const getCache = async (key) => {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (err) {
    console.error(`Error reading key "${key}" from Redis:`, err.message);
    return null;
  }
};

/**
 * Helper to set value in cache with optional TTL in seconds
 */
export const setCache = async (key, value, ttlInSeconds = 300) => {
  try {
    const client = getRedisClient();
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlInSeconds > 0) {
      await client.set(key, stringValue, 'EX', ttlInSeconds);
    } else {
      await client.set(key, stringValue);
    }
    return true;
  } catch (err) {
    console.error(`Error setting key "${key}" in Redis:`, err.message);
    return false;
  }
};

/**
 * Helper to delete a key from cache
 */
export const delCache = async (key) => {
  try {
    const client = getRedisClient();
    await client.del(key);
    return true;
  } catch (err) {
    console.error(`Error deleting key "${key}" from Redis:`, err.message);
    return false;
  }
};

/**
 * Helper to invalidate keys by pattern (e.g. "tenant:101:*")
 */
export const flushCachePattern = async (pattern) => {
  try {
    const client = getRedisClient();
    const stream = client.scanStream({ match: pattern });
    stream.on('data', (keys) => {
      if (keys.length) {
        const pipeline = client.pipeline();
        keys.forEach((key) => pipeline.del(key));
        pipeline.exec();
      }
    });
  } catch (err) {
    console.error(`Error clearing cache pattern "${pattern}":`, err.message);
  }
};

export default getRedisClient;
