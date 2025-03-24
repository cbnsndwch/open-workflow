
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMswReady } from '../../mocks/browser';
import { AuthContextType, AuthData, Account } from './types';
import { checkExistingSession, loginUser, logoutUser } from './authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthData>({ user: null, accounts: [] });
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  const hasMultipleAccounts = authData.accounts.length > 1;

  // Set current account when auth changes
  useEffect(() => {
    if (authData.accounts.length > 0 && !currentAccount) {
      // If user has multiple accounts and no current account is set, navigate to account selection
      if (authData.accounts.length > 1) {
        navigate('/account-select');
      } else {
        // Single account - set it and navigate to workflows
        setCurrentAccount(authData.accounts[0]);
        navigate('/workflows');
      }
    }
  }, [authData.accounts, currentAccount, navigate]);

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
          
          // If user has a single account, set it automatically
          if (sessionData.accounts.length === 1) {
            setCurrentAccount(sessionData.accounts[0]);
          }
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
      
      // After successful login, redirect based on number of accounts
      if (data.accounts.length > 1) {
        navigate('/account-select');
      } else if (data.accounts.length === 1) {
        setCurrentAccount(data.accounts[0]);
        navigate('/workflows');
      }
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
      setAuthData({ user: null, accounts: [] });
      setCurrentAccount(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    user: authData.user,
    accounts: authData.accounts,
    currentAccount,
    hasMultipleAccounts,
    login,
    logout,
    setCurrentAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
