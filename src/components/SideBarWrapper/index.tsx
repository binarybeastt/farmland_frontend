import React, { useState, useEffect } from "react";
import { SideButtons } from "../SideButtons";
import "./style.css";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { BiMenu, BiChevronLeft } from "react-icons/bi";

interface SideBarWrapperProps {
  sideButtonsState?: "default" | "active";
  dataQuestState?: "default" | "active";
  myQuestsState?: "default" | "active";
  leaderboardState?: "default" | "active";
  lossPredictionState?: "default" | "active";
  learnState?: "default" | "active";
  sideButtonsDivClassName?: string;
  sideButtonsIcon?: React.ReactNode;
  sideButtonsIcon1?: React.ReactNode;
  sideButtonsIcon2?: React.ReactNode;
  sideButtonsIcon3?: React.ReactNode;
  sideButtonsIcon4?: React.ReactNode;
  className?: string;
  override?: React.ReactNode;
  plant?: string;
}

export const SideBarWrapper = ({
  sideButtonsState = "default",
  dataQuestState = "default",
  myQuestsState = "default",
  leaderboardState = "default",
  lossPredictionState = "default",
  learnState = "default",
  sideButtonsDivClassName,
  sideButtonsIcon,
  sideButtonsIcon1,
  sideButtonsIcon2,
  sideButtonsIcon3,
  sideButtonsIcon4,
  className,
  override,
  plant = "/icons/plant-1.svg",
}: SideBarWrapperProps) => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check screen size on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`side-bar-wrapper ${collapsed ? 'collapsed' : ''} ${className || ""}`}>
      <div className="frame">
        <img className="plant" alt="Plant" src={plant} />
        <div className="text-wrapper">FarmLand</div>
        <button 
          className="collapse-button" 
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <BiMenu /> : <BiChevronLeft />}
        </button>
      </div>

      <div className="div-2">
        <SideButtons
          className="side-buttons-instance"
          icon={sideButtonsIcon}
          state={sideButtonsState}
          text="Dashboard"
          href="/dashboard"
        />
        <SideButtons
          className="side-buttons-instance"
          icon={override}
          state={dataQuestState}
          text="Data Quest"
          href="/dashboard/data-quest"
        />
        <SideButtons
          className="side-buttons-instance"
          icon={override}
          state={myQuestsState}
          text="My Quests"
          href="/dashboard/my-quests"
        />
        <SideButtons
          className="side-buttons-instance"
          icon={sideButtonsIcon1}
          state={leaderboardState}
          text="Leaderboard"
          href="/dashboard/leaderboard"
        />
        <SideButtons
          className="side-buttons-instance"
          icon={sideButtonsIcon2}
          state={lossPredictionState}
          text="Loss Prediction"
          href="/dashboard/loss-prediction"
        />
        <SideButtons
          className="side-buttons-instance"
          icon={sideButtonsIcon3}
          state={learnState}
          text="Learn"
          href="/dashboard/learn"
        />
      </div>
      
      {/* Direct logout button */}
      <button className="direct-logout-button" onClick={handleLogout}>
        <IoLogOutOutline className="logout-icon" />
        <span className="logout-text">Log Out</span>
      </button>
    </div>
  );
}; 