import React from 'react';

interface WorkflowHeaderProps {
    workflowId?: string;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ workflowId }) => {
    return (
        <div className="border-b p-2 bg-background">
            {/* Header content will be implemented later */}
        </div>
    );
};

export default WorkflowHeader;
