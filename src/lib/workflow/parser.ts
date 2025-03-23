
import { WorkflowGraph } from './types';
import yaml from 'js-yaml';

/**
 * Parses a JSON string into a WorkflowGraph
 */
export function parseJsonWorkflow(jsonString: string): WorkflowGraph {
  try {
    return JSON.parse(jsonString) as WorkflowGraph;
  } catch (error) {
    throw new Error(`Failed to parse workflow JSON: ${(error as Error).message}`);
  }
}

/**
 * Serializes a WorkflowGraph to a JSON string
 */
export function serializeWorkflowToJson(workflow: WorkflowGraph): string {
  try {
    return JSON.stringify(workflow, null, 2);
  } catch (error) {
    throw new Error(`Failed to serialize workflow to JSON: ${(error as Error).message}`);
  }
}

/**
 * Parses a YAML string into a WorkflowGraph
 */
export function parseYamlWorkflow(yamlString: string): WorkflowGraph {
  try {
    return yaml.load(yamlString) as WorkflowGraph;
  } catch (error) {
    throw new Error(`Failed to parse workflow YAML: ${(error as Error).message}`);
  }
}

/**
 * Serializes a WorkflowGraph to a YAML string
 */
export function serializeWorkflowToYaml(workflow: WorkflowGraph): string {
  try {
    return yaml.dump(workflow, { indent: 2 });
  } catch (error) {
    throw new Error(`Failed to serialize workflow to YAML: ${(error as Error).message}`);
  }
}

/**
 * Clones a workflow graph deeply
 */
export function cloneWorkflow(workflow: WorkflowGraph): WorkflowGraph {
  return JSON.parse(JSON.stringify(workflow)) as WorkflowGraph;
}
