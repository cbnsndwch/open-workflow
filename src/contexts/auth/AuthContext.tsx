
import React, { createContext, useState, useEffect } from 'react';
import { isMswReady } from '../../mocks/browser';
import { AuthContextType, AuthData, Organization } from './types';
import { checkExistingSession, loginUser, logoutUser } from './authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        // Check if MSW is ready
        const mswActive = isMswReady();
        
        if (!mswActive) {
          console.log("MSW not active, using fallback mode");
          setUseFallbackMode(true);
        }

        // Check for existing session
        const sessionData = await checkExistingSession(useFallbackMode);
        if (sessionData) {
          setAuthData(sessionData);
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
      const data = await loginUser(identifier, password, useFallbackMode);
      setAuthData(data);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser(useFallbackMode);
      setAuthData({ user: null, organizations: [] });
      setCurrentOrganization(null);
    } catch (error) {
      console.error('Logout error:', error);
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
