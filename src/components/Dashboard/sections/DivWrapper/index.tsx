import React from "react";
import "./style.css";

export const DivWrapper = () => {
  return (
    <div className="div-wrapper">
      <div className="tabs">
        <div className="tab active">Loss Prediction</div>
        <div className="tab">Harvest Analytic</div>
      </div>

      <div className="prediction-card">
        <div className="crop-header">
          <div className="crop-name">Tomato</div>
          <div className="updated">Updated 2hrs ago</div>
        </div>
        <div className="risk-level">Risk Level: High (25% Loss Predicted)</div>
        <div className="factor">Main Factor: Temperature</div>
        <div className="recommendation">
          <div className="recommendation-header">Recommendation</div>
          <div className="recommendation-text">Transport during cooler hours</div>
        </div>
      </div>

      <div className="prediction-card low-risk">
        <div className="crop-header">
          <div className="crop-name">Cassava</div>
          <div className="updated">Updated 2hrs ago</div>
        </div>
        <div className="risk-level">Risk Level: High (25% Loss Predicted)</div>
        <div className="factor">Main Factor: Temperature</div>
        <div className="recommendation">
          <div className="recommendation-header">Recommendation</div>
          <div className="recommendation-text">Transport during cooler hours</div>
        </div>
      </div>
    </div>
  );
}; 