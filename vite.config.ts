import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: true
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  }
});
