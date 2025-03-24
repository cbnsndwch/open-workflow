
import React, { createContext, useContext, useState } from 'react';
import { Node, Edge, Connection, useNodesState, useEdgesState, addEdge, MarkerType } from '@xyflow/react';
import { WorkflowGraph } from '@/lib/workflow/types';

interface FlowContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  selectedSourceNodeId: string | null;
  setSelectedSourceNodeId: (id: string | null) => void;
  showNodePalette: boolean;
  setShowNodePalette: (show: boolean) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider');
  }
  return context;
};

interface FlowProviderProps {
  children: React.ReactNode;
  initialNodes: Node[];
  initialEdges: Edge[];
  readOnly?: boolean;
  onConnect?: (params: Connection) => void;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ 
  children, 
  initialNodes, 
  initialEdges,
  readOnly = false,
  onConnect: externalOnConnect,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string | null>(null);
  const [showNodePalette, setShowNodePalette] = useState(false);

  const onConnect = (params: Connection) => {
    if (!readOnly) {
      setEdges((eds) => addEdge({
        ...params,
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed },
        data: {
          label: `${params.sourceHandle} → ${params.targetHandle}`,
        },
        style: { stroke: '#b1b1b7' },
      }, eds));
      
      if (externalOnConnect) {
        externalOnConnect(params);
      }
    }
  };

  const value = {
    nodes,
    edges,
    onNodesChange: readOnly ? undefined : onNodesChange,
    onEdgesChange: readOnly ? undefined : onEdgesChange,
    onConnect,
    selectedSourceNodeId,
    setSelectedSourceNodeId,
    showNodePalette,
    setShowNodePalette,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
