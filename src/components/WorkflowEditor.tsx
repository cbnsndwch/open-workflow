import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { WorkflowGraph } from '@/lib/workflow/types';
import { validateWorkflow } from '@/lib/workflow';

import WorkflowVisualizer from './WorkflowVisualizer';

interface WorkflowEditorProps {
    initialWorkflow?: WorkflowGraph;
    onChange?: (workflow: WorkflowGraph) => void;
    className?: string;
    fullscreen?: boolean;
}

export default function WorkflowEditor({
    initialWorkflow,
    onChange,
    className,
    fullscreen = false
}: WorkflowEditorProps) {
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
            className={`h-full bg-card ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''} ${className || ''}`}
        >
            {activeWorkflow ? (
                <WorkflowVisualizer
                    workflow={activeWorkflow}
                    onWorkflowChange={handleWorkflowChange}
                    readOnly={false}
                    className="h-full w-full"
                />
            ) : null}
        </div>
    );
}
