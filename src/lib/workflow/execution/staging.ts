
import { WorkflowGraph } from '../types';
import { NodeExecutionStatus, WorkflowNode } from './types';
import { findNode } from '../traversal';

/**
 * Creates an initial execution state for nodes in a workflow.
 * Sets all nodes to 'pending' status with empty outputs.
 */
export function createInitialNodeExecutionState(
  workflow: WorkflowGraph
): Record<string, NodeExecutionStatus> {
  const nodeStates: Record<string, NodeExecutionStatus> = {};

  for (const node of workflow.nodes) {
    nodeStates[node.id] = {
      status: 'pending',
      outputs: {},
    };
  }

  return nodeStates;
}

/**
 * Checks if a node is ready to be executed by ensuring all its dependencies
 * have completed execution.
 */
export function isNodeReady(
  nodeId: string,
  workflow: WorkflowGraph,
  nodeStates: Record<string, NodeExecutionStatus>
): boolean {
  const node = findNode(workflow, nodeId);
  
  if (!node) {
    return false;
  }

  // A node with no incoming edges is always ready
  const incomingEdges = workflow.edges.filter(edge => edge.target === nodeId);
  if (incomingEdges.length === 0) {
    return true;
  }

  // Check that all dependencies are complete
  for (const edge of incomingEdges) {
    const sourceNodeState = nodeStates[edge.source];
    if (!sourceNodeState || sourceNodeState.status !== 'completed') {
      return false;
    }
  }

  return true;
}
