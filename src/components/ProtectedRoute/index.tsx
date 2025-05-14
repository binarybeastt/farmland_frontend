"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { isAuthenticated, getToken, checkAdminStatus } from '../../services/auth';
import './style.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  adminOnly = false 
}) => {
  const { authenticated, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      // First check if user is authenticated
      if (!loading) {
        if (!authenticated) {
          // Redirect to login if not authenticated
          router.replace('/');
          return;
        }

        // Double check token validation
        const tokenValid = isAuthenticated();
        if (!tokenValid) {
          // Token is invalid or expired
          router.replace('/');
          return;
        }

        // For admin routes, check admin status using the API
        if (adminOnly) {
          const token = getToken();
          if (!token) {
            router.replace('/');
            return;
          }

          const isAdmin = await checkAdminStatus(token);
          if (!isAdmin) {
            // Redirect non-admin users to dashboard
            router.replace('/dashboard');
            return;
          }
        }

        // User is authorized
        setIsAuthorized(true);
      }
      
      setAuthChecked(true);
    };

    checkAccess();
  }, [authenticated, loading, router, adminOnly]);

  // Show nothing while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Only render children if properly authorized
  return isAuthorized ? <>{children}</> : null;
}; 