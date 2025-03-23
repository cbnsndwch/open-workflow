
import { useState } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import { executeWorkflow } from '@/lib/workflow/executor';
import { toast } from 'sonner';

export const useWorkflowExecution = (workflow: WorkflowGraph) => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStatus, setExecutionStatus] = useState<string>('');
  const [executionNodes, setExecutionNodes] = useState<string[]>([]);
  
  const executeActiveWorkflow = async () => {
    setIsExecuting(true);
    setExecutionStatus('Executing workflow...');
    setExecutionNodes([]);
    
    const visitedNodes: string[] = [];
    
    try {
      const result = await executeWorkflow(workflow, {
        nodeExecutors: {
          'core:http_request': async (node, inputs, context) => {
            console.log(`Executing HTTP request node: ${node.name}`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              outputs: {
                main: { status: 200, data: { message: 'Success' } }
              }
            };
          }
        },
        onNodeStart: (nodeId) => {
          const node = workflow.nodes.find(n => n.id === nodeId);
          if (node) {
            visitedNodes.push(node.name);
            setExecutionNodes([...visitedNodes]);
            setExecutionStatus(`Executing node: ${node.name}`);
          }
        },
        onNodeComplete: (nodeId, result) => {
          const node = workflow.nodes.find(n => n.id === nodeId);
          if (node) {
            setExecutionStatus(`Completed node: ${node.name}`);
          }
        },
        onNodeError: (nodeId, error) => {
          const node = workflow.nodes.find(n => n.id === nodeId);
          if (node) {
            setExecutionStatus(`Error executing node: ${node.name} - ${error.message}`);
          }
        }
      });
      
      if (result.successful) {
        setExecutionStatus('Workflow execution completed successfully');
        toast.success('Workflow executed successfully');
      } else {
        setExecutionStatus(`Workflow execution completed with errors: ${Object.keys(result.errors).length} errors`);
        toast.error('Workflow execution failed');
      }
    } catch (error) {
      setExecutionStatus(`Workflow execution failed: ${(error as Error).message}`);
      toast.error(`Execution failed: ${(error as Error).message}`);
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
