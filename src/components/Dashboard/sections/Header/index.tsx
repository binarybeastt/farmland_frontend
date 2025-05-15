import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { BiMenu } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import styles from "./styles.module.css";

interface HeaderProps {
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if viewport is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    const sidebar = document.querySelector('.side-bar-wrapper');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
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
    <>
      <div className={styles.header}>
        {isMobile && (
          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <BiMenu />
          </button>
        )}
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
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
      
      {/* Fixed position logout button for mobile */}
      {isMobile && (
        <button 
          className={styles.fixedLogoutButton}
          onClick={handleLogout}
          aria-label="Log out"
        >
          <IoLogOutOutline />
        </button>
      )}
    </>
  );
}; 