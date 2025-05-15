import { apiRequest } from './api';
import { getToken } from './auth';
import { getCachedData, setCachedData, clearCachePattern } from './cache';

export interface HarvestAnalytics {
  total_harvests: number;
  total_quantity_kg: number;
  total_loss_kg: number;
  loss_percentage: number;
  crop_distribution: {
    [key: string]: number;
  };
  quality_distribution: {
    [key: string]: number;
  };
  monthly_trends: {
    month: string;
    quantity_kg: number;
    loss_kg: number;
    loss_percentage: number;
  }[];
}

export interface GetHarvestAnalyticsParams {
  start_date?: string;
  end_date?: string;
}

export const getHarvestAnalytics = async (params: GetHarvestAnalyticsParams = {}): Promise<HarvestAnalytics> => {
  const token = getToken();
  const queryParams = new URLSearchParams();
  
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const url = `/api/v1/harvests/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const cacheKey = `harvest_analytics_${queryParams.toString()}`;
  
  // Check cache first
  const cachedData = getCachedData<HarvestAnalytics>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await apiRequest<HarvestAnalytics>(url, 'GET', null, token);
  
  // Store in cache
  setCachedData(cacheKey, response);
  
  return response;
}; 