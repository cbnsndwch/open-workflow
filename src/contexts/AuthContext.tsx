
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isMswReady } from '../mocks/browser';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  username?: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  role: string;
};

type AuthData = {
  user: User | null;
  organizations: Organization[];
};

interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo data for fallback when MSW isn't working
const DEMO_AUTH_DATA = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    username: 'admin'
  },
  organizations: [
    { id: '1', name: 'Acme Corp', slug: 'acme-corp', ownerId: '1', role: 'owner' },
    { id: '2', name: 'Widgets Inc', slug: 'widgets-inc', ownerId: '1', role: 'owner' }
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthData>({ user: null, organizations: [] });
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  // Set current organization when auth changes
  useEffect(() => {
    if (authData.organizations.length > 0 && !currentOrganization) {
      setCurrentOrganization(authData.organizations[0]);
    }
  }, [authData.organizations, currentOrganization]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          try {
            const parsedData = JSON.parse(storedAuth);
            setAuthData({
              user: parsedData.user || null,
              organizations: parsedData.organizations || []
            });
            setIsLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing stored auth data:", e);
            localStorage.removeItem('auth');
          }
        }

        // Check if MSW is ready
        const mswActive = isMswReady();
        
        if (!mswActive) {
          console.log("MSW not active, using fallback mode");
          setUseFallbackMode(true);
          setIsLoading(false);
          return;
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
            setIsLoading(false);
            return;
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
              setAuthData(formattedData);
              localStorage.setItem('auth', JSON.stringify(formattedData));
            }
          } else {
            console.log('Not a JSON response from auth check, skipping');
            // If MSW is supposedly active but returns HTML, something is wrong
            // Go to fallback mode
            setUseFallbackMode(true);
          }
        } catch (error) {
          console.error('API auth check failed:', error);
          setUseFallbackMode(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUseFallbackMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      // If we're in fallback mode, use demo data directly
      if (useFallbackMode) {
        console.log('Using fallback mode for login');
        // Check if demo credentials match
        if ((identifier === 'admin' && password === 'password') || 
            (identifier === 'user' && password === 'password')) {
          setAuthData(DEMO_AUTH_DATA);
          localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
          toast.success('Logged in with demo account');
          setIsLoading(false);
          return;
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
        setUseFallbackMode(true);
        
        // Retry with fallback mode
        if ((identifier === 'admin' && password === 'password') || 
            (identifier === 'user' && password === 'password')) {
          setAuthData(DEMO_AUTH_DATA);
          localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
          toast.success('Logged in with demo account (fallback mode)');
          setIsLoading(false);
          return;
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
        setUseFallbackMode(true);
        
        if ((identifier === 'admin' && password === 'password') || 
            (identifier === 'user' && password === 'password')) {
          setAuthData(DEMO_AUTH_DATA);
          localStorage.setItem('auth', JSON.stringify(DEMO_AUTH_DATA));
          toast.success('Logged in with demo account (JSON parsing failed)');
          return;
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // Ensure consistent data structure
      const formattedData = {
        user: data.user || null,
        organizations: data.organizations || []
      };
      
      setAuthData(formattedData);
      
      // Store in localStorage for persistence and for the loader to use
      localStorage.setItem('auth', JSON.stringify(formattedData));
      
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!useFallbackMode) {
        await fetch('/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          }
        });
      }
      setAuthData({ user: null, organizations: [] });
      setCurrentOrganization(null);
      localStorage.removeItem('auth');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    user: authData.user,
    organizations: authData.organizations,
    currentOrganization,
    login,
    logout,
    setCurrentOrganization,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
