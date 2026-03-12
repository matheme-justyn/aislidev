# ADR-007: Remove Slidev Base URL Parameter

## Status

Accepted

## Date

2026-03-10

## Context

### Previous Architecture (ADR-005)

We previously used path-based proxy routing with Slidev's `--base` parameter:

```typescript
// Slidev launched with:
npx slidev --base /slidev/${port}/

// Proxy forwarded requests with full path:
GET /slidev/13030/slides/1 → http://localhost:13030/slidev/13030/slides/1
```

**Critical Issues Discovered**:

1. **Export PPTX Broken**: Slidev's export endpoint expected `base=/` but received `/slidev/:port/`, producing empty PPTX files
2. **WebSocket Path Confusion**: Some `/@server-reactive/*` endpoints failed with 404 errors
3. **Resource Path Complications**: Absolute path endpoints didn't account for base URL prefix
4. **Cascading Problems**: "疊床架屋" (stacking solutions) - each fix created new issues

### Root Cause Analysis (Oracle Consultation)

The fundamental problem: **Embedding a complete SPA (Slidev) inside another SPA (AISlidev) with path manipulation breaks Slidev's assumptions about its base URL.**

Slidev is designed to either:

- Run at root path (`base=/`)
- Run at a static sub-path (e.g., `base=/presentations/`)

But NOT:

- Dynamic per-instance sub-paths (`/slidev/13030/`, `/slidev/13031/`) where the port number changes

### Ecosystem Research (Librarian Agent)

Research across GitHub (1000+ Slidev repos) found:

- ❌ **Zero projects** use path-based proxy with `--base` parameter
- ✅ Existing solutions: Electron (IPC), WebContainer (isolated), or native integration
- ✅ Slidev provides **built-in `?embedded=true` mode** with postMessage API

### Code Dependency Analysis (Explore Agent)

Only **one feature** depended on same-origin access:

- Page number preservation: `iframe.contentWindow.location.href`
- Can be replaced with postMessage (~20-30 lines)

All other features work cross-origin.

---

## Decision

**Remove the `--base /slidev/${port}/` parameter from Slidev launch arguments and implement postMessage-based communication.**

### Key Changes

#### 1. Slidev Launch (No Base Parameter)

```typescript
// Before (ADR-005):
npx slidev --base /slidev/${port}/ --port ${port}

// After (ADR-007):
npx slidev --port ${port}
// Slidev sees itself at base=/
```

#### 2. Proxy Path Rewriting

```typescript
// src/server/index.ts
app.use(
  `/slidev/:port`,
  createProxyMiddleware({
    target: "http://localhost",
    router: (req) => {
      const port = req.url?.match(/^\/slidev\/(\d+)/)?.[1];
      return `http://localhost:${port}`;
    },
    pathRewrite: {
      "^/slidev/\\d+": "", // Strip prefix before forwarding
    },
    changeOrigin: true,
    ws: true, // WebSocket support
  }),
);
```

**Request Flow**:

```
Browser: GET /slidev/13030/slides/1
         ↓ (proxy strips prefix)
Slidev:  GET /slides/1
         ↓ (Slidev sees base=/)
Response: Works correctly
```

#### 3. PostMessage Communication Layer

**New file: `src/composables/slidevBridge.ts`**

```typescript
export function useSlidevBridge(iframeRef: Ref<HTMLIFrameElement | null>) {
  const currentPage = ref(1);
  const totalPages = ref(1);

  // Listen to Slidev's navState messages
  window.addEventListener("message", (event) => {
    if (event.data.type === "navState") {
      currentPage.value = event.data.page;
      totalPages.value = event.data.total;
    }
  });

  // Send navigate command to Slidev
  const navigate = (page: number) => {
    iframe.contentWindow?.postMessage({ type: "navigate", page }, "*");
  };

  const reload = () => {
    if (!iframe) return;
    iframe.src = iframe.src; // Trigger reload
  };

  return { currentPage, totalPages, navigate, reload };
}
```

#### 4. Component Integration

**Updated: `src/components/SlidevPreview.vue`**

```typescript
// Before: Direct iframe.contentWindow access
const currentPage = computed(() => {
  const href = iframe.contentWindow?.location.href;
  return extractPageNumber(href);
});

// After: PostMessage bridge
const { currentPage, totalPages, navigate, reload } =
  useSlidevBridge(iframeRef);
