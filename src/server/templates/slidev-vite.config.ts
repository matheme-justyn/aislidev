import { defineConfig, searchForWorkspaceRoot } from "vite";

// Minimal Vite config for Slidev instances
// Only defines constants and file serving - lets Slidev CLI handle plugins
export default defineConfig({
  server: {
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      // Allow serving files from workspace root and parent directories
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '..',
        '../..',
      ],
    },
  },
  define: {
    // Define Slidev compile-time constants
    __DEV__: false,
    __SLIDEV_CLIENT_ROOT__: '"/node_modules/@slidev/client"',
    __SLIDEV_HASH_ROUTE__: false,
    __SLIDEV_FEATURE_DRAWINGS__: false,
    __SLIDEV_FEATURE_EDITOR__: false,
    __SLIDEV_FEATURE_DRAWINGS_PERSIST__: false,
    __SLIDEV_FEATURE_RECORD__: false,
    __SLIDEV_FEATURE_PRESENTER__: true,
    __SLIDEV_FEATURE_PRINT__: false,
    __SLIDEV_FEATURE_BROWSER_EXPORTER__: false,
    __SLIDEV_FEATURE_WAKE_LOCK__: false,
    __SLIDEV_HAS_SERVER__: true,
  },
});
