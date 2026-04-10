import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 75 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
      webp: { lossless: false, quality: 75 },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
