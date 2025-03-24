
// Mock data for users
export const users = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    username: 'admin',
    password: 'password',
    role: 'admin',
    lastLogin: new Date().toISOString() // Add initial lastLogin
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    username: 'user',
    password: 'password',
    role: 'user',
    lastLogin: new Date().toISOString() // Add initial lastLogin
  }
];

// Mock accounts data (formerly organizations)
export const accounts = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', ownerId: '1' },
  { id: '2', name: 'Widgets Inc', slug: 'widgets-inc', ownerId: '1' },
  { id: '3', name: 'Personal', slug: 'personal', ownerId: '2' },
];

// Mock user account memberships
export const memberships = [
  { id: '1', userId: '1', accountId: '1', role: 'owner' },
  { id: '2', userId: '1', accountId: '2', role: 'owner' },
  { id: '3', userId: '2', accountId: '3', role: 'owner' },
];
