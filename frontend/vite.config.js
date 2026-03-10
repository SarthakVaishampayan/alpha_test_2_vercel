import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode (development / production)
  const env = loadEnv(mode, process.cwd(), "");

  // The backend URL used by the dev-server proxy.
  // Falls back to localhost:5000 if VITE_API_URL is not set in .env.local
  const backendUrl = env.VITE_API_URL || "http://localhost:5000";

  return {
    plugins: [react()],

    // ── Dev Server ─────────────────────────────────────────────────────────
    server: {
      port: 5173,
      proxy: {
        // Forward every /api/* request to the local Express backend.
        // This means you can also call fetch('/api/...') without a full URL
        // during local development, though the app currently uses VITE_API_URL.
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ── Build ──────────────────────────────────────────────────────────────
    build: {
      // Output directory (Vercel's @vercel/static-build looks for "dist")
      outDir: "dist",

      // Generate source maps for easier debugging in production
      sourcemap: false,

      // Increase the warning threshold slightly (default is 500 kB)
      chunkSizeWarningLimit: 800,

      rollupOptions: {
        output: {
          // Split large dependencies into separate chunks so the browser
          // can cache them independently between deployments.
          manualChunks: {
            // React Router
            "vendor-router": ["react-router-dom"],

            // Recharts (charting library — fairly large)
            "vendor-recharts": ["recharts"],

            // Lucide icons
            "vendor-lucide": ["lucide-react"],
          },
        },
      },
    },

    // ── Preview (vite preview) ─────────────────────────────────────────────
    preview: {
      port: 4173,
    },
  };
});
