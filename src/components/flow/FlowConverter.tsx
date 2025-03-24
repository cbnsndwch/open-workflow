
import React, { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { workflowToReactFlow, updateWorkflowWithConnection } from '@/lib/workflow/convert';
import { FlowProvider } from './FlowContext';
import FlowCanvas from './FlowCanvas';
import FlowNodePalette from './FlowNodePalette';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface FlowConverterProps {
  workflow: WorkflowGraph;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  readOnly?: boolean;
  className?: string;
}

const FlowConverter: React.FC<FlowConverterProps> = ({
  workflow,
  onWorkflowChange,
  readOnly = false,
  className,
}) => {
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);

  useEffect(() => {
    if (!workflow) return;
    
    const { nodes, edges } = workflowToReactFlow(workflow);
    
    // Override onAddNode handler for each node
    const nodesWithHandlers = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onAddNode: (nodeId: string) => {
          setSelectedSourceNodeId(nodeId);
          setShowNodePalette(true);
        }
      }
    }));
    
    // Log for debugging
    console.log("Converting workflow to flow:", nodesWithHandlers.length, "nodes,", edges.length, "edges");
    
    setInitialNodes(nodesWithHandlers);
    setInitialEdges(edges);
  }, [workflow]);

  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string | null>(null);
  const [showNodePalette, setShowNodePalette] = useState(false);

  const handleConnect = (params) => {
    if (readOnly || !onWorkflowChange) return;
    
    // Update the workflow object for the parent component
    const updatedWorkflow = updateWorkflowWithConnection(
      workflow,
      params.source,
      params.target,
      params.sourceHandle,
      params.targetHandle
    );
    
    onWorkflowChange(updatedWorkflow);
  };

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
      <ReactFlowProvider>
        <FlowProvider 
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          readOnly={readOnly}
          onConnect={handleConnect}
        >
          <FlowCanvas 
            nodeTypes={nodeTypes} 
            edgeTypes={edgeTypes}
            className="w-full h-full"
          />
          
          <FlowNodePalette
            show={showNodePalette}
            onClose={() => {
              setShowNodePalette(false);
              setSelectedSourceNodeId(null);
            }}
            onAddNode={handleAddNode}
          />
        </FlowProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowConverter;
