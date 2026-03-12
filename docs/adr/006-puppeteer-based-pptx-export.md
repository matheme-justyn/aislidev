# ADR-006: Puppeteer-Based PPTX Export

## Status

~~Accepted~~ → **Superseded by [ADR-007](./007-remove-slidev-base-parameter.md)**

**Superseded Date**: 2026-03-10

**Reason**: The root cause of PPTX export failures was Slidev's `--base` parameter. ADR-007 removed the base URL parameter, allowing Slidev's native export to work correctly. Puppeteer automation is no longer needed.

## Context

We need to implement PPTX export functionality for presentations. Initial attempts using Slidev CLI (`slidev export --format pptx`) produced empty PPTX files despite showing success messages.

### Investigation Results

1. **Slidev CLI Export Issues** (via librarian agent research):
   - GitHub Issues #2091, #1851, #1624 report empty exports
   - CLI uses Playwright Chromium but has known bugs
   - Export appears successful but generates empty files (no slide content)

2. **Slidev's Recommendation**:
   - Official docs explicitly recommend "Browser Exporter" over CLI
   - Browser exporter available at `http://localhost:<port>/export`
   - CLI message: "Try the new browser exporter!"

3. **Root Cause**:
   - CLI export's Playwright rendering fails silently
   - Container/headless environment limitations
   - Screen Capture API requirements not met by CLI

### Options Considered

**Option A: Continue with CLI + Debugging**

- Pros: Simpler implementation, no additional dependencies
- Cons: Known bugs, unpredictable results, community reports failures

**Option B: Redirect to Browser Exporter (Manual)**

- Pros: Quick implementation (5 minutes), uses official recommended method
- Cons: Requires manual user action, breaks "one-click export" UX

**Option C: Puppeteer Automation of Browser Exporter** ✅ Selected

- Pros:
  - Uses official recommended export method
  - True "one-click" experience
  - Reliable results (browser-based rendering)
  - Better error handling
- Cons:
  - Additional dependency (puppeteer ~65 packages)
  - More complex implementation
  - Longer export time (~30-60 seconds)

## Decision

We will use **Puppeteer to automate the Browser Exporter** workflow.

### Implementation Approach

1. **Browser Automation**:
   - Launch headless Chromium via Puppeteer
   - Navigate to `http://localhost:<port>/export`
   - Wait for export UI to load
   - Find and click PPTX export button
   - Monitor download completion
   - Return downloaded file to user

2. **Architecture**:

   ```
   User clicks "Export PPTX"
   → POST /api/presentations/:id/export
   → Check presentation is running
   → Launch Puppeteer browser
   → Navigate to slidev export page
   → Automate PPTX download
   → Return file to user
   → Cleanup downloaded file
   ```

3. **Error Handling**:
   - Verify presentation is running before export
   - Timeout protection (2 minutes max)
   - File size validation (reject empty files)
   - Proper browser cleanup (even on errors)

4. **Dependencies**:
   - `puppeteer` (latest) - includes bundled Chromium
   - Already had `playwright-chromium` from CLI attempts (can remove)

## Consequences

### Positive

- ✅ **Reliable exports**: Uses Slidev's recommended, actively maintained method
- ✅ **Better UX**: True one-click export experience
- ✅ **Future-proof**: Follows official guidelines, less likely to break
- ✅ **Container-ready**: Puppeteer works well in containerized environments with proper flags

### Negative

- ❌ **Bundle size**: +65 packages (~200MB with Chromium)
- ❌ **Export time**: 30-60 seconds (vs theoretical 10-20s for CLI)
- ❌ **Memory usage**: Browser automation requires more RAM
- ❌ **Complexity**: More code to maintain (browser automation logic)

### Neutral

- ⚠️ **Container requirements**:
  - Need `--no-sandbox` flag for Chromium
  - May need `--disable-dev-shm-usage` in restricted environments
  - Already handled in implementation with proper args

### Migration Path

If Slidev CLI export is fixed in future:

1. Keep current Puppeteer implementation as "reliable mode"
2. Add CLI as "fast mode" option
3. Let user choose in Settings modal

## References

- [Slidev Export Documentation](https://sli.dev/guide/exporting.html)
- [Slidev GitHub Issue #2091](https://github.com/slidevjs/slidev/issues/2091)
- [Puppeteer API Documentation](https://pptr.dev/)
- Librarian agent analysis results (session: ses_32aab1969ffeWxqRk4ms27FkSI)

## Related ADRs

- ADR-005: WebSocket Proxy for Slidev (provides the running Slidev instance)
- ADR-004: Slidev Vite Dev Mode Fix (ensures presentation runs properly)

---

## Superseded By

**[ADR-007: Remove Slidev Base URL Parameter](./007-remove-slidev-base-parameter.md)**

This ADR is superseded because:

1. **Root Cause Fixed**: The `--base /slidev/${port}/` parameter was identified as the root cause of export failures
2. **Simpler Solution**: Removing the base parameter allows Slidev's native export to work without browser automation
3. **Better Performance**: No 30-60 second Puppeteer overhead, no +200MB Chromium bundle
4. **Architectural Improvement**: Aligned with Slidev's design intent (`base=/` by default)

**Migration**: The Puppeteer implementation can be removed in favor of Slidev's built-in export functionality.
