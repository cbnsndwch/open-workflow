
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { simpleWorkflow, complexWorkflow } from '@/data/sampleWorkflows';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';

interface WorkflowContextType {
  workflows: WorkflowWithMeta[];
  getWorkflowById: (id: string) => WorkflowWithMeta | undefined;
  updateWorkflow: (id: string, workflow: WorkflowGraph) => void;
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
}

export interface WorkflowWithMeta extends WorkflowGraph {
  id: string;
  name: string;
  type: string;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Add metadata to sample workflows
const sampleWorkflows: WorkflowWithMeta[] = [
  {
    ...simpleWorkflow,
    id: 'simple',
    name: 'Simple Workflow',
    type: 'Standard',
  },
  {
    ...complexWorkflow,
    id: 'complex',
    name: 'Complex Workflow',
    type: 'Advanced',
  }
];

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<WorkflowWithMeta[]>(sampleWorkflows);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fullscreenEdit, setFullscreenEdit] = useState<boolean>(false);
  
  const activeWorkflow = activeWorkflowId 
    ? workflows.find(w => w.id === activeWorkflowId) 
    : workflows[0];
  
  const {
    isExecuting,
    executionStatus,
    executionNodes,
    executionNodeIds,
    executeActiveWorkflow
  } = useWorkflowExecution(activeWorkflow || workflows[0]);
  
  const getWorkflowById = (id: string): WorkflowWithMeta | undefined => {
    return workflows.find(w => w.id === id);
  };
  
  const updateWorkflow = (id: string, updatedWorkflow: WorkflowGraph) => {
    setWorkflows(prevWorkflows => 
      prevWorkflows.map(w => 
        w.id === id 
          ? { ...w, ...updatedWorkflow, id, name: w.name, type: w.type } 
          : w
      )
    );
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
        handleWorkflowChange
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
