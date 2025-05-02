import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",  // Utilise des chemins relatifs (ne casse rien)
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
