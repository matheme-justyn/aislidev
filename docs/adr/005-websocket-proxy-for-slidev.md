# ADR-005: WebSocket-Enabled Proxy for Slidev Integration

**Status**: Accepted

**Date**: 2026-03-09

**Deciders**: Development Team

---

## Context

AISlidev integrates Slidev preview in an iframe, where the Slidev server runs on a separate port (e.g., 13030) and the main application runs on port 13000. We need to proxy all Slidev requests through the main application server to:

1. Maintain a unified entry point (single port for users)
2. Enable cross-origin communication between editor and preview
3. Support Slidev's real-time features (Hot Module Replacement, reactive navigation)

### Initial Implementation Issues

**Problem 1: No WebSocket Support**

The original proxy implementation used Node's `fetch()` API:

```typescript
const response = await fetch(targetUrl, {
  method: request.method,
  headers,
  body: ...
});
```

This approach:

- ✅ Works for HTTP requests (GET, POST, etc.)
- ❌ **Does NOT support WebSocket connections**
- ❌ Breaks Slidev's HMR (Hot Module Replacement)
- ❌ Breaks `/@server-reactive` endpoints that require WebSocket

**Errors observed**:

```
WebSocket connection to 'ws://localhost:13000/slidev/13030/' failed
POST http://localhost:13000/@server-reactive/nav 404 (Not Found)
```

**Problem 2: Redirect Loop**

When attempting to remove `/slidev/:port` prefix via `pathRewrite`, Slidev redirected requests back to its configured `--base` path, causing infinite 302 loops:

```
GET /slidev/13030/ → Proxy strips prefix → GET / → Slidev redirects to /slidev/13030/ → Loop
```

---

## Decision

**Adopt `http-proxy-middleware` with explicit WebSocket upgrade handling.**

### Key Implementation Details

#### 1. Use `http-proxy-middleware`

Replace `fetch()`-based proxy with a specialized HTTP/WebSocket proxy library:

```typescript
import { createProxyMiddleware } from "http-proxy-middleware";
```

#### 2. Preserve Full Request Path

**Do NOT strip `/slidev/:port` prefix** - Slidev expects it due to `--base` flag:

```typescript
// Slidev launched with:
npx slidev --base /slidev/${port}/

// Proxy configuration:
const proxy = createProxyMiddleware({
  target: `http://localhost:${port}`,
  changeOrigin: true,
  ws: true, // Enable WebSocket
  // NO pathRewrite - keep full path
});
```

#### 3. Handle WebSocket Upgrades Explicitly

Register upgrade event listener on Fastify's underlying HTTP server:

```typescript
fastify.server.on("upgrade", (req, socket, head) => {
  const upgradeUrl = req.url || "";
  if (upgradeUrl.startsWith(`/slidev/${port}`)) {
    proxy.upgrade(req, socket, head);
  }
});
```

#### 4. Reuse Proxy Instances

Create one proxy instance per Slidev port and reuse it:

```typescript
const slidevProxies = new Map();

if (!slidevProxies.has(port)) {
  const proxy = createProxyMiddleware({ ... });
  slidevProxies.set(port, proxy);

  // Setup WebSocket upgrade for this port
  fastify.server.on('upgrade', ...);
}

return slidevProxies.get(port)(req, res, next);
```

**Why reuse?** WebSocket upgrade handlers must be registered once, not per-request.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Browser (localhost:13000)                               │
│                                                          │
│  ┌──────────────┐         ┌─────────────────┐          │
│  │ AISlidev App │◄───────►│ Slidev Preview  │          │
│  │   (Vite)     │         │    (iframe)     │          │
│  └──────────────┘         └─────────────────┘          │
│        │                          │                     │
└────────┼──────────────────────────┼─────────────────────┘
         │                          │
         │ HTTP/WS                  │ HTTP/WS
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│ Fastify Server (port 13000)                             │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────────┐      │
│  │ Vite Middleware  │    │ Slidev Proxy         │      │
│  │  (for /*)        │    │  (for /slidev/:port) │      │
│  └──────────────────┘    └──────────────────────┘      │
│                                   │                     │
│                                   │ http-proxy-         │
│                                   │ middleware          │
│                                   │ (WebSocket support) │
└───────────────────────────────────┼─────────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │ Slidev Server    │
                          │ (port 13030)     │
                          │                  │
                          │ --base /slidev/  │
                          │        13030/    │
                          └──────────────────┘
```

---

## Alternatives Considered

### Alternative 1: Custom WebSocket Proxy Implementation

Write custom WebSocket upgrade handling with Node's `http` module.

**Rejected because**:

- Complex to implement correctly
- Requires handling WebSocket protocol details
- `http-proxy-middleware` is battle-tested

### Alternative 2: Remove `/slidev/:port` Prefix (Path Rewriting)

Strip the prefix before forwarding to Slidev.

**Rejected because**:

- Causes infinite redirect loop
- Slidev's `--base` flag expects the full path
- Would require modifying Slidev's internal behavior

### Alternative 3: Run Slidev Without `--base`

Launch Slidev at root path without base prefix.

**Rejected because**:

- Cannot distinguish multiple Slidev instances
- Asset paths would conflict with main app
- Breaks Slidev's design for sub-path deployment

---

## Consequences

### Positive

✅ **WebSocket connections work** - HMR and reactive features function correctly

✅ **No redirect loops** - Slidev receives requests with expected paths

✅ **Reusable proxy instances** - Efficient resource usage

✅ **Maintainable** - Using standard library instead of custom implementation

✅ **Supports multiple Slidev instances** - Each port gets its own proxy

### Negative

❌ **Additional dependency** - `http-proxy-middleware` (~7 packages)

❌ **Complexity** - More moving parts than simple `fetch()` proxy

⚠️ **Known Issue**: Some `/@server-reactive/*` requests without `/slidev/:port/` prefix still return 404. These appear to be non-critical as preview displays correctly.

### Future Improvements

- Investigate and fix remaining `/@server-reactive/nav` 404 errors
- Consider adding retry logic for transient proxy errors
- Add monitoring/metrics for proxy health

---

## Related

- **ADR-004**: Slidev Vite Dev Mode Fix - Original iframe integration approach
- **SlidevManager.ts**: Manages Slidev process lifecycle and port allocation
- **Related Issue**: WebSocket connection failures, 302 redirect loops

---

## References

- [http-proxy-middleware Documentation](https://github.com/chimurai/http-proxy-middleware)
- [Fastify Middleware Guide](https://fastify.dev/docs/latest/Guides/Middleware/)
- [Slidev Base Path Configuration](https://sli.dev/guide/hosting#base-path)
- [WebSocket Protocol RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
