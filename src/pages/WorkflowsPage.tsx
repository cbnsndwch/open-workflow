
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

const WorkflowsPage = () => {
  const navigate = useNavigate();
  const { workflows } = useWorkflowContext();

  const handleViewWorkflow = (id: string) => {
    navigate(`/workflow/${id}`);
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Workflows</h1>
      
      <div className="rounded-md border">
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
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.name}</TableCell>
                <TableCell>{workflow.type}</TableCell>
                <TableCell>{workflow.nodes.length}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkflowsPage;
