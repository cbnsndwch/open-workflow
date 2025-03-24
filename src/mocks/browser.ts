
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Export a function to check if MSW is active
export const isMswReady = () => {
  return Boolean((window as any).__MSW_REGISTRATION__);
};
