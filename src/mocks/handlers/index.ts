
import { authHandlers } from './auth';
import { accountHandlers } from './organizations';

export const handlers = [...authHandlers, ...accountHandlers];
