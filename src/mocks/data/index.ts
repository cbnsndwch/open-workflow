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
