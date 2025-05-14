"use client";

import React from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="leaderboard" />
        <main>
          <Header pageTitle="Leaderboard" />
          <div className="content-container">
            <h1>Leaderboard</h1>
            <p>This page is under construction. Coming soon!</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 