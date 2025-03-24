
/**
 * Re-export everything from the new modular structure
 * This maintains backward compatibility with existing code
 */

export type { TraversalOptions, NodeVisitor } from './core';
export { traverseWorkflow, getReachableNodes } from './core';
export { getAllPaths, findPaths } from './paths';
export { findStartNodes, findTerminalNodes } from './node-finders';
export { getIncomingConnections, getOutgoingConnections } from './connections';
export { detectCycles, topologicalSort } from './validation';
