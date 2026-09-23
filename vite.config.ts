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
      // The voice demo is a WebSocket, which needs `ws: true` — the plain string
      // form below only forwards HTTP and would drop the upgrade. This entry is
      // listed first because Vite matches prefixes in declaration order, so the
      // broader '/api' rule would otherwise swallow it.
      //
      // In production there is no proxy at all: Caddy forwards to the same Node
      // process that serves the page, and it upgrades WebSockets natively.
      '/api/voice/stream': {
        target: 'ws://127.0.0.1:3000',
        ws: true,
      },
      '/api': 'http://127.0.0.1:3000',
    },
  },
})
