
import {
  WorkflowGraph,
  ExecutionContext,
} from '../types';
import { executeNode, getMissingInputs } from './core';
import { areAllRequiredInputsAvailable } from './inputs';

/**
 * Information about a staged node waiting for its inputs
 */
export interface StagedNodeInfo {
  nodeName: string;
  missingInputs: string[];
  visitPath: string[];
}

/**
 * Process all staged nodes until none are left or no progress is made
 */
export async function processStagedNodes(
  workflow: WorkflowGraph, 
  context: ExecutionContext,
  errors: Record<string, Error>
): Promise<void> {
  let progress = true;
  let iterations = 0;
  const MAX_ITERATIONS = 1000; // Safety limit
  
  while (progress && context.stagedNodes.size > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    progress = false;
    
    // Get a snapshot of the current staged nodes to iterate over
    const stagedEntries = Array.from(context.stagedNodes.entries());
    
    for (const [nodeId, info] of stagedEntries) {
      // Check if all required inputs are now available
      const allInputsAvailable = areAllRequiredInputsAvailable(workflow, info.nodeName, context);
      
      if (allInputsAvailable) {
        // Remove from staged nodes
        context.stagedNodes.delete(nodeId);
        progress = true;
        
        // Now execute the node as its inputs are ready
        const node = workflow.nodes.find(n => n.name === info.nodeName);
        if (node) {
          try {
            // Execute the node now that inputs are available
            await executeNode(workflow, info.nodeName, context, errors, info.visitPath);
          } catch (error) {
            console.error(`Error executing previously staged node ${info.nodeName}:`, error);
            errors[node.id] = error instanceof Error ? error : new Error(String(error));
            if (context.onNodeError) {
              context.onNodeError(node.id, errors[node.id]);
            }
          }
        }
      }
    }
    
    if (iterations === MAX_ITERATIONS) {
      console.error('Reached maximum staged node processing iterations, likely due to a circular dependency');
    }
  }
}
