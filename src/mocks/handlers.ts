
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

export const handlers = [
  // Login handler - properly handle username or email
  http.post('/api/auth/login', async ({ request }) => {
    try {
      // Type the request body correctly
      const { identifier, password } = await request.json() as LoginRequest;
      
      // Find user by email or username
      const user = users.find(
        (u) => (u.email === identifier || u.username === identifier) && u.password === password
      );
      
      if (!user) {
        return HttpResponse.json(
          { error: 'Invalid credentials' }, 
          { status: 401 }
        );
      }
      
      // Get user's organizations
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return HttpResponse.json({
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          username: user.username 
        },
        organizations: userOrgs,
      });
    } catch (error) {
      console.error('Error in login handler:', error);
      return HttpResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );
    }
  }),
  
  // Get current user
  http.get('/api/auth/me', () => {
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return HttpResponse.json(null, { status: 401 });
    }
    
    try {
      return HttpResponse.json(JSON.parse(authData));
    } catch (error) {
      console.error('Error parsing auth data in /me endpoint:', error);
      return HttpResponse.json(
        { error: 'Invalid auth data' },
        { status: 500 }
      );
    }
  }),
  
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  
  http.get('/api/organizations', () => {
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return HttpResponse.json(null, { status: 401 });
    }
    
    try {
      const { user } = JSON.parse(authData);
      const userMemberships = memberships.filter(m => m.userId === user.id);
      const userOrgs = userMemberships.map(membership => {
        const org = organizations.find(o => o.id === membership.organizationId);
        return { ...org, role: membership.role };
      });
      
      return HttpResponse.json(userOrgs);
    } catch (error) {
      console.error('Error in organizations endpoint:', error);
      return HttpResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );
    }
  }),
];
