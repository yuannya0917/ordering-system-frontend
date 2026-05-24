import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.100.167.245:8081',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://10.100.167.245:8081',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://10.100.167.245:8081',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
