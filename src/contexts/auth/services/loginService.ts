import { toast } from 'sonner';
import { AuthData, DEMO_AUTH_DATA } from '../types';
import { addLoginRecord } from './loginHistoryService';
import { users, accounts, memberships } from '@/mocks/data';

export const loginUser = async (
    identifier: string,
    password: string,
    useFallbackMode: boolean
): Promise<AuthData> => {
    // If we're in fallback mode, use demo data directly
    if (useFallbackMode) {
        console.log('Using fallback mode for login');
        // Check if demo credentials match
        if (identifier === 'admin' && password === 'password') {
            // Use admin demo data
            const adminUser = users.find(u => u.username === 'admin');
            if (adminUser) {
                // Get admin's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === adminUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create admin auth data
                const adminAuthData: AuthData = {
                    user: {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        role: adminUser.role,
                        username: adminUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(adminUser.id, adminUser.email);

                localStorage.setItem('auth', JSON.stringify(adminAuthData));
                toast.success('Logged in as Admin');
                return adminAuthData;
            }
        } else if (identifier === 'user' && password === 'password') {
            // Use regular user demo data
            const regularUser = users.find(u => u.username === 'user');
            if (regularUser) {
                // Get user's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === regularUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create regular user auth data
                const userAuthData: AuthData = {
                    user: {
                        id: regularUser.id,
                        email: regularUser.email,
                        name: regularUser.name,
                        role: regularUser.role,
                        username: regularUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(regularUser.id, regularUser.email);

                localStorage.setItem('auth', JSON.stringify(userAuthData));
                toast.success('Logged in as Regular User');
                return userAuthData;
            }
        }

        throw new Error('Invalid credentials');
    }

    // Using the mock service worker API with explicit content-type
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ identifier, password })
    });

    // Check if response is HTML by looking at content-type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        console.warn('Received HTML response, switching to fallback mode');

        // Retry with fallback mode credentials
        if (identifier === 'admin' && password === 'password') {
            // Use admin demo data with proper account filtering
            const adminUser = users.find(u => u.username === 'admin');
            if (adminUser) {
                // Get admin's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === adminUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create admin auth data
                const adminAuthData: AuthData = {
                    user: {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        role: adminUser.role,
                        username: adminUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(adminUser.id, adminUser.email);

                localStorage.setItem('auth', JSON.stringify(adminAuthData));
                toast.success('Logged in as Admin (fallback mode)');
                return adminAuthData;
            }
        } else if (identifier === 'user' && password === 'password') {
            // Use regular user demo data with proper account filtering
            const regularUser = users.find(u => u.username === 'user');
            if (regularUser) {
                // Get user's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === regularUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create regular user auth data
                const userAuthData: AuthData = {
                    user: {
                        id: regularUser.id,
                        email: regularUser.email,
                        name: regularUser.name,
                        role: regularUser.role,
                        username: regularUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(regularUser.id, regularUser.email);

                localStorage.setItem('auth', JSON.stringify(userAuthData));
                toast.success('Logged in as Regular User (fallback mode)');
                return userAuthData;
            }
        }

        throw new Error('Invalid credentials');
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
        if (identifier === 'admin' && password === 'password') {
            // Use admin demo data with proper account filtering
            const adminUser = users.find(u => u.username === 'admin');
            if (adminUser) {
                // Get admin's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === adminUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create admin auth data
                const adminAuthData: AuthData = {
                    user: {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        role: adminUser.role,
                        username: adminUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(adminUser.id, adminUser.email);

                localStorage.setItem('auth', JSON.stringify(adminAuthData));
                toast.success('Logged in as Admin (JSON parsing failed)');
                return adminAuthData;
            }
        } else if (identifier === 'user' && password === 'password') {
            // Use regular user demo data with proper account filtering
            const regularUser = users.find(u => u.username === 'user');
            if (regularUser) {
                // Get user's accounts
                const userMemberships = memberships.filter(
                    m => m.userId === regularUser.id
                );
                const userAccounts = userMemberships.map(membership => {
                    const account = accounts.find(
                        o => o.id === membership.accountId
                    );
                    return { ...account, role: membership.role };
                });

                // Create regular user auth data
                const userAuthData: AuthData = {
                    user: {
                        id: regularUser.id,
                        email: regularUser.email,
                        name: regularUser.name,
                        role: regularUser.role,
                        username: regularUser.username,
                        lastLogin: new Date().toISOString()
                    },
                    accounts: userAccounts
                };

                // Add login record
                addLoginRecord(regularUser.id, regularUser.email);

                localStorage.setItem('auth', JSON.stringify(userAuthData));
                toast.success(
                    'Logged in as Regular User (JSON parsing failed)'
                );
                return userAuthData;
            }
        }

        throw new Error('Invalid credentials');
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
                Accept: 'application/json'
            }
        });
    }
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
};
