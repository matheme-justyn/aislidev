import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:13000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/frontend",
  },
});
