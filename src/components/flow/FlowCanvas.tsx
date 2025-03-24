
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  MarkerType,
} from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import '@xyflow/react/dist/style.css';

interface FlowCanvasProps {
  nodeTypes: any;
  edgeTypes: any;
  className?: string;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  nodeTypes, 
  edgeTypes,
  className,
}) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowContext();

  console.log('FlowCanvas rendering with:', nodes.length, 'nodes and', edges.length, 'edges');

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.1}
      maxZoom={1.5}
      fitView
      attributionPosition="bottom-right"
      className={`rounded-xl ${className || ''}`}
      defaultEdgeOptions={{
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }}
    >
      <Background gap={12} size={1} />
      <Controls />
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
      <Panel position="top-right" className="bg-white p-2 rounded shadow-md z-10">
        <div className="text-xs text-gray-500">
          {onNodesChange ? 'Editing enabled' : 'Read-only view'}
        </div>
      </Panel>
    </ReactFlow>
  );
};

export default FlowCanvas;
