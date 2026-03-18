# ADR-011: Fix PPTX Export Flow with Correct URLs and Auto-Start

**Date**: 2026-03-17  
**Status**: Accepted  
**Contributors**: @tony140407 (PR #2)  
**Related**: [ADR-009](./009-pptx-export-via-data-directory.md), [ADR-010](./010-revert-child-process-screenshot-approach.md)

---

## Context

The PPTX export feature (introduced in v0.3.0 via [ADR-009](./009-pptx-export-via-data-directory.md)) had three critical issues preventing it from working correctly:

### Problem 1: Incorrect Screenshot URLs

**Symptom**: BrowserExporter navigated to `http://localhost:{port}/1`, but Playwright captured Vite's "wrong base URL" error page instead of actual slides.

**Root Cause**: Slidev uses `--base /slidev/{port}/` for its base path, configured in `SlidevManager.ts`:

```typescript
const args = [
  "slidev",
  slidesPath,
  "--port",
  port.toString(),
  "--base",
  `/slidev/${port}/`, // ← Required base path
  // ...
];
```

Without including this base path in screenshot URLs, Vite serves a 404 or base URL mismatch error page.

### Problem 2: Manual Preview Requirement

**Symptom**: Export endpoint returned HTTP 400 if Slidev wasn't already running.

**User Experience Issue**: Users had to manually open preview before exporting, creating unnecessary friction.

**Original Code**:

```typescript
const processInfo = slidevManager.getProcess(id);
if (!processInfo || processInfo.status !== "running") {
  return reply.code(400).send({
    error: "Presentation not running",
    message: `Presentation '${id}' must be running to export. Start preview first.`,
  });
}
```

### Problem 3: Frontend Download Flow Mismatch

**Symptom**: Frontend tried to download PPTX directly from POST response, but server returned JSON with `downloadUrl`.

**Protocol Mismatch**:

- **Frontend expected**: `POST /export` → PPTX blob
- **Server returned**: `POST /export` → JSON `{ downloadUrl: "/api/presentations/{id}/exports/{file}.pptx" }`

**Original Frontend Code**:

```typescript
const response = await fetch(`/api/presentations/${id}/export`, {
  method: "POST",
});
const blob = await response.blob(); // ❌ This is JSON, not a blob!
```

---

## Decision

We accept PR #2 from @tony140407 that fixes all three issues:

### Fix 1: Correct Screenshot URLs

**Change**: Include Slidev's base path in all screenshot URLs.

**Implementation** (`BrowserExporter.ts`):

```typescript
// Before:
const slideUrl = `http://localhost:${port}/${slideNumber}`;

// After:
const slideUrl = `http://localhost:${port}/slidev/${port}/${slideNumber}`;
```

**Applied to**:

- Initial navigation in `exportPPTX()` (line ~71)
- Slide screenshot in `screenshotSlide()` (line ~193)

### Fix 2: Auto-Start Slidev

**Change**: Export endpoint auto-starts Slidev if not running, instead of returning 400 error.

**Implementation** (`presentations.ts`):

```typescript
// Get Slidev process info to obtain port, auto-start if not running
let processInfo = slidevManager.getProcess(id);
if (!processInfo || processInfo.status !== "running") {
  fastify.log.info(`[Export ${id}] Slidev not running, auto-starting...`);
  const content = await fs.readFile(slidesPath, "utf-8");
  processInfo = await slidevManager.startPresentation(id, content);
}
```

**Benefits**:

- ✅ Seamless UX: Click "Export" → get PPTX (no manual preview step)
- ✅ Stateless: Export works regardless of current UI state
- ✅ Consistent: Same behavior whether preview is open or not

### Fix 3: Two-Step Download Flow

**Change**: Frontend correctly handles JSON response → fetch downloadUrl → download blob.

**Implementation** (`EditorLayout.vue`):

```typescript
// Step 1: Trigger export (returns JSON)
const response = await fetch(`/api/presentations/${id}/export`, {
  method: "POST",
});
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || "Export failed");
}

// Step 2: Get download URL from JSON
const data = await response.json();

// Step 3: Download the actual PPTX file
const fileResponse = await fetch(data.downloadUrl);
if (!fileResponse.ok) {
  throw new Error("Failed to download exported file");
}

const blob = await fileResponse.blob();
// ... download blob as file
```

**Additional Fix**: Removed unnecessary `Content-Type: application/json` header from POST request with empty body.

---

## Consequences

### Positive

✅ **PPTX Export Now Works**: All three issues resolved, export flow functional end-to-end.

✅ **Improved UX**: Users can export directly without opening preview first.

✅ **Correct Protocol**: Frontend and backend protocol now aligned (JSON response with downloadUrl).

✅ **Maintainability**: Clear separation of concerns:

- Export endpoint: Orchestrate export process, return metadata
- Static file serving: Deliver exported PPTX files
- Frontend: Handle two-step download flow

✅ **Logging**: Auto-start behavior is logged for debugging.

### Limitations & Future Work

⚠️ **Background Image Issue Still Exists**: This PR fixes URL paths and UX flow, but does NOT solve the core background image loading problem documented in [ADR-010](./010-revert-child-process-screenshot-approach.md).

**Status of background images**:

- **URL path**: Now correct ✅
- **Loading in screenshots**: Still fails (97KB white backgrounds) ❌
- **Root cause**: Playwright execution context in service process (see ADR-010)
- **Solution**: Requires architectural change (separate worker process or AI-assisted image generation approach)

⚠️ **No Timeout on Auto-Start**: If Slidev fails to start, export will hang. Consider adding:

```typescript
const maxWait = 30000; // 30 seconds
const startTime = Date.now();
while (Date.now() - startTime < maxWait) {
  if (processInfo.status === "running") break;
  await sleep(500);
}
if (processInfo.status !== "running") {
  throw new Error("Slidev failed to start within timeout");
}
```

⚠️ **Error Handling**: Frontend error messages could be more specific (distinguish between export failure and download failure).

### Migration Notes

**No Breaking Changes**: This is a bug fix that makes existing functionality work correctly.

**Testing Checklist**:

- [ ] Export PPTX when Slidev is not running → should auto-start and export
- [ ] Export PPTX when Slidev is already running → should use existing process
- [ ] Verify downloaded PPTX has correct slide content (not error pages)
- [ ] Check server logs confirm correct URL: `http://localhost:{port}/slidev/{port}/{slideNumber}`

---

## References

- **PR #2**: https://github.com/matheme-justyn/aislidev/pull/2
- **Contributor**: @tony140407
- **Merge Commit**: `7b0424d` (squash and merge)
- **Local Merge**: `2e9d172` (merge commit with investigation history)

### Related ADRs

- [ADR-009: PPTX Export via Data Directory](./009-pptx-export-via-data-directory.md) - Original PPTX export implementation
- [ADR-010: Revert Child Process Screenshot Approach](./010-revert-child-process-screenshot-approach.md) - Background image loading investigation (ongoing issue)

### Investigation Context

This PR was reviewed during Session 4 of the PPTX background loading investigation. While it doesn't solve the core background image issue, it fixes critical path and UX problems that prevented export from working at all.

See `docs/investigation/pptx-background-loading-issue.md` for complete investigation timeline.

---

## Acknowledgment

**Special thanks to @tony140407** for:

- Identifying all three issues independently
- Providing complete, well-structured PR with clear description
- Following Conventional Commits format
- Including comprehensive testing instructions

This contribution significantly improved the PPTX export feature and demonstrates the value of community contributions.
