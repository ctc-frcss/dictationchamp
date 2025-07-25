import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// This is a simplified config for GitHub Pages deployment.
export default defineConfig({
  base: '/dictationchamp/',
  root: 'client',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
});