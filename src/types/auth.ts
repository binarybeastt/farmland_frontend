// User registration data type
export interface RegisterData {
  username: string;
  email: string;
  farm_name: string;
  location: Record<string, any>;
  is_active: boolean;
  password: string;
}

// User registration response type
export interface RegisterResponse extends Omit<RegisterData, 'password'> {
  id: string;
  level: number;
  points: number;
  settings: Record<string, any>;
  joined_date: string;
}

// Login response type
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// User data type
export interface User {
  id?: string;
  username?: string;
  email?: string;
  farm_name?: string;
  level?: number;
  points?: number;
  role?: 'admin' | 'user';
} 