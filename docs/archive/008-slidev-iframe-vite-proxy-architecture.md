# ADR-008: Slidev Iframe Vite Proxy Architecture

## Status

Accepted

## Date

2026-03-10

## Context

AISliDev embeds Slidev preview instances in an iframe within the main application. This requires proxying requests from the main application (port 13000) to dynamically spawned Slidev instances (varying ports like 13030).

The challenge is that Slidev uses Vite's development server, which generates numerous virtual modules with special path patterns. These paths must be correctly proxied to the appropriate Slidev instance based on context (Referer header or cached state).

## Problem

When implementing iframe-based Slidev preview, we encountered a series of 404 errors for different types of Vite virtual modules:

1. Standard Vite paths: `/@fs/...`, `/@vite/...`, `/@id/...`
2. Slidev virtual modules: `/@slidev/...`
3. Server-reactive state: `/@server-reactive/...`
4. UnoCSS virtual modules: `/__uno*.css`
5. Slidev frontmatter modules: `/slides.md__slidev_*.frontmatter`

Each path pattern requires explicit proxy middleware handling because:

- Browser requests use absolute paths (ignoring iframe's `<base>` tag for certain resources)
- Vite virtual modules are dynamically generated and not static files
- Port routing must be determined from request context (Referer header)

## Decision

Implement a comprehensive Vite proxy middleware that intercepts ALL Vite special path patterns and routes them to the correct Slidev instance.

### Proxy Architecture

**File**: `src/server/index.ts` (lines ~140-180)

**Core Logic**:

```typescript
// Vite special paths proxy (/@fs/, /@vite/, /@id/, /@slidev/, /@server-reactive/, /__*, slides.md__slidev_*)
let lastUsedPort: number | null = null;

await fastify.use((req, res, next) => {
  const url = req.url || "";

  // Match ALL Vite virtual module patterns
  if (
    url.match(/^\/@(fs|vite|id|slidev|server-reactive)/) ||
    url.startsWith("/__") ||
    url.match(/^\/slides\.md__slidev_/)
  ) {
    const referer = req.headers.referer || req.headers.referrer || "";

    // Extract target port from Referer header
    const refererMatch = referer.match(/\/slidev\/(\d+)/);
    let port: number | null = null;

    if (refererMatch) {
      port = parseInt(refererMatch[1]);
      lastUsedPort = port; // Cache for subsequent requests
    } else if (lastUsedPort) {
      port = lastUsedPort; // Fallback to cached port
    }

    if (port) {
      // Get or create proxy instance for this port
      if (!slidevProxies.has(port)) {
        const proxy = createProxyMiddleware({
          target: `http://localhost:${port}`,
          changeOrigin: true,
          ws: false,
        });
        slidevProxies.set(port, proxy);
      }

      return slidevProxies.get(port)(req, res, next);
    }
  }

  next();
});
```

### Path Patterns Explained

| Pattern                            | Purpose                | Example                                                   |
| ---------------------------------- | ---------------------- | --------------------------------------------------------- |
| `/@fs/...`                         | Filesystem access      | `/@fs/Users/.../node_modules/vue/dist/vue.esm-bundler.js` |
| `/@vite/...`                       | Vite client/HMR        | `/@vite/client`                                           |
| `/@id/...`                         | Node module resolution | `/@id/__x00__virtual:...`                                 |
| `/@slidev/...`                     | Slidev virtual modules | `/@slidev/configs`, `/@slidev/setups/main`                |
| `/@server-reactive/...`            | Server-reactive state  | `/@server-reactive/nav`, `/@server-reactive/drawings`     |
| `/__uno*.css`                      | UnoCSS virtual modules | `/__uno.css`, `/__uno_preflights.css`                     |
| `/slides.md__slidev_*.frontmatter` | Slidev frontmatter     | `/slides.md__slidev_1.frontmatter?import`                 |

### HTML Base Tag Strategy

The Slidev proxy middleware (separate from Vite proxy) injects `<base href="/slidev/${port}/">` into HTML responses:

```typescript
// Slidev proxy middleware (handles /slidev/:port/* paths)
if (
  contentType.includes("text/html") &&
  (reqPath === "/" || reqPath.startsWith("/?"))
) {
  let html = responseBuffer.toString("utf8");
  html = html.replace("<head>", `<head>\n  <base href="/slidev/${port}/">`);
  return html;
}
```

**Why This Works**:

- Relative paths (e.g., `favicon.ico`) resolve to `/slidev/${port}/favicon.ico`
- Absolute paths (e.g., `/@fs/...`) bypass `<base>` tag and match Vite proxy patterns
- Best of both worlds: relative path resolution + explicit absolute path handling

### Port Resolution Strategy

1. **Primary**: Extract from Referer header (`/slidev/(\d+)` pattern)
2. **Fallback**: Use `lastUsedPort` cached from previous requests
3. **Rationale**:
   - First request (HTML) has clear Referer with port
   - Subsequent module imports may lose Referer context
   - Cache ensures continuity within same session

## Consequences

### Positive

1. **Complete Vite Virtual Module Support**: All Vite special paths correctly proxied
2. **Minimal HTML Manipulation**: Only inject `<base>` tag, no path rewriting
3. **Robust Port Routing**: Referer + cache fallback handles edge cases
4. **Reusable Proxy Instances**: Per-port proxy instances cached for performance
5. **Extensible Pattern Matching**: Easy to add new virtual module patterns

### Negative

1. **Pattern Maintenance**: Must update regex when Vite/Slidev introduce new virtual paths
2. **Cache Invalidation**: `lastUsedPort` cache could theoretically route to wrong instance if user switches between presentations rapidly (unlikely in practice)
3. **Debugging Complexity**: Multiple layers (Vite proxy → Slidev proxy → Slidev instance) can be hard to trace

### Failed Approaches (Learn from Mistakes)

**❌ Approach 1: Path Rewriting in HTML**

- Tried: Rewrite `/@fs/...` to `@fs/...` (remove leading slash) to force `<base>` tag usage
- Failed: ES modules always use absolute paths, ignoring `<base>` tag
- Issue: Vite module imports generated absolute paths that bypassed rewritten HTML

**❌ Approach 2: Only Inject Base Tag**

- Tried: Inject `<base>` but don't handle absolute Vite paths
- Failed: Absolute paths (`/@fs/`, `/__uno.css`) ignored base tag
- Issue: Browser sent requests to main app instead of Slidev instance

**❌ Approach 3: Partial Pattern Matching**

- Tried: Only match `/@fs/`, `/@vite/`, `/@id/`
- Failed: Slidev virtual modules (`/@slidev/`, `/@server-reactive/`) returned 404
- Issue: Vite ecosystem uses many special path patterns, must handle ALL

**❌ Approach 4: Proxy with Base Tag and Path Prefix**

- Tried: Use proxy path `/slidev/:port/` with injected `<base href="/slidev/${port}/">` and hash router
- Failed: Vue Router still saw `/slidev/${port}/` as base path, causing 404
- Issue: Even with hash mode, router initialization reads base path from `<base>` tag, leading to route mismatch
- Example: `<base href="/slidev/13032/">` + hash `#/` → Vue Router thinks base is `/slidev/13032/`, displays 404

