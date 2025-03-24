import { WorkflowGraph, Node } from '../types';
import { NodeExecutionStatus, StagedNodeInfo } from './types';

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
            outputs: {}
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
    const node = workflow.nodes.find(n => n.id === nodeId);

    if (!node) {
        return false;
    }

    // A node with no incoming edges is always ready
    const incomingEdges = Object.keys(workflow.edges).filter(sourceId => {
        const sourceEdges = workflow.edges[sourceId];
        return Object.keys(sourceEdges).some(outputPort => {
            return sourceEdges[outputPort].some(conn => conn.node === nodeId);
        });
    });

    if (incomingEdges.length === 0) {
        return true;
    }

    // Check that all dependencies are complete
    for (const sourceId of incomingEdges) {
        const sourceNodeState = nodeStates[sourceId];
        if (!sourceNodeState || sourceNodeState.status !== 'completed') {
            return false;
        }
    }

    return true;
}

/**
 * Process nodes that are staged for execution.
 * This is a placeholder function that would be implemented with actual logic.
 */
export function processStagedNodes(
    stagedNodes: StagedNodeInfo[],
    workflow: WorkflowGraph,
    nodeStates: Record<string, NodeExecutionStatus>
): void {
    // Implementation would go here
}
