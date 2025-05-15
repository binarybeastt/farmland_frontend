import { apiRequest } from './api';
import { Quest, QuestData } from '../types/quest';
import { getToken } from './auth';
import { getCachedData, setCachedData, clearCachePattern, clearCacheEntry } from './cache';

// API base URL
const API_BASE_URL = 'https://phlapp-production.up.railway.app';

// Create a new quest (admin only)
export const createQuest = async (questData: QuestData): Promise<Quest> => {
  const token = getToken();
  const response = await apiRequest<Quest>('/api/v1/quests/', 'POST', questData, token);
  
  // Clear quests cache when a new quest is created
  clearCachePattern('quests_');
  
  return response;
};

// Get all quests with pagination
export interface GetQuestsParams {
  skip?: number;
  limit?: number;
  active_only?: boolean;
}

export const getQuests = async (params: GetQuestsParams = { skip: 0, limit: 20, active_only: true }): Promise<Quest[]> => {
  const token = getToken();
  const queryParams = new URLSearchParams();
  
  if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params.active_only !== undefined) queryParams.append('active_only', params.active_only.toString());
  
  const url = `/api/v1/quests/?${queryParams.toString()}`;
  const cacheKey = `quests_${queryParams.toString()}`;
  
  // Check cache first
  const cachedData = getCachedData<Quest[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch from API
  const response = await apiRequest<Quest[]>(url, 'GET', null, token);
  
  // Store in cache
  setCachedData(cacheKey, response);
  
  return response;
};

// Get quest by ID
export const getQuestById = async (questId: string): Promise<Quest> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching quest: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getQuestById:', error);
    throw error;
  }
};

// Update quest (admin only)
export const updateQuest = async (id: string, questData: Partial<QuestData>): Promise<Quest> => {
  const token = getToken();
  const response = await apiRequest<Quest>(`/api/v1/quests/${id}`, 'PUT', questData, token);
  
  // Clear related cache entries
  clearCacheEntry(`quest_${id}`);
  clearCachePattern('quests_');
  
  return response;
};

// Delete quest (admin only)
export const deleteQuest = async (id: string): Promise<void> => {
  const token = getToken();
  await apiRequest<void>(`/api/v1/quests/${id}`, 'DELETE', null, token);
  
  // Clear related cache entries
  clearCacheEntry(`quest_${id}`);
  clearCachePattern('quests_');
};

// Assign quest to current user
export interface AssignedQuest {
  status: string;
  progress_pct: number;
  completed: boolean;
  completed_at: string | null;
  progress_data: Record<string, any>;
  id: string;
  user_id: string;
  quest_id: string;
  quest: Quest;
  created_at: string;
  updated_at: string;
}

export const assignQuestToUser = async (questId: string): Promise<AssignedQuest> => {
  const token = getToken();
  const response = await apiRequest<AssignedQuest>(`/api/v1/quests/assign/${questId}`, 'POST', null, token);
  
  // Clear assigned quests cache
  clearCachePattern('assigned_quests');
  
  return response;
};

// Get quests assigned to the current user
export const getAssignedQuests = async (params: { active_only?: boolean; skip?: number; limit?: number } = { active_only: true, skip: 0, limit: 20 }): Promise<AssignedQuest[]> => {
  try {
    const token = getToken();
    const queryParams = new URLSearchParams();
    
    if (params.active_only !== undefined) queryParams.append('active_only', params.active_only.toString());
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/api/v1/quests/user/me?${queryParams.toString()}`;
    const cacheKey = `assigned_quests_${queryParams.toString()}`;
    
    // Check cache first
    const cachedData = getCachedData<AssignedQuest[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from API
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching assigned quests: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error in getAssignedQuests:', error);
    throw error;
  }
};

// Interface for a harvest
export interface Harvest {
  id: string;
  user_id: string;
  crop_type: string;
  harvest_date: string;
  quantity_kg: number;
  quality_rating: number;
  harvest_conditions?: Record<string, any>;
  location?: Record<string, any>;
  loss_reported_kg?: number;
  created_at: string;
  updated_at: string;
}

// Get user's harvests
export const getHarvests = async (params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }): Promise<Harvest[]> => {
  try {
    const token = getToken();
    const queryParams = new URLSearchParams();
    
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/api/v1/harvests/?${queryParams.toString()}`;
    const cacheKey = `harvests_${queryParams.toString()}`;
    
    // Check cache first
    const cachedData = getCachedData<Harvest[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from API
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching harvests: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error in getHarvests:', error);
    throw error;
  }
};

// Type definitions for record submissions
export interface HarvestRecord {
  crop_type: string;
  harvest_date: string;
  quantity_kg: number;
  quality_rating: number;
  harvest_conditions?: Record<string, any>;
  location?: Record<string, any>;
  loss_reported_kg?: number;
  quest_id: string;
}

export interface StorageRecord {
  facility_type: string;
  temperature: number;
  humidity: number;
  duration_days: number;
  observations: string;
  harvest_id: string;
  quest_id: string;
}

export interface TransportRecord {
  transport_type: string;
  duration_hours: number;
  conditions?: Record<string, any>;
  distance_km: number;
  observations: string;
  harvest_id: string;
  quest_id: string;
}

// Submit harvest record
export const submitHarvestRecord = async (data: HarvestRecord): Promise<any> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/harvests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error submitting harvest record: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in submitHarvestRecord:', error);
    throw error;
  }
};

// Submit storage record
export const submitStorageRecord = async (data: StorageRecord): Promise<any> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/storage/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error submitting storage record: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in submitStorageRecord:', error);
    throw error;
  }
};

// Submit transport record
export const submitTransportRecord = async (data: TransportRecord): Promise<any> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/transport/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error submitting transport record: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in submitTransportRecord:', error);
    throw error;
  }
};

// Get available harvests for storage and transport records
export const getAvailableHarvests = async (): Promise<Harvest[]> => {
  try {
    const token = getToken();
    // Use the regular harvests endpoint with query params as shown in the curl command
    const response = await fetch(`${API_BASE_URL}/api/v1/harvests/?skip=0&limit=100`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching available harvests: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAvailableHarvests:', error);
    throw error;
  }
};

// Type for quest details
export interface Quest {
  id: string;
  title: string;
  description: string;
  points_reward: number;
  quest_type: 'harvest' | 'storage' | 'transport';
  image?: string;
  created_at?: string;
  updated_at?: string;
} 