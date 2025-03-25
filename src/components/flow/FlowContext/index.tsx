import React, { useState } from 'react';
import {
    Node,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType
} from '@xyflow/react';

import { FlowContext } from './useFlowContext';

interface FlowProviderProps {
    children: React.ReactNode;
    initialNodes: Node[];
    initialEdges: Edge[];
    readOnly?: boolean;
    onConnect?: (params: Connection) => void;
}

export function FlowProvider({
    children,
    initialNodes,
    initialEdges,
    readOnly = false,
    onConnect: externalOnConnect
}: FlowProviderProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<
        string | null
    >(null);
    const [showNodePalette, setShowNodePalette] = useState(false);

    const onConnect = (params: Connection) => {
        if (!readOnly) {
            setEdges(eds =>
                addEdge(
                    {
                        ...params,
                        type: 'custom',
                        markerEnd: { type: MarkerType.ArrowClosed },
                        data: {
                            label: `${params.sourceHandle} → ${params.targetHandle}`
                        },
                        style: { stroke: '#b1b1b7' }
                    },
                    eds
                )
            );

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
        setShowNodePalette
    };

    return (
        <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
    );
}
