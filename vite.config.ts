import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  }
})
