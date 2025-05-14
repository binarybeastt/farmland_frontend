import React from "react";
import "./style.css";

export const FrameWrapper = () => {
  return (
    <div className="frame-wrapper">
      {/* Level Card */}
      <div className="level-card">
        <div className="level-header">MY LEVEL</div>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <div className="level-indicators">
          <div>
            <div className="level-label">1,500</div>
            <div className="level-value">Harvest Hero</div>
          </div>
          <div>
            <div className="level-label">3000</div>
            <div className="level-value">Harvest Lord</div>
          </div>
        </div>
      </div>

      {/* Achievement Card */}
      <div className="achievement-card">
        <div className="achievement-header">ACHIEVEMENT</div>
        <div className="achievement-item">
          <div className="achievement-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" fill="#E8B800" />
            </svg>
          </div>
          <div className="achievement-info">
            <div className="achievement-title">Harvest Hero</div>
            <div className="achievement-description">Logged 10 Harvest</div>
          </div>
        </div>
        <div className="achievement-item">
          <div className="achievement-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9.5L12 2Z" fill="#E8B800" />
            </svg>
          </div>
          <div className="achievement-info">
            <div className="achievement-title">Data Champion</div>
            <div className="achievement-description">Consistent for 7 days</div>
          </div>
        </div>
        <div className="achievement-item">
          <div className="achievement-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9.5L12 2Z" fill="#E8B800" />
            </svg>
          </div>
          <div className="achievement-info">
            <div className="achievement-title">Heart of state Storage</div>
            <div className="achievement-description">Best storage facilities</div>
          </div>
        </div>
      </div>

      {/* Activity Card */}
      <div className="activity-card">
        <div className="activity-header">MY ACTIVITY</div>
        <div>
          <div className="stat-row">
            <div className="stat-label">Total Points</div>
            <div className="stat-value">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E8B800" />
              </svg>
              2000
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-label">Quest joined</div>
            <div className="stat-value">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L12.5 7H18L13.5 11L15 16L10 13L5 16L6.5 11L2 7H7.5L10 2Z" fill="#8B5CF6" />
              </svg>
              3
            </div>
          </div>
        </div>
        <div>
          <div className="stat-row">
            <div className="stat-label">League</div>
            <div className="stat-value">Harvester's L</div>
          </div>
          <div className="stat-row">
            <div className="stat-label">Current streak</div>
            <div className="stat-value">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10L8 14L16 6" stroke="#0C0" strokeWidth="2" />
              </svg>
              3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 