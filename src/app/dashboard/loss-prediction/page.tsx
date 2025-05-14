"use client";

import React from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { DivWrapper } from "../../../components/Dashboard/sections/DivWrapper";
import { Header } from "../../../components/Dashboard/sections/Header";

export default function LossPredictionPage() {
  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="lossPrediction" />
        <main>
          <Header pageTitle="Loss Prediction" />
          <div className="content-container">
            <h1>Loss Prediction</h1>
            <DivWrapper />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 