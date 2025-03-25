import React from 'react';

import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import WorkflowEditor from '@/components/WorkflowEditor';

import { WorkflowGraph } from '@/lib/workflow/types';

interface WorkflowPanelProps {
    workflow: WorkflowGraph;
    editMode: boolean;
    onNodeClick: (nodeId: string) => void;
    onWorkflowChange: (workflow: WorkflowGraph) => void;
    className?: string;
}

export default function WorkflowPanel({
    workflow,
    editMode,
    onNodeClick,
    onWorkflowChange,
    className
}: WorkflowPanelProps) {
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
}
