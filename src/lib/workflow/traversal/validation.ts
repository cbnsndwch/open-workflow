
import { WorkflowGraph } from '../types';
import { findStartNodes } from '../validator/node-finders';

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
