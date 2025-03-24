
import { WorkflowGraph } from '../types';

export interface NodeExecutionStatus {
  status: 'pending' | 'running' | 'completed' | 'error';
  outputs: Record<string, any>;
  error?: string;
}

export type NodeExecutorFn = (
  node: any, // Using any for now to resolve the type issues
  inputs: Record<string, any>
) => Promise<Record<string, any>>;

export interface WorkflowExecutionContext {
  workflow: WorkflowGraph;
  nodeStates: Record<string, NodeExecutionStatus>;
  nodeExecutors: Record<string, NodeExecutorFn>;
}
