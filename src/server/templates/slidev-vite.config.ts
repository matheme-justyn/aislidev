import { defineConfig, Plugin, searchForWorkspaceRoot } from "vite";

// Plugin to force replace all Slidev constants in all files
const forceSlidevConstantsPlugin = (): Plugin => ({
  name: 'force-slidev-constants',
  enforce: 'pre',
  transform(code, _id) {
    // Define all Slidev constants as string replacements
    const replacements = {
      '__DEV__': 'false',
      '__SLIDEV_CLIENT_ROOT__': '"/node_modules/@slidev/client"',
      '__SLIDEV_HASH_ROUTE__': 'false',
      '__SLIDEV_FEATURE_DRAWINGS__': 'false',
      '__SLIDEV_FEATURE_EDITOR__': 'false',
      '__SLIDEV_FEATURE_DRAWINGS_PERSIST__': 'false',
      '__SLIDEV_FEATURE_RECORD__': 'false',
      '__SLIDEV_FEATURE_PRESENTER__': 'true',
      '__SLIDEV_FEATURE_PRINT__': 'false',
      '__SLIDEV_FEATURE_BROWSER_EXPORTER__': 'false',
      '__SLIDEV_FEATURE_WAKE_LOCK__': 'false',
      '__SLIDEV_HAS_SERVER__': 'true',
    };

    let modified = code;
    let hasChange = false;

    // Replace all constants
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      if (modified.includes(key)) {
        modified = modified.replace(regex, value);
        hasChange = true;
      }
    }

    if (hasChange) {
      return {
        code: modified,
        map: null
      };
    }
    return null;
  }
});

export default defineConfig({
  plugins: [forceSlidevConstantsPlugin()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      // Restrict serving files from outside the project root
      // But allow workspace root and parent directories for node_modules access
      allow: [
        // Search up for workspace root (handles monorepos)
        searchForWorkspaceRoot(process.cwd()),
        // Allow accessing parent directory (for /app/node_modules)
        '..',
        // Allow accessing two levels up (to reach /app from /app/data/aislidev-demo)
        '../..',
      ],
    },
  },
  define: {
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
