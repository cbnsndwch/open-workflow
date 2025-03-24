import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { useAuth } from '@/contexts/auth';
import { getWorkflowsForAccount } from '@/mocks/data/workflows';

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
        // Try to determine if we should use MSW or fallback mode
        const useFallbackMode = !Boolean((window as any).__MSW_REGISTRATION__);
        
        if (useFallbackMode) {
          console.log("Using fallback mode for workflows");
          // Use the mock data directly when in fallback mode
          const mockWorkflows = getWorkflowsForAccount(currentAccount.id);
          setWorkflows(mockWorkflows);
          setIsLoading(false);
          return;
        }
        
        // Otherwise try fetching from the API
        const response = await fetch(`/api/workflows?accountId=${currentAccount.id}`);
        
        // Check for HTML response (which would indicate the API isn't working)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.log("Received HTML response, using fallback data");
          const mockWorkflows = getWorkflowsForAccount(currentAccount.id);
          setWorkflows(mockWorkflows);
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setWorkflows(data);
        } else {
          console.error('Failed to fetch workflows:', response.statusText);
          // Fallback to mock data on error
          const mockWorkflows = getWorkflowsForAccount(currentAccount.id);
          setWorkflows(mockWorkflows);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
        // Fallback to mock data on error
        const mockWorkflows = getWorkflowsForAccount(currentAccount.id);
        setWorkflows(mockWorkflows);
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
      // Check if we should use fallback mode
      const useFallbackMode = !Boolean((window as any).__MSW_REGISTRATION__);
      
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
      
      // Skip API call if in fallback mode
      if (useFallbackMode) {
        console.log("Using fallback mode, skipping API update");
        return;
      }
      
      // Then send update to API if not in fallback mode
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
      
      // Check for HTML response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.log("Received HTML response from update API, ignoring");
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to update workflow:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };
  
  const addWorkflow = async (workflow: WorkflowWithMeta): Promise<void> => {
    if (!currentAccount) throw new Error("No active account");
    
    try {
      // Check if we should use fallback mode
      const useFallbackMode = !Boolean((window as any).__MSW_REGISTRATION__);
      
      if (useFallbackMode) {
        console.log("Using fallback mode, adding workflow locally");
        const newWorkflow = {
          ...workflow,
          id: workflow.id || `workflow-${Date.now()}`,
          accountId: currentAccount.id,
          lastModified: new Date().toISOString()
        };
        
        // Update the local state with the new workflow
        setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
        return;
      }
      
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
      
      // Check for HTML response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.log("Received HTML response from add API, using local add");
        const newWorkflow = {
          ...workflow,
          id: workflow.id || `workflow-${Date.now()}`,
          accountId: currentAccount.id,
          lastModified: new Date().toISOString()
        };
        
        // Update the local state with the new workflow
        setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to add workflow: ${response.statusText}`);
      }
      
      const newWorkflow = await response.json();
      
      // Update the local state with the new workflow
      setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
    } catch (error) {
      console.error('Error adding workflow:', error);
      
      // Fallback: Add workflow locally on error
      const newWorkflow = {
        ...workflow,
        id: workflow.id || `workflow-${Date.now()}`,
        accountId: currentAccount.id,
        lastModified: new Date().toISOString()
      };
      
      setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
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
