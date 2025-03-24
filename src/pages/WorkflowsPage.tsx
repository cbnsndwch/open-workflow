
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth';

const WorkflowsPage = () => {
  const navigate = useNavigate();
  const { workflows, isLoading } = useWorkflowContext();
  const { currentAccount } = useAuth();

  const handleViewWorkflow = (id: string) => {
    navigate(`/workflow/${id}`);
  };

  if (!currentAccount) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Workflows</h1>
        <p className="text-muted-foreground">Please select an account to view workflows.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-2">Workflows</h1>
      <p className="text-muted-foreground mb-6">
        Showing workflows for {currentAccount.name}
      </p>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Nodes</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : workflows.length > 0 ? (
              workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>{workflow.type}</TableCell>
                  <TableCell>{workflow.nodes.length}</TableCell>
                  <TableCell>
                    {new Date(workflow.lastModified).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewWorkflow(workflow.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No workflows found for this account
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkflowsPage;
