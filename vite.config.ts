import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  optimizeDeps: {
    exclude: ['@slidev/cli', '@slidev/client', '@slidev/parser', '@slidev/theme-default', '@slidev/theme-seriph'],
  },
  server: {
    // Vite is now used as middleware in Fastify, not standalone
    // No proxy needed - API requests go directly to same server
    strictPort: false,
  },
  build: {
    outDir: "dist/frontend",
    emptyOutDir: true,
  },
});
