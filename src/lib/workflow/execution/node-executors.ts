
import {
  Node,
  NodeExecutor,
  ExecutionContext,
  NodeExecutionResult,
} from '../types';

/**
 * Get the appropriate executor for a node
 */
export function getNodeExecutor(
  node: Node,
  nodeExecutors: Record<string, NodeExecutor>
): NodeExecutor {
  // Check if we have a custom executor for this node kind
  const kindExecutor = nodeExecutors[node.kind];
  if (kindExecutor) {
    return kindExecutor;
  }
  
  // Check if we have a custom executor for this specific node
  const nodeExecutor = nodeExecutors[node.id];
  if (nodeExecutor) {
    return nodeExecutor;
  }
  
  // Return default executor
  return defaultNodeExecutor;
}

/**
 * Default node executor that passes inputs to outputs
 */
export const defaultNodeExecutor: NodeExecutor = async (
  node,
  inputs,
  context
): Promise<NodeExecutionResult> => {
  console.log(`Executing node ${node.name} (${node.kind})`, inputs);
  
  // For a no-op node, just pass through the main input to main output
  if (node.kind === 'core:no_op') {
    return {
      outputs: {
        main: inputs.main,
      },
    };
  }
  
  // For manual trigger nodes, return an empty object
  if (node.kind === 'core:triggers:manual') {
    return {
      outputs: {
        main: {},
      },
    };
  }
  
  // Default behavior: pass through all inputs as outputs
  return {
    outputs: {
      main: inputs.main || {},
      ...inputs,
    },
  };
};

/**
 * Create a node executor for a specific node type
 */
export function createNodeExecutor(
  executor: (node: Node, inputs: Record<string, any>, context: ExecutionContext) => Promise<any>
): NodeExecutor {
  return async (node, inputs, context): Promise<NodeExecutionResult> => {
    try {
      const result = await executor(node, inputs, context);
      
      if (result === undefined) {
        return { outputs: { main: {} } };
      }
      
      if (typeof result === 'object' && result !== null) {
        return { outputs: { main: result } };
      }
      
      return { outputs: { main: { value: result } } };
    } catch (error) {
      return {
        outputs: {},
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };
}
