import { useState, useEffect, useCallback } from 'react';
import { getCachedData, setCachedData, clearCacheEntry } from '../services/cache';

interface UseCacheOptions<T> {
  key: string;
  fetchData: () => Promise<T>;
  expiryTime?: number;
  onError?: (error: any) => void;
}

interface UseCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

/**
 * A custom hook for fetching data with cache support
 */
export function useCache<T>({
  key,
  fetchData,
  expiryTime,
  onError
}: UseCacheOptions<T>): UseCacheResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      // Try to get data from cache first
      const cachedData = getCachedData<T>(key);
      
      if (cachedData) {
        setData(cachedData);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const startTime = performance.now();
      const freshData = await fetchData();
      const endTime = performance.now();

      // If the request was super fast (<50ms) it might be from a cache layer
      // we don't control (like browser cache or server cache)
      setIsFromCache(endTime - startTime < 50);
      
      // Store in cache
      setCachedData(key, freshData, expiryTime);
      setData(freshData);
    } catch (err) {
      console.error(`Error fetching data for key ${key}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchData, expiryTime, onError]);

  const refetch = useCallback(async () => {
    // Clear this specific cache entry before refetching
    clearCacheEntry(key);
    await loadData();
  }, [key, loadData]);

  const clearCacheAndState = useCallback(() => {
    clearCacheEntry(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    isFromCache,
    refetch,
    clearCache: clearCacheAndState
  };
} 