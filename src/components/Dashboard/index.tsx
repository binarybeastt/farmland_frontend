"use client";

import React, { useState, useEffect } from "react";
import { Div } from "./sections/Div";
import { DivWrapper } from "./sections/DivWrapper";
import { FrameWrapper } from "./sections/FrameWrapper";
import { SideBar, ActiveSidebarItem } from "./sections/SideBar";
import { Header } from "./sections/Header";
import { useAuth } from "../../context/AuthContext";
import "./style.css";

interface DashboardProps {
  activeItem?: ActiveSidebarItem;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeItem = 'dashboard' }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Listen for sidebar collapse state changes
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarElement = document.querySelector('.side-bar-wrapper');
      if (sidebarElement) {
        setSidebarCollapsed(sidebarElement.classList.contains('collapsed'));
      }
    };
    
    // Initial check
    checkSidebarState();
    
    // Create a mutation observer to watch for class changes on the sidebar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkSidebarState();
        }
      });
    });
    
    const sidebarElement = document.querySelector('.side-bar-wrapper');
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true });
    }
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Get farm name from user data or default text
  const getFarmName = () => {
    if (user?.farm_name) {
      return user.farm_name;
    }
    return user?.username || "Welcome";
  };
  
  // Remove any potential light blue FarmLand element from the DOM when component mounts
  React.useEffect(() => {
    // Find and remove any rogue FarmLand elements that might be overlapping
    const farmlandElements = document.querySelectorAll('[class*="farmland"], [class*="FarmLand"]');
    farmlandElements.forEach(el => {
      if (el.closest('.side-bar-wrapper') === null) {
        el.remove();
      }
    });
  }, []);

  return (
    <div className={`dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} data-model-id="2:1956">
      <SideBar activeItem={activeItem} />
      <div className="main-content-wrapper">
        <Header pageTitle="Dashboard" />
        
        <div className="content-wrapper">
          <div className="left-column">
            <div className="frame-53">
              <div className="text-wrapper-37">Welcome, {getFarmName()}</div>
              <p className="text-wrapper-38">
                Complete your daily quest to reach the next level
              </p>
            </div>
            <Div />
            <DivWrapper />
          </div>
          <div className="right-column">
            <FrameWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}; 