import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom")) return "react-vendor";
          if (id.includes("node_modules/react") && !id.includes("react-router")) return "react-vendor";
          if (id.includes("node_modules/react-router")) return "router";
          if (id.includes("node_modules/framer-motion")) return "framer";
          if (id.includes("node_modules/axios")) return "axios";
        },
      },
    },
  },
})
