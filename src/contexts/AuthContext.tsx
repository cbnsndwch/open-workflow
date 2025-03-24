
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthData>({ user: null, organizations: [] });
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);

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

        // Then check API - using the mock service worker API
        try {
          const response = await fetch('/api/auth/me');
          
          // Check if response is JSON before attempting to parse
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            if (response.ok) {
              const data = await response.json();
              const formattedData = {
                user: data.user || null,
                organizations: data.organizations || []
              };
              setAuthData(formattedData);
              localStorage.setItem('auth', JSON.stringify(formattedData));
            }
          } else {
            console.log('Not a JSON response from auth check, skipping');
          }
        } catch (error) {
          console.error('API auth check failed:', error);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      // Using the mock service worker API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      // Check if response is JSON before attempting to parse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON response but got:', contentType);
        throw new Error('Server error: unexpected response format');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
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
      await fetch('/api/auth/logout', { method: 'POST' });
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
