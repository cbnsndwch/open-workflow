
import React from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    MarkerType
} from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import { useTheme } from '@/components/theme/theme-provider';
import '@xyflow/react/dist/style.css';

interface FlowCanvasProps {
    nodeTypes: any;
    edgeTypes: any;
    className?: string;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
    nodeTypes,
    edgeTypes,
    className
}) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
        useFlowContext();
    const { theme } = useTheme();
    
    console.log(
        'FlowCanvas rendering with:',
        nodes.length,
        'nodes and',
        edges.length,
        'edges',
        'theme:',
        theme
    );
    
    // Determine background and styling based on theme
    const isDarkTheme = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const flowStyle = {
        backgroundColor: isDarkTheme ? 'hsl(var(--background))' : '#f7f9fb'
    };
    
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
            className={`rounded-xl ${className || ''} ${isDarkTheme ? 'dark-flow' : 'light-flow'}`}
            style={flowStyle}
            defaultEdgeOptions={{
                type: 'custom',
                markerEnd: {
                    type: MarkerType.ArrowClosed
                }
            }}
        >
            <Background 
                gap={12} 
                size={1} 
                color={isDarkTheme ? '#333' : '#e2e2e2'} 
            />
            <Controls className={isDarkTheme ? 'flow-controls-dark' : ''} />
            <MiniMap 
                nodeStrokeWidth={3} 
                zoomable 
                pannable 
                className={isDarkTheme ? 'flow-minimap-dark' : ''}
            />
        </ReactFlow>
    );
};

export default FlowCanvas;
