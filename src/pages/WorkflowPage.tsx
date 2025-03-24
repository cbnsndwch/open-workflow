
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowEditor } from '@/components/WorkflowEditor';
import { WorkflowFooter } from '@/components/workflow/WorkflowFooter';

const WorkflowPage = () => {
  const { id } = useParams();
  const { user, currentAccount } = useAuth();
  
  // If no user is logged in, don't render anything (auth context will handle redirect)
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but no account is selected, redirect to account selection
  if (user && !currentAccount) {
    return <Navigate to="/account-select" replace />;
  }
  
  return (
    <div className="h-full flex flex-col">
      <WorkflowHeader workflowId={id} />
      <div className="flex-1 overflow-hidden bg-muted/20">
        <WorkflowEditor workflowId={id} />
      </div>
      <WorkflowFooter workflowId={id} />
    </div>
  );
};

export default WorkflowPage;
