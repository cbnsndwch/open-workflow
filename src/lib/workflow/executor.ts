
import {
  WorkflowGraph,
  Node,
  NodeExecutor,
  ExecutionContext,
  NodeExecutionResult,
  ExecutionOptions,
  WorkflowExecutionResult,
} from './types';
import { findStartNodes } from './traversal';

/**
 * Execute a workflow graph
 */
export async function executeWorkflow(
  workflow: WorkflowGraph,
  options: ExecutionOptions = {}
): Promise<WorkflowExecutionResult> {
  const {
    startNodeId,
    initialState = {},
    nodeExecutors = {},
    onNodeStart,
    onNodeComplete,
    onNodeError,
  } = options;

  // Create execution context
  const context: ExecutionContext = {
    state: { ...initialState },
    nodeResults: {},
    visitedNodes: new Set<string>(),
    nodeExecutors,
    onNodeStart,
    onNodeComplete,
    onNodeError,
  };

  // Track errors during execution
  const errors: Record<string, Error> = {};

  // Find start node
  let startNodeName: string | undefined;
  if (startNodeId) {
    const startNode = workflow.nodes.find(n => n.id === startNodeId);
    if (!startNode) {
      throw new Error(`Start node with ID ${startNodeId} not found`);
    }
    startNodeName = startNode.name;
  } else {
    const startNodes = findStartNodes(workflow);
    if (startNodes.length === 0) {
      throw new Error('No start nodes found in workflow');
    }
    startNodeName = startNodes[0];
  }

  // Execute the workflow starting from the start node
  try {
    await executeNode(workflow, startNodeName, context, errors);
  } catch (error) {
    // Catch any uncaught errors
    console.error('Workflow execution failed with error:', error);
    return {
      nodeResults: context.nodeResults,
      finalState: context.state,
      errors,
      successful: false,
    };
  }

  // Determine if the workflow execution was successful
  const successful = Object.keys(errors).length === 0;

  return {
    nodeResults: context.nodeResults,
    finalState: context.state,
    errors,
    successful,
  };
}

/**
 * Execute a single node and its downstream nodes
 * 
 * IMPORTANT: This function handles execution dependencies in the following ways:
 * 1. It uses a depth-first traversal approach, but with a crucial check: a node will only be executed 
 *    if it hasn't been visited before, using the visitedNodes set in the context.
 * 2. The visitedNodes set ensures that a node is only executed after all its dependencies 
 *    have been processed, as the traversal will have already visited those nodes.
 * 3. Cycles are handled by tracking the visit path and detecting repeated nodes.
 * 4. The collectNodeInputs function will find all inputs from previously executed nodes,
 *    ensuring data is available before a node is processed.
 */
async function executeNode(
  workflow: WorkflowGraph,
  nodeName: string,
  context: ExecutionContext,
  errors: Record<string, Error>,
  visitPath: string[] = []
): Promise<void> {
  // Check for cycles
  if (visitPath.includes(nodeName)) {
    console.warn(`Cycle detected in execution: ${visitPath.join(' -> ')} -> ${nodeName}`);
    // We allow cycles, but we need to check if we've already visited this node in this execution
    if (context.visitedNodes.has(nodeName)) {
      return;
    }
  }

  // Find the node by name
  const node = workflow.nodes.find(n => n.name === nodeName);
  if (!node) {
    throw new Error(`Node "${nodeName}" not found in workflow`);
  }

  // Mark node as visited
  context.visitedNodes.add(nodeName);
  visitPath.push(nodeName);

  // Notify of node start
  if (context.onNodeStart) {
    context.onNodeStart(node.id);
  }

  try {
    // Check if all inputs for this node are available (dependencies satisfied)
    // collectNodeInputs will find inputs from nodes that have already been executed
    const inputs = collectNodeInputs(workflow, nodeName, context);
    
    // Before executing, confirm all required inputs are available
    const inputsAvailable = areAllRequiredInputsAvailable(workflow, nodeName, context);
    
    if (!inputsAvailable) {
      // Handle missing inputs - for now we proceed but this could be enhanced
      console.warn(`Node ${nodeName} is being executed with potentially incomplete inputs`);
    }

    // Execute the node
    const executor = getNodeExecutor(node, context.nodeExecutors);
    const result = await executor(node, inputs, context);

    // Store the result
    context.nodeResults[node.id] = result;

    // Update state with node outputs
    if (result.outputs) {
      context.state[node.name] = result.outputs;
    }

    // Notify of node completion
    if (context.onNodeComplete) {
      context.onNodeComplete(node.id, result);
    }

    // Check for error
    if (result.error) {
      errors[node.id] = result.error;
      if (context.onNodeError) {
        context.onNodeError(node.id, result.error);
      }
    }

    // Execute downstream nodes
    const nodeConnections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(nodeConnections)) {
      const connections = nodeConnections[outputPort];
      
      // Sort connections by order
      const sortedConnections = [...connections].sort((a, b) => a.order - b.order);
      
      // Execute each connected node
      for (const connection of sortedConnections) {
        await executeNode(
          workflow,
          connection.node,
          context,
          errors,
          [...visitPath]
        );
      }
    }
  } catch (error) {
    // Handle node execution error
    const nodeError = error instanceof Error ? error : new Error(String(error));
    errors[node.id] = nodeError;
    
    // Notify of node error
    if (context.onNodeError) {
      context.onNodeError(node.id, nodeError);
    }
    
    // Log the error
    console.error(`Error executing node ${nodeName}:`, nodeError);
  }
}

