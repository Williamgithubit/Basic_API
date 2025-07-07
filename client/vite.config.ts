import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Optional: suppress warning up to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          toastify: ['react-toastify'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          icons: ['lucide-react'],
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
    alias: [{ find: '@', replacement: '/src' }],
  },
});
