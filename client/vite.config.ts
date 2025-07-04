import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Set chunk size warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group react and react-dom together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react';
            }
            // Group UI libraries
            if (id.includes('react-hot-toast') || id.includes('react-toastify') || id.includes('react-modal')) {
              return 'ui';
            }
            // Group other heavy dependencies
            if (id.includes('axios') || id.includes('react-confetti') || id.includes('framer-motion')) {
              return 'vendor';
            }
            // Default chunking for other node_modules
            return 'vendor';
          }
        },
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
    alias: [
      { find: '@', replacement: '/src' }
    ]
  }
});
