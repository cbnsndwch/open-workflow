import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { simpleWorkflow } from '@/data/sampleWorkflows';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useWorkflowContext } from '@/contexts/workflow/WorkflowProvider';
import { useAuth } from '@/contexts/auth';

interface OnboardingWizardProps {
    open: boolean;
    onClose: () => void;
}

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
    const { currentAccount } = useAuth();
    const { addWorkflow } = useWorkflowContext();
    const [isAdding, setIsAdding] = React.useState(false);
    const isMobile = useIsMobile();

    const handleAddSampleWorkflow = async () => {
        if (!currentAccount) {
            toast.error('Please select an account first');
            return;
        }

        // Prevent multiple clicks
        if (isAdding) return;

        console.log('handleAddSampleWorkflow function triggered');
        setIsAdding(true);
        try {
            console.log('Adding sample workflow...');
            // Create a new workflow based on the sample
            const newWorkflow = {
                ...simpleWorkflow,
                id: `sample-${Date.now()}`,
                name: 'My First Workflow',
                type: 'Standard',
                accountId: currentAccount.id,
                lastModified: new Date().toISOString()
            };

            console.log(
                'Calling addWorkflow with:',
                JSON.stringify(newWorkflow)
            );
            await addWorkflow(newWorkflow);
            toast.success('Sample workflow added to your account');
            onClose();
        } catch (error) {
            console.error('Failed to add sample workflow:', error);
            toast.error(
                'Failed to add sample workflow. Please try again later.'
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleGuidedSetup = () => {
        // This will be implemented later
        toast.info('Guided setup will be available soon!');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={open => !open && onClose()}
            modal={true}
        >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Welcome to OpenWorkflow
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Let's get you started with your first workflow
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <Button
                            variant="ghost"
                            className={`p-0 h-auto w-full text-left ${
                                isAdding ? 'opacity-70 pointer-events-none' : ''
                            }`}
                            onClick={handleAddSampleWorkflow}
                            disabled={isAdding}
                        >
                            <Card className="h-full w-full border-2 border-muted hover:border-primary transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        Sample Workflow
                                    </CardTitle>
                                    <CardDescription>
                                        Start with a pre-built workflow
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    Begin with a simple, ready-to-use workflow
                                    to explore the platform's capabilities.
                                </CardContent>
                                <CardFooter className="pt-2 justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {isAdding
                                            ? 'Setting up...'
                                            : 'Click to add'}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </CardFooter>
                            </Card>
                        </Button>

                        <Button
                            variant="ghost"
                            className="p-0 h-auto w-full text-left"
                            onClick={handleGuidedSetup}
                        >
                            <Card className="h-full w-full border-2 border-muted hover:border-primary transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center">
                                        <ArrowRight className="w-5 h-5 mr-2" />
                                        Guided Setup
                                        <Badge
                                            variant="secondary"
                                            className="ml-2 text-xs"
                                        >
                                            soon
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Answer a few questions to create your
                                        workflow
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    We'll guide you through creating a custom
                                    workflow based on your specific needs.
                                </CardContent>
                                <CardFooter className="pt-2 justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Click to preview
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </CardFooter>
                            </Card>
                        </Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
