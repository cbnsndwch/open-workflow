
import { WorkflowGraph, Node } from '../types';
import { NodeExecutionStatus, NodeExecutorFn, WorkflowExecutionContext } from './types';
import { createInitialNodeExecutionState, isNodeReady } from './staging';
import { collectNodeInputs } from './inputs';
import { executeNode } from './node-executor';

/**
 * Executes a workflow by sequentially processing all nodes in dependency order.
 */
export async function executeWorkflow(
  workflow: WorkflowGraph,
  options: {
    nodeExecutors: Record<string, NodeExecutorFn>,
    onNodeStart?: (nodeId: string) => Promise<Record<string, any>>,
    onNodeSuccess?: (nodeId: string, result: Record<string, any>) => Promise<Record<string, any>>,
    onNodeError?: (nodeId: string, error: any) => Promise<Record<string, any>>
  }
): Promise<Record<string, NodeExecutionStatus>> {
  // Initialize execution state
  const nodeStates = createInitialNodeExecutionState(workflow);
  
  // Create execution context
  const context: WorkflowExecutionContext = {
    workflow,
    nodeStates,
    nodeExecutors: options.nodeExecutors,
  };

  // Process nodes until all are completed or no more can be processed
  let progress = true;
  
  while (progress) {
    progress = false;
    
    for (const node of workflow.nodes) {
      const nodeId = node.id;
      const nodeState = nodeStates[nodeId];
      
      // Skip nodes that are already running, completed, or have errors
      if (nodeState.status !== 'pending') {
        continue;
      }
      
      // Check if the node is ready to execute
      if (isNodeReady(nodeId, workflow, nodeStates)) {
        // Mark the node as running
        nodeStates[nodeId] = { ...nodeState, status: 'running' };
        
        try {
          // Notify node start
          if (options.onNodeStart) {
            await options.onNodeStart(nodeId);
          }
          
          // Collect inputs from dependencies
          const inputs = collectNodeInputs(node, workflow, nodeStates);
          
          // Execute the node
          const executor = context.nodeExecutors[node.kind] || context.nodeExecutors[node.id];
          if (!executor) {
            throw new Error(`No executor found for node ${node.id} (${node.kind})`);
          }
          
          const result = await executor(node, inputs);
          
          // Update node state
          nodeStates[nodeId] = {
            status: 'completed',
            outputs: result
          };
          
          // Notify node success
          if (options.onNodeSuccess) {
            await options.onNodeSuccess(nodeId, result);
          }
          
          // Progress was made
          progress = true;
        } catch (error) {
          // Handle node execution error
          nodeStates[nodeId] = {
            status: 'error',
            outputs: {},
            error: error instanceof Error ? error.message : String(error),
          };
          
          // Notify node error
          if (options.onNodeError) {
            await options.onNodeError(nodeId, error);
          }
          
          // Consider this as progress since we tried
          progress = true;
        }
      }
    }
  }
  
  return nodeStates;
}
