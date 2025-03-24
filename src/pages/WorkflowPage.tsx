import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useWorkflowContext } from '@/contexts/workflow';
import WorkflowEditor from '@/components/WorkflowEditor';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
const WorkflowPage = () => {
    const { id } = useParams();
    const { user, currentAccount } = useAuth();
    const { getWorkflowById } = useWorkflowContext();
    const workflow = id ? getWorkflowById(id) : undefined;

    // If no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but no account is selected, redirect to account selection
    if (user && !currentAccount) {
        return <Navigate to="/accounts" replace />;
    }
    if (!workflow) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">
                        Workflow Not Found
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        The workflow you are looking for could not be found.
                    </p>
                    <Button onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
                <WorkflowEditor
                    initialWorkflow={workflow}
                    onChange={updatedWorkflow => {
                        console.log('Workflow updated:', updatedWorkflow);
                    }}
                />
            </div>

            {/* Bottom Controls */}
        </div>
    );
};
export default WorkflowPage;