```

**Iframe URL includes embedded mode**:

```typescript
const slidevUrl = computed(
  () => `/slidev/${props.presentation.port}/?embedded=true`,
);
```

### Why This Works

1. **Slidev's perspective**: Always sees `base=/` (default behavior)
2. **Browser's perspective**: Accesses via `/slidev/:port/` (isolated routing)
3. **Proxy's role**: Transparent translation between the two perspectives
4. **Communication**: Standard postMessage API (Slidev natively supports)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Browser (localhost:13000)                               │
│                                                          │
│  ┌──────────────┐  postMessage  ┌─────────────────┐    │
│  │ AISlidev App │◄──────────────►│ Slidev Preview  │    │
│  │              │  (cross-origin)│  ?embedded=true │    │
│  └──────────────┘                └─────────────────┘    │
│        │                                  │              │
└────────┼──────────────────────────────────┼──────────────┘
         │                                  │
         │ HTTP                             │ HTTP/WS
         │                                  │
         ▼                                  ▼
┌─────────────────────────────────────────────────────────┐
│ Fastify Server (port 13000)                             │
│                                                          │
│  ┌──────────────┐         ┌──────────────────────┐     │
│  │ Vite Routes  │         │ Slidev Proxy         │     │
│  │ (/*) │         │ (/slidev/:port/*)    │     │
│  └──────────────┘         └──────────────────────┘     │
│                                     │                    │
│                       pathRewrite: '^/slidev/\d+' → ''  │
└─────────────────────────────────────┼───────────────────┘
                                      │
                                      │ Strip prefix
                                      ▼
                            ┌──────────────────┐
                            │ Slidev Server    │
                            │ (port 13030)     │
                            │                  │
                            │ base=/ (default) │
                            └──────────────────┘
```

---

## Alternatives Considered

### Alternative 1: Host-Based Routing

Use `p-<id>.localhost` subdomains instead of path-based routing.

**Pros**:

- Clean URLs, Slidev sees `base=/` naturally
- No proxy path manipulation needed

**Cons**:

- Requires DNS/hosts file configuration
- Browser compatibility issues (Safari, Firefox strict mode)
- Complex setup for users
- Doesn't work in containerized environments without extra config

**Decision**: Rejected for v0.3.0, can migrate later if needed.

### Alternative 2: Keep `--base` + Fix Export Endpoints

Manually patch Slidev's export logic to handle base URLs.

**Cons**:

- Fragile: Every Slidev update might break it
- Doesn't solve WebSocket routing issues
- Fighting against framework design

**Decision**: Rejected - architectural workaround is cleaner.

### Alternative 3: Separate Export Server

Run a dedicated Slidev instance without `--base` for exports only.

**Cons**:

- Resource overhead (extra processes)
- Complex lifecycle management
- User confusion (why two Slidev instances?)

**Decision**: Rejected - unnecessary complexity.

---

## Consequences

### Positive

✅ **Export PPTX Fixed**: Slidev's export endpoint works correctly (sees `base=/`)

✅ **WebSocket Routing Simplified**: No path prefix confusion

✅ **Standard Communication**: Uses Slidev's official `?embedded=true` + postMessage API

✅ **Future-Proof**: Aligned with Slidev's design intent

✅ **Cleaner Architecture**: Removed "疊床架屋" (stacked solutions) complexity

✅ **Backward Compatible**: All existing features preserved

### Negative

❌ **Cross-Origin Limitations**: Cannot directly access `iframe.contentWindow.location`

- Mitigation: PostMessage provides same functionality

⚠️ **Additional Abstraction Layer**: `useSlidevBridge()` composable

- Benefit: Encapsulates communication logic, easier to test

### Neutral

🔄 **External Access Still Path-Based**: Users still access via `/slidev/:port/`

- This is intentional - provides isolation between presentations
- Can migrate to host-based routing later if needed

---

## Superseded ADRs

This ADR supersedes:

- **ADR-006**: Puppeteer-Based PPTX Export
  - Reason: Root cause (base URL parameter) is now fixed
  - Puppeteer automation no longer needed for exports
  - Slidev's native export should work correctly now

---

## Related

- **ADR-005**: WebSocket-Enabled Proxy for Slidev (proxy mechanism still used)
- **ADR-004**: Slidev Vite Dev Mode Fix (original iframe integration)
- **ADR-006**: Puppeteer-Based PPTX Export (superseded by this ADR)

---

## References

- [Slidev Embedded Mode Documentation](https://sli.dev/guide/ui.html#embedded-mode)
- [Slidev Export Guide](https://sli.dev/guide/exporting.html)
- [http-proxy-middleware pathRewrite](https://github.com/chimurai/http-proxy-middleware#pathrewrite-object-function)
- [Vite Issue #15099](https://github.com/vitejs/vite/issues/15099) - Sub-path deployment problems
- Oracle agent analysis (session: ses_32a91053fffe2GNHRSXvitaWqE)
- Librarian agent research (sessions: ses_32a8e638effeAV5uRH4xpqcVuP, ses_32a818bd3ffeTPMSpwo6e7IhCx)
- Explore agent analysis (session: ses_32a8e4ecaffeXuEYuvNHkQMgxJ)

---

## Verification

**Expected Test Results** (Manual Testing Required):

- [ ] Slidev preview loads correctly
- [ ] HMR (Hot Module Replacement) works
- [ ] Page navigation via postMessage works
- [ ] Refresh button preserves current page
- [ ] **Export PPTX generates non-empty file** (primary goal)
- [ ] WebSocket connections established without 404 errors
- [ ] Multiple presentations run independently

**Test Plan**: See `docs/TEST_PLAN.md` (lines 43-73)
