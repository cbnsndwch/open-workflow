
import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  Panel,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowGraph } from '@/lib/workflow/types';
import { Button } from './ui/button';
import CustomNode from './flow/CustomNode';
import CustomEdge from './flow/CustomEdge';
import { applyDagreLayout } from '@/lib/workflow/layout';
import FlowNodePalette from './flow/FlowNodePalette';

interface ReactFlowWorkflowProps {
  workflow: WorkflowGraph;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  readOnly?: boolean;
  className?: string;
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const ReactFlowWorkflow: React.FC<ReactFlowWorkflowProps> = ({ 
  workflow, 
  onWorkflowChange,
  readOnly = false,
  className,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  // Convert workflow to React Flow nodes and edges
  useEffect(() => {
    if (!workflow) return;

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
        onAddNode: (nodeId: string) => {
          setSelectedSourceNodeId(nodeId);
          setShowNodePalette(true);
        },
        ...node,
      },
    }));

    // Apply layout
    const layoutNodes = applyDagreLayout(flowNodes, workflow);

    // Create edges from workflow connections
    const flowEdges: Edge[] = [];
    Object.entries(workflow.edges).forEach(([sourceName, connections]) => {
      const sourceNode = workflow.nodes.find(n => n.name === sourceName);
      if (!sourceNode) return;

      Object.entries(connections).forEach(([sourcePort, targets]) => {
        targets.forEach((target) => {
          const targetNode = workflow.nodes.find(n => n.name === target.node);
          if (!targetNode) return;

          flowEdges.push({
            id: `${sourceNode.id}-${sourcePort}-${targetNode.id}-${target.port}`,
            source: sourceNode.id,
            target: targetNode.id,
            sourceHandle: sourcePort,
            targetHandle: target.port,
            type: 'custom',
            data: {
              label: `${sourcePort} → ${target.port}`,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
            style: { stroke: '#b1b1b7' },
          });
        });
      });
    });

    setNodes(layoutNodes);
    setEdges(flowEdges);
    
    // Fit view after a short delay to ensure all elements are rendered
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  }, [workflow, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      
      // Add the new edge
      setEdges((eds) => addEdge({
        ...params,
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed },
        data: {
          label: `${params.sourceHandle} → ${params.targetHandle}`,
        },
        style: { stroke: '#b1b1b7' },
      }, eds));
      
      // Update the workflow object for the parent component
      if (onWorkflowChange) {
        // Find the source and target nodes
        const sourceNode = workflow.nodes.find(n => n.id === params.source);
        const targetNode = workflow.nodes.find(n => n.id === params.target);
        
        if (sourceNode && targetNode && params.sourceHandle && params.targetHandle) {
          const newEdges = { ...workflow.edges };
          
          // Initialize connections for the source node if they don't exist
          if (!newEdges[sourceNode.name]) {
            newEdges[sourceNode.name] = {};
          }
          
          // Initialize connections for the specific port if they don't exist
          if (!newEdges[sourceNode.name][params.sourceHandle]) {
            newEdges[sourceNode.name][params.sourceHandle] = [];
          }
          
          // Add the new connection
          newEdges[sourceNode.name][params.sourceHandle].push({
            node: targetNode.name,
            port: params.targetHandle,
            order: newEdges[sourceNode.name][params.sourceHandle].length
          });
          
          onWorkflowChange({
            ...workflow,
            edges: newEdges
          });
        }
      }
    },
    [workflow, onWorkflowChange, readOnly, setEdges]
  );

  const handleAddNode = (nodeType: string, nodeName: string) => {
    if (readOnly || !selectedSourceNodeId || !onWorkflowChange) return;
    
    // Create a new node
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      name: nodeName,
      kind: nodeType,
      version: "1.0.0",
    };
    
    // Find source node
    const sourceNode = workflow.nodes.find(n => n.id === selectedSourceNodeId);
    if (!sourceNode) return;
    
    // Create a new connection
    const newEdges = { ...workflow.edges };
    if (!newEdges[sourceNode.name]) {
      newEdges[sourceNode.name] = {};
    }
    if (!newEdges[sourceNode.name]["main"]) {
      newEdges[sourceNode.name]["main"] = [];
    }
    
    newEdges[sourceNode.name]["main"].push({
      node: nodeName,
      port: "main",
      order: newEdges[sourceNode.name]["main"].length
    });
    
    // Update workflow
    onWorkflowChange({
      nodes: [...workflow.nodes, newNode],
      edges: newEdges
    });
    
    setShowNodePalette(false);
    setSelectedSourceNodeId(null);
  };

  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        maxZoom={1.5}
        fitView
        attributionPosition="bottom-right"
        className="rounded-xl"
      >
        <Background gap={12} size={1} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Panel position="top-right" className="bg-white p-2 rounded shadow-md z-10">
          <div className="text-xs text-gray-500">
            {readOnly ? 'Read-only view' : 'Editing enabled'}
          </div>
        </Panel>
      </ReactFlow>
      
      <FlowNodePalette
        show={showNodePalette}
        onClose={() => {
          setShowNodePalette(false);
          setSelectedSourceNodeId(null);
        }}
        onAddNode={handleAddNode}
      />
    </div>
  );
};

export default ReactFlowWorkflow;
