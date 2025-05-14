"use client";

import React from 'react';
import { QuestCreation } from '../../../../components/Quest';
import { AdminRoute } from '../../../../components/AdminRoute';
import { SideBar } from '../../../../components/Dashboard/sections/SideBar';
import { Header } from '../../../../components/Dashboard/sections/Header';
import '../../../../components/AdminRoute/style.css';
import '../../../../components/Quest/style.css';
import styles from './createQuest.module.css';

export default function CreateQuestPage() {
  return (
    <AdminRoute>
      <div className="dashboard">
        <SideBar />
        <div className={styles.mainContentWrapper}>
          <Header pageTitle="Create Quest" />
          <div className={styles.contentWrapper}>
            <QuestCreation />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 