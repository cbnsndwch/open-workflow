
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { useWorkflowContext } from '@/contexts/workflow/WorkflowProvider';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

function WorkflowCard({ workflow }) {
  const { accountId } = useParams();
  
  const date = new Date(workflow.lastModified);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{workflow.name}</CardTitle>
        <CardDescription>{workflow.type}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Workflow Preview</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-muted-foreground">Last modified: {formattedDate}</span>
        <Button asChild size="sm">
          <Link to={`/${accountId}/workflow/${workflow.id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const WorkflowsPage = () => {
  const { workflows, isLoading } = useWorkflowContext();
  const { currentAccount, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkedForWorkflows, setCheckedForWorkflows] = useState(false);
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but no account is selected, redirect to account selection
  if (user && !currentAccount) {
    return <Navigate to="/accounts" replace />;
  }
  
  // Check if the user has no workflows and show the onboarding wizard
  useEffect(() => {
    if (!isLoading && workflows.length === 0 && !checkedForWorkflows && currentAccount) {
      setShowOnboarding(true);
      setCheckedForWorkflows(true);
    } else if (workflows.length > 0 && !checkedForWorkflows) {
      setCheckedForWorkflows(true);
    }
  }, [isLoading, workflows, currentAccount, checkedForWorkflows]);
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            {currentAccount ? `Manage your workflows in ${currentAccount.name}` : 'Manage your workflows'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          title="New Workflow"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : workflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No workflows found</h2>
          <p className="text-muted-foreground mt-2">
            Create a new workflow or use the onboarding wizard to get started.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setShowOnboarding(true)}
          >
            Get Started
          </Button>
        </div>
      )}
      
      <OnboardingWizard 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </div>
  );
};

export default WorkflowsPage;
