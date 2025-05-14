const API_BASE_URL = 'https://phlapp-production.up.railway.app';

// Event for auth error to trigger app-wide response
export const authErrorEvent = typeof window !== 'undefined' 
  ? new Event('auth_error') 
  : null;

// Utility function for making API requests
export const apiRequest = async <T>(
  endpoint: string, 
  method: string, 
  body: any = null, 
  token: string | null = null
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized errors (expired token or invalid credentials)
    if (response.status === 401) {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token_data');
        localStorage.removeItem('user');
        
        // Dispatch an auth error event that can be listened to in the app
        if (authErrorEvent) {
          window.dispatchEvent(authErrorEvent);
        }
      }
      
      throw new Error('Authentication failed. Please login again.');
    }

    // For responses with content, parse the JSON
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    const data = hasJsonContent ? await response.json() : null;

    if (!response.ok) {
      // Special handling for validation errors (422)
      if (response.status === 422 && data && data.detail) {
        // If detail is an array of validation errors
        if (Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: any) => {
            // Get the field name and error message
            const location = err.loc?.slice(1).join('.') || 'unknown field';
            return `${location}: ${err.msg}`;
          }).join('; ');
          throw new Error(`Validation error: ${errorMessages}`);
        } else if (typeof data.detail === 'string') {
          throw new Error(data.detail);
        } else {
          throw new Error(JSON.stringify(data.detail));
        }
      }
      
      throw new Error(data?.detail || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Interceptor to check token before making requests
export const withAuth = async <T>(
  callback: (token: string) => Promise<T>
): Promise<T> => {
  // Get current token
  const tokenData = localStorage.getItem('token_data');
  
  if (!tokenData) {
    if (authErrorEvent) {
      window.dispatchEvent(authErrorEvent);
    }
    throw new Error('No authentication token found');
  }
  
  try {
    const { token } = JSON.parse(tokenData);
    
    if (!token) {
      if (authErrorEvent) {
        window.dispatchEvent(authErrorEvent);
      }
      throw new Error('Invalid authentication token');
    }
    
    // Execute the callback with token
    return await callback(token);
  } catch (error) {
    console.error('Auth interceptor error:', error);
    
    // Clear any invalid tokens
    localStorage.removeItem('token_data');
    localStorage.removeItem('user');
    
    if (authErrorEvent) {
      window.dispatchEvent(authErrorEvent);
    }
    
    throw error;
  }
}; 