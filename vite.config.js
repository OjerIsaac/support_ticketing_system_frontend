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
    proxy: {
      '/export': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/attachments': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
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
