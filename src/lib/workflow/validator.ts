/**
 * Re-export everything from the new modular structure
 * This maintains backward compatibility with existing code
 */

export {
    validateWorkflow,
    detectCycles,
    findStartNodes,
    findTerminalNodes
} from './validator/index';
