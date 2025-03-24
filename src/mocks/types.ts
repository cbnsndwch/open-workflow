
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  password: string;
  role: string;
  lastLogin?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
}
