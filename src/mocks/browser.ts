
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Explicitly set the path to the worker script
const workerPath = '/mockServiceWorker.js';

// Create a function to initialize the worker
export async function initMsw() {
  if (process.env.NODE_ENV !== 'production') {
    try {
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
      console.log('MSW initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize MSW:', error);
      return false;
    }
  }
  return false;
}

// Export a function to check if MSW is active
export const isMswReady = () => {
  return Boolean((window as any).__MSW_REGISTRATION__);
};
