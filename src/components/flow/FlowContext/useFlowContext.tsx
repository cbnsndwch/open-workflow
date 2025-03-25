/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { Node, Edge, Connection } from '@xyflow/react';

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

export const FlowContext = createContext<FlowContextType | undefined>(
    undefined
);

export function useFlowContext() {
    const context = useContext(FlowContext);
    if (!context) {
        throw new Error('useFlowContext must be used within a FlowProvider');
    }
    return context;
}
