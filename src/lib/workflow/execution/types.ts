
import { WorkflowGraph, Node } from '../types';

export interface NodeExecutionStatus {
  status: 'pending' | 'running' | 'completed' | 'error';
  outputs: Record<string, any>;
  error?: string;
}

export type NodeExecutorFn = (
  node: Node, 
  inputs: Record<string, any>
) => Promise<Record<string, any>>;

export interface WorkflowExecutionContext {
  workflow: WorkflowGraph;
  nodeStates: Record<string, NodeExecutionStatus>;
  nodeExecutors: Record<string, NodeExecutorFn>;
}

export interface StagedNodeInfo {
  id: string;
  inputs: Record<string, any>;
}
