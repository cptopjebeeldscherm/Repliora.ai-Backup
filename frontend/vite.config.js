import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["artistic-credible-midge.ngrok-free.app"], // ✅ this is the key line
  }
})
