
import { WorkflowGraph } from '../types';

/**
 * Find all start nodes in the workflow
 */
export function findStartNodes(workflow: WorkflowGraph): string[] {
  const nodesWithIncomingEdges = new Set<string>();
  
  // Find all nodes that have incoming edges
  for (const sourceName of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceName];
    for (const outputPort of Object.keys(outputPorts)) {
      const connections = outputPorts[outputPort];
      for (const connection of connections) {
        nodesWithIncomingEdges.add(connection.node);
      }
    }
  }
  
  // Start nodes are those without incoming edges
  return workflow.nodes
    .filter(node => !nodesWithIncomingEdges.has(node.name))
    .map(node => node.name);
}

/**
 * Find all terminal nodes in the workflow (nodes with no outgoing edges)
 */
export function findTerminalNodes(workflow: WorkflowGraph): string[] {
  return workflow.nodes
    .filter(node => {
      const edges = workflow.edges[node.name];
      return !edges || Object.keys(edges).length === 0;
    })
    .map(node => node.name);
}
