
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { simpleWorkflow, complexWorkflow } from '@/data/sampleWorkflows';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';

interface WorkflowContextType {
  selectedWorkflow: string;
  setSelectedWorkflow: (workflow: string) => void;
  activeWorkflow: WorkflowGraph;
  setActiveWorkflow: (workflow: WorkflowGraph) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  fullscreenEdit: boolean;
  setFullscreenEdit: (mode: boolean) => void;
  isExecuting: boolean;
  executionStatus: string;
  executionNodes: Record<string, { status: string, result?: Record<string, any>, error?: string }>;
  executionNodeIds: string[];
  executeActiveWorkflow: () => void;
  handleWorkflowChange: (workflow: WorkflowGraph) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowGraph>(simpleWorkflow);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('simple');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fullscreenEdit, setFullscreenEdit] = useState<boolean>(false);
  
  const {
    isExecuting,
    executionStatus,
    executionNodes,
    executionNodeIds,
    executeActiveWorkflow
  } = useWorkflowExecution(activeWorkflow);
  
  useEffect(() => {
    if (selectedWorkflow === 'simple') {
      setActiveWorkflow(simpleWorkflow);
    } else {
      setActiveWorkflow(complexWorkflow);
    }
  }, [selectedWorkflow]);
  
  const handleWorkflowChange = (workflow: WorkflowGraph) => {
    setActiveWorkflow(workflow);
  };

  return (
    <WorkflowContext.Provider
      value={{
        selectedWorkflow,
        setSelectedWorkflow,
        activeWorkflow,
        setActiveWorkflow,
        editMode,
        setEditMode,
        fullscreenEdit,
        setFullscreenEdit,
        isExecuting,
        executionStatus,
        executionNodes,
        executionNodeIds,
        executeActiveWorkflow,
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