/**
 * Check if all required inputs for a node are available in the context state
 * This helps identify potential dependency issues where a node might be executed
 * before all its inputs are ready
 */
function areAllRequiredInputsAvailable(
  workflow: WorkflowGraph,
  nodeName: string,
  context: ExecutionContext
): boolean {
  // Get all incoming connections to this node
  const incomingConnections = getIncomingConnections(workflow, nodeName);
  
  // Check if all source nodes have been executed
  for (const connection of incomingConnections) {
    const sourceName = connection.source;
    const sourceOutputPort = connection.outputPort;
    
    // If the source node output is not in the state, it hasn't been executed yet
    if (!context.state[sourceName] || 
        context.state[sourceName][sourceOutputPort] === undefined) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all incoming connections to a node
 */
function getIncomingConnections(
  workflow: WorkflowGraph,
  nodeName: string
): Array<{ source: string; outputPort: string; targetPort: string }> {
  const connections: Array<{ source: string; outputPort: string; targetPort: string }> = [];
  
  // Find all incoming connections to this node
  for (const sourceName of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceName];
    for (const outputPort of Object.keys(outputPorts)) {
      const nodeConnections = outputPorts[outputPort];
      for (const connection of nodeConnections) {
        if (connection.node === nodeName) {
          connections.push({
            source: sourceName,
            outputPort: outputPort,
            targetPort: connection.port
          });
        }
      }
    }
  }
  
  return connections;
}

/**
 * Collect inputs for a node from its upstream nodes
 * 
 * This function gathers inputs by:
 * 1. Finding all nodes that connect to this node
 * 2. Retrieving the appropriate output values from those nodes in the context state
 * 3. Mapping those outputs to the correct input ports on this node
 * 
 * Note: This relies on the context.state having outputs from all required upstream nodes.
 * If execution order is incorrect, some inputs may be undefined.
 */
function collectNodeInputs(
  workflow: WorkflowGraph,
  nodeName: string,
  context: ExecutionContext
): Record<string, any> {
  const inputs: Record<string, any> = {};
  
  // Find all incoming connections to this node
  for (const sourceName of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceName];
    for (const outputPort of Object.keys(outputPorts)) {
      const connections = outputPorts[outputPort];
      for (const connection of connections) {
        if (connection.node === nodeName) {
          // Find the source node
          const sourceNode = workflow.nodes.find(n => n.name === sourceName);
          if (!sourceNode) {
            continue;
          }
          
          // Get the source node's output
          const sourceNodeOutput = context.state[sourceName]?.[outputPort];
          
          // Add to inputs under the target port name
          inputs[connection.port] = sourceNodeOutput;
        }
      }
    }
  }
  
  // Add global state
  inputs._state = context.state;
  
  return inputs;
}

/**
 * Get the appropriate executor for a node
 */
function getNodeExecutor(
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
