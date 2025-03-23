
import { Node } from '@xyflow/react';
import { WorkflowGraph } from './types';

export const applyDagreLayout = (nodes: Node[], workflow: WorkflowGraph) => {
  // For simplicity, we'll use a structured tree layout
  const levelMap = new Map<string, number>();
  const horizontalSpacing = 200;
  const verticalSpacing = 250; // Increased vertical spacing for better visibility of edges
  
  // Determine node levels (depth in the graph)
  const calculateLevels = (nodeId: string, level: number, visited = new Set<string>()) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const currentLevel = levelMap.get(nodeId) || 0;
    levelMap.set(nodeId, Math.max(currentLevel, level));
    
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const outgoingConnections = workflow.edges[node.name];
    if (!outgoingConnections) return;
    
    Object.values(outgoingConnections).forEach(targets => {
      targets.forEach(target => {
        const targetNode = workflow.nodes.find(n => n.name === target.node);
        if (targetNode) {
          calculateLevels(targetNode.id, level + 1, new Set(visited));
        }
      });
    });
  };
  
  // Find start nodes (nodes with no incoming connections)
  const nodeIncomingEdges = new Map<string, number>();
  for (const sourceNodeName in workflow.edges) {
    for (const sourcePort in workflow.edges[sourceNodeName]) {
      for (const target of workflow.edges[sourceNodeName][sourcePort]) {
        const targetNode = workflow.nodes.find(n => n.name === target.node);
        if (targetNode) {
          nodeIncomingEdges.set(targetNode.id, (nodeIncomingEdges.get(targetNode.id) || 0) + 1);
        }
      }
    }
  }
  
  const startNodeIds = workflow.nodes
    .filter(node => !nodeIncomingEdges.has(node.id))
    .map(node => node.id);
  
  // Calculate levels starting from root nodes
  startNodeIds.forEach(nodeId => calculateLevels(nodeId, 0));
  
  // Group nodes by level
  const nodesByLevel = new Map<number, string[]>();
  levelMap.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)?.push(nodeId);
  });
  
  // Position nodes by level - vertical layout (top to bottom)
  return nodes.map(node => {
    const level = levelMap.get(node.id) || 0;
    const nodesInLevel = nodesByLevel.get(level) || [];
    const indexInLevel = nodesInLevel.indexOf(node.id);
    
    // Calculate vertical position (y-axis is now the primary direction)
    const y = level * verticalSpacing;
    
    // Calculate horizontal position
    const totalLevelWidth = nodesInLevel.length * horizontalSpacing;
    const startX = -totalLevelWidth / 2 + horizontalSpacing / 2;
    const x = startX + indexInLevel * horizontalSpacing;
    
    return {
      ...node,
      position: { x, y },
    };
  });
};
