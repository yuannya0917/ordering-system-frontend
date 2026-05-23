import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/ordering-system-frontend/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.100.147.122:8081',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://10.100.147.122:8081',
        changeOrigin: true,
      },
    },
  },
})
