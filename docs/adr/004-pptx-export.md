# ADR-004: PPTX Export Evolution

**Status**: Accepted  
**Date**: 2025-12-25 (Original), Updated 2026-03-23  
**Supersedes**: ADR-006, 009, 010, 011, 014, 015

## Context

PPTX export requires browser automation to capture Slidev slides with full styling, themes, and animations.

## Evolution Timeline

### Phase 1: Puppeteer Approach (2025-12-25) - Superseded

**Decision**: Use Puppeteer for screenshot-based export

**Problems**:
- Heavy dependencies
- Complex error handling
- Unreliable on some systems

**Status**: Superseded by Playwright (ADR-009)

### Phase 2: Data Directory Export (2026-01-15)

**Decision**: Export to `data/{presentationId}/exports/` directory

**Rationale**:
- Persistent storage across container restarts
- Volume-mounted directory accessible to host
- Easy file management and cleanup

**Structure**:
```
data/
  {presentationId}/
    slides.md
    exports/
      {presentationId}-{timestamp}.pptx
```

### Phase 3: NODE_ENV Investigation (2026-03-15)

**Problem**: Background images not loading in screenshots (97 KB vs 844 KB)

**Root Cause**: `NODE_ENV=development` breaks Playwright's CSS background-image loading

**Fix**: Temporarily unset NODE_ENV during browser launch
```typescript
const originalNodeEnv = process.env.NODE_ENV;
delete process.env.NODE_ENV;

const browser = await chromium.launch({...});

// Restore after launch
if (originalNodeEnv) process.env.NODE_ENV = originalNodeEnv;
```

**Investigation**: 12+ approaches tested (child_process, inline, environment variables, etc.)

### Phase 4: Direct Access Architecture (2026-03-16)

**Problem**: Proxy-based access caused URL inconsistencies

**Decision**: Direct `http://localhost:{port}` access for screenshots

**Changes**:
1. Frontend iframe: `http://localhost:{port}/` (direct)
2. BrowserExporter: Same direct URL (consistency)
3. Slidev: `--remote` flag for CORS

**Benefits**: Eliminates proxy routing complexity

### Phase 5: Playwright Installation (2026-03-16)

**Problem**: `playwright-chromium` package (stripped-down) doesn't load external CSS background images

**Fix**: Full `playwright` package + `channel: 'chromium'`

**Dockerfile**:
```dockerfile
FROM node:20-bookworm-slim
RUN npx playwright install chromium --with-deps
```

**Trade-off**: Image size increased (50 MB → 200 MB) but necessary for proper rendering

### Phase 6: Background Rendering (2026-03-23)

**Three Issues Fixed**:

#### Issue 1: Wrong Slide Count
**Problem**: `countSlidesFromFile()` counted frontmatter `---` as slides
```markdown
---
background: url
---  ← Mistakenly counted as slide separator
# Slide 2
```

**Fix**: Use Slidev API instead
```typescript
const slideCount = await page.evaluate(() => {
  return (window as any).__slidev__?.nav?.total || 0;
});
```

#### Issue 2: Background Images Not Applied
**Problem**: Slidev ignores `background` frontmatter without explicit layout

**Solution**: Document requirement for `layout: cover`
```markdown
---
layout: cover
background: https://images.unsplash.com/photo-xxx
---
```

**Rationale**: This is Slidev's intended behavior, not a bug

#### Issue 3: Dark Theme Not Captured
**Problem**: Playwright headless defaults to light color scheme (white background)

**Fix**: Force dark mode in page creation
```typescript
page = await browser.newPage({
  colorScheme: 'dark'  // Match Slidev's default theme
});
```

**Results**: 
- Before: `rgb(255, 255, 255)` (white)
- After: `rgb(18, 18, 18)` (dark gray/black)

#### Issue 4: v-click Animations Not Captured
**Problem**: v-click content missing in exported PPTX, producing duplicate/misplaced slides

