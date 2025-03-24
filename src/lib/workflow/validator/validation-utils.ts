import { WorkflowGraph, ValidationError, Node } from '../types';
import { detectCycles } from './cycle-detection';
import { findReachableNodes, findStartNodes } from './node-finders';

/**
 * Validates a workflow graph
 */
export function validateWorkflow(workflow: WorkflowGraph) {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check if workflow has nodes
    if (
        !workflow.nodes ||
        !Array.isArray(workflow.nodes) ||
        workflow.nodes.length === 0
    ) {
        errors.push({
            message: 'Workflow must have at least one node',
            severity: 'error'
        });
        return { valid: false, errors, warnings };
    }

    // Check if workflow has edges
    if (!workflow.edges || typeof workflow.edges !== 'object') {
        errors.push({
            message: 'Workflow must have an edges object',
            severity: 'error'
        });
        return { valid: false, errors, warnings };
    }

    validateNodes(workflow, errors);
    validateEdges(workflow, errors, warnings);

    // Check for cycles - Warning rather than error since cycles are allowed but can cause issues
    const cycles = detectCycles(workflow);
    if (cycles.length > 0) {
        warnings.push({
            message: `Workflow contains cycles: ${cycles.map(cycle => cycle.join(' -> ')).join(', ')}`,
            severity: 'warning'
        });
    }

    // Check for orphaned nodes (nodes not connected to the graph)
    const reachableNodes = findReachableNodes(workflow);
    const orphanedNodes = workflow.nodes.filter(
        node => !reachableNodes.has(node.name)
    );
    if (orphanedNodes.length > 0) {
        warnings.push({
            message: `Workflow contains orphaned nodes: ${orphanedNodes.map(n => n.name).join(', ')}`,
            severity: 'warning'
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates workflow nodes
 */
function validateNodes(workflow: WorkflowGraph, errors: ValidationError[]) {
    const nodeIds = new Set<string>();
    const nodeNames = new Set<string>();

    workflow.nodes.forEach(node => {
        // Check for required node properties
        if (!node.id) {
            errors.push({
                message: `Node is missing required property 'id'`,
                nodeId: node.id,
                severity: 'error'
            });
        }

        if (!node.name) {
            errors.push({
                message: `Node is missing required property 'name'`,
                nodeId: node.id,
                severity: 'error'
            });
        }

        if (!node.kind) {
            errors.push({
                message: `Node is missing required property 'kind'`,
                nodeId: node.id,
                severity: 'error'
            });
        }

        if (!node.version) {
            errors.push({
                message: `Node is missing required property 'version'`,
                nodeId: node.id,
                severity: 'error'
            });
        }

        // Check for duplicate IDs
        if (nodeIds.has(node.id)) {
            errors.push({
                message: `Duplicate node ID: ${node.id}`,
                nodeId: node.id,
                severity: 'error'
            });
        } else {
            nodeIds.add(node.id);
        }

        // Check for duplicate names
        if (nodeNames.has(node.name)) {
            errors.push({
                message: `Duplicate node name: ${node.name}`,
                nodeId: node.id,
                severity: 'error'
            });
        } else {
            nodeNames.add(node.name);
        }
    });

    return { nodeIds, nodeNames };
}

/**
 * Validates workflow edges
 */
function validateEdges(
    workflow: WorkflowGraph,
    errors: ValidationError[],
    warnings: ValidationError[]
) {
    // Create node map for quick lookup
    const nodeMap: Record<string, Node> = {};
    workflow.nodes.forEach(node => {
        nodeMap[node.name] = node;
    });

    // Validate edges
    for (const [sourceName, connections] of Object.entries(workflow.edges)) {
        // Check if source node exists
        if (!nodeMap[sourceName]) {
            errors.push({
                message: `Edge refers to non-existent source node: ${sourceName}`,
                severity: 'error'
            });
            continue;
        }

        // Check each port and its connections
        for (const [outputPort, nodeConnections] of Object.entries(
            connections
        )) {
            if (!Array.isArray(nodeConnections)) {
                errors.push({
                    message: `Port connections for ${sourceName}.${outputPort} must be an array`,
                    nodeId: nodeMap[sourceName]?.id,
                    severity: 'error'
                });
                continue;
            }

            // Check each node connection
            nodeConnections.forEach(connection => {
                if (!connection.node) {
                    errors.push({
                        message: `Connection from ${sourceName}.${outputPort} is missing 'node' property`,
                        nodeId: nodeMap[sourceName]?.id,
                        severity: 'error'
                    });
                } else if (!nodeMap[connection.node]) {
                    errors.push({
                        message: `Connection from ${sourceName}.${outputPort} refers to non-existent target node: ${connection.node}`,
                        nodeId: nodeMap[sourceName]?.id,
                        severity: 'error'
                    });
                }

                if (!connection.port) {
                    errors.push({
                        message: `Connection from ${sourceName}.${outputPort} is missing 'port' property`,
                        nodeId: nodeMap[sourceName]?.id,
                        severity: 'error'
                    });
                }

                if (typeof connection.order !== 'number') {
                    errors.push({
                        message: `Connection from ${sourceName}.${outputPort} is missing 'order' property or it's not a number`,
                        nodeId: nodeMap[sourceName]?.id,
                        severity: 'error'
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
                    severity: 'warning'
                });
            }
        }
    }
}
