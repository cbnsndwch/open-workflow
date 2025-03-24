
import {
  WorkflowGraph,
  Node,
  ExecutionContext,
} from '../types';
import { getNodeExecutor } from './node-executors';
import { areAllRequiredInputsAvailable, collectNodeInputs } from './inputs';
import { getMissingInputs } from './dependencies';

/**
 * Execute a single node and its downstream nodes
 * 
 * IMPORTANT: This function handles execution dependencies in the following ways:
 * 1. Nodes with unsatisfied input dependencies are staged for later execution
 * 2. The visitedNodes set ensures that a node is only executed once
 * 3. Cycles are handled by tracking the visit path and detecting repeated nodes
 * 4. The execution follows a dependency-aware approach where nodes are only
 *    executed when their inputs are available
 */
export async function executeNode(
  workflow: WorkflowGraph,
  nodeName: string,
  context: ExecutionContext,
  errors: Record<string, Error>,
  visitPath: string[] = []
): Promise<void> {
  // Check for cycles
  if (visitPath.includes(nodeName)) {
    console.warn(`Cycle detected in execution: ${visitPath.join(' -> ')} -> ${nodeName}`);
    // We allow cycles, but we need to check if we've already visited this node in this execution
    if (context.visitedNodes.has(nodeName)) {
      return;
    }
  }

  // Find the node by name
  const node = workflow.nodes.find(n => n.name === nodeName);
  if (!node) {
    throw new Error(`Node "${nodeName}" not found in workflow`);
  }

  // Check if all required inputs are available
  const inputsAvailable = areAllRequiredInputsAvailable(workflow, nodeName, context);
  
  if (!inputsAvailable) {
    // Stage this node for later execution when inputs are available
    const missingInputs = getMissingInputs(workflow, nodeName, context);
    
    // Only add to staged nodes if not already visited
    if (!context.visitedNodes.has(nodeName)) {
      context.stagedNodes.set(node.id, {
        nodeName,
        missingInputs,
        visitPath: [...visitPath, nodeName]
      });
      
      console.log(`Node ${nodeName} staged for later execution; missing inputs: ${missingInputs.join(', ')}`);
    }
    
    // Don't execute this node now, but continue with downstream nodes
    // (they will also get staged if they depend on this one)
  } else {
    // Mark node as visited
    context.visitedNodes.add(nodeName);
    visitPath.push(nodeName);

    // Notify of node start
    if (context.onNodeStart) {
      context.onNodeStart(node.id);
    }

    try {
      // Collect inputs for this node - they should all be available now
      const inputs = collectNodeInputs(workflow, nodeName, context);
      
      // Execute the node
      const executor = getNodeExecutor(node, context.nodeExecutors);
      const result = await executor(node, inputs, context);

      // Store the result
      context.nodeResults[node.id] = result;

      // Update state with node outputs
      if (result.outputs) {
        context.state[node.name] = result.outputs;
      }

      // Notify of node completion
      if (context.onNodeComplete) {
        context.onNodeComplete(node.id, result);
      }

      // Check for error
      if (result.error) {
        errors[node.id] = result.error;
        if (context.onNodeError) {
          context.onNodeError(node.id, result.error);
        }
      }
    } catch (error) {
      // Handle node execution error
      const nodeError = error instanceof Error ? error : new Error(String(error));
      errors[node.id] = nodeError;
      
      // Notify of node error
      if (context.onNodeError) {
        context.onNodeError(node.id, nodeError);
      }
      
      // Log the error
      console.error(`Error executing node ${nodeName}:`, nodeError);
    }
  }

  // Execute downstream nodes regardless - they'll be staged if their inputs aren't ready
  const nodeConnections = workflow.edges[nodeName] || {};
  for (const outputPort of Object.keys(nodeConnections)) {
    const connections = nodeConnections[outputPort];
    
    // Sort connections by order
    const sortedConnections = [...connections].sort((a, b) => a.order - b.order);
    
    // Execute each connected node
    for (const connection of sortedConnections) {
      await executeNode(
        workflow,
        connection.node,
        context,
        errors,
        [...visitPath]
      );
    }
  }
}
