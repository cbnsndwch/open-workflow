
import { toast } from 'sonner';
import { AuthData, DEMO_AUTH_DATA } from './types';

export const checkExistingSession = async (useFallbackMode: boolean): Promise<AuthData | null> => {
  // First check localStorage
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    try {
      const parsedData = JSON.parse(storedAuth);
      return {
        user: parsedData.user || null,
        organizations: parsedData.organizations || []
      };
    } catch (e) {
      console.error("Error parsing stored auth data:", e);
      localStorage.removeItem('auth');
    }
  }

  // If fallback mode is active, we don't need to check the API
  if (useFallbackMode) {
    return null;
  }

  // Then check API
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.log('Auth check failed with status:', response.status);
      return null;
    }
    
    // Check if response is JSON before attempting to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data) {
        const formattedData = {
          user: data.user || null,
          organizations: data.organizations || []
        };
        localStorage.setItem('auth', JSON.stringify(formattedData));
        return formattedData;
      }
    } else {
      console.log('Not a JSON response from auth check, skipping');
      return null;
    }
  } catch (error) {
    console.error('API auth check failed:', error);
    return null;
  }
  
  return null;
};

export const loginUser = async (
  identifier: string, 
  password: string, 
  useFallbackMode: boolean
): Promise<AuthData> => {
  // If we're in fallback mode, use demo data directly
  if (useFallbackMode) {
    console.log('Using fallback mode for login');
    // Check if demo credentials match
    if ((identifier === 'admin' && password === 'password') || 
        (identifier === 'user' && password === 'password')) {
      localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
      toast.success('Logged in with demo account');
      return DEMO_AUTH_DATA;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // Using the mock service worker API with explicit content-type
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ identifier, password }),
  });

  // Check if response is HTML by looking at content-type
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    console.warn('Received HTML response, switching to fallback mode');
    
    // Retry with fallback mode credentials
    if ((identifier === 'admin' && password === 'password') || 
        (identifier === 'user' && password === 'password')) {
      localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
      toast.success('Logged in with demo account (fallback mode)');
      return DEMO_AUTH_DATA;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // First check if we got a successful response
  if (!response.ok) {
    const errorText = await response.text();
    try {
      // Try to parse as JSON
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || 'Invalid credentials');
    } catch (e) {
      // If not JSON, use raw text
      throw new Error(errorText || 'Login failed');
    }
  }
  
  // Parse the response as JSON
  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Error parsing login response as JSON', e);
    
    // Switch to fallback mode if JSON parsing fails
    if ((identifier === 'admin' && password === 'password') || 
        (identifier === 'user' && password === 'password')) {
      localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
      toast.success('Logged in with demo account (JSON parsing failed)');
      return DEMO_AUTH_DATA;
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  // Ensure consistent data structure
  const formattedData = {
    user: data.user || null,
    organizations: data.organizations || []
  };
  
  // Store in localStorage for persistence and for the loader to use
  localStorage.setItem('auth', JSON.stringify(formattedData));
  
  toast.success('Logged in successfully');
  return formattedData;
};

export const logoutUser = async (useFallbackMode: boolean): Promise<void> => {
  if (!useFallbackMode) {
    await fetch('/api/auth/logout', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    });
  }
  localStorage.removeItem('auth');
  toast.success('Logged out successfully');
};