**Root Cause**: Opacity-based DOM detection unreliable - Slidev uses Vue reactivity for v-click state

**Solution**: Use Slidev's internal API for accurate click tracking
```typescript
const clickInfo = await page.evaluate(() => {
  const slidev = (window as any).__slidev__;
  return {
    total: slidev.nav.clicksTotal || 0,  // Total clicks for current slide
    current: slidev.nav.clicks || 0        // Current click position (0-based)
  };
});

// Trigger remaining clicks
for (let i = 0; i < clickInfo.total - clickInfo.current; i++) {
  await page.keyboard.press('Space');
  // Safety check: stop if reached total (prevents advancing to next slide)
  const currentClicks = await page.evaluate(() => 
    (window as any).__slidev__?.nav?.clicks || 0
  );
  if (currentClicks >= clickInfo.total) break;
}
```

**Results**:
- Before: 13 slides → 13+ pages with repeated/misplaced content
- After: 13 slides → exactly 13 pages with all v-clicks revealed

**Alternative Approaches Tried** (all failed):
1. Count `.slidev-vclick-target` elements → inaccurate
2. Check `opacity < 1` for hidden elements → unreliable
3. Fixed number of spacebar presses → causes over-clicking

**Why Slidev API Works**: `window.__slidev__` is available in development mode (required for export)


## Current Architecture

**Export Flow**:
```
1. Start Slidev (if not running)
2. Launch Playwright browser (colorScheme: 'dark', channel: 'chromium')
3. Navigate to http://localhost:{port}/1
4. Get slide count from __slidev__.nav.total
5. For each slide:
   - Navigate to /{slideNumber}
   - Wait for theme CSS and background images
   - Trigger all v-click animations using __slidev__.nav API
   - Screenshot (1920x1080 PNG)
   - Navigate to /{slideNumber}
   - Wait for theme CSS and background images
   - Trigger all v-click animations using __slidev__.nav API
   - Screenshot (1920x1080 PNG)
   - Screenshot (1920x1080 PNG)
6. Generate PPTX with pptxgenjs
7. Cleanup temp files
```

**BrowserExporter Key Features**:
- Fresh browser instance per export (no singleton reuse)
- NODE_ENV workaround for background images
- Dark color scheme for theme consistency
- Per-slide URL navigation (not SPA navigation)
- Network idle wait for image loading
- v-click animation support via Slidev API
- Fresh browser instance per export (no singleton reuse)
- NODE_ENV workaround for background images
- Dark color scheme for theme consistency
- Per-slide URL navigation (not SPA navigation)
- Network idle wait for image loading

## Consequences

**Positive**:
- Reliable screenshot quality (~2 MB with backgrounds)
- Correct theme rendering (dark backgrounds)
- Accurate slide counting
- Full external CSS support
- Complete v-click animation support
- Reliable screenshot quality (~2 MB with backgrounds)
- Correct theme rendering (dark backgrounds)
- Accurate slide counting
- Full external CSS support

**Negative**:
- Requires user to add `layout: cover` for backgrounds
- Large Docker image (~200 MB with Chromium)
- ~10 seconds per slide export time
- Complex browser automation logic

## Known Limitations

1. **Custom fonts**: May not render if not installed in container
   - Consider embedding fonts in container

2. **Video/GIF**: Not captured in static screenshots
   - Inherent limitation of image-based export

3. **Progressive v-clicks**: Each slide captures final state (all clicks revealed)
   - Consider: Export each click state as separate slide for animation effect

## Future Improvements

- Progressive v-click capture (multiple screenshots per slide)
- PDF export option (lighter weight)
- Parallel slide processing (faster exports)
- Custom export resolution support

## References

- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [pptxgenjs Documentation](https://gitbrent.github.io/PptxGenJS/)
- [Slidev Layouts](https://sli.dev/builtin/layouts.html)
