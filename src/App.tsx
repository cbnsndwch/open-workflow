
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import { initMsw, isMswReady } from "./mocks/browser";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";

// Create QueryClient
const queryClient = new QueryClient();

const App = () => {
  const [isMockReady, setIsMockReady] = useState(process.env.NODE_ENV === 'production');
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  useEffect(() => {
    // Initialize MSW in development only
    if (process.env.NODE_ENV !== 'production' && !initializationAttempted) {
      setInitializationAttempted(true);
      
      initMsw().then((success) => {
        if (success) {
          setIsMockReady(true);
        } else {
          // If initialization fails, we'll still render the app
          // but provide fallback handlers in the AuthContext
          console.warn('MSW initialization failed, using fallback mode');
          setIsMockReady(true);
        }
      });
    }
  }, [initializationAttempted]);

  // Extra check to make sure MSW is actually ready
  useEffect(() => {
    if (!isMockReady && process.env.NODE_ENV !== 'production') {
      const checkInterval = setInterval(() => {
        if (isMswReady()) {
          console.log('MSW is now confirmed ready');
          setIsMockReady(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Don't check forever
      const timeout = setTimeout(() => {
        console.warn('MSW readiness check timed out, proceeding anyway');
        setIsMockReady(true);
        clearInterval(checkInterval);
      }, 3000);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [isMockReady]);

  if (!isMockReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Initializing app...</h2>
          <p className="text-muted-foreground mt-2">Setting up mock API services</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WorkflowProvider>
            <RouterProvider router={router} />
          </WorkflowProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
