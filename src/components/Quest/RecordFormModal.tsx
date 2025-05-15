import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../Modal';
import styles from './RecordFormModal.module.css';
import QuestCompletionModal from './QuestCompletionModal';
import {
  getQuestById,
  getAvailableHarvests,
  submitHarvestRecord,
  submitStorageRecord,
  submitTransportRecord,
  HarvestRecord,
  StorageRecord,
  TransportRecord,
  Harvest
} from '../../services/quest';
import { Quest } from '../../types/quest';

// Types for the different form data structures
interface HarvestFormData {
  crop_type: string;
  harvest_date: string;
  quantity_kg: number;
  quality_rating: number;
  harvest_conditions: Record<string, any>;
  location: Record<string, any>;
  loss_reported_kg: number;
  quest_id: string;
}

interface StorageFormData {
  facility_type: string;
  temperature: number;
  humidity: number;
  duration_days: number;
  observations: string;
  harvest_id: string;
  quest_id: string;
}

interface TransportFormData {
  transport_type: string;
  duration_hours: number;
  conditions: Record<string, any>;
  distance_km: number;
  observations: string;
  harvest_id: string;
  quest_id: string;
}

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  questId: string;
  questTitle?: string;
}

type QuestType = 'harvest' | 'storage' | 'transport' | 'unknown';

