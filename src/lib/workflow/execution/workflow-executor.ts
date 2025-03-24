
import {
  WorkflowGraph,
  ExecutionContext,
  ExecutionOptions,
  WorkflowExecutionResult,
} from '../types';
import { findStartNodes } from '../traversal';
import { processStagedNodes } from './staging';
import { executeNode } from './node-executor';

/**
 * Execute a workflow graph
 */
export async function executeWorkflow(
  workflow: WorkflowGraph,
  options: ExecutionOptions = {}
): Promise<WorkflowExecutionResult> {
  const {
    startNodeId,
    initialState = {},
    nodeExecutors = {},
    onNodeStart,
    onNodeComplete,
    onNodeError,
  } = options;

  // Create execution context
  const context: ExecutionContext = {
    state: { ...initialState },
    nodeResults: {},
    visitedNodes: new Set<string>(),
    stagedNodes: new Map<string, any>(), // Track nodes waiting for inputs
    nodeExecutors,
    onNodeStart,
    onNodeComplete,
    onNodeError,
  };

  // Track errors during execution
  const errors: Record<string, Error> = {};

  // Find start node
  let startNodeName: string | undefined;
  if (startNodeId) {
    const startNode = workflow.nodes.find(n => n.id === startNodeId);
    if (!startNode) {
      throw new Error(`Start node with ID ${startNodeId} not found`);
    }
    startNodeName = startNode.name;
  } else {
    const startNodes = findStartNodes(workflow);
    if (startNodes.length === 0) {
      throw new Error('No start nodes found in workflow');
    }
    startNodeName = startNodes[0];
  }

  // Execute the workflow starting from the start node
  try {
    // Initialize the staged nodes queue
    await executeNode(workflow, startNodeName, context, errors);
    
    // Process staged nodes until none are left or no progress is made
    await processStagedNodes(workflow, context, errors);
  } catch (error) {
    // Catch any uncaught errors
    console.error('Workflow execution failed with error:', error);
    return {
      nodeResults: context.nodeResults,
      finalState: context.state,
      errors,
      successful: false,
    };
  }

  // Determine if the workflow execution was successful
  const successful = Object.keys(errors).length === 0;

  // Check if any nodes are still staged (inputs never satisfied)
  if (context.stagedNodes.size > 0) {
    console.warn(`Workflow execution completed with ${context.stagedNodes.size} nodes never executed due to unsatisfied inputs:`, 
      Array.from(context.stagedNodes.keys()).join(', '));
  }

  return {
    nodeResults: context.nodeResults,
    finalState: context.state,
    errors,
    successful,
  };
}
