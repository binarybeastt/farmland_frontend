"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { SideBar } from '../../../../components/Dashboard/sections/SideBar';
import { useAuth } from '../../../../context/AuthContext';
import { 
  getQuestById, 
  assignQuestToUser, 
  submitHarvestRecord, 
  submitStorageRecord, 
  submitTransportRecord,
  HarvestRecord,
  StorageRecord, 
  TransportRecord,
  getHarvests,
  Harvest
} from '../../../../services/quest';
import { Quest } from '../../../../types/quest';
import { AssignedQuest } from '../../../../services/quest';
import styles from './questDetails.module.css';
import { getRandomQuestImage, defaultQuestImage } from '../../../../utils/questImages';

// Form data for different quest types
interface HarvestFormData {
  crop_type: string;
  harvest_date: string;
  quantity_kg: string;
  quality_rating: string;
  loss_reported_kg: string;
  harvest_conditions: Record<string, any>;
  location: Record<string, any>;
}

interface StorageFormData {
  facility_type: string;
  temperature: string;
  humidity: string;
  duration_days: string;
  observations: string;
  harvest_id: string;
}

interface TransportFormData {
  transport_type: string;
  duration_hours: string;
  distance_km: string;
  observations: string;
  conditions: Record<string, any>;
  harvest_id: string;
}

// Union type for all form data
type QuestFormData = HarvestFormData | StorageFormData | TransportFormData;

