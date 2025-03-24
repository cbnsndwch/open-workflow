
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
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
  login: (email: string, password: string) => Promise<void>;
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
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setAuthData(data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      setAuthData(data);
      
      // Store in localStorage for persistence and for the loader to use
      localStorage.setItem('auth', JSON.stringify(data));
      
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
