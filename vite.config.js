import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",    // allow LAN access
    port: 5173,
    // Proxy lets the frontend call "/api" and forwards to your Node server
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // backend from Vite's perspective
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
  },
});
