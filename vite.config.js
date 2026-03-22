import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Modern browser target for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core into its own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          // Split GSAP into its own chunk so it doesn't block initial render
          'gsap-vendor': ['gsap']
        }
      }
    }
  }
});