
import { http, HttpResponse } from 'msw';
import { getWorkflowsForAccount, findWorkflowById, addWorkflowToAccount } from '../data/workflows';
import { WorkflowWithMeta } from '@/contexts/WorkflowContext';

export const workflowHandlers = [
  // Get workflows for an account
  http.get('/api/workflows', ({ request }) => {
    console.log("MSW: Workflows request intercepted");
    
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    
    if (!accountId) {
      return HttpResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    const workflows = getWorkflowsForAccount(accountId);
    
    return HttpResponse.json(workflows, { status: 200 });
  }),
  
  // Create a new workflow
  http.post('/api/workflows', async ({ request }) => {
    console.log("MSW: Create workflow request intercepted");
    
    try {
      const requestData = await request.json();
      console.log("MSW: Workflow data received:", requestData);
      
      // Ensure the data has the required accountId property
      if (!requestData || typeof requestData !== 'object' || !('accountId' in requestData)) {
        return HttpResponse.json({ error: 'Account ID is required' }, { status: 400 });
      }
      
      // Create a properly typed WorkflowWithMeta object
      const workflow: WorkflowWithMeta = {
        id: requestData.id || `workflow-${Date.now()}`,
        name: requestData.name || 'New Workflow',
        type: requestData.type || 'Standard',
        accountId: requestData.accountId,
        lastModified: new Date().toISOString(),
        nodes: requestData.nodes || [],
        edges: requestData.edges || {}
      };
      
      // Add the workflow to the account
      const newWorkflow = addWorkflowToAccount(workflow);
      console.log("MSW: Workflow added successfully:", newWorkflow);
      
      return HttpResponse.json(newWorkflow, { status: 201 });
    } catch (error) {
      console.error('Error in workflow create handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
  
  // Get a specific workflow by ID
  http.get('/api/workflows/:id', ({ params }) => {
    console.log("MSW: Workflow detail request intercepted");
    
    const { id } = params;
    const workflow = findWorkflowById(id as string);
    
    if (!workflow) {
      return HttpResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    
    return HttpResponse.json(workflow, { status: 200 });
  }),
  
  // Update a workflow
  http.put('/api/workflows/:id', async ({ params, request }) => {
    console.log("MSW: Workflow update request intercepted");
    
    try {
      const { id } = params;
      const workflow = findWorkflowById(id as string);
      
      if (!workflow) {
        return HttpResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }
      
      const updatedData = await request.json();
      
      // Make sure updatedData is treated as an object when spreading
      const updatedWorkflow = {
        ...workflow,
        // Make sure updatedData is treated as an object when spreading
        ...(typeof updatedData === 'object' && updatedData !== null ? updatedData : {}),
        id: workflow.id,
        lastModified: new Date().toISOString()
      };
      
      return HttpResponse.json(updatedWorkflow, { status: 200 });
    } catch (error) {
      console.error('Error in workflow update handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
];
