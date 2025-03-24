
import { useState } from 'react';
import { WorkflowGraph, Node } from '@/lib/workflow/types';
import { executeWorkflow, NodeExecutorFn } from '@/lib/workflow/executor';

type ExecutionStatus = 'idle' | 'executing' | 'completed' | 'error';

interface NodeStatus {
  status: 'pending' | 'executing' | 'completed' | 'error';
  result?: Record<string, any>;
  error?: string;
}

export const useWorkflowExecution = (workflow: WorkflowGraph) => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('idle');
  const [executionNodes, setExecutionNodes] = useState<Record<string, NodeStatus>>({});

  // Custom executor functions
  const nodeExecutors: Record<string, NodeExecutorFn> = {
    // Define custom executors for specific node types
    // These should return promises with the execution result
    'core:http_request': async (node: Node): Promise<Record<string, any>> => {
      // Simulate HTTP request
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 200, body: { success: true, data: 'Sample response data' } });
        }, 1500);
      });
    }
  };

  // Handlers for workflow execution
  const handleNodeStart = async (nodeId: string): Promise<Record<string, any>> => {
    setExecutionNodes((prev) => ({
      ...prev,
      [nodeId]: { status: 'executing' }
    }));
    return {}; // Return empty object to satisfy the type
  };

  const handleNodeSuccess = async (nodeId: string, result: Record<string, any>): Promise<Record<string, any>> => {
    setExecutionNodes((prev) => ({
      ...prev,
      [nodeId]: { status: 'completed', result }
    }));
    return result;
  };

  const handleNodeError = async (nodeId: string, error: any): Promise<Record<string, any>> => {
    setExecutionNodes((prev) => ({
      ...prev,
      [nodeId]: { status: 'error', error: error.message || String(error) }
    }));
    return { error: error.message || String(error) };
  };

  const executeActiveWorkflow = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setExecutionStatus('executing');
    setExecutionNodes({});
    
    // Reset nodes to pending state
    const initialNodes: Record<string, NodeStatus> = {};
    workflow.nodes.forEach(node => {
      initialNodes[node.id] = { status: 'pending' };
    });
    setExecutionNodes(initialNodes);
    
    try {
      await executeWorkflow(workflow, {
        nodeExecutors,
        onNodeStart: handleNodeStart,
        onNodeSuccess: handleNodeSuccess,
        onNodeError: handleNodeError
      });
      
      setExecutionStatus('completed');
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setExecutionStatus('error');
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    isExecuting,
    executionStatus,
    executionNodes,
    executeActiveWorkflow
  };
};
