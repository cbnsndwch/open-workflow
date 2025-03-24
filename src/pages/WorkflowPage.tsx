
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import WorkflowControls from '@/components/workflow/WorkflowControls';
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
      <div className="grid grid-cols-1 md:grid-cols-4 h-full">
        <div className="col-span-1 p-4 border-r">
          <WorkflowControls />
        </div>
        <div className="col-span-3 flex-1 overflow-hidden">
          <WorkflowPanel
            workflow={currentWorkflow}
            editMode={editMode}
            onNodeClick={handleNodeClick}
            onWorkflowChange={handleWorkflowChange}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
