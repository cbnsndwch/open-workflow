
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

/**
 * Initialize MSW and return true if successful, false otherwise
 */
export async function initMsw(): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
        try {
            // Log when we're starting MSW
            console.log('Starting MSW...');

            // Start the worker with some options for better debugging
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    // Use the local MSW worker script directly
                    url: '/mockServiceWorker.js'
                }
            });

            console.log('MSW initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize MSW:', error);
            return false;
        }
    }
    return false;
}

/**
 * Check if MSW is ready
 */
export const isMswReady = (): boolean => {
    // Use the window property to determine if MSW is active
    return Boolean(window.__MSW_INITIALIZED);
};
