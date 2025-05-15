"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";
import { getHarvestAnalytics, HarvestAnalytics } from "../../../services/harvests";
import styles from "./harvestAnalytics.module.css";

export default function HarvestAnalyticsPage() {
  const [analytics, setAnalytics] = useState<HarvestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const params = {} as any;
        
        if (filter.startDate) {
          params.start_date = filter.startDate;
        }
        
        if (filter.endDate) {
          params.end_date = filter.endDate;
        }
        
        const data = await getHarvestAnalytics(params);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch harvest analytics:', err);
        setError('Failed to load harvest analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will automatically trigger with the updated filter
  };

  // Format month display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="dashboard" />
        <main>
          <Header pageTitle="Harvest Analytics" />
          <div className={styles.contentContainer}>
            <div className={styles.filtersContainer}>
              <form onSubmit={applyFilters} className={styles.filterForm}>
                <div className={styles.filterInputs}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="startDate">Start Date</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      name="startDate" 
                      value={filter.startDate} 
                      onChange={handleFilterChange}
                      className={styles.dateInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="endDate">End Date</label>
                    <input 
                      type="date" 
                      id="endDate" 
                      name="endDate" 
                      value={filter.endDate} 
                      onChange={handleFilterChange}
                      className={styles.dateInput}
                    />
                  </div>
                </div>
                <button type="submit" className={styles.filterButton}>Apply Filters</button>
              </form>
            </div>
            
            {loading ? (
              <div className={styles.loadingState}>Loading analytics data...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : analytics ? (
              <div className={styles.analyticsContainer}>
                <div className={styles.metricsContainer}>
                  <div className={styles.metricCard}>
                    <h3>Total Harvests</h3>
                    <div className={styles.metricValue}>{analytics.total_harvests}</div>
                  </div>
                  <div className={styles.metricCard}>
                    <h3>Total Quantity</h3>
                    <div className={styles.metricValue}>{analytics.total_quantity_kg.toFixed(1)} kg</div>
                  </div>
                  <div className={styles.metricCard}>
                    <h3>Total Loss</h3>
                    <div className={styles.metricValue}>{analytics.total_loss_kg.toFixed(1)} kg</div>
                  </div>
                  <div className={styles.metricCard}>
                    <h3>Loss Percentage</h3>
                    <div className={styles.metricValue}>{analytics.loss_percentage.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className={styles.chartSection}>
                  <h2>Monthly Harvest Trends</h2>
                  
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.colorBox} style={{ backgroundColor: 'var(--primary-color)' }}></span>
                      <span>Harvest Quantity (kg)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.colorBox} style={{ backgroundColor: 'var(--danger-color)' }}></span>
                      <span>Loss Quantity (kg)</span>
                    </div>
                  </div>
                  
                  <div className={styles.barChart}>
                    {analytics.monthly_trends.map((trend, index) => (
                      <div key={index} className={styles.chartColumn}>
                        <div className={styles.chartBars}>
                          <div 
                            className={styles.harvestBar} 
                            style={{ 
                              height: `${(trend.quantity_kg / Math.max(...analytics.monthly_trends.map(t => t.quantity_kg))) * 200}px` 
                            }}
                          ></div>
                          <div 
                            className={styles.lossBar} 
                            style={{ 
                              height: `${(trend.loss_kg / Math.max(...analytics.monthly_trends.map(t => t.quantity_kg))) * 200}px` 
                            }}
                          ></div>
                        </div>
                        <div className={styles.monthLabel}>{formatMonth(trend.month)}</div>
                        <div className={styles.valueLabels}>
                          <div>{trend.quantity_kg.toFixed(1)} kg</div>
                          <div className={styles.lossLabel}>{trend.loss_percentage.toFixed(1)}% loss</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.distributionSection}>
                  <div className={styles.distributionCard}>
                    <h2>Crop Distribution</h2>
                    <div className={styles.distributionChart}>
                      {Object.entries(analytics.crop_distribution).map(([crop, count], index) => (
                        <div key={crop} className={styles.distributionItem}>
                          <div className={styles.distributionLabel}>{crop}</div>
                          <div className={styles.distributionBarContainer}>
                            <div 
                              className={styles.distributionBar} 
                              style={{ 
                                width: `${(count / Object.values(analytics.crop_distribution).reduce((a, b) => a + b, 0)) * 100}%`,
                                backgroundColor: index % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)'
                              }}
                            ></div>
                          </div>
                          <div className={styles.distributionValue}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.distributionCard}>
                    <h2>Quality Distribution</h2>
                    <div className={styles.distributionChart}>
                      {Object.entries(analytics.quality_distribution).map(([quality, count], index) => (
                        <div key={quality} className={styles.distributionItem}>
                          <div className={styles.distributionLabel}>Grade {quality}</div>
                          <div className={styles.distributionBarContainer}>
                            <div 
                              className={styles.distributionBar} 
                              style={{ 
                                width: `${(count / Object.values(analytics.quality_distribution).reduce((a, b) => a + b, 0)) * 100}%`,
                                backgroundColor: getQualityColor(parseInt(quality))
                              }}
                            ></div>
                          </div>
                          <div className={styles.distributionValue}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>No analytics data available.</div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Helper function to get color based on quality grade
function getQualityColor(quality: number): string {
  switch(quality) {
    case 1: return 'var(--success-color)'; // Highest quality
    case 2: return 'var(--primary-color)';
    case 3: return 'var(--warning-color)';
    case 4: return 'var(--danger-color)';
    default: return 'var(--secondary-color)';
  }
} 