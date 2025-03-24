
import React from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import FlowConverter from './flow/FlowConverter';

interface ReactFlowWorkflowProps {
  workflow: WorkflowGraph;
  onWorkflowChange?: (workflow: WorkflowGraph) => void;
  readOnly?: boolean;
  className?: string;
}

const ReactFlowWorkflow: React.FC<ReactFlowWorkflowProps> = (props) => {
  return <FlowConverter {...props} />;
};

export default ReactFlowWorkflow;
