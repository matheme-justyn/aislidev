# ADR-015: PPTX Export Background Image Rendering Fix

**Status**: Accepted  
**Date**: 2026-03-23  
**Deciders**: Development Team  
**Related**: [ADR-014](./014-slidev-direct-access-and-playwright-fix.md)

## Context

After fixing Playwright installation and URL routing issues (ADR-014), PPTX exports were generating files with incorrect backgrounds:

1. **Wrong slide count**: Detected 5 slides instead of actual 3 slides
2. **Missing background images**: Slides 2-3 had white backgrounds instead of Unsplash images
3. **Wrong theme rendering**: Slide 1 had white background instead of Slidev's default dark theme

### Investigation Results

Three distinct root causes were identified through systematic debugging:

#### Issue 1: Incorrect Slide Counting
- **Symptom**: `countSlidesFromFile()` returned 5 slides instead of 3
- **Root Cause**: Counting all `---` separators, including frontmatter delimiters
- **Example**:
  ```markdown
  ---
  background: url1
  ---           ← This was counted as a slide separator
  # Slide 2
  ```

#### Issue 2: Background Images Not Applied
- **Symptom**: Browser showed black backgrounds, PPTX had white backgrounds
- **Root Cause**: Slidev's `background` property requires explicit layout specification
- **Discovery**: Without `layout: cover`, Slidev ignores the `background` frontmatter

#### Issue 3: Dark Theme Not Captured
- **Symptom**: Playwright screenshots showed white backgrounds despite dark theme in browser
- **Root Cause**: Playwright defaults to light color scheme in headless mode
- **Browser comparison**:
  - Normal browser: `rgb(18, 18, 18)` (dark)
  - Playwright headless: `rgb(255, 255, 255)` (white)

## Decision

Implemented three-part solution:

### 1. Use Slidev API for Slide Counting

**Before**:
```typescript
private async countSlidesFromFile(slidesPath: string): Promise<number> {
  const content = await fs.readFile(slidesPath, "utf-8");
  const separators = content.split("\n").filter((line) => line.trim() === "---");
  return separators.length - 1; // Unreliable
}
```

**After**:
```typescript
const slideCount = await page.evaluate(() => {
  const slidev = (window as any).__slidev__;
  return slidev?.nav?.total || 0;
});
```

**Rationale**: Slidev's internal API accurately tracks slides, accounting for frontmatter.

### 2. Require `layout: cover` for Background Images

Updated documentation to mandate layout specification:

```markdown
---
layout: cover
background: https://images.unsplash.com/photo-xxx
---

# Your Slide Title
```

**Rationale**: This is Slidev's intended behavior. Background images require layout context to render properly.

### 3. Force Dark Color Scheme in Playwright

**Before**:
```typescript
page = await this.browser!.newPage();
```

**After**:
```typescript
page = await this.browser!.newPage({
  colorScheme: 'dark'  // Match Slidev's default theme
});
```

**Rationale**: Explicitly sets color scheme preference to match Slidev's default dark theme.

## Consequences

### Positive

1. **Accurate slide counting**: No more phantom slides in exports
2. **Correct background rendering**: All background images load properly
3. **Theme consistency**: Dark theme captured correctly in screenshots
4. **Reliable exports**: File sizes indicate proper image loading (2MB vs 100KB)

### Negative

1. **User requirement**: Users must add `layout: cover` to slides with backgrounds
2. **Breaking change**: Existing slides without layout specification won't have backgrounds in exports
3. **Documentation burden**: Need to clearly communicate layout requirement

### Neutral

1. **Slidev best practice**: Using explicit layouts aligns with Slidev's design philosophy
2. **Testing complexity**: Requires testing with various layout types

## Validation

### Test Case: bg-test-2

Created test presentation with 3 slides:

1. **Slide 1**: No explicit background (default theme) → Dark background ✅
2. **Slide 2**: `layout: cover` + Unsplash image → Code city image ✅
3. **Slide 3**: `layout: cover` + Different Unsplash → Blue gradient ✅

**Export Results**:
- Slide count: 3 (correct)
- File size: 1.9-2.0 MB (indicates images loaded)
- Visual inspection: All backgrounds render correctly

### Verification Commands

```bash
# Test slide count detection
curl -s http://localhost:13000/api/presentations/bg-test-2/status | jq '.port'
# Visit http://localhost:{port}/1 and check __slidev__.nav.total in console

# Test export
curl -X POST http://localhost:13000/api/presentations/bg-test-2/export
# Check file size (should be ~2MB with backgrounds)
ls -lh data/bg-test-2/exports/*.pptx
```

## Implementation Details

### Files Modified

1. **BrowserExporter.ts**:
   - Line 80: Added `colorScheme: 'dark'` to page creation
   - Line 97-100: Replaced `countSlidesFromFile()` with Slidev API call
   - Line 200-217: Enhanced theme CSS wait logic

2. **README.md**:
   - Added "Background Images Requirements" section
   - Documented `layout: cover` requirement with examples
   - Listed supported layouts

3. **Test Data**:
   - Updated `data/bg-test-2/slides.md` with proper `layout: cover` usage

### Code Changes Summary

```typescript
// Slide counting: File parsing → Slidev API
- countSlidesFromFile(slidesPath)
+ page.evaluate(() => (window as any).__slidev__?.nav?.total || 0)

// Page creation: Default → Dark mode
- await this.browser!.newPage()
+ await this.browser!.newPage({ colorScheme: 'dark' })

// Slides.md: No layout → Explicit layout
- ---
- background: url
- ---
+ ---
+ layout: cover
+ background: url
+ ---
```

## Related Issues

- **Session 5 (2026-03-23 morning)**: Initial investigation, tried 10+ approaches
- **Session 6 (2026-03-23 afternoon)**: Identified root causes, implemented fixes
- **ADR-010**: NODE_ENV environment variable workaround
- **ADR-014**: Playwright installation and URL routing fixes

## References

- [Slidev Layouts Documentation](https://sli.dev/builtin/layouts.html)
- [Playwright Color Scheme Emulation](https://playwright.dev/docs/emulation#color-scheme-and-media)
- [Slidev Navigation API](https://sli.dev/custom/config-parser.html)

## Notes

### Why Not Auto-Detect Layout?

Considered automatically adding `layout: cover` during export, but rejected because:
1. Would create inconsistency between editor and export
2. User might intentionally not want backgrounds
3. Violates principle of "what you see is what you export"

### Future Improvements

- Detect slides without layout but with background, warn user
- Support more layout types (intro, image, etc.)
- Add unit tests for slide counting logic
