
import {
  WorkflowGraph,
  Node,
  NodeExecutor,
  ExecutionContext,
  NodeExecutionResult,
  ExecutionOptions,
  WorkflowExecutionResult,
} from '../types';
import { findStartNodes } from '../traversal';
import { processStagedNodes } from './staging';
import { defaultNodeExecutor, getNodeExecutor } from './node-executors';
import { areAllRequiredInputsAvailable, collectNodeInputs } from './inputs';

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
    stagedNodes: new Map<string, any>(), // Track nodes waiting for inputs
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
 * Execute a single node and its downstream nodes
 * 
 * IMPORTANT: This function handles execution dependencies in the following ways:
 * 1. Nodes with unsatisfied input dependencies are staged for later execution
 * 2. The visitedNodes set ensures that a node is only executed once
 * 3. Cycles are handled by tracking the visit path and detecting repeated nodes
 * 4. The execution follows a dependency-aware approach where nodes are only
 *    executed when their inputs are available
 */
export async function executeNode(
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
export function getMissingInputs(
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
 * Get all incoming connections to a node
 */
export function getIncomingConnections(
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
