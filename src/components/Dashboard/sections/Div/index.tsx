"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAssignedQuests, AssignedQuest } from "../../../../services/quest";
import { getRandomQuestImage, defaultQuestImage } from "../../../../utils/questImages";
import "./style.css";

export const Div = () => {
  const router = useRouter();
  const [assignedQuests, setAssignedQuests] = useState<AssignedQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const fetchUserQuests = useCallback(async () => {
    try {
      setLoading(true);
      // Get user's assigned quests - limited to 5
      const fetchedQuests = await getAssignedQuests({ limit: 5, skip: 0 });
      setAssignedQuests(fetchedQuests);
    } catch (err) {
      console.error("Failed to fetch user quests:", err);
      setError("Failed to load your quests");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUserQuests();
  }, [fetchUserQuests]);
  
  const handleDotClick = (index: number) => {
    if (index < assignedQuests.length) {
      setActiveIndex(index);
    }
  };
  
  const handleStartQuest = (e: React.MouseEvent, questId: string) => {
    e.preventDefault();
    router.push(`/dashboard/data-quest/${questId}?showModal=true`);
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-text">Loading your quests...</div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="error-container">
          <div className="error-text">{error}</div>
        </div>
      );
    }
    
    if (assignedQuests.length === 0) {
      return (
        <div className="no-quests-container">
          <div className="no-quests-content">
            <div className="text-wrapper-31">NO ACTIVE QUESTS</div>
            <div className="text-wrapper-32">Join a Quest</div>
            <div className="text-wrapper-33">Find and join quests to start earning points</div>
            <div className="frame-45">
              <div 
                className="frame-46"
                onClick={() => router.push('/dashboard/data-quest')}
              >
                <div className="text-wrapper-35">Explore Quests</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    const currentQuest = assignedQuests[activeIndex];
    
    return (
      <div className="frame-40">
        <img
          className="rectangle-4"
          alt={currentQuest.quest?.title || "Quest image"}
          src={currentQuest.quest?.image || getRandomQuestImage(currentQuest.quest_id)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultQuestImage;
          }}
        />
        <div className="frame-41">
          <div className="frame-42">
            <div className="text-wrapper-31">
              {currentQuest.status.toUpperCase()} QUEST
            </div>
            <div className="frame-43">
              <div className="text-wrapper-32">{currentQuest.quest?.title}</div>
              <div className="text-wrapper-33">
                {currentQuest.quest?.description?.substring(0, 60)}
                {currentQuest.quest?.description?.length > 60 ? "..." : ""}
              </div>
            </div>
            <div className="frame-44">
              <div className="text-wrapper-34">{currentQuest.quest?.points_reward} pts</div>
            </div>
          </div>
          <div className="frame-45">
            <div
              className="frame-46"
              onClick={(e) => handleStartQuest(e, currentQuest.quest_id)}
            >
              <div className="text-wrapper-35">
                {currentQuest.progress_pct > 0 ? "Continue quest" : "Start quest"}
              </div>
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${currentQuest.progress_pct}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {currentQuest.progress_pct}% Complete
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="div">
      <div className="frame-25">
        <div className="overlap-group-6">
          {renderContent()}
        </div>
      </div>
      {!loading && !error && assignedQuests.length > 0 && (
        <div className="pagination">
          {assignedQuests.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`} 
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}; 