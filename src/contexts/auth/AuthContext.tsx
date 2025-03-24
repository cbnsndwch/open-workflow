import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContextType, AuthData, Account } from './types';
import { checkExistingSession, loginUser, logoutUser } from './authService';
import { useMsw } from '../msw/MswContext';

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Get the navigate function
    const navigate = useNavigate();
    const { accountId } = useParams<{ accountId?: string }>();
    const { useFallback } = useMsw();

    const [isLoading, setIsLoading] = useState(true);
    const [authData, setAuthData] = useState<AuthData>({
        user: null,
        accounts: []
    });
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

    const hasMultipleAccounts = authData.accounts.length > 1;

    // Set the current account based on accountId from URL or localStorage
    useEffect(() => {
        if (authData.accounts.length > 0 && !currentAccount && accountId) {
            // If we have an accountId in the URL, try to match it with available accounts
            const matchingAccount = authData.accounts.find(
                acc => acc.id === accountId
            );

            if (matchingAccount) {
                setCurrentAccount(matchingAccount);
                localStorage.setItem(
                    'currentAccount',
                    JSON.stringify(matchingAccount)
                );
            } else {
                // If the accountId doesn't match any account, redirect to account selection
                navigate('/accounts');
            }
        }
    }, [authData.accounts, currentAccount, accountId, navigate]);

    // Update current account and redirect to the account-specific URL
    const updateCurrentAccount = (account: Account | null) => {
        setCurrentAccount(account);
        if (account) {
            localStorage.setItem('currentAccount', JSON.stringify(account));
            // Navigate to the account-specific workflows page
            navigate(`/${account.id}/workflows`);
        } else {
            localStorage.removeItem('currentAccount');
        }
    };

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check for existing session
                const sessionData = await checkExistingSession(useFallback);
                if (sessionData) {
                    setAuthData(sessionData);

                    // Don't set current account here - let the other useEffect handle it
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [useFallback]);

    // Handle user login
    const login = async (identifier: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await loginUser(identifier, password, useFallback);
            setAuthData(data);

            // After successful login, redirect based on number of accounts
            if (data.accounts.length > 1) {
                navigate('/accounts');
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

    // Handle user logout
    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutUser(useFallback);
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
        setCurrentAccount: updateCurrentAccount
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
