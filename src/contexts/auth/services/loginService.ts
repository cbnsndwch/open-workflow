
import { toast } from 'sonner';
import { AuthData, DEMO_AUTH_DATA } from '../types';
import { addLoginRecord } from './loginHistoryService';

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
      // Update lastLogin timestamp
      const demoData = JSON.parse(JSON.stringify(DEMO_AUTH_DATA)); // Deep clone to avoid reference issues
      if (demoData.user) {
        demoData.user.lastLogin = new Date().toISOString();
        
        // Add login record
        addLoginRecord(demoData.user.id, demoData.user.email);
      }
      localStorage.setItem('auth', JSON.stringify(demoData));
      toast.success('Logged in with demo account');
      return demoData;
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
      // Update lastLogin timestamp
      const demoData = JSON.parse(JSON.stringify(DEMO_AUTH_DATA)); // Deep clone to avoid reference issues
      if (demoData.user) {
        demoData.user.lastLogin = new Date().toISOString();
        
        // Add login record
        addLoginRecord(demoData.user.id, demoData.user.email);
      }
      localStorage.setItem('auth', JSON.stringify(demoData));
      toast.success('Logged in with demo account (fallback mode)');
      return demoData;
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
    
    // Update lastLogin timestamp
    if (data.user) {
      data.user.lastLogin = new Date().toISOString();
      
      // Add login record
      addLoginRecord(data.user.id, data.user.email);
    }
    
  } catch (e) {
    console.error('Error parsing login response as JSON', e);
    
    // Switch to fallback mode if JSON parsing fails
    if ((identifier === 'admin' && password === 'password') || 
        (identifier === 'user' && password === 'password')) {
      // Update lastLogin timestamp
      const demoData = JSON.parse(JSON.stringify(DEMO_AUTH_DATA)); // Deep clone to avoid reference issues
      if (demoData.user) {
        demoData.user.lastLogin = new Date().toISOString();
        
        // Add login record
        addLoginRecord(demoData.user.id, demoData.user.email);
      }
      localStorage.setItem('auth', JSON.stringify(demoData));
      toast.success('Logged in with demo account (JSON parsing failed)');
      return demoData;
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  // Ensure consistent data structure
  const formattedData = {
    user: data.user || null,
    accounts: data.accounts || []
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
