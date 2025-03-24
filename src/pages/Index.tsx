
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowGraph } from '@/lib/workflow/types';
import { simpleWorkflow, complexWorkflow } from '@/data/sampleWorkflows';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import WorkflowControls from '@/components/workflow/WorkflowControls';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import FullscreenEditorWrapper from '@/components/workflow/FullscreenEditorWrapper';

const Index = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowGraph>(simpleWorkflow);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('simple');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fullscreenEdit, setFullscreenEdit] = useState<boolean>(false);
  
  const {
    isExecuting,
    executionStatus,
    executionNodes,
    executeActiveWorkflow
  } = useWorkflowExecution(activeWorkflow);
  
  useEffect(() => {
    if (selectedWorkflow === 'simple') {
      setActiveWorkflow(simpleWorkflow);
    } else {
      setActiveWorkflow(complexWorkflow);
    }
  }, [selectedWorkflow]);
  
  const handleNodeClick = (nodeId: string) => {
    const node = activeWorkflow.nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Node: ${node.name}`, {
        description: `Kind: ${node.kind}, Version: ${node.version}`,
      });
    }
  };
  
  const handleWorkflowChange = (workflow: WorkflowGraph) => {
    setActiveWorkflow(workflow);
  };
  
  const handleWorkflowSelect = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };
  
  const handleEditModeToggle = (mode: boolean) => {
    setEditMode(mode);
  };
  
  const handleFullscreenEdit = () => {
    setFullscreenEdit(true);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card col-span-1">
          <CardHeader>
            <CardTitle>Workflow Selection</CardTitle>
            <CardDescription>Choose a workflow to visualize and edit</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowControls
              selectedWorkflow={selectedWorkflow}
              editMode={editMode}
              isExecuting={isExecuting}
              executionStatus={executionStatus}
              executionNodes={executionNodes}
              onWorkflowSelect={handleWorkflowSelect}
              onEditModeToggle={handleEditModeToggle}
              onFullscreenEdit={handleFullscreenEdit}
              onExecuteWorkflow={executeActiveWorkflow}
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card col-span-1 lg:col-span-2">
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
      </div>
    </div>
  );
};

export default Index;
