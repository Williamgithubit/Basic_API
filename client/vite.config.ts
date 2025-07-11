import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({  
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000, // Set chunk size warning limit to 2000 kB
    rollupOptions: {
      output: {
        manualChunks: {
          // Put React and related packages in a separate chunk
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-router',
            '@remix-run/router'
          ],
          // UI libraries in a separate chunk
          'ui-vendor': [
            'react-hot-toast',
            'react-toastify',
            'react-modal',
            '@headlessui/react',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
          // Data fetching and state management
          'data-vendor': [
            'axios',
            '@tanstack/react-query'
          ]
        }
      },
    },
  },
  server: {
    port: 4000,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
});
