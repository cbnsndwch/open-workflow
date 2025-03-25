import { WorkflowGraph } from '@/lib/workflow/types';

import FlowConverter from './flow/FlowConverter';

interface ReactFlowWorkflowProps {
    workflow: WorkflowGraph;
    onWorkflowChange?: (workflow: WorkflowGraph) => void;
    readOnly?: boolean;
    className?: string;
}

export default function ReactFlowWorkflow(props: ReactFlowWorkflowProps) {
    return <FlowConverter {...props} />;
}
