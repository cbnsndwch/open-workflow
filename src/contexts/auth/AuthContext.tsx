
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMswReady } from '../../mocks/browser';
import { AuthContextType, AuthData, Account } from './types';
import { checkExistingSession, loginUser, logoutUser } from './authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Get the navigate function
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthData>({ user: null, accounts: [] });
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  const hasMultipleAccounts = authData.accounts.length > 1;

  // Set the current account in localStorage
  const updateCurrentAccount = (account: Account | null) => {
    setCurrentAccount(account);
    if (account) {
      localStorage.setItem('currentAccount', JSON.stringify(account));
      // Navigate to workflows after setting account
      navigate('/workflows');
    } else {
      localStorage.removeItem('currentAccount');
    }
  };

  // Retrieve saved account and auth data on mount
  useEffect(() => {
    if (authData.accounts.length > 0 && !currentAccount) {
      // Check for saved account in localStorage
      const savedAccount = localStorage.getItem('currentAccount');
      
      if (savedAccount) {
        try {
          const parsedAccount = JSON.parse(savedAccount);
          // Verify that the saved account exists in the current accounts array
          const accountExists = authData.accounts.some(acc => acc.id === parsedAccount.id);
          
          if (accountExists) {
            // Find the full account details from the current accounts array
            const matchingAccount = authData.accounts.find(acc => acc.id === parsedAccount.id);
            setCurrentAccount(matchingAccount || null);
            return;
          }
        } catch (e) {
          console.error('Error parsing saved account', e);
          localStorage.removeItem('currentAccount');
        }
      }
      
      // If no valid saved account, handle based on number of accounts
      if (authData.accounts.length > 1) {
        navigate('/account-select');
      } else if (authData.accounts.length === 1) {
        updateCurrentAccount(authData.accounts[0]);
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
          
          // Don't set current account here - let the other useEffect handle it
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
        updateCurrentAccount(data.accounts[0]);
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
      localStorage.removeItem('currentAccount');
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
    setCurrentAccount: updateCurrentAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
