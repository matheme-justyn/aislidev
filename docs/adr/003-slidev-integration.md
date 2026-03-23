# ADR-003: Slidev Preview Integration

**Status**: Accepted  
**Date**: 2025-12-22 (Original), Updated 2026-03-16  
**Supersedes**: ADR-004, 005, 007, 008, 012

## Context

Integrating Slidev's live preview server into AISlidev frontend requires handling:
1. Vite dev mode constants
2. WebSocket connections for hot reload
3. URL routing and proxying
4. Vue plugin compatibility

## Evolution Timeline

### Issue 1: Vite Dev Mode Constants (2025-12-22)

**Problem**: Slidev's Vite config uses Node-only APIs in browser code
```javascript
export default defineConfig({
  define: {
    __DEV__: process.env.NODE_ENV === 'development'  // ❌ process is undefined in browser
  }
})
```

**Fix**: Wrap in JSON.stringify()
```javascript
define: {
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
}
```

### Issue 2: WebSocket Proxy (2025-12-23)

**Problem**: Slidev's HMR (Hot Module Reload) uses WebSocket, HTTP-only proxy breaks it

**Fix**: Enable WebSocket in http-proxy-middleware
```javascript
app.use('/slidev/:port', createProxyMiddleware({
  target: 'http://localhost',
  ws: true,  // Enable WebSocket
  router: (req) => `http://localhost:${req.params.port}`
}));
```

### Issue 3: Slidev Base URL Confusion (2026-01-10)

**Problem**: Slidev's `--base` parameter caused asset loading failures

**Root Cause**: Proxy already handles path rewriting, `--base` creates double-pathing

**Fix**: Remove `--base` parameter entirely, use direct paths

### Issue 4: Proxy Response Interception (2026-01-12)

**Problem**: http-proxy-middleware v3 changed API, response interception broken

**Old API (v2)**:
```javascript
onProxyRes: (proxyRes, req, res) => {
  proxyRes.on('data', chunk => res.write(chunk));
}
```

**New API (v3)**:
```javascript
on: {
  proxyRes: (proxyRes, req, res) => {
    // Handle response buffering
  }
}
```

### Issue 5: Vue Router Hash Mode Incompatibility (2026-03-15)

**Problem**: Slidev uses hash routing (`#/2`), Vue Router intercepted hash changes

**Attempted Fixes**:
1. Proxy rewriting `/slidev/:port/:slide` ❌
2. Vue Router ignore patterns ❌
3. Manual iframe postMessage ❌

**Final Fix**: Direct iframe access (no proxy for preview)
```vue
<iframe :src="`http://localhost:${port}/`" />
```

**Trade-off**: Requires CORS configuration in Slidev (`--remote` flag)

### Issue 6: Vite Plugin Compatibility (2026-03-15)

**Problem**: `vite-plugin-vue-devtools` caused initialization errors in Slidev child process

**Fix**: Explicitly disable in Slidev's Vite config
```javascript
export default defineConfig({
  plugins: [
    vue(),
    !process.env.DISABLE_VUE_DEVTOOLS && VueDevTools()
  ].filter(Boolean)
})
```

## Current Architecture

**Slidev Preview Flow**:
```
User Browser
  ↓
AISlidev Frontend (Vue)
  ↓
<iframe src="http://localhost:{port}/"> ← Direct access
  ↓
Slidev Dev Server (--remote flag for CORS)
```

**No proxy for preview** - Simplifies routing, eliminates WebSocket/hash conflicts

**SlidevManager**:
- Starts Slidev with `--remote` flag (bind to 0.0.0.0)
- Dynamic port allocation (13030-13040)
- Process lifecycle management

## Consequences

**Positive**:
- Direct iframe access eliminates routing complexity
- Native Slidev HMR works without custom WebSocket handling
- No Vue Router conflicts
- Simpler architecture to maintain

**Negative**:
- Requires CORS configuration (`--remote`)
- Frontend needs to know exact port (dynamic port passing)
- Cannot use relative URLs in iframe

## Key Lessons

1. **Avoid over-proxying**: Direct access often simpler than complex proxying
2. **Framework boundaries**: Respect hash routing in iframes
3. **Vite plugins**: Carefully manage plugin compatibility in child processes
4. **API changes**: Always check migration guides for major version bumps

## References

- [Slidev Configuration](https://sli.dev/custom/config-vite)
- [http-proxy-middleware v3 Migration](https://github.com/chimurai/http-proxy-middleware/blob/master/MIGRATION.md)
- [Vite define Option](https://vitejs.dev/config/shared-options.html#define)
