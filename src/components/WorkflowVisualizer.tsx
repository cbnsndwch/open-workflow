
import React, { useEffect, useRef, useState } from 'react';
import { WorkflowGraph, ValidationResult } from '@/lib/workflow/types';
import { calculateLayout, LayoutResult } from '@/lib/workflow/visualization';
import { validateWorkflow } from '@/lib/workflow/validator';

interface WorkflowVisualizerProps {
  workflow: WorkflowGraph;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  workflow,
  onNodeClick,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LayoutResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [animatingNode, setAnimatingNode] = useState<string | null>(null);
  
  useEffect(() => {
    // Validate the workflow
    const validationResult = validateWorkflow(workflow);
    setValidation(validationResult);
    
    // Calculate layout
    const calculatedLayout = calculateLayout(workflow);
    setLayout(calculatedLayout);
  }, [workflow]);
  
  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      // Animate the node before triggering the click handler
      setAnimatingNode(nodeId);
      setTimeout(() => {
        setAnimatingNode(null);
        onNodeClick(nodeId);
      }, 300);
    }
  };
  
  if (!layout) {
    return <div className="workflow-container flex items-center justify-center">Loading workflow...</div>;
  }
  
  return (
    <div className={`workflow-container ${className || ''}`} ref={containerRef}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`${-layout.width/2} 0 ${layout.width} ${layout.height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker 
            id="arrowhead" 
            markerWidth="10" 
            markerHeight="7" 
            refX="7" 
            refY="3.5" 
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
          </marker>
        </defs>
        
        {/* Render edges */}
        <g>
          {layout.edges.map(edge => (
            <path
              key={edge.id}
              d={edge.path}
              className={`workflow-edge edge-animate-in ${animatingNode === edge.source ? 'workflow-edge-animated' : ''}`}
            />
          ))}
        </g>
        
        {/* Render nodes */}
        <g>
          {layout.nodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.x - node.width/2}, ${node.y - node.height/2})`}
              onClick={() => handleNodeClick(node.id)}
              className={`cursor-pointer node-animate-in`}
              style={{ 
                transitionDelay: `${node.level * 50}ms`,
                animation: animatingNode === node.id 
                  ? 'pulse 0.3s ease-in-out' 
                  : undefined
              }}
            >
              <rect
                x="0"
                y="0"
                width={node.width}
                height={node.height}
                rx="8"
                className={`workflow-node ${node.isStart ? 'workflow-node-start' : ''} ${node.isTerminal ? 'workflow-node-terminal' : ''}`}
              />
              <text
                x={node.width/2}
                y={node.height/2 - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="workflow-node-title"
              >
                {node.name}
              </text>
              <text
                x={node.width/2}
                y={node.height/2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="workflow-node-kind"
              >
                {node.kind}
              </text>
              
              {/* Input and output ports */}
              <circle
                cx={node.width/2}
                cy="0"
                r="4"
                className="workflow-port workflow-port-input"
              />
              <circle
                cx={node.width/2}
                cy={node.height}
                r="4"
                className="workflow-port workflow-port-output"
              />
            </g>
          ))}
        </g>
      </svg>
      
      {validation && !validation.valid && (
        <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg max-w-md text-sm shadow-md">
          <h4 className="font-medium mb-1">Validation Errors</h4>
          <ul className="list-disc pl-5 text-xs">
            {validation.errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation && validation.warnings.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg max-w-md text-sm shadow-md">
          <h4 className="font-medium mb-1">Workflow Warnings</h4>
          <ul className="list-disc pl-5 text-xs">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkflowVisualizer;
