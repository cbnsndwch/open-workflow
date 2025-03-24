
import { WorkflowGraph, NodeConnection } from '../types';

/**
 * Get incoming connections to a node
 */
export function getIncomingConnections(
  workflow: WorkflowGraph,
  nodeName: string
): { source: string; outputPort: string; connection: NodeConnection }[] {
  const incoming: { source: string; outputPort: string; connection: NodeConnection }[] = [];
  
  for (const sourceName of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceName];
    for (const outputPort of Object.keys(outputPorts)) {
      const connections = outputPorts[outputPort];
      for (const connection of connections) {
        if (connection.node === nodeName) {
          incoming.push({
            source: sourceName,
            outputPort,
            connection,
          });
        }
      }
    }
  }
  
  return incoming;
}

/**
 * Get outgoing connections from a node
 */
export function getOutgoingConnections(
  workflow: WorkflowGraph,
  nodeName: string
): { outputPort: string; connections: NodeConnection[] }[] {
  const nodeConnections = workflow.edges[nodeName] || {};
  const outgoing: { outputPort: string; connections: NodeConnection[] }[] = [];
  
  for (const outputPort of Object.keys(nodeConnections)) {
    outgoing.push({
      outputPort,
      connections: nodeConnections[outputPort],
    });
  }
  
  return outgoing;
}
