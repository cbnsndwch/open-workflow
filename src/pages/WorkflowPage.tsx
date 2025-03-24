
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import WorkflowControls from '@/components/workflow/WorkflowControls';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth';

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
    setEditMode,
    isLoading
  } = useWorkflowContext();
  
  const { currentAccount } = useAuth();
  const [currentWorkflow, setCurrentWorkflow] = useState(id ? getWorkflowById(id) : undefined);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!currentAccount) {
      navigate('/account-select');
      toast.error('Please select an account first');
      return;
    }
    
    if (!id || !getWorkflowById(id)) {
      navigate('/workflows');
      toast.error('Workflow not found');
    } else {
      setCurrentWorkflow(getWorkflowById(id));
    }
  }, [id, navigate, getWorkflowById, isLoading, currentAccount]);
  
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
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 h-screen/2">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="col-span-3 h-screen/2">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentWorkflow) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Workflow not found</h1>
        <p className="text-muted-foreground">
          The workflow you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
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
