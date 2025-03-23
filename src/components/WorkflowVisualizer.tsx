
import React, { useState } from 'react';
import { WorkflowGraph, ValidationResult } from '@/lib/workflow/types';
import { validateWorkflow } from '@/lib/workflow/validator';
import ReactFlowWorkflow from './ReactFlowWorkflow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WorkflowVisualizerProps {
  workflow: WorkflowGraph;
  onNodeClick?: (nodeId: string) => void;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  className?: string;
  readOnly?: boolean;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  workflow,
  onNodeClick,
  onWorkflowChange,
  className,
  readOnly = true,
}) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  React.useEffect(() => {
    // Validate the workflow
    const validationResult = validateWorkflow(workflow);
    setValidation(validationResult);
  }, [workflow]);
  
  return (
    <div className={`workflow-container relative ${className || ''}`}>
      <ReactFlowWorkflow 
        workflow={workflow} 
        onWorkflowChange={onWorkflowChange}
        readOnly={readOnly}
      />
      
      {validation && !validation.valid && (
        <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg max-w-md text-sm shadow-md">
          <h4 className="font-medium mb-1">Validation Errors</h4>
          <ul className="list-disc pl-5 text-xs">
            {validation.errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation && validation.warnings.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg max-w-md text-sm shadow-md">
          <h4 className="font-medium mb-1">Workflow Warnings</h4>
          <ul className="list-disc pl-5 text-xs">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkflowVisualizer;
