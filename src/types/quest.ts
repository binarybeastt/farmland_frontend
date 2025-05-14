export interface QuestRequirements {
  requirement_type: 'quantity' | 'quality' | 'loss' | 'count' | 'crop' | 'conditions';
  // Harvest quest requirements
  target_kg?: number;
  crop_type?: string;
  
  // Storage/Transport quest requirements
  target_temperature?: number;
  temperature_tolerance?: number;
  target_humidity?: number;
  humidity_tolerance?: number;
  
  // Other requirements (keeping for backward compatibility)
  min_quality_rating?: number;
  max_loss_percentage?: number;
  harvest_count?: number;
}

export interface QuestData {
  title: string;
  description: string;
  quest_type: 'harvest' | 'storage' | 'transport';
  points_reward: number;
  requirements: QuestRequirements;
  active: boolean;
  expires_at: string;
  image?: string;
}

export interface Quest extends QuestData {
  id: string;
  created_at: string;
  updated_at: string;
} 