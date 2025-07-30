import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // Add cache busting
        sourcemap: false,
        // Use default minifier instead of terser
        minify: 'esbuild',
        // Force cache invalidation
        target: 'es2015'
    },
    define: {
        // Ensure environment variables are available at build time
        'process.env': {},
        // Add build timestamp for cache busting
        __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    // Add cache headers for better cache control
    server: {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    }
});
