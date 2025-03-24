
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowPanel from '@/components/workflow/WorkflowPanel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Save } from 'lucide-react';

const WorkflowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getWorkflowById,
    updateWorkflow,
    executeWorkflow,
    isExecuting,
    executionStatus,
    executionNodes,
    executionNodeIds
  } = useWorkflowContext();
  
  const [editMode, setEditMode] = useState(false);
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
  };
  
  const handleSave = () => {
    if (currentWorkflow && id) {
      updateWorkflow(id, currentWorkflow);
      setHasChanges(false);
      toast.success('Workflow saved successfully');
    }
  };
  
  const handleExecute = () => {
    if (id) {
      executeWorkflow(id);
    }
  };
  
  if (!currentWorkflow) {
    return <div className="p-6">Loading workflow...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workflows')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">{currentWorkflow.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={editMode ? "outline" : "default"} 
            onClick={() => setEditMode(false)}
            className={!editMode ? "bg-primary" : ""}
          >
            View
          </Button>
          <Button 
            variant={editMode ? "default" : "outline"} 
            onClick={() => setEditMode(true)}
            className={editMode ? "bg-primary" : ""}
          >
            Edit
          </Button>
          
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
          
          <Button 
            onClick={handleExecute} 
            disabled={isExecuting || editMode}
            variant="outline"
          >
            <Play className="h-4 w-4 mr-1" />
            Execute
          </Button>
        </div>
      </div>
      
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
