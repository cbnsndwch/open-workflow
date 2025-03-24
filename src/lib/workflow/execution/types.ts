
import { WorkflowGraph, WorkflowNode } from '../types';

export interface NodeExecutionStatus {
  status: 'pending' | 'running' | 'completed' | 'error';
  outputs: Record<string, any>;
  error?: string;
}

export type NodeExecutorFn = (
  node: WorkflowNode,
  inputs: Record<string, any>
) => Promise<Record<string, any>>;

export interface WorkflowExecutionContext {
  workflow: WorkflowGraph;
  nodeStates: Record<string, NodeExecutionStatus>;
  nodeExecutors: Record<string, NodeExecutorFn>;
}