const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  questId,
  questTitle = 'Quest'
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [questDetails, setQuestDetails] = useState<Quest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableHarvests, setAvailableHarvests] = useState<Harvest[]>([]);
  
  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    pointsEarned: 0,
    cropType: '',
    riskLevel: '',
    mainFactor: '',
    recommendation: ''
  });
  
  // Initialize appropriate form data based on quest type
  const [harvestFormData, setHarvestFormData] = useState<HarvestRecord>({
    crop_type: '',
    harvest_date: new Date().toISOString().split('T')[0],
    quantity_kg: 0,
    quality_rating: 5,
    harvest_conditions: { notes: '' },
    location: { description: '' },
    loss_reported_kg: 0,
    quest_id: questId
  });
  
  // Additional state for simple text inputs - initialize as empty strings
  const [harvestConditionsText, setHarvestConditionsText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [transportConditionsText, setTransportConditionsText] = useState('');
  
  const [storageFormData, setStorageFormData] = useState<StorageRecord>({
    facility_type: '',
    temperature: 0,
    humidity: 0,
    duration_days: 0,
    observations: '',
    harvest_id: '',
    quest_id: questId
  });
  
  const [transportFormData, setTransportFormData] = useState<TransportRecord>({
    transport_type: '',
    duration_hours: 0,
    conditions: { notes: '' },
    distance_km: 0,
    observations: '',
    harvest_id: '',
    quest_id: questId
  });

  // Fetch quest details to determine the quest type
  useEffect(() => {
    const fetchQuestDetails = async () => {
      if (!questId || !isOpen) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the quest details
        const quest = await getQuestById(questId);
        setQuestDetails(quest);
        
        // If quest type is storage or transport, fetch available harvests
        if (quest.quest_type === 'storage' || quest.quest_type === 'transport') {
          try {
            // Call getAvailableHarvests to get user's harvests for the dropdown
            const harvests = await getAvailableHarvests();
            console.log('Available harvests:', harvests);
            setAvailableHarvests(harvests);
            
            // Set default harvest_id if there are available harvests
            if (harvests.length > 0) {
              if (quest.quest_type === 'storage') {
                setStorageFormData(prev => ({ ...prev, harvest_id: harvests[0].id }));
              } else if (quest.quest_type === 'transport') {
                setTransportFormData(prev => ({ ...prev, harvest_id: harvests[0].id }));
              }
            }
          } catch (err) {
            console.error('Error fetching available harvests:', err);
            // Don't set error here, just log it - we can still show the form
          }
        }
      } catch (err) {
        console.error('Error fetching quest details:', err);
        setError('Failed to load quest details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestDetails();
  }, [questId, isOpen]);

  // In the useEffect block, add this code to initialize text inputs from nested objects
  useEffect(() => {
    if (questDetails) {
      // For harvest form, extract values from nested objects for the text inputs
      if (questDetails.quest_type === 'harvest') {
        setHarvestConditionsText(harvestFormData.harvest_conditions?.notes || '');
        setLocationText(harvestFormData.location?.description || '');
      }
      // For transport form
      else if (questDetails.quest_type === 'transport') {
        setTransportConditionsText(transportFormData.conditions?.notes || '');
      }
    }
  }, [questDetails]);

  // Handle input changes for Harvest form
  const handleHarvestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setHarvestFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle input changes for Storage form
  const handleStorageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setStorageFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle input changes for Transport form
  const handleTransportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTransportFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!questDetails) {
      setError('Quest details not available. Please try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      
      // Submit based on quest type
      if (questDetails.quest_type === 'harvest') {
        response = await submitHarvestRecord(harvestFormData);
      } else if (questDetails.quest_type === 'storage') {
        response = await submitStorageRecord(storageFormData);
      } else if (questDetails.quest_type === 'transport') {
        response = await submitTransportRecord(transportFormData);
      } else {
        throw new Error('Unknown quest type');
      }
      
      console.log('Submission successful:', response);
      
      // Set completion data
      setCompletionData({
        pointsEarned: questDetails.points_reward || 50,
        cropType: questDetails.quest_type === 'harvest' ? harvestFormData.crop_type : 'Tomato',
        riskLevel: '',
        mainFactor: '',
        recommendation: ''
      });
      
      // Show completion modal
      setShowCompletionModal(true);
      
      // Reset form data
      if (questDetails.quest_type === 'harvest') {
        setHarvestFormData({
          crop_type: '',
          harvest_date: new Date().toISOString().split('T')[0],
          quantity_kg: 0,
          quality_rating: 5,
          harvest_conditions: { notes: '' },
          location: { description: '' },
          loss_reported_kg: 0,
          quest_id: questId
        });
        // Also reset the text fields
        setHarvestConditionsText('');
        setLocationText('');
      } else if (questDetails.quest_type === 'storage') {
        setStorageFormData({
          facility_type: '',
          temperature: 0,
          humidity: 0,
          duration_days: 0,
          observations: '',
          harvest_id: '',
          quest_id: questId
        });
      } else if (questDetails.quest_type === 'transport') {
        setTransportFormData({
          transport_type: '',
          duration_hours: 0,
          conditions: { notes: '' },
          distance_km: 0,
          observations: '',
          harvest_id: '',
          quest_id: questId
        });
        // Also reset the transport conditions text field
        setTransportConditionsText('');
      }
    } catch (err) {
      console.error('Error submitting record:', err);
      setError('Failed to submit record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate form based on quest type
  const renderForm = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <p>Loading quest details...</p>
        </div>
      );
    }
    
    if (!questDetails) {
      return (
        <div className={styles.errorContainer}>
          <p>Failed to load quest details. Please try again.</p>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      );
    }
    
    if (questDetails.quest_type === 'harvest') {
      return (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="crop_type">Crop Type</label>
            <input
              type="text"
              id="crop_type"
              name="crop_type"
              value={harvestFormData.crop_type}
              onChange={handleHarvestInputChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="harvest_date">Harvest Date</label>
            <input
              type="date"
              id="harvest_date"
              name="harvest_date"
              value={harvestFormData.harvest_date}
              onChange={handleHarvestInputChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="quantity_kg">Quantity (kg)</label>
              <input
                type="number"
                id="quantity_kg"
                name="quantity_kg"
                value={harvestFormData.quantity_kg}
                onChange={handleHarvestInputChange}
                min="0"
                step="0.1"
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="loss_reported_kg">Loss Reported (kg)</label>
              <input
                type="number"
                id="loss_reported_kg"
                name="loss_reported_kg"
                value={harvestFormData.loss_reported_kg}
                onChange={handleHarvestInputChange}
                min="0"
                step="0.1"
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="quality_rating">Quality Rating (1-10)</label>
            <input
              type="number"
              id="quality_rating"
              name="quality_rating"
              value={harvestFormData.quality_rating}
              onChange={handleHarvestInputChange}
              min="1"
              max="10"
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="harvest_conditions">Harvest Conditions</label>
            <textarea
              id="harvest_conditions"
              name="harvest_conditions_text"
              value={harvestConditionsText}
              onChange={(e) => {
                setHarvestConditionsText(e.target.value);
                // Convert the text to a notes object in the background
                setHarvestFormData(prev => ({
                  ...prev,
                  harvest_conditions: { notes: e.target.value }
                }));
              }}
              placeholder="Describe harvest conditions"
              className={styles.formTextarea}
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <textarea
              id="location"
              name="location_text"
              value={locationText}
              onChange={(e) => {
                setLocationText(e.target.value);
                // Convert the text to a description object in the background
                setHarvestFormData(prev => ({
                  ...prev,
                  location: { description: e.target.value }
                }));
              }}
              placeholder="Describe location details"
              className={styles.formTextarea}
              rows={3}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Harvest Record'}
            </button>
          </div>
        </form>
      );
    } else if (questDetails.quest_type === 'storage') {
      return (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="harvest_id">Select Harvest</label>
            <select
              id="harvest_id"
              name="harvest_id"
              value={storageFormData.harvest_id}
              onChange={handleStorageInputChange}
              className={styles.formSelect}
              required
            >
              <option value="">-- Select a harvest --</option>
              {availableHarvests.map(harvest => (
                <option key={harvest.id} value={harvest.id}>
                  {harvest.crop_type} - {new Date(harvest.harvest_date).toLocaleDateString()} ({harvest.quantity_kg}kg)
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="facility_type">Facility Type</label>
            <select
              id="facility_type"
              name="facility_type"
              value={storageFormData.facility_type}
              onChange={handleStorageInputChange}
              className={styles.formSelect}
              required
            >
              <option value="">-- Select facility type --</option>
              <option value="warehouse">Warehouse</option>
              <option value="cold_storage">Cold Storage</option>
              <option value="silo">Silo</option>
              <option value="barn">Barn</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="temperature">Temperature (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={storageFormData.temperature}
                onChange={handleStorageInputChange}
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="humidity">Humidity (%)</label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                value={storageFormData.humidity}
                onChange={handleStorageInputChange}
                min="0"
                max="100"
                className={styles.formInput}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="duration_days">Duration (days)</label>
            <input
              type="number"
              id="duration_days"
              name="duration_days"
              value={storageFormData.duration_days}
              onChange={handleStorageInputChange}
              min="1"
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="observations">Observations</label>
            <textarea
              id="observations"
              name="observations"
              value={storageFormData.observations}
              onChange={handleStorageInputChange}
              placeholder="Any observations or notes about storage conditions"
              className={styles.formTextarea}
              rows={4}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Storage Record'}
            </button>
          </div>
        </form>
      );
    } else if (questDetails.quest_type === 'transport') {
      return (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="harvest_id">Select Harvest</label>
            <select
              id="harvest_id"
              name="harvest_id"
              value={transportFormData.harvest_id}
              onChange={handleTransportInputChange}
              className={styles.formSelect}
              required
            >
              <option value="">-- Select a harvest --</option>
              {availableHarvests.map(harvest => (
                <option key={harvest.id} value={harvest.id}>
                  {harvest.crop_type} - {new Date(harvest.harvest_date).toLocaleDateString()} ({harvest.quantity_kg}kg)
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="transport_type">Transport Type</label>
            <select
              id="transport_type"
              name="transport_type"
              value={transportFormData.transport_type}
              onChange={handleTransportInputChange}
              className={styles.formSelect}
              required
            >
              <option value="">-- Select transport type --</option>
              <option value="truck">Truck</option>
              <option value="train">Train</option>
              <option value="ship">Ship</option>
              <option value="airplane">Airplane</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="duration_hours">Duration (hours)</label>
              <input
                type="number"
                id="duration_hours"
                name="duration_hours"
                value={transportFormData.duration_hours}
                onChange={handleTransportInputChange}
                min="0.1"
                step="0.1"
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="distance_km">Distance (km)</label>
              <input
                type="number"
                id="distance_km"
                name="distance_km"
                value={transportFormData.distance_km}
                onChange={handleTransportInputChange}
                min="0.1"
                step="0.1"
                className={styles.formInput}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="conditions">Transport Conditions</label>
            <textarea
              id="conditions_text"
              name="conditions_text"
              value={transportConditionsText}
              onChange={(e) => {
                setTransportConditionsText(e.target.value);
                // Convert the text to a notes object in the background
                setTransportFormData(prev => ({
                  ...prev,
                  conditions: { notes: e.target.value }
                }));
              }}
              placeholder="Describe transport conditions"
              className={styles.formTextarea}
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="observations">Observations</label>
            <textarea
              id="observations"
              name="observations"
              value={transportFormData.observations}
              onChange={handleTransportInputChange}
              placeholder="Any additional observations"
              className={styles.formTextarea}
              rows={4}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Transport Record'}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <div className={styles.errorContainer}>
          <p>Unknown quest type. Please try again later.</p>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      );
    }
  };

  const handleCompletionModalClose = () => {
    setShowCompletionModal(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showCompletionModal}
        onClose={onClose}
        title={`Record for ${questDetails?.title || questTitle}`}
        size="medium"
      >
        <div className={styles.formContainer}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          
          {renderForm()}
        </div>
      </Modal>
      
      <QuestCompletionModal
        isOpen={showCompletionModal}
        onClose={handleCompletionModalClose}
        questTitle={questDetails?.title || questTitle}
        pointsEarned={completionData.pointsEarned}
        questType={questDetails?.quest_type || 'harvest'}
        cropType={completionData.cropType}
        riskLevel={completionData.riskLevel}
        mainFactor={completionData.mainFactor}
        recommendation={completionData.recommendation}
      />
    </>
  );
};

export default RecordFormModal; 