
import React from 'react';

interface WorkflowHeaderProps {
  workflowId?: string;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ workflowId }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl heading-gradient mb-2">Workflow Graph Traversal</h1>
      <p className="subheading mx-auto">
        A powerful TypeScript library for creating, managing, and executing workflow graphs with ease.
      </p>
    </div>
  );
};

export default WorkflowHeader;
