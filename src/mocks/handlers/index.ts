
import { authHandlers } from './auth';
import { organizationHandlers } from './organizations';

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...organizationHandlers,
];
