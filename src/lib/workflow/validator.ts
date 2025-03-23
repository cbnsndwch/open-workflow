
import { WorkflowGraph, ValidationResult, ValidationError, Node } from './types';

/**
 * Validates a workflow graph
 */
export function validateWorkflow(workflow: WorkflowGraph): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check if workflow has nodes
  if (!workflow.nodes || !Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
    errors.push({
      message: 'Workflow must have at least one node',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Check if workflow has edges
  if (!workflow.edges || typeof workflow.edges !== 'object') {
    errors.push({
      message: 'Workflow must have an edges object',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  const nodeNames = new Set<string>();
  const nodeMap: Record<string, Node> = {};

  workflow.nodes.forEach((node) => {
    // Check for required node properties
    if (!node.id) {
      errors.push({
        message: `Node is missing required property 'id'`,
        nodeId: node.id,
        severity: 'error',
      });
    }

    if (!node.name) {
      errors.push({
        message: `Node is missing required property 'name'`,
        nodeId: node.id,
        severity: 'error',
      });
    }

    if (!node.kind) {
      errors.push({
        message: `Node is missing required property 'kind'`,
        nodeId: node.id,
        severity: 'error',
      });
    }

    if (!node.version) {
      errors.push({
        message: `Node is missing required property 'version'`,
        nodeId: node.id,
        severity: 'error',
      });
    }

    // Check for duplicate IDs
    if (nodeIds.has(node.id)) {
      errors.push({
        message: `Duplicate node ID: ${node.id}`,
        nodeId: node.id,
        severity: 'error',
      });
    } else {
      nodeIds.add(node.id);
    }

    // Check for duplicate names
    if (nodeNames.has(node.name)) {
      errors.push({
        message: `Duplicate node name: ${node.name}`,
        nodeId: node.id,
        severity: 'error',
      });
    } else {
      nodeNames.add(node.name);
      nodeMap[node.name] = node;
    }
  });

  // Validate edges
  for (const [sourceName, connections] of Object.entries(workflow.edges)) {
    // Check if source node exists
    if (!nodeMap[sourceName]) {
      errors.push({
        message: `Edge refers to non-existent source node: ${sourceName}`,
        severity: 'error',
      });
      continue;
    }

    // Check each port and its connections
    for (const [outputPort, nodeConnections] of Object.entries(connections)) {
      if (!Array.isArray(nodeConnections)) {
        errors.push({
          message: `Port connections for ${sourceName}.${outputPort} must be an array`,
          nodeId: nodeMap[sourceName]?.id,
          severity: 'error',
        });
        continue;
      }

      // Check each node connection
      nodeConnections.forEach((connection, index) => {
        if (!connection.node) {
          errors.push({
            message: `Connection from ${sourceName}.${outputPort} is missing 'node' property`,
            nodeId: nodeMap[sourceName]?.id,
            severity: 'error',
          });
        } else if (!nodeMap[connection.node]) {
          errors.push({
            message: `Connection from ${sourceName}.${outputPort} refers to non-existent target node: ${connection.node}`,
            nodeId: nodeMap[sourceName]?.id,
            severity: 'error',
          });
        }

        if (!connection.port) {
          errors.push({
            message: `Connection from ${sourceName}.${outputPort} is missing 'port' property`,
            nodeId: nodeMap[sourceName]?.id,
            severity: 'error',
          });
        }

        if (typeof connection.order !== 'number') {
          errors.push({
            message: `Connection from ${sourceName}.${outputPort} is missing 'order' property or it's not a number`,
            nodeId: nodeMap[sourceName]?.id,
            severity: 'error',
          });
        }
      });

      // Check for duplicate order values
      const orders = nodeConnections.map(conn => conn.order);
      const uniqueOrders = new Set(orders);
      if (uniqueOrders.size !== orders.length) {
        warnings.push({
          message: `Output port ${sourceName}.${outputPort} has duplicate order values, which may cause unexpected behavior`,
          nodeId: nodeMap[sourceName]?.id,
          severity: 'warning',
        });
      }
    }
  }

  // Check for cycles - Warning rather than error since cycles are allowed but can cause issues
  const cycles = detectCycles(workflow);
  if (cycles.length > 0) {
    warnings.push({
      message: `Workflow contains cycles: ${cycles.map(cycle => cycle.join(' -> ')).join(', ')}`,
      severity: 'warning',
    });
  }

  // Check for orphaned nodes (nodes not connected to the graph)
  const reachableNodes = findReachableNodes(workflow);
  const orphanedNodes = workflow.nodes.filter(node => !reachableNodes.has(node.name));
  if (orphanedNodes.length > 0) {
    warnings.push({
      message: `Workflow contains orphaned nodes: ${orphanedNodes.map(n => n.name).join(', ')}`,
      severity: 'warning',
    });
  }

  // Check for undefined edges referencing nodes that don't exist
  for (const sourceName of Object.keys(workflow.edges)) {
    if (!nodeMap[sourceName]) {
      errors.push({
        message: `Edge refers to non-existent source node: ${sourceName}`,
        severity: 'error',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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

/**
 * Finds all nodes reachable from any start node
 */
export function findReachableNodes(workflow: WorkflowGraph): Set<string> {
  const reachable = new Set<string>();
  const startNodes = findStartNodes(workflow);
  
  function dfs(nodeName: string) {
    if (reachable.has(nodeName)) {
      return;
    }
    
    reachable.add(nodeName);
    
    const connections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(connections)) {
      for (const connection of connections[outputPort]) {
        dfs(connection.node);
      }
    }
  }
  
  // Start DFS from each start node
  for (const startNode of startNodes) {
    dfs(startNode);
  }
  
  return reachable;
}

/**
 * Finds all start nodes in the workflow graph
 */
export function findStartNodes(workflow: WorkflowGraph): string[] {
  // Create a set of all nodes that have incoming edges
  const nodesWithIncomingEdges = new Set<string>();
  
  for (const sourceName of Object.keys(workflow.edges)) {
    const connections = workflow.edges[sourceName];
    for (const outputPort of Object.keys(connections)) {
      for (const connection of connections[outputPort]) {
        nodesWithIncomingEdges.add(connection.node);
      }
    }
  }
  
  // Start nodes are those that don't have incoming edges
  return workflow.nodes
    .filter(node => !nodesWithIncomingEdges.has(node.name))
    .map(node => node.name);
}

/**
 * Finds all terminal nodes in the workflow graph
 */
export function findTerminalNodes(workflow: WorkflowGraph): string[] {
  // Terminal nodes are those that don't have outgoing edges
  return workflow.nodes
    .filter(node => !workflow.edges[node.name] || Object.keys(workflow.edges[node.name]).length === 0)
    .map(node => node.name);
}
