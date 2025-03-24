
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define the initial nodes for the demo workflow
const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'input',
    data: { label: 'API Trigger' },
    position: { x: 50, y: 100 },
    style: {
      background: '#f3f0ff',
      border: '1px solid #9b87f5',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'process',
    data: { label: 'Process Data' },
    position: { x: 300, y: 100 },
    style: {
      background: '#f0f7ff',
      border: '1px solid #87adf5',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'ai',
    data: { label: 'AI Analysis' },
    position: { x: 300, y: 250 },
    style: {
      background: '#fff0f7',
      border: '1px solid #f587b3',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'decision',
    data: { label: 'Decision' },
    position: { x: 550, y: 175 },
    style: {
      background: '#fffbf0',
      border: '1px solid #f5d287',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'action1',
    data: { label: 'Send Email' },
    position: { x: 800, y: 100 },
    style: {
      background: '#f0fff5',
      border: '1px solid #87f5a9',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'action2',
    data: { label: 'Update Database' },
    position: { x: 800, y: 250 },
    style: {
      background: '#f0fff5',
      border: '1px solid #87f5a9',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
];

// Define the edges connecting the nodes
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger',
    target: 'process',
    animated: true,
    style: { stroke: '#9b87f5' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: 'process',
    target: 'ai',
    animated: true,
    style: { stroke: '#87adf5' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-4',
    source: 'process',
    target: 'decision',
    animated: true,
    style: { stroke: '#87adf5' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e3-4',
    source: 'ai',
    target: 'decision',
    animated: true,
    style: { stroke: '#f587b3' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e4-5',
    source: 'decision',
    target: 'action1',
    animated: true,
    label: 'Yes',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.7 },
    style: { stroke: '#f5d287' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e4-6',
    source: 'decision',
    target: 'action2',
    animated: true,
    label: 'No',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.7 },
    style: { stroke: '#f5d287' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const LandingPageFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      attributionPosition="bottom-right"
      zoomOnScroll={false}
      panOnScroll={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background gap={12} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeStrokeWidth={3}
        zoomable={false}
        pannable={false}
        maskColor="rgba(240, 240, 255, 0.6)"
      />
    </ReactFlow>
  );
};

export default LandingPageFlow;
