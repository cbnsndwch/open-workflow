import { http, HttpResponse } from 'msw';
import { accounts, memberships } from '../data';

// Account-related handlers (formerly organizations)
export const accountHandlers = [
    // Accounts endpoints
    http.get('/api/accounts', () => {
        console.log('MSW: Accounts request intercepted');
        const authData = localStorage.getItem('auth');

        if (!authData) {
            return new HttpResponse(JSON.stringify(null), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        try {
            const { user } = JSON.parse(authData);
            const userMemberships = memberships.filter(
                m => m.userId === user.id
            );
            const userAccounts = userMemberships.map(membership => {
                const account = accounts.find(
                    o => o.id === membership.accountId
                );
                return { ...account, role: membership.role };
            });

            return new HttpResponse(JSON.stringify(userAccounts), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error in accounts endpoint:', error);
            return new HttpResponse(JSON.stringify({ error: 'Server error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }),

    // Also handle absolute URL path
    http.get('https://*.lovable.app/api/accounts', () => {
        console.log('MSW: Accounts request intercepted (absolute URL)');
        const authData = localStorage.getItem('auth');

        if (!authData) {
            return new HttpResponse(JSON.stringify(null), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        try {
            const { user } = JSON.parse(authData);
            const userMemberships = memberships.filter(
                m => m.userId === user.id
            );
            const userAccounts = userMemberships.map(membership => {
                const account = accounts.find(
                    o => o.id === membership.accountId
                );
                return { ...account, role: membership.role };
            });

            return new HttpResponse(JSON.stringify(userAccounts), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error in accounts endpoint:', error);
            return new HttpResponse(JSON.stringify({ error: 'Server error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    })
];
