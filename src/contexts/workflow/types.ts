
import { WorkflowGraph } from '@/lib/workflow/types';

export interface WorkflowWithMeta extends WorkflowGraph {
  id: string;
  name: string;
  type: string;
  accountId: string;
  lastModified: string;
}

export interface WorkflowContextType {
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
