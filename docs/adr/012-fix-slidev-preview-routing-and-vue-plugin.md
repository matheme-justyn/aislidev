# ADR-012: Fix Slidev Preview 404 and Main App Blank Page

**Status**: Accepted  
**Date**: 2026-03-18  
**Decision Makers**: Development Team  
**Related**: [ADR-011](./011-fix-pptx-export-flow.md)

## Context

After implementing history routing for Slidev in the editor preview (right panel), we encountered two critical issues:

1. **Preview showed "404 Page not found"** - Slidev loaded but displayed 404 error requiring "go home" click
2. **Main editor page was blank** - The editor UI at `http://localhost:13000` didn't render at all

### Root Causes Identified

Through systematic debugging with parallel exploration agents and direct testing, we identified three separate issues:

#### Issue 1: Hash Routing vs History Routing Mismatch

**Problem**: Slidev used `routerMode: hash` requiring `#/` in URLs, but our proxy and frontend expected history mode routes.

**Evidence**:
- Clicking "Go Home" redirected to `http://localhost:13000/1` instead of `http://localhost:13000/slidev/13030/#/1`
- Slidev didn't know about its base path `/slidev/{port}/`

#### Issue 2: Vite Config Not Loaded

**Problem**: When creating Vite dev server in `src/server/index.ts`, the configuration was inlined and **didn't load `vite.config.ts`**, so the Vue plugin was never initialized.

**Evidence**:
```javascript
// Before (wrong)
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "spa",
  optimizeDeps: { ... },  // Inline config without Vue plugin
});
```

**Result**: Virtual module `__x00__plugin-vue:export-helper` returned 404, causing Vue components to fail loading.

#### Issue 3: Vite Proxy Captured Main App Resources

**Problem**: The Vite special paths proxy middleware had overly broad regex that captured main app's virtual modules and proxied them to Slidev.

**Evidence**:
```javascript
// Before (wrong)
if (url.match(/^\/@(fs|vite|id|slidev|server-reactive)/) || url.startsWith('/__')) {
  // Always proxy, even for main app resources!
}
```

**Result**: Main app's `/@id/__x00__plugin-vue:export-helper` was proxied to Slidev (port 13030), which returned 404.

## Decision

We implemented three fixes to address each issue:

### Fix 1: Switch to History Mode with Base Path

**Changed**:
1. `data/aislidev-demo/slides.md`: `routerMode: hash` → `routerMode: history`
2. `src/server/services/SlidevManager.ts`: Added `--base /slidev/${port}/` to Slidev CLI
3. `src/components/SlidevPreview.vue`: Removed `/#/` from preview URL
4. `src/server/index.ts`: Removed `pathRewrite` and HTML base tag injection (Slidev handles it)

**Rationale**:
- History mode is more modern and has better base path support
- `--base` parameter tells Slidev's Vue Router about its deployment path
- Cleaner URLs: `/slidev/13030/1` instead of `/slidev/13030/#/1`

### Fix 2: Load vite.config.ts with Vue Plugin

**Changed**:
```javascript
// After (correct)
const vite = await createServer({
  configFile: join(__dirname, "../../vite.config.ts"),  // Load config with Vue plugin
  server: { middlewareMode: true },
  appType: "spa",
});
```

**Rationale**:
- `vite.config.ts` already has Vue plugin configured: `plugins: [vue()]`
- Loading the config file ensures all plugins and settings are applied
- Separates configuration from server setup (better maintainability)

### Fix 3: Fix Vite Proxy to Only Handle Slidev Resources

**Changed**:
```javascript
// After (correct)
if (url.match(/^\/@(fs|vite|id|slidev|server-reactive)/) || url.includes('__slidev_') || url.match(/^\/slides\.md__slidev_/)) {
  const referer = req.headers.referer || req.headers.referrer || '';
  
  // ONLY proxy if referer contains /slidev/ (from Slidev pages)
  const refererMatch = referer.match(/\/slidev\/(\d+)/);
  
  if (refererMatch) {
    const port = parseInt(refererMatch[1]);
    // Proxy to Slidev
    return slidevProxies.get(port)(req, res, next);
  } else {
    // No Slidev referer - let main Vite handle it
    console.log(`[Vite Proxy] No Slidev referer, passing to main Vite`);
  }
}
next();  // Pass to main Vite middleware
```

**Rationale**:
- Check Referer header to distinguish main app resources from Slidev resources
- Main app resources (referer from `/`) are handled by main Vite
- Slidev resources (referer from `/slidev/{port}/`) are proxied to Slidev port
- Removed `lastUsedPort` fallback that incorrectly proxied main app requests

## Consequences

### Positive

✅ **Slidev preview displays correctly** - No more 404 error, slides load immediately  
✅ **Main editor UI renders** - Vue components load with proper plugin support  
✅ **History mode works** - Clean URLs, better browser history navigation  
✅ **Resource routing is correct** - Main app and Slidev resources are properly separated  
✅ **Reduced complexity** - No more HTML injection, pathRewrite, or base tag manipulation

### Negative

⚠️ **Referer-based routing** - Relies on browser sending Referer header (might break in some edge cases)  
⚠️ **Slidev restart required** - When changing slides.md, Slidev must restart to apply `--base` parameter

### Neutral

🔄 **History mode requirement** - All presentations must use `routerMode: history` (not hash)  
🔄 **Vite config dependency** - Server depends on vite.config.ts existing and being correct

## Verification

### Manual Testing

```bash
# Test 1: Main app loads
curl http://localhost:13000/ | grep "AISliDev"
# ✅ Returns HTML with title

# Test 2: Vue plugin virtual module loads
curl http://localhost:13000/@id/__x00__plugin-vue:export-helper
# ✅ Returns JavaScript export helper (not 404)

# Test 3: Slidev preview loads
curl http://localhost:13000/slidev/13030/
# ✅ Returns Slidev HTML with correct base path

# Test 4: History mode route works
curl http://localhost:13000/slidev/13030/1
# ✅ Returns 200 OK (not 404)
```

### Browser Testing

1. ✅ Main page `http://localhost:13000` displays editor UI with file list
2. ✅ Clicking presentation opens right panel preview without 404
3. ✅ Console has no `__x00__plugin-vue:export-helper` 404 errors
4. ✅ First slide displays with correct Unsplash background image

### Known Issues

⚠️ **Subsequent slides show white background** - First slide (with frontmatter background) displays correctly, but later slides using theme layouts show white background instead of theme styling. This is a separate issue requiring further investigation of Slidev theme CSS loading.

## Implementation Files

**Modified**:
- `data/aislidev-demo/slides.md` - Changed to history mode
- `src/server/services/SlidevManager.ts` - Added `--base` parameter
- `src/server/index.ts` - Fixed Vite config loading and proxy routing
- `src/components/SlidevPreview.vue` - Removed `/#/` from URL

**Verified Clean**:
- `vite.config.ts` - Already had Vue plugin configured
- `package.json` - Already had `@vitejs/plugin-vue@^6.0.4`

## References

- [Slidev CLI Documentation](https://sli.dev/guide/install.html#command-line-interface-cli)
- [Vite Middleware Mode](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server)
- [Vue Router History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

## Next Steps

1. **Investigate theme CSS loading issue** - Why subsequent slides don't load theme styling
2. **Consider Referer fallback** - Add alternative routing for browsers that don't send Referer
3. **Document deployment** - Update deployment guide with history mode routing requirements
4. **Test all Slidev themes** - Verify fix works with different Slidev themes (default, seriph, etc.)
