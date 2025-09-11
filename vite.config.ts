import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      // ngrok and localtunnel host patterns
      'ngrok-free.app',
      'ngrok.app',
      'loca.lt',
      // allow any subdomain for ngrok
      // Vite accepts exact matches; for dynamic subdomains, allow '*' by proxying check
      // but we can list the base domains as above which is sufficient.
    ],
  },
})