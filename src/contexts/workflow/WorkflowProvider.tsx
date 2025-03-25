import { useState, useEffect, PropsWithChildren } from 'react';

import { useAuth } from '@/contexts/auth';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { WorkflowGraph } from '@/lib/workflow/types';

import { WorkflowWithMeta } from './types';
import { WorkflowContext } from './useWorkflowContext';
import {
    fetchWorkflowsForAccount,
    updateWorkflowApi,
    createWorkflowApi
} from './workflowService';

export function WorkflowProvider({ children }: PropsWithChildren) {
    const [workflows, setWorkflows] = useState<WorkflowWithMeta[]>([]);
    const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(
        null
    );
    const [editMode, setEditMode] = useState<boolean>(false);
    const [fullscreenEdit, setFullscreenEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { currentAccount } = useAuth();

    // Fetch workflows for the current account
    useEffect(() => {
        const loadWorkflows = async () => {
            if (!currentAccount) {
                setWorkflows([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const workflowsData = await fetchWorkflowsForAccount(
                    currentAccount.id
                );
                setWorkflows(workflowsData);
            } catch (error) {
                console.error('Error fetching workflows:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWorkflows();
    }, [currentAccount]);

    const activeWorkflow = activeWorkflowId
        ? workflows.find(w => w.id === activeWorkflowId)
        : workflows[0];

    const {
        isExecuting,
        executionStatus,
        executionNodes,
        executionNodeIds,
        executeActiveWorkflow
    } = useWorkflowExecution(activeWorkflow);

    const getWorkflowById = (id: string): WorkflowWithMeta | undefined => {
        return workflows.find(w => w.id === id);
    };

    const updateWorkflow = async (
        id: string,
        updatedWorkflow: WorkflowGraph
    ) => {
        if (!currentAccount) return;

        try {
            // First update UI optimistically
            setWorkflows(prevWorkflows =>
                prevWorkflows.map(w =>
                    w.id === id
                        ? {
                              ...w,
                              ...updatedWorkflow,
                              id,
                              name: w.name,
                              type: w.type,
                              accountId: w.accountId,
                              lastModified: new Date().toISOString()
                          }
                        : w
                )
            );

            // Then send update to API
            await updateWorkflowApi(id, updatedWorkflow, currentAccount.id);
        } catch (error) {
            console.error('Error updating workflow:', error);
        }
    };

    const addWorkflow = async (workflow: WorkflowWithMeta): Promise<void> => {
        if (!currentAccount) throw new Error('No active account');

        try {
            const newWorkflow = await createWorkflowApi(
                workflow,
                currentAccount.id
            );

            if (newWorkflow) {
                // Update the local state with the new workflow
                setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
            }
        } catch (error) {
            console.error('Error adding workflow:', error);

            // Fallback: Add workflow locally on error
            const localWorkflow = {
                ...workflow,
                id: workflow.id || `workflow-${Date.now()}`,
                accountId: currentAccount.id,
                lastModified: new Date().toISOString()
            };

            setWorkflows(prevWorkflows => [...prevWorkflows, localWorkflow]);
            throw error;
        }
    };

    const executeWorkflow = (id: string) => {
        setActiveWorkflowId(id);
        // We need to wait for activeWorkflow to be updated before executing
        setTimeout(() => {
            executeActiveWorkflow();
        }, 0);
    };

    const handleWorkflowChange = (updatedWorkflow: WorkflowGraph) => {
        if (activeWorkflowId) {
            updateWorkflow(activeWorkflowId, updatedWorkflow);
        }
    };

    return (
        <WorkflowContext.Provider
            value={{
                workflows,
                getWorkflowById,
                updateWorkflow,
                addWorkflow,
                executeWorkflow,
                executeActiveWorkflow,
                isExecuting,
                executionStatus,
                executionNodes,
                executionNodeIds,
                activeWorkflow,
                editMode,
                setEditMode,
                fullscreenEdit,
                setFullscreenEdit,
                handleWorkflowChange,
                isLoading
            }}
        >
            {children}
        </WorkflowContext.Provider>
    );
}
