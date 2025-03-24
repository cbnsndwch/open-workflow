
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { useAuth } from '@/contexts/auth';

interface WorkflowContextType {
  workflows: WorkflowWithMeta[];
  getWorkflowById: (id: string) => WorkflowWithMeta | undefined;
  updateWorkflow: (id: string, workflow: WorkflowGraph) => void;
  addWorkflow: (workflow: WorkflowWithMeta) => Promise<void>;
  executeWorkflow: (id: string) => void;
  executeActiveWorkflow: () => void;
  isExecuting: boolean;
  executionStatus: string;
  executionNodes: Record<string, { status: string, result?: Record<string, any>, error?: string }>;
  executionNodeIds: string[];
  activeWorkflow: WorkflowWithMeta | undefined;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  fullscreenEdit: boolean;
  setFullscreenEdit: (fullscreen: boolean) => void;
  handleWorkflowChange: (workflow: WorkflowGraph) => void;
  isLoading: boolean;
}

export interface WorkflowWithMeta extends WorkflowGraph {
  id: string;
  name: string;
  type: string;
  accountId: string;
  lastModified: string;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<WorkflowWithMeta[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fullscreenEdit, setFullscreenEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { currentAccount } = useAuth();
  
  // Fetch workflows for the current account
  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!currentAccount) {
        setWorkflows([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/workflows?accountId=${currentAccount.id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkflows(data);
        } else {
          console.error('Failed to fetch workflows:', response.statusText);
          setWorkflows([]);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
        setWorkflows([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkflows();
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
  
  const updateWorkflow = async (id: string, updatedWorkflow: WorkflowGraph) => {
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
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedWorkflow,
          accountId: currentAccount.id,
          lastModified: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update workflow:', response.statusText);
        // Could revert the optimistic update here if needed
      }
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };
  
  const addWorkflow = async (workflow: WorkflowWithMeta): Promise<void> => {
    if (!currentAccount) throw new Error("No active account");
    
    try {
      // Add the workflow to the API
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workflow,
          accountId: currentAccount.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add workflow: ${response.statusText}`);
      }
      
      const newWorkflow = await response.json();
      
      // Update the local state with the new workflow
      setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
    } catch (error) {
      console.error('Error adding workflow:', error);
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
};

export const useWorkflowContext = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflowContext must be used within a WorkflowProvider');
  }
  return context;
};
