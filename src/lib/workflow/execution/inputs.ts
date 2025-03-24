
import {
  WorkflowGraph,
  ExecutionContext
} from '../types';
import { getIncomingConnections } from './dependencies';

/**
 * Check if all required inputs for a node are available in the context state
 * This helps identify potential dependency issues where a node might be executed
 * before all its inputs are ready
 */
export function areAllRequiredInputsAvailable(
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
export function collectNodeInputs(
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
