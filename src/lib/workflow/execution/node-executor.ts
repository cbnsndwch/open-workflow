
import { Node } from '../types';
import { NodeExecutorFn } from './types';

/**
 * Execute a single node with the appropriate executor
 */
export async function executeNode(
  node: Node,
  inputs: Record<string, any>,
  context: {
    nodeExecutors: Record<string, NodeExecutorFn>
  }
): Promise<Record<string, any>> {
  // Get the appropriate executor for this node
  const executor = context.nodeExecutors[node.kind] || context.nodeExecutors[node.id];
  
  if (!executor) {
    throw new Error(`No executor found for node ${node.id} (${node.kind})`);
  }
  
  // Execute the node
  const result = await executor(node, inputs);
  return result;
}
