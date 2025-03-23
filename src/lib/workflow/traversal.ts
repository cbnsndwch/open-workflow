import { WorkflowGraph, NodeConnection } from './types';

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
function findPaths(
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

/**
 * Detect cycles in the workflow graph
 */
export function detectCycles(workflow: WorkflowGraph): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function dfs(nodeName: string, path: string[] = []) {
    if (recursionStack.has(nodeName)) {
      const cycle = [...path.slice(path.indexOf(nodeName)), nodeName];
      cycles.push(cycle);
      return;
    }
    
    if (visited.has(nodeName)) {
      return;
    }
    
    visited.add(nodeName);
    recursionStack.add(nodeName);
    path.push(nodeName);
    
    const nodeConnections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(nodeConnections)) {
      for (const connection of nodeConnections[outputPort]) {
        dfs(connection.node, [...path]);
      }
    }
    
    recursionStack.delete(nodeName);
  }
  
  // Start DFS from each node
  for (const node of workflow.nodes) {
    if (!visited.has(node.name)) {
      dfs(node.name);
    }
  }
  
  return cycles;
}

/**
 * Topologically sort the nodes in the workflow
 * (This will fail if the graph has cycles)
 */
export function topologicalSort(workflow: WorkflowGraph): string[] {
  const sorted: string[] = [];
  const visited = new Set<string>();
  const temp = new Set<string>();
  
  function visit(nodeName: string) {
    if (temp.has(nodeName)) {
      throw new Error(`Graph has cycles, cannot perform topological sort`);
    }
    
    if (visited.has(nodeName)) {
      return;
    }
    
    temp.add(nodeName);
    
    const nodeConnections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(nodeConnections)) {
      for (const connection of nodeConnections[outputPort]) {
        visit(connection.node);
      }
    }
    
    temp.delete(nodeName);
    visited.add(nodeName);
    sorted.unshift(nodeName);
  }
  
  // Start with all nodes that have no incoming edges
  const startNodes = findStartNodes(workflow);
  for (const nodeName of startNodes) {
    if (!visited.has(nodeName)) {
      visit(nodeName);
    }
  }
  
  // If not all nodes were visited, visit the remaining (for disconnected subgraphs)
  for (const node of workflow.nodes) {
    if (!visited.has(node.name)) {
      visit(node.name);
    }
  }
  
  return sorted;
}
