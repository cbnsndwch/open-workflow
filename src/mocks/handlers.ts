
import { http, HttpResponse } from 'msw';

// Define the login request type
interface LoginRequest {
  email: string;
  password: string;
}

// Mock user data
export const users = [
  { id: '1', email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'user@example.com', password: 'password', name: 'Regular User', role: 'user' },
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
  // Login handler
  http.post('/api/auth/login', async ({ request }) => {
    // Type the request body correctly
    const { email, password } = await request.json() as LoginRequest;
    
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!user) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid credentials' }), 
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      organizations: userOrgs,
    });
  }),
  
  // Get current user
  http.get('/api/auth/me', () => {
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(null, { status: 401 });
    }
    
    return HttpResponse.json(JSON.parse(authData));
  }),
  
  // Logout handler
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  
  // Get organizations
  http.get('/api/organizations', () => {
    const authData = localStorage.getItem('auth');
    
    if (!authData) {
      return new HttpResponse(null, { status: 401 });
    }
    
    const { user } = JSON.parse(authData);
    const userMemberships = memberships.filter(m => m.userId === user.id);
    const userOrgs = userMemberships.map(membership => {
      const org = organizations.find(o => o.id === membership.organizationId);
      return { ...org, role: membership.role };
    });
    
    return HttpResponse.json(userOrgs);
  }),
];
