"use client";

import React, { ReactNode } from 'react';
import { ProtectedRoute } from '../ProtectedRoute';
import './style.css';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Use the enhanced ProtectedRoute with adminOnly=true
  return (
    <ProtectedRoute adminOnly={true}>
      {children}
    </ProtectedRoute>
  );
}; 