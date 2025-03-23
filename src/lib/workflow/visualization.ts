
import { WorkflowGraph, Node } from './types';
import { findStartNodes, findTerminalNodes } from './traversal';

/**
 * Options for visualizing a workflow
 */
export interface VisualizationOptions {
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  nodePadding?: number;
  levelHeight?: number;
}

/**
 * A node with its calculated position for visualization
 */
export interface PositionedNode extends Node {
  x: number;
  y: number;
  width: number;
  height: number;
  isStart: boolean;
  isTerminal: boolean;
  level: number;
}

/**
 * An edge with its calculated points for visualization
 */
export interface PositionedEdge {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  sourceNodeName: string;
  targetNodeName: string;
  controlPoints: { x: number; y: number }[];
  path: string;
  order: number;
}

/**
 * Layout result for visualization
 */
export interface LayoutResult {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  width: number;
  height: number;
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
    levelHeight = 180,
  } = options;
  
  // Find start and terminal nodes
  const startNodeNames = findStartNodes(workflow);
  const terminalNodeNames = findTerminalNodes(workflow);
  
  // Assign levels to nodes (topological sort)
  const nodeLevels = assignLevels(workflow);
  
  // Group nodes by level
  const nodesPerLevel: Record<number, Node[]> = {};
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
  
  // Calculate node positions
  const positionedNodes: PositionedNode[] = [];
  const nodePositions: Record<string, { x: number; y: number }> = {};
  
  for (const level of levels.sort((a, b) => a - b)) {
    const nodesInLevel = nodesPerLevel[level];
    const levelWidth = nodesInLevel.length * (nodeWidth + nodePadding) - nodePadding;
    const startX = -levelWidth / 2 + nodeWidth / 2;
    
    nodesInLevel.forEach((node, index) => {
      const x = startX + index * (nodeWidth + nodePadding);
      const y = level * levelHeight;
      
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
  
  // Calculate edge paths
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
        
        // Calculate edge path
        const sourceX = sourceNode.x;
        const sourceY = sourceNode.y + sourceNode.height / 2;
        const targetX = targetNode.x;
        const targetY = targetNode.y - targetNode.height / 2;
        
        // Use a bezier curve for the edge
        const sourceBottom = sourceY;
        const targetTop = targetY;
        const controlPointY = (sourceBottom + targetTop) / 2;
        
        const controlPoints = [
          { x: sourceX, y: sourceBottom },
          { x: sourceX, y: controlPointY },
          { x: targetX, y: controlPointY },
          { x: targetX, y: targetTop },
        ];
        
        // Create SVG path
        const path = `M ${sourceX} ${sourceBottom} C ${sourceX} ${controlPointY}, ${targetX} ${controlPointY}, ${targetX} ${targetTop}`;
        
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
  const height = (maxLevel + 1) * levelHeight + 80;
  
  return {
    nodes: positionedNodes,
    edges: positionedEdges,
    width,
    height,
  };
}

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
 * Create an HTML representation of a workflow
 */
export function createHtmlRepresentation(workflow: WorkflowGraph): string {
  const layout = calculateLayout(workflow);
  
  // Create SVG content
  const svgContent = `
    <svg width="${layout.width}" height="${layout.height}" viewBox="${-layout.width/2} 0 ${layout.width} ${layout.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
        </marker>
      </defs>
      
      <g>
        ${layout.edges.map(edge => `
          <path d="${edge.path}" class="workflow-edge" />
        `).join('')}
        
        ${layout.nodes.map(node => `
          <g transform="translate(${node.x - node.width/2}, ${node.y - node.height/2})">
            <rect x="0" y="0" width="${node.width}" height="${node.height}" rx="8" 
              class="workflow-node ${node.isStart ? 'workflow-node-start' : ''} ${node.isTerminal ? 'workflow-node-terminal' : ''}" />
            <text x="${node.width/2}" y="${node.height/2}" text-anchor="middle" dominant-baseline="middle" class="workflow-node-title">${node.name}</text>
            <text x="${node.width/2}" y="${node.height/2 + 16}" text-anchor="middle" dominant-baseline="middle" class="workflow-node-kind">${node.kind}</text>
          </g>
        `).join('')}
      </g>
    </svg>
  `;
  
  return svgContent;
}

/**
 * Export workflow as SVG
 */
export function exportWorkflowAsSvg(workflow: WorkflowGraph): string {
  const layout = calculateLayout(workflow);
  
  return `
    <svg width="${layout.width}" height="${layout.height}" viewBox="${-layout.width/2} 0 ${layout.width} ${layout.height}" 
        xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
        </marker>
        <style>
          .workflow-node {
            fill: white;
            stroke: #e5e7eb;
            stroke-width: 1;
          }
          .workflow-node-start {
            fill: #eff6ff;
            stroke: #bfdbfe;
          }
          .workflow-node-terminal {
            fill: #f9fafb;
            stroke: #e5e7eb;
          }
          .workflow-node-title {
            font-family: sans-serif;
            font-size: 12px;
            font-weight: 500;
            fill: #1f2937;
          }
          .workflow-node-kind {
            font-family: sans-serif;
            font-size: 10px;
            fill: #6b7280;
            opacity: 0.7;
          }
          .workflow-edge {
            stroke: #d1d5db;
            stroke-width: 1.5;
            fill: none;
            marker-end: url(#arrowhead);
          }
        </style>
      </defs>
      
      <g>
        ${layout.edges.map(edge => `
          <path d="${edge.path}" class="workflow-edge" />
        `).join('')}
        
        ${layout.nodes.map(node => `
          <g transform="translate(${node.x - node.width/2}, ${node.y - node.height/2})">
            <rect x="0" y="0" width="${node.width}" height="${node.height}" rx="8" 
              class="workflow-node ${node.isStart ? 'workflow-node-start' : ''} ${node.isTerminal ? 'workflow-node-terminal' : ''}" />
            <text x="${node.width/2}" y="${node.height/2}" text-anchor="middle" dominant-baseline="middle" class="workflow-node-title">${node.name}</text>
            <text x="${node.width/2}" y="${node.height/2 + 16}" text-anchor="middle" dominant-baseline="middle" class="workflow-node-kind">${node.kind}</text>
          </g>
        `).join('')}
      </g>
    </svg>
  `;
}
