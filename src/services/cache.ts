// Cache system for API responses
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // Time in milliseconds before cache expires
}

// Global in-memory cache
const apiCache: Record<string, CacheItem<any>> = {};

// Default expiry time: 5 minutes
const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000;

/**
 * Get data from cache by key
 * @param key Cache key
 * @returns Cached data or null if not found or expired
 */
export const getCachedData = <T>(key: string): T | null => {
  const cachedItem = apiCache[key];
  
  if (!cachedItem) {
    return null;
  }
  
  const now = Date.now();
  if (now - cachedItem.timestamp > cachedItem.expiry) {
    // Cache expired, remove it
    delete apiCache[key];
    return null;
  }
  
  return cachedItem.data as T;
};

/**
 * Set data in cache
 * @param key Cache key
 * @param data Data to cache
 * @param expiry Optional expiry time in milliseconds (default: 5 minutes)
 */
export const setCachedData = <T>(key: string, data: T, expiry: number = DEFAULT_CACHE_EXPIRY): void => {
  apiCache[key] = {
    data,
    timestamp: Date.now(),
    expiry
  };
};

/**
 * Clear all cached data
 */
export const clearCache = (): void => {
  Object.keys(apiCache).forEach(key => {
    delete apiCache[key];
  });
};

/**
 * Clear specific cache entry by key
 * @param key Cache key to clear
 */
export const clearCacheEntry = (key: string): void => {
  delete apiCache[key];
};

/**
 * Clear cache entries that match a key pattern
 * @param pattern String pattern to match against cache keys
 */
export const clearCachePattern = (pattern: string): void => {
  const regex = new RegExp(pattern);
  Object.keys(apiCache).forEach(key => {
    if (regex.test(key)) {
      delete apiCache[key];
    }
  });
}; 