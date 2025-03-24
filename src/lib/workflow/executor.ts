
/**
 * Re-export everything from the new modular structure
 * This maintains backward compatibility with existing code
 */

export {
  executeWorkflow,
  defaultNodeExecutor,
  createNodeExecutor,
} from './execution';

// Export NodeExecutorFn as NodeExecutor for backwards compatibility
export type { NodeExecutorFn as NodeExecutor } from './execution/types';
