
import React from 'react';
import { toast } from 'sonner';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowControls from '@/components/workflow/WorkflowControls';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import FullscreenEditorWrapper from '@/components/workflow/FullscreenEditorWrapper';

const Index = () => {
  const {
    activeWorkflow,
    editMode,
    fullscreenEdit,
    handleWorkflowChange
  } = useWorkflowContext();
  
  const handleNodeClick = (nodeId: string) => {
    const node = activeWorkflow.nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Node: ${node.name}`, {
        description: `Kind: ${node.kind}, Version: ${node.version}`,
      });
    }
  };
  
  if (fullscreenEdit) {
    return (
      <FullscreenEditorWrapper
        workflow={activeWorkflow}
        onWorkflowChange={handleWorkflowChange}
      />
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <WorkflowPanel
          workflow={activeWorkflow}
          editMode={editMode}
          onNodeClick={handleNodeClick}
          onWorkflowChange={handleWorkflowChange}
          className="h-full"
        />
      </div>
      
      <div className="p-6 bg-background border-t">
        <WorkflowControls />
      </div>
    </div>
  );
};

export default Index;
