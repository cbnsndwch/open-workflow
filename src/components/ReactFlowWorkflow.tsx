
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowGraph } from '@/lib/workflow/types';

// Custom node component
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const nodeTypeColors: Record<string, string> = {
    'core:triggers:manual': 'bg-blue-100 border-blue-400',
    'core:http_request': 'bg-purple-100 border-purple-400',
    'core:switch': 'bg-yellow-100 border-yellow-400',
    'core:code': 'bg-green-100 border-green-400',
    'core:if': 'bg-orange-100 border-orange-400',
    'core:no_op': 'bg-gray-100 border-gray-400',
    'core:set': 'bg-indigo-100 border-indigo-400',
    'noco_db:action': 'bg-pink-100 border-pink-400',
    'core:aggregate': 'bg-teal-100 border-teal-400',
    'core:filter': 'bg-red-100 border-red-400',
    'core:split_input': 'bg-emerald-100 border-emerald-400',
    'default': 'bg-white border-gray-300',
  };
  
  const nodeColor = nodeTypeColors[data.kind] || nodeTypeColors.default;
  
  return (
    <div className={`px-4 py-2 rounded-lg shadow-sm border ${nodeColor} ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="font-medium text-gray-800">{data.label}</div>
      <div className="text-xs text-gray-500 mt-1">{data.kind}</div>
    </div>
  );
};

interface ReactFlowWorkflowProps {
  workflow: WorkflowGraph;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  readOnly?: boolean;
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const ReactFlowWorkflow: React.FC<ReactFlowWorkflowProps> = ({ 
  workflow, 
  onWorkflowChange,
  readOnly = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
        ...node,
      },
    }));

    // Apply simple layout - position nodes in a tree-like structure
    const layoutNodes = applySimpleLayout(flowNodes, workflow);

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
            label: `${sourcePort} → ${target.port}`,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#b1b1b7' },
          });
        });
      });
    });

    setNodes(layoutNodes);
    setEdges(flowEdges);
  }, [workflow, setNodes, setEdges]);

  // Simple layout function to position nodes in a tree-like structure
  const applySimpleLayout = (nodes: Node[], workflow: WorkflowGraph) => {
    // Find start nodes (nodes with no incoming edges)
    const nodeIncomingEdges: Record<string, number> = {};
    
    // Count incoming edges for all nodes
    Object.values(workflow.edges).forEach(connections => {
      Object.values(connections).forEach(targets => {
        targets.forEach(target => {
          const targetNode = workflow.nodes.find(n => n.name === target.node);
          if (targetNode) {
            nodeIncomingEdges[targetNode.id] = (nodeIncomingEdges[targetNode.id] || 0) + 1;
          }
        });
      });
    });
    
    // Nodes with no incoming edges are start nodes
    const startNodeIds = workflow.nodes
      .filter(node => !nodeIncomingEdges[node.id])
      .map(node => node.id);
    
    // Calculate node levels (distance from start nodes)
    const nodeLevels: Record<string, number> = {};
    const calculateLevels = (nodeId: string, level: number, visited: Set<string> = new Set()) => {
      if (visited.has(nodeId)) return; // Prevent cycles
      visited.add(nodeId);
      
      nodeLevels[nodeId] = Math.max(level, nodeLevels[nodeId] || 0);
      
      // Find outgoing edges
      const node = workflow.nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const connections = workflow.edges[node.name];
      if (!connections) return;
      
      Object.values(connections).forEach(targets => {
        targets.forEach(target => {
          const targetNode = workflow.nodes.find(n => n.name === target.node);
          if (targetNode) {
            calculateLevels(targetNode.id, level + 1, new Set(visited));
          }
        });
      });
    };
    
    startNodeIds.forEach(id => calculateLevels(id, 0));
    
    // Group nodes by level
    const nodesByLevel: Record<number, string[]> = {};
    Object.entries(nodeLevels).forEach(([nodeId, level]) => {
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(nodeId);
    });
    
    // Position nodes by level
    const levelSpacing = 150;
    const nodeSpacing = 200;
    const maxNodesInLevel = Math.max(...Object.values(nodesByLevel).map(nodesInLevel => nodesInLevel.length));
    
    return nodes.map(node => {
      const level = nodeLevels[node.id] || 0;
      const nodesInThisLevel = nodesByLevel[level] || [];
      const nodeIndexInLevel = nodesInThisLevel.indexOf(node.id);
      const nodesCount = nodesInThisLevel.length;
      
      const x = level * levelSpacing;
      const totalWidth = (nodesCount - 1) * nodeSpacing;
      const startY = -totalWidth / 2;
      const y = startY + nodeIndexInLevel * nodeSpacing;
      
      return {
        ...node,
        position: { x, y },
      };
    });
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      
      // Add the new edge
      setEdges((eds) => addEdge({
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        label: `${params.sourceHandle} → ${params.targetHandle}`,
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

  return (
    <div className="w-full h-full bg-slate-50 rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        attributionPosition="bottom-right"
        className="rounded-xl"
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={12} size={1} />
        <Panel position="top-right" className="bg-white p-2 rounded shadow-md">
          <div className="text-xs text-gray-500">
            {readOnly ? 'Read-only view' : 'Editing enabled'}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ReactFlowWorkflow;
