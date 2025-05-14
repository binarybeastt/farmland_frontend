import React from "react";
import { InteractionFillStreakOn1 } from "../../../../icons/InteractionFillStreakOn1";
import "./style.css";

export const Frame = () => {
  return (
    <div className="frame">
      <div className="text-wrapper">Dashboard</div>

      <div className="div-2">
        <div className="div-3">
          <div className="div-4">
            <InteractionFillStreakOn1
              className="interaction-fill"
              color="#8ECC09"
            />
            <div className="text-wrapper-2">3</div>
          </div>

          <div className="div-4">
            <div className="interaction-fill points-icon">
              <div className="points-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#E8B800" />
                </svg>
              </div>
            </div>
            <div className="text-wrapper-2">2.1k</div>
          </div>
        </div>

        <div className="div-5">
          <div className="overlap-wrapper">
            <div className="overlap">
              <div className="vuesax-linear" />

              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <div className="text-wrapper-3">1</div>

                  <div className="text-wrapper-4">12</div>
                </div>
              </div>
            </div>
          </div>

          <div className="div-wrapper-2">
            <div className="text-wrapper-5">BF</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 