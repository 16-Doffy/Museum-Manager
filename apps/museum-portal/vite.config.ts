import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['three', 'three/examples/jsm/loaders/GLTFLoader', 'three/examples/jsm/loaders/OBJLoader'],
  },
  server: {
    port: 3600,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
