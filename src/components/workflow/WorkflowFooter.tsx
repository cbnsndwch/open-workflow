
import React from 'react';

interface WorkflowFooterProps {
  workflowId?: string;
}

const WorkflowFooter: React.FC<WorkflowFooterProps> = ({ workflowId }) => {
  return (
    <div className="text-center">
      <p className="text-gray-600 max-w-2xl mx-auto">
        Build complex workflows with a type-safe, extensible library that handles everything from validation to execution.
      </p>
    </div>
  );
};

export default WorkflowFooter;
