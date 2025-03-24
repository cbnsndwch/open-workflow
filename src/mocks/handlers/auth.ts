import { http, HttpResponse } from 'msw';
import { users, accounts, memberships } from '../data';
import { LoginRequest } from '../types';

// Auth-related handlers
export const authHandlers = [
  // Login handler - properly handle username or email
  http.post('/api/auth/login', async ({ request }) => {
    console.log("MSW: Login request intercepted");
    try {
      const contentType = request.headers.get('Content-Type');
      
      // Ensure we're getting JSON
      if (!contentType || !contentType.includes('application/json')) {
        return new HttpResponse(
          JSON.stringify({ error: 'Content-Type must be application/json' }),
          { 
            status: 415,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Type the request body correctly
      const { identifier, password } = await request.json() as LoginRequest;
      
      // Find user by email or username
      const user = users.find(
        (u) => (u.email === identifier || u.username === identifier) && u.password === password
      );
      
      if (!user) {
        return new HttpResponse(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Update lastLogin timestamp
      user.lastLogin = new Date().toISOString();
      
      // Get user's accounts
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userAccounts = userMemberships.map(membership => {
        const account = accounts.find(o => o.id === membership.accountId);
        return { ...account, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify({
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            username: user.username,
            lastLogin: user.lastLogin
          },
          accounts: userAccounts,
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in login handler:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Server error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Also handle the absolute URL path
  http.post('https://*.lovable.app/api/auth/login', async ({ request }) => {
    console.log("MSW: Login request intercepted (absolute URL)");
    try {
      const contentType = request.headers.get('Content-Type');
      
      // Ensure we're getting JSON
      if (!contentType || !contentType.includes('application/json')) {
        return new HttpResponse(
          JSON.stringify({ error: 'Content-Type must be application/json' }),
          { 
            status: 415,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Type the request body correctly
      const { identifier, password } = await request.json() as LoginRequest;
      
      // Find user by email or username
      const user = users.find(
        (u) => (u.email === identifier || u.username === identifier) && u.password === password
      );
      
      if (!user) {
        return new HttpResponse(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Update lastLogin timestamp
      user.lastLogin = new Date().toISOString();
      
      // Get user's accounts
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userAccounts = userMemberships.map(membership => {
        const account = accounts.find(o => o.id === membership.accountId);
        return { ...account, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify({
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            username: user.username,
            lastLogin: user.lastLogin
          },
          accounts: userAccounts,
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in login handler:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Server error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Get current user
  http.get('/api/auth/me', () => {
    console.log("MSW: Auth me request intercepted");
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(
        JSON.stringify(null),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    try {
      return new HttpResponse(
        authData,
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error parsing auth data in /me endpoint:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid auth data' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Also handle the absolute URL path
  http.get('https://*.lovable.app/api/auth/me', () => {
    console.log("MSW: Auth me request intercepted (absolute URL)");
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(
        JSON.stringify(null),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    try {
      return new HttpResponse(
        authData,
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error parsing auth data in /me endpoint:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid auth data' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Logout endpoint
  http.post('/api/auth/logout', () => {
    console.log("MSW: Logout request intercepted");
    return new HttpResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }),
  
  // Also handle the absolute URL path
  http.post('https://*.lovable.app/api/auth/logout', () => {
    console.log("MSW: Logout request intercepted (absolute URL)");
    return new HttpResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }),
];
