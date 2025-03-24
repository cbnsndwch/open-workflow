import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import { useWorkflowContext } from '@/contexts/workflow';

interface PageHeaderProps {
    title?: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getWorkflowById } = useWorkflowContext();

    // Check if we're on a workflow page
    const isWorkflowPage = location.pathname.includes('/workflow/');

    // Get workflow name if on a workflow page
    const workflowName = isWorkflowPage && id ? getWorkflowById(id)?.name : '';

    // Determine title based on route if not provided
    const pageTitle =
        title ||
        (isWorkflowPage && workflowName
            ? workflowName
            : getPageTitle(location.pathname));

    return (
        <header className="border-b border-border/30 bg-background px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isWorkflowPage ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/workflows')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-xl font-semibold">
                                {pageTitle}
                            </h1>
                        </>
                    ) : (
                        <>
                            <SidebarTrigger />
                            <h1 className="text-xl font-semibold">
                                {pageTitle}
                            </h1>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isWorkflowPage && (
                        <Button
                            className="flex items-center gap-2 bg-black text-white hover:bg-black/90"
                            onClick={() => console.log('Execute workflow')}
                        >
                            <Play className="h-4 w-4" />
                            Run Workflow
                        </Button>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

// Helper function to get page title based on route
function getPageTitle(pathname: string): string {
    switch (pathname) {
        case '/':
        case '/workflows':
            return 'Workflows';
        case '/settings':
            return 'Settings';
        case '/help':
            return 'Help';
        default:
            if (pathname.startsWith('/workflow/')) {
                return 'Workflow Details';
            }
            return 'Not Found';
    }
}
