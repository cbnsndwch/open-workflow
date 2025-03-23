
import { WorkflowGraph } from '../types';
import { findStartNodes, findTerminalNodes } from '../traversal';
import { LayoutResult, PositionedNode, PositionedEdge, VisualizationOptions } from './types';

/**
 * Assign levels to nodes in the workflow
 */
function assignLevels(workflow: WorkflowGraph): Record<string, number> {
  const nodeLevels: Record<string, number> = {};
  const visited = new Set<string>();
  
  function visit(nodeName: string, level: number = 0) {
    if (visited.has(nodeName)) {
      // If we've already visited this node, only update its level if the new level is higher
      nodeLevels[nodeName] = Math.max(nodeLevels[nodeName] || 0, level);
      return;
    }
    
    visited.add(nodeName);
    nodeLevels[nodeName] = level;
    
    const nodeConnections = workflow.edges[nodeName] || {};
    for (const outputPort of Object.keys(nodeConnections)) {
      for (const connection of nodeConnections[outputPort]) {
        visit(connection.node, level + 1);
      }
    }
  }
  
  // Start with all nodes that have no incoming edges
  const startNodes = findStartNodes(workflow);
  for (const nodeName of startNodes) {
    visit(nodeName, 0);
  }
  
  // Handle any disconnected nodes (just in case)
  for (const node of workflow.nodes) {
    if (!visited.has(node.name)) {
      visit(node.name, 0);
    }
  }
  
  return nodeLevels;
}

/**
 * Calculate layout for workflow visualization
 */
export function calculateLayout(
  workflow: WorkflowGraph,
  options: VisualizationOptions = {}
): LayoutResult {
  const {
    nodeWidth = 150,
    nodeHeight = 80,
    nodePadding = 40,
    levelSpacing = 180,
  } = options;
  
  // Find start and terminal nodes
  const startNodeNames = findStartNodes(workflow);
  const terminalNodeNames = findTerminalNodes(workflow);
  
  // Assign levels to nodes (topological sort)
  const nodeLevels = assignLevels(workflow);
  
  // Group nodes by level
  const nodesPerLevel: Record<number, typeof workflow.nodes> = {};
  for (const [nodeName, level] of Object.entries(nodeLevels)) {
    const node = workflow.nodes.find(n => n.name === nodeName);
    if (node) {
      if (!nodesPerLevel[level]) {
        nodesPerLevel[level] = [];
      }
      nodesPerLevel[level].push(node);
    }
  }
  
  // Determine layout dimensions
  const levels = Object.keys(nodesPerLevel).map(Number);
  const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
  
  // Calculate node positions - vertical layout (top to bottom)
  const positionedNodes: PositionedNode[] = [];
  const nodePositions: Record<string, { x: number; y: number }> = {};
  
  for (const level of levels.sort((a, b) => a - b)) {
    const nodesInLevel = nodesPerLevel[level];
    const levelWidth = nodesInLevel.length * (nodeWidth + nodePadding) - nodePadding;
    const startX = -levelWidth / 2 + nodeWidth / 2;
    
    nodesInLevel.forEach((node, index) => {
      const x = startX + index * (nodeWidth + nodePadding);
      const y = level * levelSpacing;  // Position based on level (vertical layout)
      
      nodePositions[node.name] = { x, y };
      
      positionedNodes.push({
        ...node,
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        isStart: startNodeNames.includes(node.name),
        isTerminal: terminalNodeNames.includes(node.name),
        level,
      });
    });
  }
  
  // Calculate edge paths (now for vertical flow)
  const positionedEdges: PositionedEdge[] = [];
  let edgeId = 0;
  
  for (const sourceName of Object.keys(workflow.edges)) {
    const outputPorts = workflow.edges[sourceName];
    const sourceNode = positionedNodes.find(n => n.name === sourceName);
    
    if (!sourceNode) continue;
    
    for (const outputPort of Object.keys(outputPorts)) {
      const connections = outputPorts[outputPort];
      
      connections.forEach(connection => {
        const targetNodeName = connection.node;
        const targetPort = connection.port;
        const targetNode = positionedNodes.find(n => n.name === targetNodeName);
        
        if (!targetNode) return;
        
        // Calculate edge path - updated for vertical flow
        const sourceX = sourceNode.x;
        const sourceY = sourceNode.y + sourceNode.height / 2; // Bottom of source
        const targetX = targetNode.x;
        const targetY = targetNode.y - targetNode.height / 2; // Top of target
        
        // Use a bezier curve for the edge
        const controlPointY = (sourceY + targetY) / 2;
        
        const controlPoints = [
          { x: sourceX, y: sourceY },
          { x: sourceX, y: controlPointY },
          { x: targetX, y: controlPointY },
          { x: targetX, y: targetY },
        ];
        
        // Create SVG path
        const path = `M ${sourceX} ${sourceY} C ${sourceX} ${controlPointY}, ${targetX} ${controlPointY}, ${targetX} ${targetY}`;
        
        positionedEdges.push({
          id: `edge-${edgeId++}`,
          source: sourceNode.id,
          sourcePort: outputPort,
          target: targetNode.id,
          targetPort,
          sourceNodeName: sourceName,
          targetNodeName,
          controlPoints,
          path,
          order: connection.order,
        });
      });
    }
  }
  
  // Calculate total width and height
  const nodesPerLevelCount = Object.values(nodesPerLevel).map(nodes => nodes.length);
  const maxNodesPerLevel = Math.max(...nodesPerLevelCount, 1);
  const width = maxNodesPerLevel * (nodeWidth + nodePadding) - nodePadding + 80;
  const height = (maxLevel + 1) * levelSpacing + 80;
  
  return {
    nodes: positionedNodes,
    edges: positionedEdges,
    width,
    height,
  };
}
