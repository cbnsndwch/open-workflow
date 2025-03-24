
import React from 'react';
import { BookOpen, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import { simpleWorkflow } from '@/data/sampleWorkflows';
import { useAuth } from '@/contexts/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const { currentAccount } = useAuth();
  const [selectedOption, setSelectedOption] = React.useState<'sample' | 'guided' | null>(null);
  const { addWorkflow } = useWorkflowContext();
  const [isAdding, setIsAdding] = React.useState(false);
  const isMobile = useIsMobile();

  const handleAddSampleWorkflow = async () => {
    if (!currentAccount) return;
    
    setIsAdding(true);
    try {
      // Create a new workflow based on the sample
      const newWorkflow = {
        ...simpleWorkflow,
        id: `sample-${Date.now()}`,
        name: 'My First Workflow',
        type: 'Standard',
        accountId: currentAccount.id,
        lastModified: new Date().toISOString(),
      };
      
      await addWorkflow(newWorkflow);
      toast.success('Sample workflow added to your account');
      onClose();
    } catch (error) {
      console.error('Failed to add sample workflow:', error);
      toast.error('Failed to add sample workflow');
    } finally {
      setIsAdding(false);
    }
  };

  const handleGetStarted = () => {
    if (selectedOption === 'sample') {
      handleAddSampleWorkflow();
    } else if (selectedOption === 'guided') {
      // This will be implemented later
      toast.info('Guided setup will be available soon!');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to OpenWorkflow</DialogTitle>
          <DialogDescription className="text-base">
            Let's get you started with your first workflow
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Card 
              className={`cursor-pointer border-2 transition-all ${
                selectedOption === 'sample' ? 'border-primary' : 'border-muted hover:border-muted/80'
              }`}
              onClick={() => setSelectedOption('sample')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Sample Workflow
                </CardTitle>
                <CardDescription>Start with a pre-built workflow</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Begin with a simple, ready-to-use workflow to explore the platform's capabilities.
              </CardContent>
              <CardFooter className="pt-2 justify-end">
                {selectedOption === 'sample' && <Check className="h-5 w-5 text-primary" />}
              </CardFooter>
            </Card>

            <Card 
              className={`cursor-pointer border-2 transition-all ${
                selectedOption === 'guided' ? 'border-primary' : 'border-muted hover:border-muted/80'
              }`}
              onClick={() => setSelectedOption('guided')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-muted-foreground">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Guided Setup (Coming Soon)
                </CardTitle>
                <CardDescription>Answer a few questions to create your workflow</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We'll guide you through creating a custom workflow based on your specific needs.
              </CardContent>
              <CardFooter className="pt-2 justify-end">
                {selectedOption === 'guided' && <Check className="h-5 w-5 text-primary" />}
              </CardFooter>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className={isMobile ? "flex-col space-y-2 mt-4" : ""}>
          <Button variant="outline" onClick={onClose} className={isMobile ? "w-full" : ""}>Cancel</Button>
          <Button 
            onClick={handleGetStarted} 
            disabled={!selectedOption || isAdding}
            className={isMobile ? "w-full" : ""}
          >
            {isAdding ? 'Setting up...' : 'Get Started'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
