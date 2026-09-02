import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site from /DiloraUserWebsite/, but on our own
  // server it lives at the root. Set BASE_PATH=/ for the EC2 build.
  base: process.env.BASE_PATH ?? '/DiloraUserWebsite/',
  server: {
    // So `npm run dev` talks to the local API server instead of 404ing on
    // /api/demo-call. Run `npm run dev:api` alongside it.
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
})
