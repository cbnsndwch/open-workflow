
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Add type declarations for the window object
declare global {
  interface Window {
    __MSW_REGISTRATION?: any;
    __MSW_INITIALIZED?: boolean;
  }
}

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Explicitly set the path to the worker script
const workerPath = '/mockServiceWorker.js';

// Create a function to initialize the worker
export async function initMsw() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Log when we're starting MSW
      console.log('Starting MSW...');
      
      // Make sure we're not handling HTML 
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: workerPath,
          options: {
            // Force update of the worker on each start
            updateViaCache: 'none',
          },
        },
      });
      
      // Verify that MSW is working by logging
      console.log('MSW initialized successfully');
      
      // Set a flag for easier checking
      window.__MSW_INITIALIZED = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize MSW:', error);
      window.__MSW_INITIALIZED = false;
      return false;
    }
  }
  return false;
}

// Export a function to check if MSW is active
export const isMswReady = () => {
  // Check either the MSW registration or our custom flag
  return Boolean(window.__MSW_REGISTRATION || window.__MSW_INITIALIZED);
};
