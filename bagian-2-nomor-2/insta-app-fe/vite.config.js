import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['instapp-dev.hisyam.dev'],
    port: 3000,
  },
  preview: {
    allowedHosts: ['instapp.hisyam.dev'],
    port: 3000
  }
})
