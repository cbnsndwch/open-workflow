import { WorkflowGraph } from '../types';
import { findStartNodes } from './node-finders';

/**
 * Options for graph traversal
 */
export interface TraversalOptions {
  startNodeName?: string;
  visitedNodes?: Set<string>;
  maxDepth?: number;
  handleCycles?: boolean;
}

/**
 * Visitor function for traverseWorkflow
 */
export type NodeVisitor = (
  nodeName: string,
  depth: number,
  path: string[]
) => boolean | void;

/**
 * Traverse the workflow graph starting from a given node
 */
export function traverseWorkflow(
  workflow: WorkflowGraph,
  visitor: NodeVisitor,
  options: TraversalOptions = {}
): void {
  const {
    startNodeName,
    maxDepth = Infinity,
    handleCycles = true,
  } = options;
  
  const visitedNodes = options.visitedNodes || new Set<string>();
  const nodeNameMap: Record<string, string> = {};
  
  // Build a map of node id to node name for easier lookup
  workflow.nodes.forEach(node => {
    nodeNameMap[node.id] = node.name;
  });
  
  const startNodes = startNodeName
    ? [startNodeName]
    : findStartNodes(workflow);
  
  function traverse(
    nodeName: string,
    depth: number = 0,
    path: string[] = []
  ) {
    // Stop if we've reached max depth
    if (depth > maxDepth) {
      return;
    }
    
    // Handle cycles
    if (path.includes(nodeName)) {
      if (handleCycles) {
        // Skip this node to prevent infinite recursion
        return;
      }
      // Otherwise, continue traversal even in cycles
    }
    
    // Add current node to path
    const currentPath = [...path, nodeName];
    
    // Visit the node, and stop traversal if visitor returns false
    const shouldContinue = visitor(nodeName, depth, currentPath);
    if (shouldContinue === false) {
      return;
    }
    
    // Mark as visited
    visitedNodes.add(nodeName);
    
    // Get all outgoing connections from this node
    const nodeConnections = workflow.edges[nodeName] || {};
    
    // For each output port
    for (const outputPort of Object.keys(nodeConnections)) {
      const connections = nodeConnections[outputPort];
      
      // Sort connections by order
      const sortedConnections = [...connections].sort((a, b) => a.order - b.order);
      
      // Visit each connected node
      for (const connection of sortedConnections) {
        traverse(connection.node, depth + 1, currentPath);
      }
    }
  }
  
  // Start traversal from all start nodes
  for (const nodeName of startNodes) {
    traverse(nodeName);
  }
}

/**
 * Get all nodes reachable from the given start node
 */
export function getReachableNodes(
  workflow: WorkflowGraph,
  startNodeName?: string
): Set<string> {
  const reachableNodes = new Set<string>();
  
  traverseWorkflow(
    workflow,
    (nodeName) => {
      reachableNodes.add(nodeName);
    },
    { startNodeName }
  );
  
  return reachableNodes;
}
