
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Layout, ChevronDown } from 'lucide-react';
import { useWorkflowContext } from '@/contexts/WorkflowContext';

export function WorkflowSelector() {
  const { 
    selectedWorkflow, 
    setSelectedWorkflow
  } = useWorkflowContext();

  const handleSelectWorkflow = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>{selectedWorkflow === 'simple' ? 'Simple Workflow' : 'Complex Workflow'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select Workflow</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleSelectWorkflow('simple')}
            className={selectedWorkflow === 'simple' ? 'bg-accent text-accent-foreground' : ''}
          >
            Simple Workflow
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleSelectWorkflow('complex')}
            className={selectedWorkflow === 'complex' ? 'bg-accent text-accent-foreground' : ''}
          >
            Complex Workflow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
