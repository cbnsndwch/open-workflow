import React from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import WorkflowEditor from '@/components/WorkflowEditor';

interface FullscreenEditorWrapperProps {
    workflow: WorkflowGraph;
    onWorkflowChange: (workflow: WorkflowGraph) => void;
}

const FullscreenEditorWrapper: React.FC<FullscreenEditorWrapperProps> = ({
    workflow,
    onWorkflowChange
}) => {
    return (
        <WorkflowEditor
            initialWorkflow={workflow}
            onChange={onWorkflowChange}
            fullscreen={true}
        />
    );
};

export default FullscreenEditorWrapper;
