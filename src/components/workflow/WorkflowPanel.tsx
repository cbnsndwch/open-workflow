
import React from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import WorkflowEditor from '@/components/WorkflowEditor';

interface WorkflowPanelProps {
  workflow: WorkflowGraph;
  editMode: boolean;
  onNodeClick: (nodeId: string) => void;
  onWorkflowChange: (workflow: WorkflowGraph) => void;
  className?: string;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ 
  workflow, 
  editMode,
  onNodeClick, 
  onWorkflowChange,
  className
}) => {
  return (
    <div className={className}>
      {editMode ? (
        <WorkflowEditor 
          initialWorkflow={workflow}
          onChange={onWorkflowChange}
          className="h-full"
        />
      ) : (
        <WorkflowVisualizer 
          workflow={workflow} 
          onNodeClick={onNodeClick}
          className="h-full"
        />
      )}
    </div>
  );
};

export default WorkflowPanel;
