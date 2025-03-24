import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { WorkflowWithMeta } from './workflow/types';
import { 
  fetchWorkflowsForAccount, 
  updateWorkflowApi,
  createWorkflowApi
} from './workflow/workflowService';
import { useMsw } from './msw/MswContext';

interface WorkflowContextType {
  workflows: WorkflowWithMeta[];
  isLoading: boolean;
  error: string | null;
  refreshWorkflows: () => Promise<void>;
  updateWorkflow: (id: string, workflow: WorkflowWithMeta) => Promise<void>;
  createWorkflow: (workflow: WorkflowWithMeta) => Promise<void>;
  getWorkflowById: (id: string) => WorkflowWithMeta | undefined;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accountId } = useParams<{ accountId: string }>();
  const { useFallback } = useMsw();
  
  const [workflows, setWorkflows] = useState<WorkflowWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkflows = async () => {
    if (!accountId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedWorkflows = await fetchWorkflowsForAccount(accountId, useFallback);
      setWorkflows(fetchedWorkflows);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      refreshWorkflows();
    }
  }, [accountId]);

  const updateWorkflow = async (id: string, workflow: WorkflowWithMeta) => {
    if (!accountId) return;
    
    try {
      await updateWorkflowApi(id, workflow, accountId, useFallback);
      
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(w => 
          w.id === id ? { ...workflow, lastModified: new Date().toISOString() } : w
        )
      );
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  };

  const createWorkflow = async (workflow: WorkflowWithMeta) => {
    if (!accountId) return;
    
    try {
      const newWorkflow = await createWorkflowApi(workflow, accountId, useFallback);
      
      if (newWorkflow) {
        setWorkflows(prevWorkflows => [...prevWorkflows, newWorkflow]);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  };

  const getWorkflowById = (id: string) => {
    return workflows.find(workflow => workflow.id === id);
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        isLoading,
        error,
        refreshWorkflows,
        updateWorkflow,
        createWorkflow,
        getWorkflowById
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflowContext = () => {
  throw new Error('This context is deprecated. Use useWorkflowContext from contexts/workflow/WorkflowProvider instead');
};
