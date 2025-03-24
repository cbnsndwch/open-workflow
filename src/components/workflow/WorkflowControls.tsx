import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Expand } from 'lucide-react';
import { useWorkflowContext } from '@/contexts/workflow';

const WorkflowControls: React.FC = () => {
    const {
        editMode,
        setEditMode,
        setFullscreenEdit,
        isExecuting,
        executionStatus,
        executionNodes,
        executionNodeIds = [],
        executeActiveWorkflow
    } = useWorkflowContext();

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Button
                    variant={!editMode ? 'default' : 'outline'}
                    onClick={() => setEditMode(false)}
                    className="flex-1"
                >
                    View Mode
                </Button>
                <Button
                    variant={editMode ? 'default' : 'outline'}
                    onClick={() => setEditMode(true)}
                    className="flex-1"
                >
                    Edit Mode
                </Button>
            </div>

            {editMode && (
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={() => setFullscreenEdit(true)}
                >
                    <Expand className="mr-2 h-4 w-4" />
                    <span>Fullscreen Editor</span>
                </Button>
            )}

            <Button
                onClick={executeActiveWorkflow}
                disabled={isExecuting || editMode}
                className="w-full"
            >
                {isExecuting ? 'Executing...' : 'Execute Workflow'}
            </Button>

            {executionStatus && (
                <Alert>
                    <AlertTitle>Execution Status</AlertTitle>
                    <AlertDescription className="text-sm">
                        {executionStatus}
                    </AlertDescription>
                </Alert>
            )}

            {executionNodeIds.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">
                        Execution Path:
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md text-xs">
                        {executionNodeIds.join(' → ')}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowControls;
