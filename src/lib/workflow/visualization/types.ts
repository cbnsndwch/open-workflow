
import { Node } from '../types';

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
