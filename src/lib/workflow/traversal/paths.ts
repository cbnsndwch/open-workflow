
import { WorkflowGraph } from '../types';
import { findStartNodes } from './node-finders';

/**
 * Get all paths from start nodes to terminal nodes
 */
export function getAllPaths(
  workflow: WorkflowGraph,
  startNodeName?: string
): string[][] {
  const paths: string[][] = [];
  const startNodes = startNodeName
    ? [startNodeName]
    : findStartNodes(workflow);
  
  // For each start node
  for (const nodeName of startNodes) {
    findPaths(workflow, nodeName, [], paths);
  }
  
  return paths;
}

/**
 * Helper function to find all paths in the graph
 */
export function findPaths(
  workflow: WorkflowGraph,
  nodeName: string,
  currentPath: string[],
  allPaths: string[][]
): void {
  // Detect cycles
  if (currentPath.includes(nodeName)) {
    // Don't traverse cycles
    return;
  }
  
  const newPath = [...currentPath, nodeName];
  
  // Check if this is a terminal node
  const nodeConnections = workflow.edges[nodeName] || {};
  if (Object.keys(nodeConnections).length === 0) {
    allPaths.push(newPath);
    return;
  }
  
  // Continue traversal
  for (const outputPort of Object.keys(nodeConnections)) {
    const connections = nodeConnections[outputPort];
    
    // Sort connections by order
    const sortedConnections = [...connections].sort((a, b) => a.order - b.order);
    
    for (const connection of sortedConnections) {
      findPaths(workflow, connection.node, newPath, allPaths);
    }
  }
}
