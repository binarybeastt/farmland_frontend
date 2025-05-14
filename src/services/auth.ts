import { apiRequest } from './api';
import { RegisterData, RegisterResponse, LoginResponse, User } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

// User registration
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  return await apiRequest('/api/v1/auth/register', 'POST', userData);
};

// User login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email); // OAuth2 uses 'username' for email
  formData.append('password', password);

  try {
    const response = await fetch('https://phlapp-production.up.railway.app/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store the token in localStorage with timestamp
    if (data.access_token) {
      const tokenData = {
        token: data.access_token,
        timestamp: Date.now() // Store when the token was received
      };
      localStorage.setItem('token_data', JSON.stringify(tokenData));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Check if user is admin using the correct endpoint
export const checkAdminStatus = async (token: string): Promise<boolean> => {
  try {
    const response = await apiRequest<{ is_admin: boolean }>(
      '/api/v1/users/me/admin-status',
      'GET',
      null,
      token
    );
    return response.is_admin;
  } catch (error) {
    console.error('Admin status check error:', error);
    return false;
  }
};

// Check if user is logged in and token is still valid
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const tokenData = localStorage.getItem('token_data');
  if (!tokenData) return false;
  
  try {
    const { token, timestamp } = JSON.parse(tokenData);
    
    // Check if token exists
    if (!token) return false;
    
    // Try to decode the token to check expiration
    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      
      // If token is expired
      if (decodedToken.exp < currentTime) {
        // Clear invalid token
        localStorage.removeItem('token_data');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      // If token can't be decoded, it's invalid
      console.error('Token validation error:', error);
      localStorage.removeItem('token_data');
      localStorage.removeItem('user');
      return false;
    }
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
};

// Logout user
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token_data');
    localStorage.removeItem('user');
  }
};

// Get current auth token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const tokenData = localStorage.getItem('token_data');
  if (!tokenData) return null;
  
  try {
    const { token } = JSON.parse(tokenData);
    
    // Verify token is not expired before returning
    if (isTokenExpired(token)) {
      // Clear expired token
      localStorage.removeItem('token_data');
      localStorage.removeItem('user');
      return null;
    }
    
    return token;
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch {
    // If there's an error decoding, assume token is invalid
    return true;
  }
};

// Get token expiration date
export const getTokenExpirationDate = (): Date | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    return new Date(decodedToken.exp * 1000);
  } catch {
    return null;
  }
}; 