import React from 'react';

interface WorkflowFooterProps {
    workflowId?: string;
}

const WorkflowFooter: React.FC<WorkflowFooterProps> = ({ workflowId }) => {
    return (
        <div className="border-t p-2 bg-background">
            {/* Footer content will be implemented later */}
        </div>
    );
};

export default WorkflowFooter;
