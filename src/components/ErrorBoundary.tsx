
import { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from './ui/button';

export function ErrorBoundary() {
  const error = useRouteError();
  
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error);
    
    // Intentionally throw an error to test our error boundary
    throw new Error("This is an intentional error to test the error boundary");
  }, [error]);

  // Determine what type of error we're dealing with
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = '';
  
  if (isRouteErrorResponse(error)) {
    // This is a known router error
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data?.message || '';
  } else if (error instanceof Error) {
    // This is a JavaScript Error object
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    // This is a string error
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Try to extract meaningful info from unknown object errors
    errorMessage = JSON.stringify(error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-destructive">Something went wrong</h1>
        
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-left overflow-hidden">
          <h2 className="font-bold mb-2 text-xl">{errorMessage}</h2>
          
          {errorDetails && (
            <pre className="bg-background/50 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
              {errorDetails}
            </pre>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.href = '/'} variant="default">
            Go to Home
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
