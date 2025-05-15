"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { SideBar } from '../../../components/Dashboard/sections/SideBar';
import { Header } from '../../../components/Dashboard/sections/Header';
import { getAssignedQuests } from '../../../services/quest';
import { AssignedQuest } from '../../../services/quest';
import { useAuth } from '../../../context/AuthContext';
import { getRandomQuestImage, defaultQuestImage } from '../../../utils/questImages';
import RecordFormModal from '../../../components/Quest/RecordFormModal';
import styles from './myQuests.module.css';

export default function MyQuestsPage() {
  const router = useRouter();
  const [assignedQuests, setAssignedQuests] = useState<AssignedQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const { user } = useAuth();
  
  // States for the record form modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<{id: string, title?: string} | null>(null);
  
  const fetchAssignedQuests = useCallback(async () => {
    try {
      setLoading(true);
      setIsFromCache(false);
      
      // Record the start time to measure response time
      const startTime = performance.now();
      const fetchedQuests = await getAssignedQuests();
      const endTime = performance.now();
      
      // If response time is less than 50ms, we likely got a cached response
      const responseTime = endTime - startTime;
      setIsFromCache(responseTime < 50);
      
      setAssignedQuests(fetchedQuests);
    } catch (err) {
      console.error('Failed to fetch assigned quests:', err);
      setError('Failed to load your quests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignedQuests();
  }, [fetchAssignedQuests]);

  const handleEnterRecord = (e: React.MouseEvent, questId: string, questTitle?: string) => {
    e.preventDefault(); // Prevent the Link from navigating
    setSelectedQuest({id: questId, title: questTitle});
    setShowRecordModal(true);
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="myQuests" />
        <main>
          <Header pageTitle="My Quests" />

          <div className={styles.contentContainer}>
            <div className={styles.headerActions}>
              <h2 className={styles.mainHeading}>Your Active Quests</h2>
            </div>
            
            {loading ? (
              <div className={styles.loadingState}>Loading your quests...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : (
              <>
                <div className={styles.questGrid}>
                  {assignedQuests.map((assignedQuest) => (
                    <Link 
                      href={`/dashboard/data-quest/${assignedQuest.quest_id}`} 
                      key={assignedQuest.id}
                      className={styles.questCardLink}
                    >
                      <div className={styles.questCard}>
                        <div className={styles.questImageContainer}>
                          <img 
                            src={assignedQuest.quest?.image || getRandomQuestImage(assignedQuest.quest_id)} 
                            alt={assignedQuest.quest?.title} 
                            className={styles.questImage}
                            onError={(e) => {
                              // If image fails to load, use default
                              (e.target as HTMLImageElement).src = defaultQuestImage;
                            }}
                          />
                        </div>
                        <div className={styles.questContent}>
                          <div className={styles.questTitleRow}>
                            <h3 className={styles.questTitle}>{assignedQuest.quest?.title}</h3>
                            <div className={styles.questPoints}>
                              {assignedQuest.quest?.points_reward} pts
                            </div>
                          </div>
                          <div className={styles.progressSection}>
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill} 
                                style={{ width: `${assignedQuest.progress_pct}%` }}
                              ></div>
                            </div>
                            <span className={styles.progressText}>
                              {assignedQuest.progress_pct}% Complete
                            </span>
                          </div>
                          <div className={styles.questStatus}>
                            Status: {assignedQuest.status.charAt(0).toUpperCase() + assignedQuest.status.slice(1)}
                          </div>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.enterRecordButton}
                              onClick={(e) => handleEnterRecord(e, assignedQuest.quest_id, assignedQuest.quest?.title)}
                            >
                              Enter Record
                            </button>
                            <div className={styles.viewDetailsLink}>
                              View Details
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {assignedQuests.length === 0 && !loading && (
                  <div className={styles.noQuestsMessage}>
                    You haven't joined any quests yet. Go to the Data Quest page to find and join quests!
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Record Form Modal */}
      {selectedQuest && (
        <RecordFormModal
          isOpen={showRecordModal}
          onClose={() => {
            setShowRecordModal(false);
            setSelectedQuest(null);
          }}
          questId={selectedQuest.id}
          questTitle={selectedQuest.title}
        />
      )}
    </ProtectedRoute>
  );
} 