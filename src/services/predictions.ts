import { apiRequest } from './api';
import { getToken } from './auth';
import { getCachedData, setCachedData, clearCachePattern } from './cache';

export interface ContributingFactor {
  factor: string;
  impact: string;
}

export interface Prediction {
  id: string;
  entity_type: string;
  entity_id: string;
  model_id: string | null;
  estimated_shelf_life: number;
  risk_level: 'low' | 'medium' | 'high';
  loss_percentage: number;
  contributing_factors: ContributingFactor[];
  recommendations: string[];
  created_at: string;
}

export interface GetPredictionsParams {
  skip?: number;
  limit?: number;
  entity_type?: 'storage' | 'harvest' | 'transport';
}

export const getPredictions = async (params: GetPredictionsParams = { skip: 0, limit: 20 }): Promise<Prediction[]> => {
  const token = getToken();
  const queryParams = new URLSearchParams();
  
  if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params.entity_type) queryParams.append('entity_type', params.entity_type);
  
  const url = `/api/v1/predictions/?${queryParams.toString()}`;
  const cacheKey = `predictions_${queryParams.toString()}`;
  
  // Check cache first
  const cachedData = getCachedData<Prediction[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await apiRequest<Prediction[]>(url, 'GET', null, token);
  
  // Store in cache
  setCachedData(cacheKey, response);
  
  return response;
};

export const getPredictionById = async (id: string): Promise<Prediction> => {
  const token = getToken();
  const cacheKey = `prediction_${id}`;
  
  // Check cache first
  const cachedData = getCachedData<Prediction>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await apiRequest<Prediction>(`/api/v1/predictions/${id}`, 'GET', null, token);
  
  // Store in cache
  setCachedData(cacheKey, response);
  
  return response;
}; 