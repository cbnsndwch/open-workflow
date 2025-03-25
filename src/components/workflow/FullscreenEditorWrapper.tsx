import React from 'react';

import WorkflowEditor from '@/components/WorkflowEditor';

import { WorkflowGraph } from '@/lib/workflow/types';

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
