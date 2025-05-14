"use client";

import React from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="learn" />
        <main>
          <Header pageTitle="Learn" />
          <div className="content-container">
            <h1>Learn</h1>
            <p>This page is under construction. Educational content coming soon!</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 