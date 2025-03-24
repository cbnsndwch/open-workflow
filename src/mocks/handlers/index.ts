
import { authHandlers } from './auth';
import { accountHandlers } from './organizations';
import { workflowHandlers } from './workflows';

export const handlers = [...authHandlers, ...accountHandlers, ...workflowHandlers];
