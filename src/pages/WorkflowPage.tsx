
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import WorkflowHeader from '@/components/workflow/WorkflowHeader';
import WorkflowEditor from '@/components/WorkflowEditor';
import WorkflowFooter from '@/components/workflow/WorkflowFooter';

const WorkflowPage = () => {
  const { id } = useParams();
  const { user, currentAccount } = useAuth();
  const { getWorkflowById } = useWorkflowContext();
  
  const workflow = id ? getWorkflowById(id) : undefined;
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but no account is selected, redirect to account selection
  if (user && !currentAccount) {
    return <Navigate to="/account-select" replace />;
  }
  
  return (
    <div className="h-full flex flex-col">
      <WorkflowHeader />
      <div className="flex-1 overflow-hidden bg-muted/20">
        <WorkflowEditor 
          initialWorkflow={workflow} 
          onChange={(updatedWorkflow) => {
            console.log("Workflow updated:", updatedWorkflow);
          }}
        />
      </div>
      <WorkflowFooter />
    </div>
  );
};

export default WorkflowPage;
