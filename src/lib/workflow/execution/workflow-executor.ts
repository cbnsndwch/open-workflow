
import { WorkflowGraph } from '../types';
import { NodeExecutionStatus, NodeExecutorFn, WorkflowExecutionContext } from './types';
import { createInitialNodeExecutionState, isNodeReady } from './staging';
import { collectNodeInputs } from './inputs';
import { executeNode } from './node-executor';

/**
 * Executes a workflow by sequentially processing all nodes in dependency order.
 */
export async function executeWorkflow(
  workflow: WorkflowGraph,
  nodeExecutors: Record<string, NodeExecutorFn>
): Promise<Record<string, NodeExecutionStatus>> {
  // Initialize execution state
  const nodeStates = createInitialNodeExecutionState(workflow);
  
  // Create execution context
  const context: WorkflowExecutionContext = {
    workflow,
    nodeStates,
    nodeExecutors,
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
          // Collect inputs from dependencies
          const inputs = collectNodeInputs(node, workflow, nodeStates);
          
          // Execute the node
          await executeNode(node, inputs, context);
          
          // Progress was made
          progress = true;
        } catch (error) {
          // Handle node execution error
          nodeStates[nodeId] = {
            status: 'error',
            outputs: {},
            error: error instanceof Error ? error.message : String(error),
          };
          
          // Consider this as progress since we tried
          progress = true;
        }
      }
    }
  }
  
  return nodeStates;
}
