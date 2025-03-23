
import { WorkflowGraph } from '../types';
import { calculateLayout } from './layout';

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
