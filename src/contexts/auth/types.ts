export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  username?: string;
  lastLogin?: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  role: string;
};

export type AuthData = {
  user: User | null;
  organizations: Organization[];
};

export interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
}

export const DEMO_AUTH_DATA = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    username: 'admin',
    lastLogin: new Date().toISOString()
  },
  organizations: [
    { id: '1', name: 'Acme Corp', slug: 'acme-corp', ownerId: '1', role: 'owner' },
    { id: '2', name: 'Widgets Inc', slug: 'widgets-inc', ownerId: '1', role: 'owner' }
  ]
};
