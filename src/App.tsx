
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { initMsw, isMswReady } from "./mocks/browser";
import Routes from "./routes";
import { useEffect, useState } from "react";

// Add type declarations for the window object
declare global {
  interface Window {
    __MSW_REGISTRATION?: any;
    __MSW_INITIALIZED?: boolean;
  }
}

// Create QueryClient with retry options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Don't retry failed queries to avoid overloading
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
    },
  },
});

// Initialize MSW outside of the component
// This ensures MSW is set up before any rendering happens
if (process.env.NODE_ENV !== 'production') {
  console.log('Initializing MSW at startup...');
  initMsw().then(success => {
    if (success) {
      console.log('MSW initialized successfully at startup');
      // Store MSW status in window for immediate access
      window.__MSW_INITIALIZED = true;
    } else {
      console.warn('MSW failed to initialize at startup');
      window.__MSW_INITIALIZED = false;
    }
  });
}

const App = () => {
  const [isMockReady, setIsMockReady] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    // For production, we're already set
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    // Check if MSW is already initialized
    if (window.__MSW_INITIALIZED) {
      setIsMockReady(true);
      return;
    }
    
    // Check MSW readiness until it's ready or times out
    const checkInterval = setInterval(() => {
      if (isMswReady() || window.__MSW_INITIALIZED) {
        console.log('MSW is now confirmed ready');
        setIsMockReady(true);
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Timeout after 3 seconds
    const timeout = setTimeout(() => {
      console.warn('MSW readiness check timed out, proceeding in fallback mode');
      setIsMockReady(true);
      clearInterval(checkInterval);
    }, 3000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

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
          <Routes />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
