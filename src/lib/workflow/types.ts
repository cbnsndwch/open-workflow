
/**
 * Core types for the workflow graph engine
 */

/**
 * Represents a node in the workflow graph
 */
export interface Node {
  id: string;
  name: string;
  kind: string;
  version: string;
  [key: string]: any;
}

/**
 * Represents a connection to another node
 */
export interface NodeConnection {
  node: string;
  port: string;
  order: number;
}

/**
 * Map of output ports to their connections
 */
export type NodeOutputConnections = Record<string, NodeConnection[]>;

/**
 * Map of nodes to their connections
 */
export type EdgeMap = Record<string, NodeOutputConnections>;

/**
 * The entire workflow graph representation
 */
export interface WorkflowGraph {
  nodes: Node[];
  edges: EdgeMap;
}

/**
 * Represents a port on a node (input or output)
 */
export interface Port {
  name: string;
  nodeId: string;
  type: 'input' | 'output';
}

/**
 * Result of a node execution
 */
export interface NodeExecutionResult {
  outputs: Record<string, any>;
  error?: Error;
}

/**
 * Node executor function type
 */
export type NodeExecutor = (
  node: Node,
  inputs: Record<string, any>,
  context: ExecutionContext
) => Promise<NodeExecutionResult>;

/**
 * Context for workflow execution
 */
export interface ExecutionContext {
  state: Record<string, any>;
  nodeResults: Record<string, NodeExecutionResult>;
  visitedNodes: Set<string>;
  nodeExecutors: Record<string, NodeExecutor>;
  onNodeStart?: (nodeId: string) => void;
  onNodeComplete?: (nodeId: string, result: NodeExecutionResult) => void;
  onNodeError?: (nodeId: string, error: Error) => void;
}

/**
 * Options for workflow execution
 */
export interface ExecutionOptions {
  startNodeId?: string;
  initialState?: Record<string, any>;
  nodeExecutors?: Record<string, NodeExecutor>;
  onNodeStart?: (nodeId: string) => void;
  onNodeComplete?: (nodeId: string, result: NodeExecutionResult) => void;
  onNodeError?: (nodeId: string, error: Error) => void;
}

/**
 * Result of a workflow execution
 */
export interface WorkflowExecutionResult {
  nodeResults: Record<string, NodeExecutionResult>;
  finalState: Record<string, any>;
  errors: Record<string, Error>;
  successful: boolean;
}

/**
 * A validation error in the workflow
 */
export interface ValidationError {
  message: string;
  nodeId?: string;
  path?: string;
  severity: 'error' | 'warning';
}

/**
 * Result of validating a workflow
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
