
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
    stagedNodes: new Map<string, StagedNodeInfo>(), // Track nodes waiting for inputs
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
    // Initialize the staged nodes queue
    await executeNode(workflow, startNodeName, context, errors);
    
    // Process staged nodes until none are left or no progress is made
    await processStagedNodes(workflow, context, errors);
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

  // Check if any nodes are still staged (inputs never satisfied)
  if (context.stagedNodes.size > 0) {
    console.warn(`Workflow execution completed with ${context.stagedNodes.size} nodes never executed due to unsatisfied inputs:`, 
      Array.from(context.stagedNodes.keys()).join(', '));
  }

  return {
    nodeResults: context.nodeResults,
    finalState: context.state,
    errors,
    successful,
  };
}

/**
 * Information about a staged node waiting for its inputs
 */
interface StagedNodeInfo {
  nodeName: string;
  missingInputs: string[];
  visitPath: string[];
}

/**
 * Process all staged nodes until none are left or no progress is made
 */
async function processStagedNodes(
  workflow: WorkflowGraph, 
  context: ExecutionContext,
  errors: Record<string, Error>
): Promise<void> {
  let progress = true;
  let iterations = 0;
  const MAX_ITERATIONS = 1000; // Safety limit
  
  while (progress && context.stagedNodes.size > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    progress = false;
    
    // Get a snapshot of the current staged nodes to iterate over
    const stagedEntries = Array.from(context.stagedNodes.entries());
    
    for (const [nodeId, info] of stagedEntries) {
      // Check if all required inputs are now available
      const allInputsAvailable = areAllRequiredInputsAvailable(workflow, info.nodeName, context);
      
      if (allInputsAvailable) {
        // Remove from staged nodes
        context.stagedNodes.delete(nodeId);
        progress = true;
        
        // Now execute the node as its inputs are ready
        const node = workflow.nodes.find(n => n.name === info.nodeName);
        if (node) {
          try {
            // Execute the node now that inputs are available
            await executeNode(workflow, info.nodeName, context, errors, info.visitPath);
          } catch (error) {
            console.error(`Error executing previously staged node ${info.nodeName}:`, error);
            errors[node.id] = error instanceof Error ? error : new Error(String(error));
            if (context.onNodeError) {
              context.onNodeError(node.id, errors[node.id]);
            }
          }
        }
      }
    }
    
    if (iterations === MAX_ITERATIONS) {
      console.error('Reached maximum staged node processing iterations, likely due to a circular dependency');
    }
  }
}

/**
 * Execute a single node and its downstream nodes
 * 
 * IMPORTANT: This function handles execution dependencies in the following ways:
 * 1. Nodes with unsatisfied input dependencies are staged for later execution
 * 2. The visitedNodes set ensures that a node is only executed once
 * 3. Cycles are handled by tracking the visit path and detecting repeated nodes
 * 4. The execution follows a dependency-aware approach where nodes are only
 *    executed when their inputs are available
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

  // Check if all required inputs are available
  const inputsAvailable = areAllRequiredInputsAvailable(workflow, nodeName, context);
  
  if (!inputsAvailable) {
    // Stage this node for later execution when inputs are available
    const missingInputs = getMissingInputs(workflow, nodeName, context);
    
    // Only add to staged nodes if not already visited
    if (!context.visitedNodes.has(nodeName)) {
      context.stagedNodes.set(node.id, {
        nodeName,
        missingInputs,
        visitPath: [...visitPath, nodeName]
      });
      
      console.log(`Node ${nodeName} staged for later execution; missing inputs: ${missingInputs.join(', ')}`);
    }
    
    // Don't execute this node now, but continue with downstream nodes
    // (they will also get staged if they depend on this one)
  } else {
    // Mark node as visited
    context.visitedNodes.add(nodeName);
    visitPath.push(nodeName);

    // Notify of node start
    if (context.onNodeStart) {
      context.onNodeStart(node.id);
    }

    try {
      // Collect inputs for this node - they should all be available now
      const inputs = collectNodeInputs(workflow, nodeName, context);
      
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

  // Execute downstream nodes regardless - they'll be staged if their inputs aren't ready
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
}

/**
 * Get a list of missing input sources for a node
 */
function getMissingInputs(
  workflow: WorkflowGraph,
  nodeName: string,
  context: ExecutionContext
): string[] {
  const missingInputs: string[] = [];
  
  // Get all incoming connections to this node
  const incomingConnections = getIncomingConnections(workflow, nodeName);
  
  // Check which source nodes haven't been executed yet
  for (const connection of incomingConnections) {
    const sourceName = connection.source;
    const sourceOutputPort = connection.outputPort;
    
    // If the source node output is not in the state, it hasn't been executed yet
    if (!context.state[sourceName] || 
        context.state[sourceName][sourceOutputPort] === undefined) {
      missingInputs.push(`${sourceName}.${sourceOutputPort}`);
    }
  }
  
  return missingInputs;
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
  
  // If there are no incoming connections, all inputs are available by default
  if (incomingConnections.length === 0) {
    return true;
  }
  
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
