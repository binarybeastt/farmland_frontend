"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { isAuthenticated, getToken, logoutUser, getTokenExpirationDate } from '../services/auth';
import { User } from '../types/auth';
import { useRouter } from 'next/navigation';
import { authErrorEvent } from '../services/api';

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Function to check token expiration and set up auto-logout
  const setupAutoLogout = () => {
    const expirationDate = getTokenExpirationDate();
    if (!expirationDate) return;
    
    const timeUntilExpiry = expirationDate.getTime() - Date.now();
    
    // If token is already expired or will expire in less than a minute, logout now
    if (timeUntilExpiry <= 60000) {
      logout();
      return;
    }
    
    // Set up timer to auto-logout when token expires
    // Logout 1 minute before actual expiration to be safe
    const timeoutDuration = timeUntilExpiry - 60000;
    const logoutTimer = setTimeout(() => {
      logout();
    }, timeoutDuration);
    
    // Clean up timeout on unmount
    return () => clearTimeout(logoutTimer);
  };

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);
        
        if (isAuth) {
          // Get user data from localStorage if available
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          
          // Setup auto-logout based on token expiration
          setupAutoLogout();
        } else {
          // If we're not on the login page and not authenticated, redirect to login
          if (typeof window !== 'undefined' && 
              !window.location.pathname.match(/^\/(register)?$/)) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth errors from API service
    const handleAuthError = () => {
      logout();
      router.replace('/');
    };

    if (typeof window !== 'undefined' && authErrorEvent) {
      window.addEventListener('auth_error', handleAuthError);
      
      return () => {
        window.removeEventListener('auth_error', handleAuthError);
      };
    }
  }, [router]);

  const login = (userData: User, token: string) => {
    // Store user in state
    setUser(userData);
    setAuthenticated(true);
    
    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set up auto-logout timer based on token expiration
    setupAutoLogout();
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      authenticated, 
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 