export default function QuestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;
  const { user } = useAuth();
  
  const [quest, setQuest] = useState<Quest | null>(null);
  const [assignedQuest, setAssignedQuest] = useState<AssignedQuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Initialize form data based on quest type
  const [harvestFormData, setHarvestFormData] = useState<HarvestFormData>({
    crop_type: '',
    harvest_date: '',
    quantity_kg: '',
    quality_rating: '',
    loss_reported_kg: '',
    harvest_conditions: {},
    location: {}
  });

  const [storageFormData, setStorageFormData] = useState<StorageFormData>({
    facility_type: '',
    temperature: '',
    humidity: '',
    duration_days: '',
    observations: '',
    harvest_id: ''
  });

  const [transportFormData, setTransportFormData] = useState<TransportFormData>({
    transport_type: '',
    duration_hours: '',
    distance_km: '',
    observations: '',
    conditions: {},
    harvest_id: ''
  });

  // Add harvest state
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loadingHarvests, setLoadingHarvests] = useState(false);

  useEffect(() => {
    const fetchQuestDetails = async () => {
      try {
        setLoading(true);
        const fetchedQuest = await getQuestById(questId);
        setQuest(fetchedQuest);
      } catch (err) {
        console.error('Failed to fetch quest details:', err);
        setError('Failed to load quest details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchQuestDetails();
    }
  }, [questId]);

  // Check for showModal param in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('showModal') === 'true') {
      setShowRecordModal(true);
    }
  }, []);

  // Add useEffect for fetching harvests when the modal is shown
  useEffect(() => {
    const fetchHarvests = async () => {
      if (!showRecordModal || (quest && quest.quest_type === 'harvest')) {
        return;
      }
      
      try {
        setLoadingHarvests(true);
        const fetchedHarvests = await getHarvests();
        setHarvests(fetchedHarvests);
      } catch (err) {
        console.error('Failed to fetch harvests:', err);
        // Don't show an error message to avoid confusing the user
      } finally {
        setLoadingHarvests(false);
      }
    };
    
    fetchHarvests();
  }, [showRecordModal, quest]);

  const handleAssignQuest = async () => {
    try {
      setAssigning(true);
      setAssignError(null);
      const result = await assignQuestToUser(questId);
      setAssignedQuest(result);
    } catch (err) {
      console.error('Failed to assign quest:', err);
      setAssignError('Failed to register for this quest. Please try again later.');
    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle harvest form input changes
  const handleHarvestFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHarvestFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle storage form input changes
  const handleStorageFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStorageFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle transport form input changes
  const handleTransportFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransportFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form based on quest type
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    if (!quest) return;
    
    try {
      setSubmitting(true);
      
      if (quest.quest_type === 'harvest') {
        // Validate harvest form
        if (!harvestFormData.crop_type || !harvestFormData.harvest_date || !harvestFormData.quantity_kg) {
          setFormError('Please fill in all required fields');
          setSubmitting(false);
          return;
        }
        
        // Convert string values to numbers
        const harvestRecord: HarvestRecord = {
          crop_type: harvestFormData.crop_type,
          harvest_date: harvestFormData.harvest_date,
          quantity_kg: parseFloat(harvestFormData.quantity_kg),
          quality_rating: parseInt(harvestFormData.quality_rating) || 0,
          harvest_conditions: harvestFormData.harvest_conditions,
          location: harvestFormData.location,
          loss_reported_kg: parseFloat(harvestFormData.loss_reported_kg) || 0,
          quest_id: quest.id
        };
        
        await submitHarvestRecord(harvestRecord);
      } 
      else if (quest.quest_type === 'storage') {
        // Validate storage form
        if (!storageFormData.facility_type || !storageFormData.duration_days) {
          setFormError('Please fill in all required fields');
          setSubmitting(false);
          return;
        }
        
        // Convert string values to numbers
        const storageRecord: StorageRecord = {
          facility_type: storageFormData.facility_type,
          temperature: parseFloat(storageFormData.temperature) || 0,
          humidity: parseFloat(storageFormData.humidity) || 0,
          duration_days: parseInt(storageFormData.duration_days),
          observations: storageFormData.observations,
          harvest_id: storageFormData.harvest_id,
          quest_id: quest.id
        };
        
        await submitStorageRecord(storageRecord);
      } 
      else if (quest.quest_type === 'transport') {
        // Validate transport form
        if (!transportFormData.transport_type || !transportFormData.duration_hours) {
          setFormError('Please fill in all required fields');
          setSubmitting(false);
          return;
        }
        
        // Convert string values to numbers
        const transportRecord: TransportRecord = {
          transport_type: transportFormData.transport_type,
          duration_hours: parseFloat(transportFormData.duration_hours),
          distance_km: parseFloat(transportFormData.distance_km) || 0,
          observations: transportFormData.observations,
          conditions: transportFormData.conditions,
          harvest_id: transportFormData.harvest_id,
          quest_id: quest.id
        };
        
        await submitTransportRecord(transportRecord);
      }
      
      // Close modal after successful submission
      setShowRecordModal(false);
      
      // Reset form data
      resetFormData();
      
    } catch (err) {
      console.error(`Failed to submit ${quest.quest_type} data:`, err);
      setFormError(`Failed to submit ${quest.quest_type} data. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset all form data
  const resetFormData = () => {
    setHarvestFormData({
      crop_type: '',
      harvest_date: '',
      quantity_kg: '',
      quality_rating: '',
      loss_reported_kg: '',
      harvest_conditions: {},
      location: {}
    });
    
    setStorageFormData({
      facility_type: '',
      temperature: '',
      humidity: '',
      duration_days: '',
      observations: '',
      harvest_id: ''
    });
    
    setTransportFormData({
      transport_type: '',
      duration_hours: '',
      distance_km: '',
      observations: '',
      conditions: {},
      harvest_id: ''
    });
  };

  // Render the appropriate form based on quest type
  const renderFormFields = () => {
    if (!quest) return null;
    
    switch (quest.quest_type) {
      case 'harvest':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Crop Type</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Enter crop type"
                name="crop_type"
                value={harvestFormData.crop_type}
                onChange={handleHarvestFormChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Harvest Date</label>
              <input 
                type="date" 
                className={styles.formInput}
                name="harvest_date"
                value={harvestFormData.harvest_date}
                onChange={handleHarvestFormChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Quantity (Kg)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter quantity"
                name="quantity_kg"
                value={harvestFormData.quantity_kg}
                onChange={handleHarvestFormChange}
                required
                min="0"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Quality Rating (1-5)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter rating from 1-5"
                name="quality_rating"
                value={harvestFormData.quality_rating}
                onChange={handleHarvestFormChange}
                min="1"
                max="5"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Loss Reported (Kg)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter loss amount"
                name="loss_reported_kg"
                value={harvestFormData.loss_reported_kg}
                onChange={handleHarvestFormChange}
                min="0"
                step="0.1"
              />
            </div>
          </>
        );
        
      case 'storage':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Facility Type</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Enter facility type"
                name="facility_type"
                value={storageFormData.facility_type}
                onChange={handleStorageFormChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Temperature (°C)</label>
              <input 
                type="number" 
                className={styles.formInput}
                placeholder="Enter temperature"
                name="temperature"
                value={storageFormData.temperature}
                onChange={handleStorageFormChange}
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Humidity (%)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter humidity percentage"
                name="humidity"
                value={storageFormData.humidity}
                onChange={handleStorageFormChange}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Duration (Days)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter number of days"
                name="duration_days"
                value={storageFormData.duration_days}
                onChange={handleStorageFormChange}
                required
                min="1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Observations</label>
              <textarea 
                className={styles.formTextarea} 
                placeholder="Enter any observations"
                name="observations"
                value={storageFormData.observations}
                onChange={handleStorageFormChange}
                rows={4}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Select a Harvest</label>
              {loadingHarvests ? (
                <div className={styles.loadingText}>Loading harvests...</div>
              ) : harvests.length > 0 ? (
                <select
                  className={styles.formInput}
                  name="harvest_id"
                  value={storageFormData.harvest_id}
                  onChange={handleStorageFormChange}
                  required
                >
                  <option value="">-- Select a Harvest --</option>
                  {harvests.map(harvest => (
                    <option key={harvest.id} value={harvest.id}>
                      {harvest.crop_type} ({new Date(harvest.harvest_date).toLocaleDateString()}) - {harvest.quantity_kg}kg
                    </option>
                  ))}
                </select>
              ) : (
                <div className={styles.noDataText}>
                  You don't have any harvests yet. Please create a harvest record first.
                </div>
              )}
            </div>
          </>
        );
        
      case 'transport':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Transport Type</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Enter transport type"
                name="transport_type"
                value={transportFormData.transport_type}
                onChange={handleTransportFormChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Duration (Hours)</label>
              <input 
                type="number" 
                className={styles.formInput}
                placeholder="Enter duration in hours"
                name="duration_hours"
                value={transportFormData.duration_hours}
                onChange={handleTransportFormChange}
                required
                min="0"
                step="0.5"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Distance (Km)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="Enter distance"
                name="distance_km"
                value={transportFormData.distance_km}
                onChange={handleTransportFormChange}
                min="0"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Observations</label>
              <textarea 
                className={styles.formTextarea} 
                placeholder="Enter any observations"
                name="observations"
                value={transportFormData.observations}
                onChange={handleTransportFormChange}
                rows={4}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Select a Harvest</label>
              {loadingHarvests ? (
                <div className={styles.loadingText}>Loading harvests...</div>
              ) : harvests.length > 0 ? (
                <select
                  className={styles.formInput}
                  name="harvest_id"
                  value={transportFormData.harvest_id}
                  onChange={handleTransportFormChange}
                  required
                >
                  <option value="">-- Select a Harvest --</option>
                  {harvests.map(harvest => (
                    <option key={harvest.id} value={harvest.id}>
                      {harvest.crop_type} ({new Date(harvest.harvest_date).toLocaleDateString()}) - {harvest.quantity_kg}kg
                    </option>
                  ))}
                </select>
              ) : (
                <div className={styles.noDataText}>
                  You don't have any harvests yet. Please create a harvest record first.
                </div>
              )}
            </div>
          </>
        );
        
      default:
        return <p>No form available for this quest type.</p>;
    }
  };

  // Create initials from user data
  const getInitials = () => {
    if (!user) return "?";
    
    if (user.farm_name) {
      // Use farm name if available
      const words = user.farm_name.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return user.farm_name.substring(0, 2).toUpperCase();
    } 
    
    if (user.username) {
      // Fallback to username
      const words = user.username.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return user.username.substring(0, 2).toUpperCase();
    }
    
    // Last fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return "?";
  };

  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        <SideBar activeItem="dataQuest" />
        <main className={`${styles.mainContentWrapper} ${showRecordModal ? styles.blurBackground : ''}`}>
          <div className={styles.header}>
            <button 
              className={styles.backButton}
              onClick={() => router.back()}
            >
              &larr; Back to Quests
            </button>
            <h1 className={styles.pageTitle}>Quest Details</h1>
            <div className={styles.userInfo}>
              <div className={styles.energyPoints}>
                <div className={styles.energyIcon}>⚡</div>
                <span>{user?.level || 0}</span>
              </div>
              <div className={styles.questPoints}>
                <div className={styles.coinIcon}>🪙</div>
                <span>{user?.points?.toLocaleString() || 0}</span>
              </div>
              <div className={styles.notifications}>
                <div className={styles.notificationIcon}>🔔</div>
                <div className={styles.notificationBadge}>3</div>
              </div>
              <div className={styles.userAvatar}>
                <span>{getInitials()}</span>
              </div>
            </div>
          </div>

          <div className={styles.contentContainer}>
            {loading ? (
              <div className={styles.loadingState}>Loading quest details...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : quest ? (
              <div className={styles.questDetailCard}>
                <div className={styles.questImageContainer}>
                  <img 
                    src={quest.image || getRandomQuestImage(quest.id)} 
                    alt={quest.title} 
                    className={styles.questImage}
                    onError={(e) => {
                      // If image fails to load, use default
                      (e.target as HTMLImageElement).src = defaultQuestImage;
                    }}
                  />
                </div>
                
                <div className={styles.questContent}>
                  <div className={styles.questHeader}>
                    <h2 className={styles.questTitle}>{quest.title}</h2>
                    <div className={styles.questPoints}>
                      <span className={styles.pointsValue}>{quest.points_reward}</span> points
                    </div>
                  </div>
                  
                  <p className={styles.questDescription}>{quest.description}</p>
                  
                  <div className={styles.questMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Type:</span>
                      <span className={styles.metaValue}>{quest.quest_type.charAt(0).toUpperCase() + quest.quest_type.slice(1)}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Status:</span>
                      <span className={`${styles.metaValue} ${styles.statusBadge} ${quest.active ? styles.active : styles.inactive}`}>
                        {quest.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Expires:</span>
                      <span className={styles.metaValue}>{formatDate(quest.expires_at)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.requirementsSection}>
                    <h3 className={styles.requirementsTitle}>Requirements</h3>
                    <div className={styles.requirementsList}>
                      {quest.requirements.requirement_type === 'quantity' && quest.requirements.target_kg && (
                        <div className={styles.requirementItem}>
                          <span className={styles.requirementIcon}>⚖️</span>
                          <span>Target Quantity: {quest.requirements.target_kg} kg</span>
                        </div>
                      )}
                      {quest.requirements.requirement_type === 'quality' && quest.requirements.min_quality_rating && (
                        <div className={styles.requirementItem}>
                          <span className={styles.requirementIcon}>⭐</span>
                          <span>Minimum Quality Rating: {quest.requirements.min_quality_rating}</span>
                        </div>
                      )}
                      {quest.requirements.requirement_type === 'loss' && quest.requirements.max_loss_percentage && (
                        <div className={styles.requirementItem}>
                          <span className={styles.requirementIcon}>📉</span>
                          <span>Maximum Loss Percentage: {quest.requirements.max_loss_percentage}%</span>
                        </div>
                      )}
                      {quest.requirements.requirement_type === 'count' && quest.requirements.harvest_count && (
                        <div className={styles.requirementItem}>
                          <span className={styles.requirementIcon}>🔢</span>
                          <span>Required Harvest Count: {quest.requirements.harvest_count}</span>
                        </div>
                      )}
                      {quest.requirements.requirement_type === 'crop' && quest.requirements.crop_type && (
                        <div className={styles.requirementItem}>
                          <span className={styles.requirementIcon}>🌱</span>
                          <span>Required Crop Type: {quest.requirements.crop_type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {assignedQuest ? (
                    <div className={styles.assignedQuestInfo}>
                      <div className={styles.successMessage}>
                        You have registered for this quest!
                      </div>
                      <div className={styles.progressInfo}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${assignedQuest.progress_pct}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>
                          {assignedQuest.progress_pct}% Complete
                        </span>
                      </div>
                      <div className={styles.questStatus}>
                        Status: {assignedQuest.status.charAt(0).toUpperCase() + assignedQuest.status.slice(1)}
                      </div>
                      <button 
                        className={styles.enterRecordButton}
                        onClick={() => setShowRecordModal(true)}
                      >
                        Enter Record
                      </button>
                    </div>
                  ) : (
                    <div className={styles.registrationSection}>
                      <div className={styles.buttonContainer}>
                        <button 
                          className={styles.registerButton}
                          onClick={handleAssignQuest}
                          disabled={assigning || !quest.active}
                        >
                          {assigning ? 'Registering...' : 'Register for this Quest'}
                        </button>
                      </div>
                      {assignError && (
                        <div className={styles.assignError}>{assignError}</div>
                      )}
                      {!quest.active && (
                        <div className={styles.inactiveMessage}>This quest is currently inactive and cannot be registered.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noQuestMessage}>Quest not found.</div>
            )}
          </div>
        </main>
      </div>

      {/* Dynamic Record Form Modal */}
      {showRecordModal && quest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Today's Daily quest</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowRecordModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>{quest.title}</h3>
              <p className={styles.modalDescription}>
                {quest.quest_type === 'harvest' && 'Record your harvest details to track your yield and prepare for storage optimization'}
                {quest.quest_type === 'storage' && 'Record your storage facility details to optimize crop preservation'}
                {quest.quest_type === 'transport' && 'Record your transport details to track logistics and minimize losses'}
              </p>
              
              <form className={styles.recordForm} onSubmit={handleFormSubmit}>
                {formError && <div className={styles.formError}>{formError}</div>}
                
                {renderFormFields()}
                
                <button 
                  type="submit" 
                  className={styles.continueButton}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 