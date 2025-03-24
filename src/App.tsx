
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

// Import the worker
import { worker } from "./mocks/browser";

const queryClient = new QueryClient();

const App = () => {
  const [isMockReady, setIsMockReady] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    // Initialize MSW in development only
    if (process.env.NODE_ENV !== 'production') {
      worker.start({ onUnhandledRequest: 'bypass' })
        .then(() => setIsMockReady(true))
        .catch(console.error);
      
      return () => {
        worker.stop();
      };
    }
  }, []);

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
