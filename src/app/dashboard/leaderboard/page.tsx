"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";
import styles from "./styles.module.css";
import Image from "next/image";

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "Green Harvest",
    fullName: "Thomas Jackson",
    points: 2000,
    avatar: "GH",
    avatarColor: "#eef3ff"
  },
  {
    id: 2,
    rank: 2,
    name: "Sunfield Farms",
    fullName: "Olivia Chen",
    points: 1800,
    avatar: "SF",
    avatarColor: "#f1f1fe"
  },
  {
    id: 3,
    rank: 3,
    name: "Valley Crops",
    fullName: "Miguel Sanchez",
    points: 1600,
    avatar: "VC",
    avatarColor: "#fff1f1"
  },
  {
    id: 4,
    rank: 4,
    name: "Sunrise Growers",
    fullName: "Amina Osei",
    points: 1550,
    avatar: "SG",
    avatarColor: "#fffce6"
  },
  {
    id: 5,
    rank: 5,
    name: "Earth Bounty",
    fullName: "Rahul Patel",
    points: 1000,
    avatar: "EB",
    avatarColor: "#e6ffec"
  },
  {
    id: 6,
    rank: 6,
    name: "Prairie Farms",
    fullName: "Sofia Martinez",
    points: 1000,
    avatar: "PF",
    avatarColor: "#eef3ff"
  },
  {
    id: 7,
    rank: 7,
    name: "Fertile Fields",
    fullName: "Nathan Wong",
    points: 950,
    avatar: "FF",
    avatarColor: "#f1f1fe"
  },
  {
    id: 8,
    rank: 8,
    name: "Harvest Moon",
    fullName: "Leila Johnson",
    points: 900,
    avatar: "HM",
    avatarColor: "#fff1f1"
  },
  {
    id: 9,
    rank: 9,
    name: "Golden Grain",
    fullName: "David Nkosi",
    points: 850,
    avatar: "GG",
    avatarColor: "#fffce6"
  },
  {
    id: 10,
    rank: 10,
    name: "Fertile Valley",
    fullName: "Emma Wilson",
    points: 800,
    avatar: "FV",
    avatarColor: "#e6ffec"
  }
];

// League name and tiers
const leagueTiers = {
  diamond: "Harvester's Lord",
  platinum: "Cultivation Master",
  gold: "Crop Champion",
  silver: "Field Expert"
};

// Leaderboard Badge component
const LeaderboardBadge = ({ type, isActive }: { type: 'diamond' | 'platinum' | 'gold' | 'silver', isActive: boolean }) => {
  const badges = {
    diamond: "/images/diamond-badge.svg",
    platinum: "/images/platinum-badge.svg",
    gold: "/images/gold-badge.svg",
    silver: "/images/silver-badge.svg"
  };

  return (
    <div className={`${styles.badgeWrapper} ${isActive ? styles.activeBadge : ''}`}>
      <div className={`${styles.badge} ${styles[type]}`}>
        <Image
          src={badges[type]}
          alt={`${type} badge`}
          width={64}
          height={64}
          className={styles.badgeImage}
        />
      </div>
    </div>
  );
};

// User Avatar component
const UserAvatar = ({ initials, backgroundColor }: { initials: string, backgroundColor: string }) => {
  return (
    <div 
      className={styles.userAvatar} 
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
};

// Time period filter
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'allTime';

export default function LeaderboardPage() {
  // Current league tier
  const [currentTier, setCurrentTier] = useState<'diamond' | 'platinum' | 'gold' | 'silver'>('diamond');
  
  // Selected time period
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  
  // Highlighted user ID (could be the current user)
  const [highlightedUserId, setHighlightedUserId] = useState<number>(2);
  
  // Days remaining in current league period
  const daysLeft = 6;

  // Handle tier change
  const handleTierChange = (tier: 'diamond' | 'platinum' | 'gold' | 'silver') => {
    setCurrentTier(tier);
  };

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="leaderboard" />
        <main>
          <Header pageTitle="Leaderboard" />
          <div className={`content-container ${styles.leaderboardContainer}`}>
            
            {/* League header section */}
            <div className={styles.leagueHeader}>
              <div className={styles.badgesRow}>
                <button 
                  className={styles.badgeButton}
                  onClick={() => handleTierChange('diamond')}
                >
                  <LeaderboardBadge type="diamond" isActive={currentTier === 'diamond'} />
                </button>
                <button 
                  className={styles.badgeButton}
                  onClick={() => handleTierChange('platinum')}
                >
                  <LeaderboardBadge type="platinum" isActive={currentTier === 'platinum'} />
                </button>
                <button 
                  className={styles.badgeButton}
                  onClick={() => handleTierChange('gold')}
                >
                  <LeaderboardBadge type="gold" isActive={currentTier === 'gold'} />
                </button>
                <button 
                  className={styles.badgeButton}
                  onClick={() => handleTierChange('silver')}
                >
                  <LeaderboardBadge type="silver" isActive={currentTier === 'silver'} />
                </button>
              </div>
              
              <h1 className={styles.leagueTitle}>{leagueTiers[currentTier]}</h1>
              <p className={styles.leagueSubtitle}>Top 10 advance to the next league</p>
              
              <div className={styles.countdownContainer}>
                <div className={styles.countdownIcon}>⏱️</div>
                <span className={styles.countdownText}>{daysLeft} days left</span>
              </div>
            </div>
            
            {/* Time period selector */}
            <div className={styles.timeFilterContainer}>
              <button 
                className={`${styles.timeFilterButton} ${timePeriod === 'daily' ? styles.activeTimeFilter : ''}`}
                onClick={() => handleTimePeriodChange('daily')}
              >
                Daily
              </button>
              <button 
                className={`${styles.timeFilterButton} ${timePeriod === 'weekly' ? styles.activeTimeFilter : ''}`}
                onClick={() => handleTimePeriodChange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`${styles.timeFilterButton} ${timePeriod === 'monthly' ? styles.activeTimeFilter : ''}`}
                onClick={() => handleTimePeriodChange('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`${styles.timeFilterButton} ${timePeriod === 'allTime' ? styles.activeTimeFilter : ''}`}
                onClick={() => handleTimePeriodChange('allTime')}
              >
                All Time
              </button>
            </div>
            
            {/* Leaderboard table */}
            <div className={styles.leaderboardTable}>
              <div className={styles.tableHeader}>
                <div className={styles.rankColumn}>
                  <span className={styles.headerLabel}>Rank</span>
                </div>
                
                <div className={styles.userColumn}>
                  <span className={styles.headerLabel}>Farmer</span>
                </div>
                
                <div className={styles.pointsColumn}>
                  <span className={styles.headerLabel}>Points</span>
                </div>
              </div>
              
              {leaderboardData.map((user) => (
                <div 
                  key={user.id} 
                  className={`${styles.leaderboardRow} ${user.id === highlightedUserId ? styles.highlightedRow : ''}`}
                >
                  <div className={styles.rankColumn}>
                    <span className={styles.rankNumber}>{user.rank}.</span>
                  </div>
                  
                  <div className={styles.userColumn}>
                    <UserAvatar initials={user.avatar} backgroundColor={user.avatarColor} />
                    <div className={styles.userInfo}>
                      <h3 className={styles.userName}>{user.name}</h3>
                      <p className={styles.userFullName}>{user.fullName}</p>
                    </div>
                  </div>
                  
                  <div className={styles.pointsColumn}>
                    <span className={styles.pointsValue}>{user.points.toLocaleString()}px</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 