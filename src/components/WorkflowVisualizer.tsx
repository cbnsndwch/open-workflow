import React, { useState, useEffect } from 'react';
import { WorkflowGraph, ValidationResult } from '@/lib/workflow/types';
import { validateWorkflow } from '@/lib/workflow/validator';
import ReactFlowWorkflow from './ReactFlowWorkflow';

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
    readOnly = true
}) => {
    const [validation, setValidation] = useState<ValidationResult | null>(null);

    useEffect(() => {
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
                className="w-full h-full bg-[#f7f9fb]"
            />

            {validation && !validation.valid && (
                <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg max-w-md text-sm shadow-md z-10">
                    <h4 className="font-medium mb-1">Validation Errors</h4>
                    <ul className="list-disc pl-5 text-xs">
                        {validation.errors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WorkflowVisualizer;
