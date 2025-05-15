"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";
import { getPredictions, GetPredictionsParams, Prediction } from "../../../services/predictions";
import styles from "./lossPrediction.module.css";

export default function LossPredictionPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('harvestTracking');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const params: GetPredictionsParams = {
          skip: 0,
          limit: 100
        };
        
        // Map tabs to entity types
        const entityTypeMap: Record<string, GetPredictionsParams['entity_type']> = {
          'harvestTracking': 'harvest',
          'storageTracking': 'storage',
          'temperatureTracking': 'transport'
        };
        
        if (activeTab && entityTypeMap[activeTab]) {
          params.entity_type = entityTypeMap[activeTab];
        }
        
        const data = await getPredictions(params);
        setPredictions(data);
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
        setError('Failed to load predictions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [activeTab]);

  const getTimeSince = (dateString: string) => {
    try {
      // Check if dateString is valid
      if (!dateString) {
        console.log("Invalid date string:", dateString);
        return "Recently";
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log("Invalid date object:", date, "from string:", dateString);
        return "Recently";
      }
      
      const now = new Date();
      
      // Log times for debugging
      console.log("Date:", date.toISOString(), "Now:", now.toISOString());
      
      const diffTime = now.getTime() - date.getTime();
      
      // Ensure we're dealing with a positive time difference
      if (diffTime < 0) {
        console.log("Negative time difference:", diffTime);
        return "Recently";
      }
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60)) % 24;
      const diffMinutes = Math.floor(diffTime / (1000 * 60)) % 60;
      
      console.log("Time diff:", diffDays, "days,", diffHours, "hours,", diffMinutes, "minutes");
      
      if (diffDays > 0) {
        return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
      } else if (diffHours > 0) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else if (diffMinutes > 0) {
        return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      console.error("Error in getTimeSince:", error);
      return "Recently";
    }
  };

  // Format date to human-readable format
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Unknown date";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      // Format: "May 15, 2023" or today's date as "Today at 2:30 PM"
      const today = new Date();
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
                      
      if (isToday) {
        return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      }
      
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Helper function to get the right icon based on crop and main factor
  const getCropIcon = (crop: string, factor: string) => {
    if (crop.toLowerCase() === 'tomato') {
      return '🌡️';
    } else if (crop.toLowerCase() === 'yam') {
      return '💧';
    }
    
    // Default icons based on factor
    if (factor.toLowerCase().includes('temperature')) {
      return '🌡️';
    } else if (factor.toLowerCase().includes('water') || factor.toLowerCase().includes('moisture')) {
      return '💧';
    }
    
    return '🌱'; // Default icon
  };

  // Get border color based on risk level
  const getRiskBorderClass = (riskLevel: string, lossPercentage: number) => {
    if (riskLevel.toLowerCase() === 'low' || lossPercentage < 15) {
      return styles.lowRiskBorder;
    } else if (riskLevel.toLowerCase() === 'medium' || (lossPercentage >= 15 && lossPercentage < 25)) {
      return styles.mediumRiskBorder;
    } else {
      return styles.highRiskBorder;
    }
  };

  // Get main factor from contributing factors
  const getMainFactor = (prediction: Prediction) => {
    if (prediction.contributing_factors.length > 0) {
      return prediction.contributing_factors[0].factor;
    }
    return 'Unknown';
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="lossPrediction" />
        <main>
          <Header pageTitle="Loss Prediction" />
          <div className={styles.contentContainer}>
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'harvestTracking' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('harvestTracking')}
              >
                Harvest 
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'storageTracking' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('storageTracking')}
              >
                Storage 
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'temperatureTracking' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('temperatureTracking')}
              >
                Transport
              </button>
            </div>
            
            {loading ? (
              <div className={styles.loadingState}>Loading predictions...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : predictions.length > 0 ? (
              <div className={styles.cropCardsContainer}>
                {predictions.map((prediction, index) => {
                  // Extract crop name from entity_id or use a default
                  const cropName = prediction.entity_id.includes(':') 
                    ? prediction.entity_id.split(':')[0]
                    : `Crop ${index + 1}`;
                  
                  const mainFactor = getMainFactor(prediction);
                  
                  return (
                    <div 
                      key={prediction.id} 
                      className={`${styles.cropCard} ${getRiskBorderClass(prediction.risk_level, prediction.loss_percentage)}`}
                    >
                      <div className={styles.cropHeader}>
                        <div className={styles.cropIconTitle}>
                          <span className={styles.cropIcon}>
                            {getCropIcon(cropName, mainFactor)}
                          </span>
                          <h3 className={styles.cropTitle}>{cropName}</h3>
                        </div>
                        <div className={styles.updatedTime}>
                          Updated: {formatDate(prediction.created_at)}
                        </div>
                      </div>
                      
                      <div className={styles.riskLevel}>
                        Risk Level: {prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)} ({prediction.loss_percentage}% Loss Predicted)
                      </div>
                      
                      <div className={styles.mainFactor}>
                        Main Factor: {mainFactor}
                      </div>
                      
                      <div className={styles.recommendationSection}>
                        <div className={styles.recommendationLabel}>Recommendation</div>
                        <div className={styles.recommendationText}>
                          {prediction.recommendations.length > 0 
                            ? prediction.recommendations[0] 
                            : 'No recommendations available'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No predictions found for the selected tracking type.
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 