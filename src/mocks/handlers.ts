
import { http, HttpResponse } from 'msw';

// Define the login request type
interface LoginRequest {
  identifier: string;
  password: string;
}

// Mock user data with usernames
export const users = [
  { 
    id: '1', 
    email: 'admin@example.com', 
    username: 'admin', 
    password: 'password', 
    name: 'Admin User', 
    role: 'admin' 
  },
  { 
    id: '2', 
    email: 'user@example.com', 
    username: 'user', 
    password: 'password', 
    name: 'Regular User', 
    role: 'user' 
  },
];

// Mock organizations data
export const organizations = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', ownerId: '1' },
  { id: '2', name: 'Widgets Inc', slug: 'widgets-inc', ownerId: '1' },
  { id: '3', name: 'Personal', slug: 'personal', ownerId: '2' },
];

// Mock user organization memberships
export const memberships = [
  { userId: '1', organizationId: '1', role: 'owner' },
  { userId: '1', organizationId: '2', role: 'owner' },
  { userId: '2', organizationId: '3', role: 'owner' },
];

// Ensure all endpoints are properly configured with both paths
export const handlers = [
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
      
      // Get user's organizations
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify({
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            username: user.username 
          },
          organizations: userOrgs,
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
      
      // Get user's organizations
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify({
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            username: user.username 
          },
          organizations: userOrgs,
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
  
  // Organizations endpoints
  http.get('/api/organizations', () => {
    console.log("MSW: Organizations request intercepted");
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
      const { user } = JSON.parse(authData);
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify(userOrgs),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in organizations endpoint:', error);
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
  
  // Also handle absolute URL path
  http.get('https://*.lovable.app/api/organizations', () => {
    console.log("MSW: Organizations request intercepted (absolute URL)");
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
      const { user } = JSON.parse(authData);
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return new HttpResponse(
        JSON.stringify(userOrgs),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in organizations endpoint:', error);
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
];
