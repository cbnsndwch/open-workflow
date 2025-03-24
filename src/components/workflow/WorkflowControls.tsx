
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Expand } from 'lucide-react';

interface WorkflowControlsProps {
  selectedWorkflow: string;
  editMode: boolean;
  isExecuting: boolean;
  executionStatus: string;
  executionNodes: Record<string, { status: string, result?: Record<string, any>, error?: string }>;
  executionNodeIds?: string[];
  onWorkflowSelect: (workflow: string) => void;
  onEditModeToggle: (editMode: boolean) => void;
  onFullscreenEdit: () => void;
  onExecuteWorkflow: () => void;
}

const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  selectedWorkflow,
  editMode,
  isExecuting,
  executionStatus,
  executionNodes,
  executionNodeIds = [],
  onWorkflowSelect,
  onEditModeToggle,
  onFullscreenEdit,
  onExecuteWorkflow,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={selectedWorkflow === 'simple' ? 'default' : 'outline'}
          onClick={() => onWorkflowSelect('simple')}
          className="flex-1"
        >
          Simple Workflow
        </Button>
        <Button
          variant={selectedWorkflow === 'complex' ? 'default' : 'outline'}
          onClick={() => onWorkflowSelect('complex')}
          className="flex-1"
        >
          Complex Workflow
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={!editMode ? 'default' : 'outline'}
          onClick={() => onEditModeToggle(false)}
          className="flex-1"
        >
          View Mode
        </Button>
        <Button
          variant={editMode ? 'default' : 'outline'}
          onClick={() => onEditModeToggle(true)}
          className="flex-1"
        >
          Edit Mode
        </Button>
      </div>
      
      {editMode && (
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={onFullscreenEdit}
        >
          <Expand className="mr-2 h-4 w-4" />
          <span>Fullscreen Editor</span>
        </Button>
      )}
      
      <Button 
        onClick={onExecuteWorkflow} 
        disabled={isExecuting || editMode}
        className="w-full"
      >
        {isExecuting ? 'Executing...' : 'Execute Workflow'}
      </Button>
      
      {executionStatus && (
        <Alert>
          <AlertTitle>Execution Status</AlertTitle>
          <AlertDescription className="text-sm">{executionStatus}</AlertDescription>
        </Alert>
      )}
      
      {executionNodeIds.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Execution Path:</h4>
          <div className="bg-gray-50 p-3 rounded-md text-xs">
            {executionNodeIds.join(' → ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowControls;
