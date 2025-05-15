import React, { useState, useEffect } from "react";
import { getPredictions, Prediction } from "../../../../services/predictions";
import { getHarvestAnalytics, HarvestAnalytics } from "../../../../services/harvests";
import "./style.css";

export const DivWrapper = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [harvestAnalytics, setHarvestAnalytics] = useState<HarvestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("loss");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === "loss") {
          // Fetch the latest predictions regardless of entity type
          const data = await getPredictions({ 
            skip: 0, 
            limit: 5 // Fetch a few so we can select the latest 2
          });
          
          // Sort predictions by creation date (newest first)
          const sortedData = [...data].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          
          // Set the latest 2 predictions
          setPredictions(sortedData.slice(0, 2));
        } else if (activeTab === "harvest") {
          // Fetch harvest analytics
          const analytics = await getHarvestAnalytics();
          setHarvestAnalytics(analytics);
        }
      } catch (err) {
        console.error(`Failed to fetch ${activeTab === "loss" ? "predictions" : "harvest analytics"}:`, err);
        setError(`Failed to load ${activeTab === "loss" ? "predictions" : "harvest analytics"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

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
    if (crop.toLowerCase().includes('tomato')) {
      return '🌡️';
    } else if (crop.toLowerCase().includes('yam')) {
      return '💧';
    }
    
    // Default icons based on factor
    if (factor.toLowerCase().includes('temperature')) {
      return '🌡️';
    } else if (factor.toLowerCase().includes('water') || factor.toLowerCase().includes('moisture')) {
      return '💧';
    } else if (factor.toLowerCase().includes('harvest')) {
      return '🌱';
    } else if (factor.toLowerCase().includes('storage')) {
      return '🏪';
    } else if (factor.toLowerCase().includes('transport')) {
      return '🚚';
    }
    
    return '🌱'; // Default icon
  };

  // Get main factor from contributing factors
  const getMainFactor = (prediction: Prediction) => {
    if (prediction.contributing_factors && prediction.contributing_factors.length > 0) {
      return prediction.contributing_factors[0].factor;
    }
    return "Unknown";
  };

  // Get border color based on risk level
  const getRiskClass = (riskLevel: string, lossPercentage: number) => {
    if (riskLevel.toLowerCase() === 'low' || lossPercentage < 15) {
      return "low-risk";
    } else if (riskLevel.toLowerCase() === 'medium' || (lossPercentage >= 15 && lossPercentage < 25)) {
      return "medium-risk";
    }
    return "high-risk";
  };

  // Get crop name from entity_id
  const getCropName = (prediction: Prediction, index: number) => {
    if (prediction.entity_id.includes(':')) {
      return prediction.entity_id.split(':')[0];
    }
    return `${prediction.entity_type.charAt(0).toUpperCase() + prediction.entity_type.slice(1)} ${index + 1}`;
  };
  
  // Format month display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  // Render bar chart for harvest analytics
  const renderHarvestChart = () => {
    if (!harvestAnalytics || !harvestAnalytics.monthly_trends.length) {
      return <div className="empty-state">No chart data available</div>;
    }

    const cropColors: Record<string, string> = {};
    const crops = Object.keys(harvestAnalytics.crop_distribution);
    
    // Assign colors to crops
    crops.forEach((crop, index) => {
      // Simple color assignment - can be improved with a proper color palette
      cropColors[crop] = index === 0 ? 'var(--yam-color)' : 'var(--cassava-color)';
    });

    return (
      <div className="analytics-container">
        <div className="analytics-summary">
          <div className="analytics-metric">
            <div className="metric-value">{harvestAnalytics.total_harvests}</div>
            <div className="metric-label">Total Harvests</div>
          </div>
          <div className="analytics-metric">
            <div className="metric-value">{harvestAnalytics.total_quantity_kg.toFixed(1)}kg</div>
            <div className="metric-label">Total Quantity</div>
          </div>
          <div className="analytics-metric">
            <div className="metric-value">{harvestAnalytics.loss_percentage.toFixed(1)}%</div>
            <div className="metric-label">Loss Percentage</div>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h3>Harvest Analytics</h3>
            <div className="chart-legend">
              {crops.map((crop) => (
                <div key={crop} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: cropColors[crop] }}></span>
                  <span className="legend-label">{crop}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bar-chart">
            {harvestAnalytics.monthly_trends.map((trend, index) => {
              const barHeight = 200; // Maximum height in pixels
              const maxQuantity = Math.max(...harvestAnalytics.monthly_trends.map(t => t.quantity_kg));
              
              return (
                <div key={index} className="chart-column">
                  {crops.map((crop) => {
                    // Distribute the height proportionally among crops
                    // This is a simplification - in a real app you'd have per-crop data
                    const cropShare = harvestAnalytics.crop_distribution[crop] / 
                                     Object.values(harvestAnalytics.crop_distribution).reduce((a, b) => a + b, 0);
                    const cropHeight = (trend.quantity_kg / maxQuantity) * barHeight * cropShare;
                    
                    return (
                      <div 
                        key={crop}
                        className="bar" 
                        style={{ 
                          height: `${cropHeight}px`,
                          backgroundColor: cropColors[crop]
                        }}
                      ></div>
                    );
                  })}
                  <div className="chart-label">{formatMonth(trend.month)}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="view-all-link">
          <a href="/dashboard/harvest-analytics">View detailed analytics →</a>
        </div>
      </div>
    );
  };

  return (
    <div className="div-wrapper">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === "loss" ? "active" : ""}`}
          onClick={() => setActiveTab("loss")}
        >
          Loss Prediction
        </div>
        <div 
          className={`tab ${activeTab === "harvest" ? "active" : ""}`}
          onClick={() => setActiveTab("harvest")}
        >
          Harvest Analytics
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading {activeTab === "loss" ? "predictions" : "analytics"}...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : activeTab === "loss" ? (
        // Loss Prediction content
        predictions.length === 0 ? (
          <div className="empty-state">No predictions available</div>
        ) : (
          <>
            {predictions.map((prediction, index) => {
              const cropName = getCropName(prediction, index);
              const mainFactor = getMainFactor(prediction);
              
              return (
                <div 
                  key={prediction.id} 
                  className={`prediction-card ${getRiskClass(prediction.risk_level, prediction.loss_percentage)}`}
                >
                  <div className="crop-header">
                    <div className="crop-icon-title">
                      <span className="crop-icon">
                        {getCropIcon(cropName, mainFactor)}
                      </span>
                      <h3 className="crop-title">{cropName}</h3>
                    </div>
                    <div className="updated-time">
                      Updated: {formatDate(prediction.created_at)}
                    </div>
                  </div>
                  <div className="risk-level">
                    Risk Level: {prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)} ({prediction.loss_percentage}% Loss Predicted)
                  </div>
                  <div className="main-factor">
                    Main Factor: {mainFactor}
                  </div>
                  <div className="recommendation">
                    <div className="recommendation-header">Recommendation</div>
                    <div className="recommendation-text">
                      {prediction.recommendations && prediction.recommendations.length > 0 
                        ? prediction.recommendations[0] 
                        : 'No recommendations available'}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="view-all-link">
              <a href="/dashboard/loss-prediction">View all predictions →</a>
            </div>
          </>
        )
      ) : (
        // Harvest Analytics content
        renderHarvestChart()
      )}
    </div>
  );
}; 