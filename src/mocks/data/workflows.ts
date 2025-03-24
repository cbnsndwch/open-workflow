import { WorkflowWithMeta } from '@/contexts/workflow/types';
import { simpleWorkflow, complexWorkflow } from '@/data/sampleWorkflows';

// Associate sample workflows with specific accounts
export const accountWorkflows: Record<string, WorkflowWithMeta[]> = {
    // Acme Corp workflows
    '1': [
        {
            ...simpleWorkflow,
            id: 'simple-acme',
            name: 'Simple Workflow - Acme',
            type: 'Standard',
            accountId: '1',
            lastModified: new Date('2023-12-15').toISOString()
        },
        {
            ...complexWorkflow,
            id: 'complex-acme',
            name: 'Complex Workflow - Acme',
            type: 'Advanced',
            accountId: '1',
            lastModified: new Date('2023-12-20').toISOString()
        }
    ],
    // Widgets Inc workflows
    '2': [
        {
            ...simpleWorkflow,
            id: 'simple-widgets',
            name: 'Simple Workflow - Widgets',
            type: 'Standard',
            accountId: '2',
            lastModified: new Date('2023-11-05').toISOString()
        }
    ],
    // Personal account workflows
    '3': [
        {
            ...complexWorkflow,
            id: 'complex-personal',
            name: 'Personal Complex Workflow',
            type: 'Advanced',
            accountId: '3',
            lastModified: new Date('2023-10-10').toISOString()
        }
    ]
};

// Helper function to get workflows for a specific account
export const getWorkflowsForAccount = (
    accountId: string
): WorkflowWithMeta[] => {
    return accountWorkflows[accountId] || [];
};

// Add a workflow to an account
export const addWorkflowToAccount = (
    workflow: WorkflowWithMeta
): WorkflowWithMeta => {
    const { accountId } = workflow;

    // Ensure the account exists in our storage
    if (!accountWorkflows[accountId]) {
        accountWorkflows[accountId] = [];
    }

    // Ensure workflow has an ID
    if (!workflow.id) {
        workflow.id = `workflow-${Date.now()}`;
    }

    // Add the workflow to the account
    accountWorkflows[accountId].push(workflow);

    return workflow;
};

// Get all workflows (for admin purposes)
export const getAllWorkflows = (): WorkflowWithMeta[] => {
    return Object.values(accountWorkflows).flat();
};

// Find a specific workflow by ID
export const findWorkflowById = (
    workflowId: string
): WorkflowWithMeta | undefined => {
    return getAllWorkflows().find(workflow => workflow.id === workflowId);
};
