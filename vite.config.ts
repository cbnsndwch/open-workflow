
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const devPlugins = mode === 'development' ? [componentTagger()] : [];
    return {
        server: {
            host: '::',
            port: 8080
        },
        plugins: [react(), ...devPlugins],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        build: {
            minify: false, // Disable minification to get readable error messages
            sourcemap: true // Enable source maps for better debugging
        },
        // Make sure the MSW worker script is served with the correct MIME type
        optimizeDeps: {
            exclude: ['msw']
        }
    };
});
