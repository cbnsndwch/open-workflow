
import { WorkflowGraph } from '../types';

/**
 * Detects cycles in the workflow graph
 * @returns Array of cycles, where each cycle is an array of node names
 */
export function detectCycles(workflow: WorkflowGraph): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const stack = new Set<string>();
  
  function dfs(nodeName: string, path: string[] = []) {
    if (stack.has(nodeName)) {
      // Found a cycle
      const cycleStart = path.indexOf(nodeName);
      cycles.push(path.slice(cycleStart).concat(nodeName));
      return;
    }
    
    if (visited.has(nodeName)) {
      return;
    }
    
    visited.add(nodeName);
    stack.add(nodeName);
    path.push(nodeName);
    
    const connections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(connections)) {
      for (const connection of connections[outputPort]) {
        dfs(connection.node, [...path]);
      }
    }
    
    stack.delete(nodeName);
  }
  
  // Start DFS from each node to find cycles
  for (const node of workflow.nodes) {
    if (!visited.has(node.name)) {
      dfs(node.name);
    }
  }
  
  return cycles;
}
