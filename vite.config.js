import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,     
    allowedHosts: [
      'support-ticketing-system-frontend.onrender.com',
      'localhost',
    ],
  },
  preview: { 
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'support-ticketing-system-frontend.onrender.com',
      'localhost',
    ],
  },
});