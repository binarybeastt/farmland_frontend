"use client";

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/register', '/forgot-password', '/reset-password'];

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Auth logic
    if (!loading) {
      if (!authenticated && !isPublicRoute) {
        // Redirect to login
        router.replace('/');
        setAuthorized(false);
      } else if (authenticated && pathname === '/') {
        // If already logged in and trying to access login page, redirect to dashboard
        router.replace('/dashboard');
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [authenticated, loading, pathname, router]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="global-loading">
        <div className="loading-spinner"></div>
        <p>Please wait...</p>
      </div>
    );
  }

  // Only render children if authorized
  return authorized ? <>{children}</> : null;
}; 