**✅ Final Solution: Direct Port Access with Hash Router**

- Access Slidev instance directly via `http://localhost:${port}/#/`
- No proxy path prefix, no base tag needed
- Clean separation: Main app on port 13000, Slidev instances on dynamic ports
- Hash router works perfectly without path conflicts
- All Vite virtual modules still proxied correctly via Referer-based routing

- Match ALL known Vite virtual module patterns explicitly
- Use Referer-based routing with cache fallback
- Separate concerns: Vite proxy (absolute paths) + Slidev proxy (relative paths via base tag)

## Migration Notes

If you encounter new 404 errors for virtual modules in the future:

1. **Check Browser Console**: Identify the failing URL pattern
2. **Update Vite Proxy Regex** (`src/server/index.ts` line ~143):
   ```typescript
   if (url.match(/^\/@(fs|vite|id|slidev|server-reactive|NEW_PATTERN)/) ||
       url.startsWith('/__') ||
       url.match(/^\/slides\.md__slidev_/) ||
       url.match(/^\/NEW_PATTERN_HERE/)) {
   ```
3. **Test with Referer**: `curl -H "Referer: http://localhost:13000/slidev/13030/" http://localhost:13000/NEW_PATH`
4. **Update This ADR**: Document the new pattern and why it was added

## Related ADRs

- [ADR-004: Slidev Vite Dev Mode Fix](./004-slidev-vite-dev-mode-fix.md) - Initial Slidev integration approach
- [ADR-007: Remove Slidev Base Parameter](./007-remove-slidev-base-parameter.md) - Why we removed `base` config injection

## References

- [Vite Dev Server Special Paths](https://vitejs.dev/guide/api-hmr.html#special-paths)
- [Slidev Virtual Modules](https://sli.dev/custom/vue-context.html)
- [UnoCSS Vite Plugin](https://unocss.dev/integrations/vite)
- [http-proxy-middleware Documentation](https://github.com/chimurai/http-proxy-middleware)
