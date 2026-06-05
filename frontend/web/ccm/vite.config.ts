import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), ],
  server: {
    port: 5173,
    allowedHosts: ['localhost', "host.docker.internal" ,"5efa-102-213-250-132.ngrok-free.app"],
  },
  
})
