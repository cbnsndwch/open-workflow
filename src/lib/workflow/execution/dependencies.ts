
import {
  WorkflowGraph,
  ExecutionContext
} from '../types';

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
