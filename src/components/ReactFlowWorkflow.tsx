
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
import { ArrowRightIcon, Plus } from 'lucide-react';
import { Button } from './ui/button';
import NodePalette from './NodePalette';

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
      {!data.isTerminal && (
        <div className="absolute -bottom-3 right-1/2 translate-x-1/2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-white"
            onClick={(e) => {
              e.stopPropagation();
              data.onAddNode(data.id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

interface ReactFlowWorkflowProps {
  workflow: WorkflowGraph;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  readOnly?: boolean;
  className?: string;
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Custom edge with arrow
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: any) => {
  const path = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
  
  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#b1b1b7',
        }}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: '12px' }}
            startOffset="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-gray-500"
          >
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
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

  // Dagre layout for better node positioning
  const applyDagreLayout = (nodes: Node[], workflow: WorkflowGraph) => {
    // For simplicity, we'll use a structured tree layout
    const levelMap = new Map<string, number>();
    const horizontalSpacing = 250;
    const verticalSpacing = 150;
    
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
    
    // Position nodes by level
    return nodes.map(node => {
      const level = levelMap.get(node.id) || 0;
      const nodesInLevel = nodesByLevel.get(level) || [];
      const indexInLevel = nodesInLevel.indexOf(node.id);
      
      // Calculate horizontal position
      const x = level * horizontalSpacing;
      
      // Calculate vertical position
      const totalLevelHeight = nodesInLevel.length * verticalSpacing;
      const startY = -totalLevelHeight / 2 + verticalSpacing / 2;
      const y = startY + indexInLevel * verticalSpacing;
      
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
      
      {showNodePalette && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <NodePalette
            onSelect={handleAddNode}
            onClose={() => {
              setShowNodePalette(false);
              setSelectedSourceNodeId(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReactFlowWorkflow;
