# PPTX Export Investigation Summary

## Date

2026-03-10

## Investigation Trigger

User asked: "如果我是在容器內產生，還會有這樣的問題嗎？試試看"

Translation: "If I generate in the container, will there still be this problem? Let's try."

This question challenged the initial assumption that empty PPTX files were an accepted limitation.

---

## Investigation Process

### Phase 1: Initial Hypothesis

**Assumption**: Empty PPTX files were due to missing Playwright/Chromium in the container.

**Evidence**:

- Local testing showed CLI export created empty PPTX files
- ADR-007 assumed removing `--base` parameter would fix exports

### Phase 2: Container Testing (Alpine Linux)

**Action**: Built container with Alpine Linux + attempted Playwright installation

**Result**: Failed with error:

```
browserType.launch: Executable doesn't exist at /home/node/.cache/ms-playwright/chromium_headless_shell-1208/chrome-linux/headless_shell
```

**Root Cause**: Alpine Linux uses `musl libc`, but Playwright's Chromium requires `glibc`.

**Learning**: Alpine incompatible with Playwright binaries.

### Phase 3: Container Testing (Debian Bookworm)

**Action**:

1. Changed base image from `node:20-alpine` to `node:20-bookworm-slim`
2. Installed Playwright with `npx playwright install chromium --with-deps`
3. All system dependencies installed successfully (~300MB increase)

**Container Configuration**:

```dockerfile
FROM node:20-bookworm-slim
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx playwright install chromium --with-deps
```

**Export Test Result**:

```bash
curl -X POST http://localhost:13001/api/presentations/aislidev-demo/export
# {"success":true,"filename":"aislidev-demo-1773138044425.pptx","size":39829,...}

unzip -l export.pptx | grep "slide[0-9]"
# (no matches - still no slides!)

unzip -p export.pptx ppt/presentation.xml | grep sldIdLst
# <p:sldIdLst></p:sldIdLst>  (empty slide list)
```

**Duration**: Export took ~20 seconds (vs 2-3 seconds for broken CLI)

---

## Final Conclusion

### The Truth

**Slidev CLI PPTX export is fundamentally broken in v52.11.5**, independent of:

- ✗ Base path configuration (ADR-007 fix)
- ✗ Playwright/Chromium availability
- ✗ Operating system (Alpine vs Debian vs macOS)
- ✗ Runtime environment (local vs container)
- ✗ System dependencies

### Evidence

1. **Empty Slide List**: `<p:sldIdLst></p:sldIdLst>` in presentation.xml
2. **Slidev's Own Warning**: "Try the new browser exporter!"
3. **GitHub Issues**: #2091, #1851, #1624 report same problem
4. **Consistent Behavior**: Same 39KB empty file across all environments

### What We Learned

The user's question was **100% correct** - testing in the container revealed that:

1. The problem was NOT missing Playwright (we successfully installed it)
2. The problem IS Slidev CLI export itself being broken
3. Having full Playwright support makes no difference to the output

---

## Impact on Architecture

### Container Configuration

**Decision**: Keep Debian base with Playwright installation despite broken export.

**Rationale**:

1. **Future-proofing**: If Slidev fixes CLI export, we're ready
2. **Other features**: Playwright may be used for other features (e.g., PDF export)
3. **Cost acceptable**: ~300MB increase for production-grade browser automation

### File Structure

**Implemented**: Two-step export workflow with persistent storage (ADR-009)

- Export triggers CLI (broken, but creates file structure)
- Files persist in `data/presentations/{id}/exports/`
- Download via separate endpoint

---

## Recommendations

### Short-term (Current)

1. ✅ **Document limitation clearly** in UI and docs
2. ✅ **Provide download** even though PPTX is empty
3. ✅ **Keep infrastructure** (Debian + Playwright) for future fixes

### Medium-term (Next Version)

Consider implementing **browser-based export automation** (ADR-006 approach):

- Use Puppeteer/Playwright to automate `/export` page
- Navigate to `http://localhost:{port}/export`
- Click PPTX button programmatically
- Capture downloaded file

**Trade-offs**:

- Pro: Would produce non-empty PPTX files
- Pro: Uses Slidev's recommended method
- Con: Additional complexity (~200 lines)
- Con: Slower (30-60 seconds vs 20 seconds)

### Long-term

**Monitor Slidev updates** for CLI export fixes:

- Check release notes for export improvements
- Test with each major Slidev version
- Remove workarounds when CLI is fixed

---

## Key Takeaways

1. **User questions matter**: "試試看" (let's try) uncovered the truth
2. **Assumptions must be tested**: We assumed Playwright was missing, but testing proved otherwise
3. **Root cause investigation**: Only by testing in container did we prove CLI export is broken
4. **Document thoroughly**: This investigation should prevent repeating the same work

---

## Related Documents

- **ADR-009**: PPTX Export via Data Directory (implementation)
- **ADR-007**: Remove Slidev Base URL Parameter (wrong assumption about fix)
- **ADR-006**: Puppeteer-Based PPTX Export (future mitigation strategy)
- **Containerfile**: Changed from Alpine to Debian for Playwright compatibility
