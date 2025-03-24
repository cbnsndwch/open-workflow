
import { http, HttpResponse } from 'msw';
import { getWorkflowsForAccount, findWorkflowById, addWorkflowToAccount } from '../data/workflows';

export const workflowHandlers = [
  // Get workflows for an account
  http.get('/api/workflows', ({ request }) => {
    console.log("MSW: Workflows request intercepted");
    
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    
    if (!accountId) {
      return new HttpResponse(
        JSON.stringify({ error: 'Account ID is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const workflows = getWorkflowsForAccount(accountId);
    
    return new HttpResponse(
      JSON.stringify(workflows),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }),
  
  // Create a new workflow
  http.post('/api/workflows', async ({ request }) => {
    console.log("MSW: Create workflow request intercepted");
    
    try {
      const workflow = await request.json();
      
      if (!workflow.accountId) {
        return new HttpResponse(
          JSON.stringify({ error: 'Account ID is required' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Add the workflow to the account
      const newWorkflow = addWorkflowToAccount(workflow);
      
      return new HttpResponse(
        JSON.stringify(newWorkflow),
        { 
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in workflow create handler:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid request' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
  
  // Get a specific workflow by ID
  http.get('/api/workflows/:id', ({ params }) => {
    console.log("MSW: Workflow detail request intercepted");
    
    const { id } = params;
    const workflow = findWorkflowById(id as string);
    
    if (!workflow) {
      return new HttpResponse(
        JSON.stringify({ error: 'Workflow not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return new HttpResponse(
      JSON.stringify(workflow),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }),
  
  // Update a workflow
  http.put('/api/workflows/:id', async ({ params, request }) => {
    console.log("MSW: Workflow update request intercepted");
    
    try {
      const { id } = params;
      const workflow = findWorkflowById(id as string);
      
      if (!workflow) {
        return new HttpResponse(
          JSON.stringify({ error: 'Workflow not found' }),
          { 
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      const updatedData = await request.json();
      
      // In a real implementation, this would update the stored data
      // For this mock, we'll just return success
      
      // Make sure updatedData is treated as an object when spreading
      const updatedWorkflow = {
        ...workflow,
        // Make sure updatedData is treated as an object when spreading
        ...(typeof updatedData === 'object' && updatedData !== null ? updatedData : {}),
        id: workflow.id,
        lastModified: new Date().toISOString()
      };
      
      return new HttpResponse(
        JSON.stringify(updatedWorkflow),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error in workflow update handler:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid request' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }),
];
