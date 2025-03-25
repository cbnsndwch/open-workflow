
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import MSW browser initialization for development
async function bootstrap() {
    // Only in development environment
    if (process.env.NODE_ENV === 'development') {
        try {
            // Import MSW dynamically to prevent it from loading in production
            const { worker } = await import('./mocks/browser');
            // Initialize MSW before rendering the app
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js',
                }
            });
            console.log('MSW initialized successfully');
        } catch (error) {
            console.error('MSW initialization failed:', error);
        }
    }

    // Render the app
    createRoot(document.getElementById('root')!).render(<App />);
}

bootstrap();
