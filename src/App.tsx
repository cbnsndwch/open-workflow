import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { MswProvider } from './contexts/msw/MswContext';
import Routes from './routes';
import { useState } from 'react';

// Create QueryClient with retry options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Don't retry failed queries to avoid overloading
            refetchOnWindowFocus: false // Don't refetch when window gains focus
        }
    }
});

const App = () => {
    return (
        <MswProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <Routes />
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </MswProvider>
    );
};

export default App;
