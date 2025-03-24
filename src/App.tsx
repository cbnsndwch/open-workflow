
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { useEffect, useState } from "react";

// Import the worker and the ready checker
import { worker, isMswReady } from "./mocks/browser";

const queryClient = new QueryClient();

const App = () => {
  const [isMockReady, setIsMockReady] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    // Initialize MSW in development only
    if (process.env.NODE_ENV !== 'production') {
      // Start the worker with explicit options
      worker.start({ 
        onUnhandledRequest: 'bypass',
        // Wait until the mocks are ready before resolving
        serviceWorker: {
          url: '/mockServiceWorker.js',
        }
      })
        .then(() => {
          console.log('MSW Worker started successfully');
          setIsMockReady(true);
        })
        .catch((error) => {
          console.error('Failed to start MSW:', error);
          // Fall back to allowing the app to run without MSW
          setIsMockReady(true);
        });
      
      return () => {
        worker.stop();
      };
    }
  }, []);

  // Check if MSW is actually ready
  useEffect(() => {
    if (!isMockReady && process.env.NODE_ENV !== 'production') {
      const checkInterval = setInterval(() => {
        if (isMswReady()) {
          console.log('MSW is now ready');
          setIsMockReady(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      return () => clearInterval(checkInterval);
    }
  }, [isMockReady]);

  if (!isMockReady) {
    return <div className="flex min-h-screen items-center justify-center">Initializing app...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WorkflowProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </WorkflowProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
