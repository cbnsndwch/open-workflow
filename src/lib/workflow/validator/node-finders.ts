import { WorkflowGraph, Node } from '../types';

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
        .filter(
            node =>
                !workflow.edges[node.name] ||
                Object.keys(workflow.edges[node.name]).length === 0
        )
        .map(node => node.name);
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
