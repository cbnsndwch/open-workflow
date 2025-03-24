import React, { useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import {
    parseJsonWorkflow,
    serializeWorkflowToJson,
    validateWorkflow
} from '@/lib/workflow';
import { toast } from 'sonner';
import WorkflowVisualizer from './WorkflowVisualizer';

interface WorkflowEditorProps {
    initialWorkflow?: WorkflowGraph;
    onChange?: (workflow: WorkflowGraph) => void;
    className?: string;
    fullscreen?: boolean;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
    initialWorkflow,
    onChange,
    className,
    fullscreen = false
}) => {
    const [activeWorkflow, setActiveWorkflow] = useState<
        WorkflowGraph | undefined
    >(initialWorkflow);

    useEffect(() => {
        if (initialWorkflow) {
            setActiveWorkflow(initialWorkflow);
        }
    }, [initialWorkflow]);

    const handleWorkflowChange = (updatedWorkflow: WorkflowGraph) => {
        try {
            // Validate the workflow
            const validation = validateWorkflow(updatedWorkflow);

            if (!validation.valid) {
                toast.warning(
                    `Workflow has ${validation.errors.length} validation issues`
                );
            }

            setActiveWorkflow(updatedWorkflow);

            if (onChange) {
                onChange(updatedWorkflow);
            }
        } catch (error) {
            toast.error(`Error updating workflow: ${(error as Error).message}`);
        }
    };

    return (
        <div
            className={`workflow-editor h-full ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''} ${className || ''}`}
        >
            {activeWorkflow && (
                <WorkflowVisualizer
                    workflow={activeWorkflow}
                    onWorkflowChange={handleWorkflowChange}
                    readOnly={false}
                    className="h-full w-full"
                />
            )}
        </div>
    );
};

export default WorkflowEditor;
