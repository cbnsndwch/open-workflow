
import React from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import WorkflowEditor from '@/components/WorkflowEditor';

interface WorkflowPanelProps {
  workflow: WorkflowGraph;
  editMode: boolean;
  onNodeClick: (nodeId: string) => void;
  onWorkflowChange: (workflow: WorkflowGraph) => void;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ 
  workflow, 
  editMode,
  onNodeClick, 
  onWorkflowChange 
}) => {
  return (
    <>
      {editMode ? (
        <WorkflowEditor 
          initialWorkflow={workflow}
          onChange={onWorkflowChange}
        />
      ) : (
        <WorkflowVisualizer 
          workflow={workflow} 
          onNodeClick={onNodeClick}
          className="h-[600px]"
        />
      )}
    </>
  );
};

export default WorkflowPanel;
