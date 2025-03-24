
import { WorkflowGraph, Node } from '../types';
import { NodeExecutionStatus } from './types';
import { getIncomingConnections } from './dependencies';

/**
 * Check if all required inputs for a node are available in the context state
 */
export function areAllRequiredInputsAvailable(
  workflow: WorkflowGraph,
  nodeName: string,
  nodeStates: Record<string, NodeExecutionStatus>
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
    if (!nodeStates[sourceName] || 
        nodeStates[sourceName].status !== 'completed' ||
        nodeStates[sourceName].outputs[sourceOutputPort] === undefined) {
      return false;
    }
  }
  
  return true;
}

/**
 * Collect inputs for a node from its upstream nodes
 */
export function collectNodeInputs(
  node: Node,
  workflow: WorkflowGraph,
  nodeStates: Record<string, NodeExecutionStatus>
): Record<string, any> {
  const inputs: Record<string, any> = {};
  
  // Find all incoming connections to this node
  for (const sourceId of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceId];
    for (const outputPort of Object.keys(outputPorts)) {
      const connections = outputPorts[outputPort];
      for (const connection of connections) {
        if (connection.node === node.id) {
          // Get the source node's output
          const sourceNodeState = nodeStates[sourceId];
          if (sourceNodeState && sourceNodeState.status === 'completed') {
            const sourceOutput = sourceNodeState.outputs[outputPort];
            
            // Add to inputs under the target port name
            inputs[connection.port] = sourceOutput;
          }
        }
      }
    }
  }
  
  return inputs;
}
