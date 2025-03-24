
import { WorkflowGraph, NodeExecutionStatus, WorkflowNode } from '../types';
import { areAllRequiredInputsAvailable } from './inputs';
import { getIncomingConnections } from './dependencies';

// Define a type for the staged node information
export interface StagedNodeInfo {
  node: WorkflowNode;
  status: NodeExecutionStatus;
}

/**
 * Process workflow nodes to determine which can be executed next
 * @param workflow The workflow graph containing nodes and connections
 * @param executedNodes Map of node IDs to their execution status
 * @returns Array of nodes that are ready to be executed
 */
export function processStagedNodes(
  workflow: WorkflowGraph,
  executedNodes: Map<string, NodeExecutionStatus>
): StagedNodeInfo[] {
  const stagedNodes: StagedNodeInfo[] = [];
  const { nodes, connections } = workflow;

  for (const node of nodes) {
    // Skip nodes that have already been executed or are currently executing
    if (executedNodes.has(node.id)) {
      const status = executedNodes.get(node.id)!;
      if (status !== 'pending') {
        continue;
      }
    }

    // Get incoming connections for this node
    const incomingConnections = getIncomingConnections(node.id, connections);
    
    // Check if all required inputs have upstream nodes that completed successfully
    const allInputsAvailable = areAllRequiredInputsAvailable(
      node,
      incomingConnections,
      executedNodes
    );

    if (allInputsAvailable) {
      stagedNodes.push({
        node,
        status: 'pending',
      });
    }
  }

  return stagedNodes;
}
