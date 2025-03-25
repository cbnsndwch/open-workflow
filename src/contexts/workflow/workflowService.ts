import { WorkflowGraph } from '@/lib/workflow/types';
import { WorkflowWithMeta } from './types';
import { getWorkflowsForAccount } from '@/mocks/data/workflows';
import { useMsw } from '../msw/useMsw';

/**
 * Fetches workflows for a specific account
 */
export const fetchWorkflowsForAccount = async (
    accountId: string,
    useFallbackMode: boolean = false
): Promise<WorkflowWithMeta[]> => {
    // If we're in fallback mode, use mock data directly
    if (useFallbackMode) {
        console.log('Using fallback mode for workflows');
        return getWorkflowsForAccount(accountId);
    }

    try {
        // Otherwise try fetching from the API
        const response = await fetch(`/api/workflows?accountId=${accountId}`);

        // Check for HTML response (which would indicate the API isn't working)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            console.log('Received HTML response, using fallback data');
            return getWorkflowsForAccount(accountId);
        }

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch workflows:', response.statusText);
            // Fallback to mock data on error
            return getWorkflowsForAccount(accountId);
        }
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return getWorkflowsForAccount(accountId);
    }
};

/**
 * Updates a workflow
 */
export const updateWorkflowApi = async (
    id: string,
    workflow: WorkflowGraph,
    accountId: string,
    useFallbackMode: boolean = false
): Promise<WorkflowWithMeta | undefined> => {
    // Skip API call if in fallback mode
    if (useFallbackMode) {
        console.log('Using fallback mode, skipping API update');
        return;
    }

    try {
        const response = await fetch(`/api/workflows/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...workflow,
                accountId,
                lastModified: new Date().toISOString()
            })
        });

        // Check for HTML response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            console.log('Received HTML response from update API, ignoring');
            return;
        }

        if (!response.ok) {
            console.error('Failed to update workflow:', response.statusText);
            return;
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating workflow:', error);
        return;
    }
};

/**
 * Creates a new workflow
 */
export const createWorkflowApi = async (
    workflow: WorkflowWithMeta,
    accountId: string,
    useFallbackMode: boolean = false
): Promise<WorkflowWithMeta | undefined> => {
    // If we're in fallback mode, add workflow locally
    if (useFallbackMode) {
        console.log('Using fallback mode, adding workflow locally');
        return {
            ...workflow,
            id: workflow.id || `workflow-${Date.now()}`,
            accountId,
            lastModified: new Date().toISOString()
        };
    }

    try {
        // Add the workflow to the API
        const response = await fetch('/api/workflows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...workflow,
                accountId
            })
        });

        // Check for HTML response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            console.log('Received HTML response from add API, using local add');
            return {
                ...workflow,
                id: workflow.id || `workflow-${Date.now()}`,
                accountId,
                lastModified: new Date().toISOString()
            };
        }

        if (!response.ok) {
            throw new Error(`Failed to add workflow: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating workflow:', error);

        // Fall back to local creation
        return {
            ...workflow,
            id: workflow.id || `workflow-${Date.now()}`,
            accountId,
            lastModified: new Date().toISOString()
        };
    }
};
