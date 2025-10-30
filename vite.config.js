import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// === Exported config ===
export default defineConfig({
  plugins: [
    react(),

    // Bundle visualizer (opens a graph after build)
    visualizer({
      filename: "dist/stats.html",
      open: false, // set true if you want it to auto-open
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  // === Dev server ===
  server: {
    host: "0.0.0.0", // allow LAN access
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // your Node backend
        changeOrigin: true,
      },
    },
  },

  // === Preview build server (vite preview) ===
  preview: {
    host: "0.0.0.0",
    port: 5173,
  },

  // === Build optimization ===
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // avoids noisy warnings

    // 🔥 Smart code-splitting for caching
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          query: ["@tanstack/react-query"],
          store: ["zustand"],
          icons: ["lucide-react", "react-icons"],
          utils: ["axios", "dayjs"],
        },
      },
    },
  },
});
