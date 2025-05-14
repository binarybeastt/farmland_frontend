"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { SideBar } from '../../../components/Dashboard/sections/SideBar';
import { Header } from '../../../components/Dashboard/sections/Header';
import { getQuests, GetQuestsParams } from '../../../services/quest';
import { Quest } from '../../../types/quest';
import { useAuth } from '../../../context/AuthContext';
import { getRandomQuestImage, defaultQuestImage } from '../../../utils/questImages';
import styles from './dataQuest.module.css';

export default function DataQuestPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const { user } = useAuth();
  const [pagination, setPagination] = useState<GetQuestsParams>({
    skip: 0,
    limit: 9,
    active_only: true
  });

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      setIsFromCache(false);
      
      // Record the start time to measure response time
      const startTime = performance.now();
      const fetchedQuests = await getQuests(pagination);
      const endTime = performance.now();
      
      // If response time is less than 50ms, we likely got a cached response
      const responseTime = endTime - startTime;
      setIsFromCache(responseTime < 50);
      
      setQuests(fetchedQuests);
    } catch (err) {
      console.error('Failed to fetch quests:', err);
      setError('Failed to load quests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  const loadMore = useCallback(() => {
    setIsFetchingMore(true);
    setPagination(prev => ({
      ...prev,
      skip: (prev.skip ?? 0) + (prev.limit ?? 9)
    }));
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="dataQuest" />
        <main>
          <Header pageTitle="Data Quest" />
          <div className={styles.contentContainer}>
            <div className={styles.headerActions}>
              <h2 className={styles.mainHeading}>Earn More Points, Join a quest!</h2>
              
              {user?.role === 'admin' && (
                <Link href="/dashboard/quests/create" className={styles.createQuestButton}>
                  Create New Quest
                </Link>
              )}
            </div>
            
            {loading && quests.length === 0 ? (
              <div className={styles.loadingState}>Loading quests...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : (
              <>
                <div className={styles.questGrid}>
                  {quests.map((quest) => (
                    <Link 
                      href={`/dashboard/data-quest/${quest.id}`} 
                      key={quest.id}
                      className={styles.questCardLink}
                    >
                      <div className={styles.questCard}>
                        <div className={styles.questImageContainer}>
                          <img 
                            src={quest.image || getRandomQuestImage(quest.id)} 
                            alt={quest.title} 
                            className={styles.questImage}
                            onError={(e) => {
                              // If image fails to load, use default
                              (e.target as HTMLImageElement).src = defaultQuestImage;
                            }}
                          />
                        </div>
                        <div className={styles.questContent}>
                          <div className={styles.questTitleRow}>
                            <h3 className={styles.questTitle}>{quest.title}</h3>
                            <div className={styles.questPoints}>
                              {quest.points_reward} pts
                            </div>
                          </div>
                          <p className={styles.questDescription}>
                            {quest.description.length > 100 
                              ? `${quest.description.substring(0, 100)}...` 
                              : quest.description
                            }
                          </p>
                          <div className={styles.questFooter}>
                            <button className={styles.joinQuestButton}>
                              Join Quest
                            </button>
                            <span className={styles.questParticipants}>
                              {quest.participants_count || 0} participants
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {quests.length === 0 && !loading && (
                  <div className={styles.noQuestsMessage}>
                    No quests available at the moment. Check back later!
                  </div>
                )}
                
                {quests.length > 0 && (
                  <div className={styles.loadMoreContainer}>
                    <button 
                      className={styles.loadMoreButton}
                      onClick={loadMore}
                      disabled={isFetchingMore}
                    >
                      {isFetchingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 