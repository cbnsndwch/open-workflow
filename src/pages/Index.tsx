
import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="p-6">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle>Workflow SDK</CardTitle>
          <CardDescription>Explore and interact with the workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowPanel
            workflow={activeWorkflow}
            editMode={editMode}
            onNodeClick={handleNodeClick}
            onWorkflowChange={handleWorkflowChange}
          />
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <WorkflowControls />
      </div>
    </div>
  );
};

export default Index;
