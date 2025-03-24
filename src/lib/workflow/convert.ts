
import { Node, Edge, MarkerType } from '@xyflow/react';
import { WorkflowGraph } from './types';
import { applyDagreLayout } from './layout';

/**
 * Convert a workflow model to React Flow nodes and edges
 */
export function workflowToReactFlow(workflow: WorkflowGraph): { nodes: Node[], edges: Edge[] } {
  if (!workflow) return { nodes: [], edges: [] };
  
  console.log("Starting workflow conversion with", workflow.nodes.length, "nodes");

  // Create nodes
  const flowNodes: Node[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: { x: 0, y: 0 }, // Initial positions will be calculated by layout
    data: {
      label: node.name,
      kind: node.kind,
      version: node.version,
      isTerminal: !Object.keys(workflow.edges).includes(node.name),
      onAddNode: (nodeId: string) => {}, // Will be overridden
      ...node,
    },
  }));

  // Apply layout
  const layoutNodes = applyDagreLayout(flowNodes, workflow);
  
  console.log("After layout applied:", layoutNodes.length, "nodes with positions");

  // Create edges from workflow connections
  const flowEdges: Edge[] = [];
  Object.entries(workflow.edges).forEach(([sourceName, connections]) => {
    const sourceNode = workflow.nodes.find(n => n.name === sourceName);
    if (!sourceNode) return;

    Object.entries(connections).forEach(([sourcePort, targets]) => {
      targets.forEach((target) => {
        const targetNode = workflow.nodes.find(n => n.name === target.node);
        if (!targetNode) return;

        // Create the edge with the proper type and style
        flowEdges.push({
          id: `${sourceNode.id}-${sourcePort}-${targetNode.id}-${target.port}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'custom',
          sourceHandle: sourcePort,
          targetHandle: target.port,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#b1b1b7',
          },
          style: { stroke: '#b1b1b7', strokeWidth: 2 },
          data: {
            label: `${sourcePort} → ${target.port}`,
          },
        });
      });
    });
  });

  console.log("Finished conversion:", layoutNodes.length, "nodes,", flowEdges.length, "edges");
  return { nodes: layoutNodes, edges: flowEdges };
}

/**
 * Update a workflow object based on a new connection
 */
export function updateWorkflowWithConnection(
  workflow: WorkflowGraph,
  sourceId: string,
  targetId: string,
  sourceHandle: string,
  targetHandle: string
): WorkflowGraph {
  // Find the source and target nodes
  const sourceNode = workflow.nodes.find(n => n.id === sourceId);
  const targetNode = workflow.nodes.find(n => n.id === targetId);
  
  if (sourceNode && targetNode && sourceHandle && targetHandle) {
    const newEdges = { ...workflow.edges };
    
    // Initialize connections for the source node if they don't exist
    if (!newEdges[sourceNode.name]) {
      newEdges[sourceNode.name] = {};
    }
    
    // Initialize connections for the specific port if they don't exist
    if (!newEdges[sourceNode.name][sourceHandle]) {
      newEdges[sourceNode.name][sourceHandle] = [];
    }
    
    // Add the new connection
    newEdges[sourceNode.name][sourceHandle].push({
      node: targetNode.name,
      port: targetHandle,
      order: newEdges[sourceNode.name][sourceHandle].length
    });
    
    return {
      ...workflow,
      edges: newEdges
    };
  }
  
  return workflow;
}
