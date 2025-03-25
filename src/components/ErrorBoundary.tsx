/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError
} from 'react-router-dom';

import { Button } from './ui/button';

interface FallbackProps {
    error: unknown;
}

// Component to display when not in a router context
function ErrorFallback({ error }: FallbackProps) {
    const [errorDetails, setErrorDetails] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(
        'An unexpected error occurred'
    );

    useEffect(() => {
        console.error('Application error:', error);

        // Process the error
        if (error instanceof Error) {
            setErrorMessage(error.message);
            setErrorDetails(error.stack || '');
        } else if (typeof error === 'string') {
            setErrorMessage(error);
        } else if (error && typeof error === 'object') {
            try {
                setErrorMessage(JSON.stringify(error));
            } catch (e) {
                setErrorMessage('Error could not be serialized');
            }
        }
    }, [error]);

    // Original error in raw format
    const rawError = error
        ? typeof error === 'object'
            ? `Raw error object: ${Object.getOwnPropertyNames(error)
                  .map(prop => `${prop}: ${String((error as any)[prop])}`)
                  .join(', ')}`
            : `Raw error: ${String(error)}`
        : 'No raw error data available';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-2xl space-y-6 text-center">
                <h1 className="text-3xl font-bold text-destructive">
                    Something went wrong
                </h1>

                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-left overflow-hidden">
                    <h2 className="font-bold mb-2 text-xl">{errorMessage}</h2>

                    {errorDetails && (
                        <pre className="bg-background/50 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                            {errorDetails}
                        </pre>
                    )}

                    <div className="mt-4 pt-4 border-t border-destructive/20">
                        <h3 className="font-semibold mb-2">
                            Debug Information:
                        </h3>
                        <pre className="bg-background/50 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                            {rawError}
                        </pre>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => (window.location.href = '/')}
                        variant="default"
                    >
                        Go to Home
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Reload Page
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Main error boundary component
export function ErrorBoundary() {
    const navigate = useNavigate();
    const routeError = useRouteError();

    // If not in a router context, use the error from props
    if (!routeError) {
        return (
            <ErrorFallback
                error={
                    new Error('Component error occurred outside router context')
                }
            />
        );
    }

    // Process the route error
    let errorMessage = 'An unexpected error occurred';
    let errorDetails = '';

    if (isRouteErrorResponse(routeError)) {
        // This is a known router error
        errorMessage = `${routeError.status} ${routeError.statusText}`;
        errorDetails = routeError.data?.message || '';
    } else if (routeError instanceof Error) {
        // This is a JavaScript Error object
        errorMessage = routeError.message;
        errorDetails = routeError.stack || '';
    } else if (typeof routeError === 'string') {
        // This is a string error
        errorMessage = routeError;
    } else if (routeError && typeof routeError === 'object') {
        // Try to extract meaningful info from unknown object errors
        try {
            errorMessage = JSON.stringify(routeError);
        } catch (e) {
            errorMessage = 'Error could not be serialized';
        }
    }

    // Add debugging information for destructuring errors
    if (
        errorMessage.includes('destructured') ||
        errorMessage.includes('assignment') ||
        errorMessage.includes('destructuring') ||
        errorDetails.includes('destructured') ||
        errorDetails.includes('assignment') ||
        errorDetails.includes('destructuring')
    ) {
        errorDetails +=
            '\n\nThis might be a destructuring error where the code is trying to destructure a value that is null or undefined. Check for places where objects or arrays are being destructured without proper null checks.';
    }


    // Original error in raw format (for debugging)
    const rawError = routeError
        ? typeof routeError === 'object'
            ? `Raw error object: ${Object.getOwnPropertyNames(routeError)
                  .map(prop => `${prop}: ${String((routeError as any)[prop])}`)
                  .join(', ')}`
            : `Raw error: ${String(routeError)}`
        : 'No raw error data available';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-2xl space-y-6 text-center">
                <h1 className="text-3xl font-bold text-destructive">
                    Something went wrong
                </h1>

                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-left overflow-hidden">
                    <h2 className="font-bold mb-2 text-xl">{errorMessage}</h2>

                    {errorDetails && (
                        <pre className="bg-background/50 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                            {errorDetails}
                        </pre>
                    )}

                    <div className="mt-4 pt-4 border-t border-destructive/20">
                        <h3 className="font-semibold mb-2">
                            Debug Information:
                        </h3>
                        <pre className="bg-background/50 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                            {rawError}
                        </pre>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/')} variant="default">
                        Go to Home
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Reload Page
                    </Button>
                </div>
            </div>
        </div>
    );
}
