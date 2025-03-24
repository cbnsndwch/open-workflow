
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import { toast } from 'sonner';

const WorkflowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getWorkflowById,
    updateWorkflow,
    isExecuting,
    executionStatus,
    executionNodeIds,
    editMode,
    setEditMode
  } = useWorkflowContext();
  
  const [currentWorkflow, setCurrentWorkflow] = useState(getWorkflowById(id || ''));
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (!id || !getWorkflowById(id)) {
      navigate('/workflows');
      toast.error('Workflow not found');
    } else {
      setCurrentWorkflow(getWorkflowById(id));
    }
  }, [id, navigate, getWorkflowById]);
  
  const handleNodeClick = (nodeId: string) => {
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Node: ${node.name}`, {
        description: `Kind: ${node.kind}, Version: ${node.version}`,
      });
    }
  };
  
  const handleWorkflowChange = (updatedWorkflow: any) => {
    setCurrentWorkflow(updatedWorkflow);
    setHasChanges(true);
    
    if (id) {
      updateWorkflow(id, updatedWorkflow);
      setHasChanges(false);
      toast.success('Workflow saved successfully');
    }
  };
  
  if (!currentWorkflow) {
    return <div className="p-6">Loading workflow...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <WorkflowPanel
          workflow={currentWorkflow}
          editMode={editMode}
          onNodeClick={handleNodeClick}
          onWorkflowChange={handleWorkflowChange}
          className="h-full"
        />
      </div>
      
      {executionStatus && (
        <div className="p-4 bg-background border-t">
          <div className="text-sm font-medium mb-2">Execution Status: {executionStatus}</div>
          
          {executionNodeIds.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Execution Path: {executionNodeIds.join(' → ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
