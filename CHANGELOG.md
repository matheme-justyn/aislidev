# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-03-13

### Summary

**PPTX Export Quality Fix**: Fixed background images not appearing in exported PPTX files. Root cause was Playwright's default headless mode using stripped-down Chromium binary that doesn't load external CSS background images. Also fixed multiple frontmatter formatting errors and added navigation hints for better UX.

### Fixed

- **PPTX Export Background Images** - White backgrounds now render correctly with actual Unsplash photos
  - Root cause: Playwright's `headless=new` uses `chromium-headless-shell` binary (stripped version)
  - This minimal binary does NOT load external CSS `background-image` URLs
  - Solution: Added `channel: 'chromium'` to force full Chrome binary in `BrowserExporter.ts` (line 66)
  - Result: Screenshots increased from ~97 KB (white) to ~845 KB (with backgrounds)
  - Full Chrome binary properly loads external resources while maintaining headless operation
  - Documented browser requirements and troubleshooting in README.md
- **Frontmatter Formatting Errors** - Fixed 8 layout syntax errors causing blank slides
  - Fixed 3 instances of `layout: two-cols` → `layout: two-cols` (proper YAML)
  - Fixed 4 instances of `layout: center` → `layout: center`
  - Fixed 1 instance of `layout: end` → `layout: end`
  - Reduced total slide count from 18 to 13 (removed blank slides)
- **PPTX Slide Detection** - Fixed slide count detection logic
  - Updated selector to handle Slidev's hash routing format (`#/2`)
  - Used regex selectors for robust URL parsing
  - All 13 slides now export successfully
- **V-click Animation Capture** - PPTX screenshots now include all click-animated content
  - Added 20 spacebar presses before each screenshot
  - Ensures all v-click elements are visible in exported slides
- **Grid Overflow in Markdown Syntax Page** - Fixed layout overflow issue

### Added

- **Navigation Hint Banner** - User-friendly hint for first-time users
  - Created `NavigationHint.vue` component with close button
  - Integrated into `SlidevPreview.vue` component
  - Persists dismissal state in localStorage
  - Informs users about navigation controls and export functionality
- **Comprehensive PPTX Export Documentation** - New README section explaining:
  - Why full Chromium browser is required (vs. chromium-headless-shell)
  - How to install Playwright browsers (`npx playwright install chromium`)
  - Troubleshooting guide for common issues (white backgrounds, timeouts, animations)
  - Technical details of `channel: 'chromium'` configuration
  - Expected file sizes and export times

### Changed

- **BrowserExporter Configuration** - Simplified and optimized
  - Line 66: Added `channel: 'chromium'` to force full Chrome binary
  - Removed verbose debug logging
  - Simplified wait logic (removed redundant delays)
  - Kept essential waits for v-click animations

### Documentation

- **README.md** - Added extensive "PPTX Export" section (80+ lines)
  - Browser requirements and rationale
  - Installation instructions
  - Usage guide
  - Troubleshooting common issues
  - Technical implementation details

### Verification Results

✅ **Background Images Load**: Screenshots now ~845 KB each (vs. ~97 KB white backgrounds)
✅ **All 13 Slides Export**: Complete presentation with proper formatting
✅ **V-click Content Visible**: All click animations captured in screenshots
✅ **Valid PPTX Structure**: Opens correctly in PowerPoint/Keynote
✅ **Total File Size**: ~1.0 MB (includes all images)

### Technical Details

**Critical Code Change** (`src/server/services/BrowserExporter.ts`):

```typescript
const browser = await chromium.launch({
  headless: true,
  channel: 'chromium', // CRITICAL: Forces full Chrome binary
  args: [
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--no-sandbox',
  ],
});
```

**Why This Matters**:
- `headless: true` alone → uses `chromium-headless-shell` (stripped binary, no external CSS backgrounds)
- `headless: true` + `channel: 'chromium'` → uses full Chrome in headless mode (proper rendering)

**File Size Diagnostic**:
- Background loaded correctly: ~845 KB per screenshot
- White background (broken): ~97 KB per screenshot

This measurement was crucial for debugging and verifying the fix.

### Known Limitations

- Requires Playwright Chromium browser (~180MB container image size)
- Export time: ~10 seconds per slide with animations
- PPTX files are image-based (1-5MB, no text editing in PowerPoint)

---

## [0.3.0] - 2026-03-11

### Summary

**Screenshot-Based PPTX Export**: Complete solution for PPTX export functionality. After discovering Slidev CLI export produces empty files and browser export doesn't support PPTX, we implemented a robust screenshot-based approach using Playwright + pptxgenjs that generates high-quality PPTX files with actual slide content.

### Added

- **Screenshot-Based PPTX Export** - Complete replacement for broken Slidev CLI export
  - Created `src/server/services/BrowserExporter.ts` (277 lines)
  - Uses Playwright Chromium to render slides at 1920x1080 resolution
  - Automatic slide count detection via page indicator or navigation
  - Generates PPTX with pptxgenjs assembling screenshots
  - Export files: ~1-5MB with actual slide content (vs. 39KB empty files)
  - Export time: ~2-3 seconds per slide
  - Dynamic import for ES Module compatibility
  - Comprehensive error handling and temp file cleanup
  - Documented in ADR-009 (updated with screenshot implementation)

### Fixed

- **PPTX Export Produces Empty Files** - Root cause: Slidev CLI export bug in v52.11.5
  - Verified in both local and container environments
  - Slidev's `/export` route doesn't support PPTX (only PDF/PNG)
  - Solution: Screenshot-based generation bypasses Slidev entirely
  - Result: PPTX files now contain actual slide images
- **Vite Dependency Cache Issues** - 504 Outdated Optimize Dep errors
  - Clear `node_modules/.vite` cache when installing new dependencies
  - Restart dev server to rebuild dependency graph

### Changed

- **Export Architecture** - Shifted from CLI-based to browser automation
  - Previous: `slidev export --format pptx` (broken)
  - Current: Playwright screenshots + pptxgenjs assembly
  - Same API contract maintained (POST /export → download URL)
  - Files persist in `data/presentations/{id}/exports/` directory

### Documentation

- **ADR-009 Updated** - Screenshot-Based PPTX Generation
  - Root cause analysis (7 rounds of investigation)
  - Why CLI export fails (empty `<p:sldIdLst>` in presentation.xml)
  - Why browser export doesn't work (no PPTX support)
  - Screenshot implementation details
  - Trade-offs: larger files, longer export time, no text editing
  - Historical context: 3 iterations (ADR-006 → ADR-007 → ADR-009)
- **Cleaned Up Temporary Files** - Removed investigation and test reports
  - Archived `009-pptx-export-investigation-summary.md`
  - Removed `.emergency-fix-report.md`, `.final-testing-report.md`, etc.
  - Archived duplicate `008-slidev-iframe-vite-proxy-architecture.md`

### Dependencies

- **Added** `pptxgenjs@^4.0.1` - PPTX generation library
- **Already included** `playwright-chromium@^1.58.2` - Browser automation

### Migration Notes

**For users**: No action required. PPTX export now works correctly with actual content!

**For developers**: 
- Containerfile includes Playwright Chromium installation with `--with-deps`
- Debian bookworm-slim base image required (glibc for Playwright)
- Export timeout set to 120 seconds (configurable)

### Verification Results

✅ **PPTX Export Works**: Generated 940KB file with 2 slides (vs. 39KB empty files)
✅ **Contains Actual Content**: 2 PNG images embedded (865KB + 47KB)
✅ **Valid PPTX Structure**: slide1.xml, slide2.xml with proper references
✅ **Download Works**: Files accessible via GET endpoint
✅ **Opens in PowerPoint/Keynote**: Confirmed visual quality

### Known Limitations

- **Larger file sizes**: 1-5MB (image-based) vs. ~100KB (text-based)
- **Longer export time**: 2-3 seconds per slide vs. instant
- **No text editing**: Slides are images, not editable text in PowerPoint
- **Requires Playwright**: +180MB container image size

**Mitigation**: These trade-offs are acceptable for working functionality.
---

## [0.2.0] - 2026-03-10

### Added
- **Server-side File Browser** - Replace local file picker with server-side file system browser
  - Created `FileBrowser.vue` component for browsing `data/` directory structure
  - Added `/api/files/presentations` endpoint to list presentation files
  - Added `/api/files/templates` endpoint to list template files
  - Users place files in `data/presentations/` or `data/templates/` directories
  - File validation: requires valid Slidev frontmatter (starts with `---`)
  - Helpful empty state messages when directories are empty
  - Created `DATA_DIRECTORY.md` user guide for folder structure
- **WebSocket-Enabled Slidev Proxy** - Fix HMR and hot reload functionality
  - Implemented `http-proxy-middleware` for proper WebSocket upgrade handling
  - Added WebSocket upgrade event handler on Fastify HTTP server
  - All `/slidev/:port/*` requests now proxy both HTTP and WebSocket connections
  - Fixes Slidev HMR (`ws://localhost:13000/slidev/:port/`) connection issues
  - Documented in ADR-005: WebSocket Proxy for Slidev
- **Enhanced Editor Toolbar** - Split toolbar into left and right sections
  - Left section: 📁 Open, 🎨 Template, 💾 Save MD, ⚙️ Settings
  - Right section: 📊 Export PPTX, 🔄 Refresh
  - All buttons with proper icons and status indicators
- **Settings Modal** - User-configurable auto-save interval
  - Configure auto-save interval (default: 3 minutes)
  - Settings persisted in localStorage
  - Manual save always available via Save MD button
- **Smart Refresh** - Preserve current slide page number on manual refresh
  - Enhanced `SlidevPreview.reload()` to extract current page from iframe URL
  - Reloads Slidev with same page number (e.g., stays on slide #3)
- **Auto-reload After Template Change** - Preview automatically refreshes when template is selected
  - 0.5 second delay to ensure template is applied
  - Preserves user's current slide position
- **Toast Notifications** - Added `NMessageProvider` wrapper for user feedback
  - Success/error messages for save operations
  - Loading indicators for file operations

### Changed
- **Template Selection UX** - Changed from dropdown list to file browser modal
  - Users browse actual template files in `data/templates/` directory
  - More intuitive file management workflow
  - Supports unlimited custom templates
- **Button Labels** - Save button now explicitly labeled "Save MD" (preparing for Export PPTX feature)
- **Toolbar Layout** - Right-aligned Export PPTX and Refresh buttons for better visual hierarchy

### Removed
- **Hardcoded Template List** - Removed `constants/templates.ts` with static template definitions
- **Old TemplateModal Component** - Removed dropdown-based `TemplateModal.vue`, replaced by `FileBrowser.vue`

### Fixed
- **WebSocket Connection Failures** - Slidev HMR and `@server-reactive` endpoints now work correctly
  - Root cause: Previous fetch-based proxy couldn't handle WebSocket upgrade requests
  - Solution: Implemented proper WebSocket proxy with upgrade event handling
- **302 Redirect Loop** - Fixed infinite redirect caused by path transformation in proxy
  - Preserve full path including `/slidev/:port/` prefix in proxy target
- **Demo Theme** - Updated `data/aislidev-demo/slides.md` to use `theme: default` (was using removed theme)

### Documentation
- **ADR-005** - WebSocket Proxy for Slidev (architecture decision record)
- **DATA_DIRECTORY.md** - User guide for `data/` folder structure and usage
- **ADR Index** - Updated `docs/adr/README.md` with ADR-005 entry

### Known Issues
- Some `/@server-reactive/nav` requests return 404 (missing `/slidev/:port/` prefix)
  - Does not affect main functionality (HMR, preview, navigation all work)
  - Cosmetic console warning only
- Export PPTX button exists in UI but backend endpoint not yet implemented

## [0.1.5] - 2026-03-06

### Added
- **Guting Slidev Themes** - Three professional presentation themes for Guting (National Cybersecurity Institute)
  - **guting-lightweight** - Quick start theme with 4 essential layouts (cover, default, vertical-text, vertical-title)
  - **guting-standard** ⭐ - Complete professional theme with 23 layouts covering all presentation needs
  - **guting-classic** - Classic design with 23 layouts using universal Arial fonts
  - All themes feature Guting official color scheme: primary teal (#009594), accent yellow-green (#C2C823)
  - Total 50 Vue layout components created across three themes
  - 42 image resources (7+19+16) for backgrounds and design elements
  - UnoCSS configuration with Guting color palette
  - Comprehensive example.md files demonstrating all layouts
- **Template Selection** - Guting themes integrated into template picker modal
  - Users can now choose from 5 templates (2 existing + 3 Guting themes)
  - Themes automatically load with correct layouts and styling

### Changed
- **Git Ignore** - Added `*.pptx` to exclude PowerPoint source files from version control

---

## [0.1.4] - 2026-03-03

### Summary
**Critical fix**: Resolved Slidev iframe preview display issue - right panel now correctly shows presentations through proxy routing with proper Vite @fs path handling.

### Fixed
- **Slidev iframe preview** - Fixed blank/404 errors when loading Slidev presentations in right panel
  - Root cause: Vite's `@fs` requires double slash (`@fs//`) for absolute paths, and requests must include Slidev's `--base` path
  - Implemented proxy routing architecture: `/slidev/:port/*` routes forward to Slidev Vite server with base path
  - Added automatic `@fs/` → `@fs//` transformation in proxy for absolute path resolution
  - Created `createViteProxyRoute()` helper to handle all Vite special paths (`@fs`, `@vite`, `@id`, etc.)
  - Fixed route registration order: Vite special paths now registered before wildcard to ensure correct matching
- **Vite file system access** - Configured `server.fs.allow` to permit cross-directory module resolution
  - Added `searchForWorkspaceRoot()` and relative paths (`..`, `../..`) to allow list
  - Slidev running in `/app/data/presentations/` can now access `/app/node_modules/`
  - Updated template: `src/server/templates/slidev-vite.config.ts`
- **Slidev base path** - Added `--base /slidev/:port/` flag to Slidev startup for correct Vue Router behavior
  - Ensures all asset paths and routing work correctly within proxy namespace
  - Modified `SlidevManager.ts` to include base parameter

### Added
- **Dynamic port allocation** - Added `get-port` package for automatic Slidev port assignment (13030-13040 range)
- **Simplified preview component** - Removed overlay/buttons from `SlidevPreview.vue`, focusing on core iframe functionality

### Changed
- **Editor layout** - Adjusted panel arrangement for better preview visibility
- **Presentation routes** - Updated API endpoints to support new proxy architecture

### Planned
- AI-assisted content generation
- Advanced presentation management features

---

## [0.1.3] - 2026-03-03

### Summary
**Critical fix**: Resolved Slidev preview iframe rendering failure caused by missing compile-time constants in dev mode.

### Fixed
- **Slidev preview rendering** - Fixed "__DEV__ is not defined" and "__SLIDEV_HASH_ROUTE__ is not defined" errors
  - Root cause: Vite's `define` config behaves differently in dev vs build mode
  - In dev mode, Vite expects runtime environment to provide constants, but browser has no global variables
  - Created custom Vite plugin (`forceSlidevConstantsPlugin`) to force-replace all Slidev constants during transform phase
  - Plugin uses regex to replace 13 Slidev compile-time constants before code reaches browser
  - Works in both dev and build modes, bypassing Vite's define limitations
  - Template file: `src/server/templates/slidev-vite.config.ts` (auto-copied to each presentation directory)
- **Port mapping** - Added Slidev port range (13030-13040) to `deploy.sh` for proper container access
- **Build process** - Added `copy:templates` script to ensure non-TypeScript files are included in dist

### Documentation
- **ADR-004**: Created comprehensive technical documentation for Slidev Vite dev mode fix
  - Detailed root cause analysis with Vite define mechanism explanation
  - Complete solution implementation guide
  - Alternative approaches evaluation (build mode, source patching)
  - Prevention measures and debugging workflow
  - 433 lines covering problem, solution, and lessons learned
- Updated ADR index in `docs/adr/README.md` and `AGENTS.md`

### Technical Details
- **Problem**: Slidev subprocesses run in dev server mode (`npx slidev`)
  - Vite's `define` config in dev mode expects runtime globals, doesn't compile constants
  - `@slidev/client/env.ts` directly references constants like `__DEV__`, `__SLIDEV_HASH_ROUTE__`, etc.
  - Browser has no global variables → `ReferenceError: __DEV__ is not defined`
- **Solution**: Custom Vite plugin with transform hook
  - Executes in `pre` enforce phase before other transforms
  - Uses regex `\b${constant}\b` to find and replace all constant references
  - Replaces 13 constants: `__DEV__`, `__SLIDEV_HASH_ROUTE__`, `__SLIDEV_FEATURE_*`, etc.
  - Each presentation directory gets a copy of vite.config.ts with the plugin
- **Verification**: Browser Console clean, preview panel renders correctly, multiple presentations work

### Changed
- **README.md**: Updated version badge from 0.1.0 to 0.1.2 (sync with package.json)

### Chores
- Added `.gitattributes` to exclude build outputs from GitHub language statistics

---

## [0.1.2] - 2026-02-26

### Summary
Critical bug fix for Slidev presentation startup in container environments.

### Fixed
- **Slidev startup detection** - Fixed timeout issue preventing presentations from starting
  - Increased `waitForReady` timeout from 10s to 30s for container environments
  - Updated ready signal detection to match Slidev v52.11.5 output format
  - Added detection for "public slide show" and "localhost:" patterns
  - Enhanced monitoring of both stdout and stderr streams
- **Error logging** - Improved error messages with detailed error.message in API responses
  - Better debugging information when presentation fails to start

### Technical Details
- Slidev v52.11.5 outputs "public slide show   > http://localhost:PORT/" instead of "ready in" or "Local:"
- Container environments require longer startup times compared to local development
- Added comprehensive logging for Slidev process lifecycle events

---

## [0.1.1] - 2026-02-26

### Summary
Infrastructure improvements: integrated my-vibe-scaffolding template, standardized project structure, and improved documentation for AI agent compatibility.

### Added
- **Scaffolding infrastructure** from my-vibe-scaffolding v1.6.0
  - Version management system with pre-push hook
  - GitHub templates (issue, PR, CI placeholder)
  - Project guides (CONTRIBUTING.md, SECURITY.md)
  - i18n system (BCP 47) for multi-language support
  - OpenCode stability monitoring tools
  - Documentation guidelines and reference examples
- **Project configuration** (config.toml, opencode.json)

### Changed
- **AGENTS.md**: Simplified to English-only format (1056 → 850 lines)
  - Removed 187 lines of Chinese HTML comments
  - Updated language convention to English-only
  - Rationale: AI-facing documentation works best in English
- **ADR location**: Moved from `docs/architecture/ADR/` to standard `docs/adr/`
  - Follows ADR community convention (Michael Nygard's proposal)
  - Better tool support and GitHub search compatibility
  - Updated all references across project
- **VERSION**: Corrected from inherited 1.6.0 to 0.1.1
- **CONTRIBUTING.md**: Rewritten for AISliDev project (was scaffolding template)
- **SECURITY.md**: Rewritten for AISliDev project (was scaffolding template)

### Project Structure
```
aislidev/
├── .template/          # Scaffolding infrastructure (reference only)
│   ├── docs/          # Documentation guides
│   ├── i18n/          # Multi-language support
│   ├── scripts/       # Utility scripts
│   └── hooks/         # Git hooks
├── docs/
│   ├── adr/           # Architecture Decision Records (standard location)
│   └── guides/        # Development guides
├── AGENTS.md          # OpenCode configuration (English-only)
├── VERSION            # 0.1.1
└── config.toml        # Project configuration (git-ignored)
```

### Documentation
- Standardized ADR location following industry best practices
- Improved AGENTS.md for universal AI comprehension
- Added comprehensive contribution guidelines
- Added security policy and reporting procedures

### References
- [my-vibe-scaffolding](https://github.com/matheme-justyn/my-vibe-scaffolding) v1.6.0
- [ADR community standard](https://adr.github.io/)

---

## [0.1.0] - 2026-02-11

### Summary
Lightweight containerization architecture with Fastify server implementation. This is the first functional release with a working web server and environment configuration system.

### Added
- **Lightweight containerization architecture** (single container with Podman/Docker support)
- **Fastify-based web server** with TypeScript
- **Environment configuration system** (.env support with dotenv)
- **Auto port selection feature** with AUTO_PORT_SELECTION flag (default: enabled for development)
- **RESTful API foundation** with health check endpoint
- **Comprehensive documentation**:
  - Port configuration guide (PORT_CONFIGURATION.md)
  - Documentation maintenance guide (DOCUMENTATION_MAINTENANCE.md)
  - Quick start guide (QUICKSTART.md)
  - ADR-002: Lightweight containerization architecture

### Changed
- **Simplified README.md** to be human-friendly and concise (under 250 lines)
- Added Slidev features explanation for users unfamiliar with Slidev
- Simplified deployment section (Podman-focused)

### Documentation
- Created ADR-002 documenting lightweight containerization decision
- Added comprehensive port configuration guide
- Established documentation maintenance standards
- Updated ADR index with new ADR-002

### Technical Details
- Node.js 20+ with ES modules
- Fastify for web framework
- TypeScript for type safety
- get-port package for intelligent port management
- Podman/Docker for containerization (OCI-compatible)

---

## [0.0.1] - 2026-02-11

### Summary
Initial project framework setup. No functional features yet - this release establishes the development infrastructure and documentation standards.

### Added
- Initial project setup with AI-first development framework
- Claude Code integration (CLAUDE.md, agents, skills structure)
- Architecture Decision Records (ADR) system
- Version control strategy (ADR-001)
- Documentation standards (English + Traditional Chinese comments)
- Memory system guide for collaborators
- CHANGELOG.md following Keep a Changelog format

### Changed
- Project reset from v1 architecture
- New documentation-driven approach

### Documentation
- Created comprehensive CLAUDE.md configuration
- Established ADR-001 for version control strategy
- Added MEMORY_GUIDE.md for Claude Code memory system
- Archived v1 design in ARCHIVE_v1_design.md

---

## v1 (Archived - No Official Release)

### Summary
First version using frontend/backend separation with containerization. **Archived due to architectural issues.**

See `ARCHIVE_v1_design.md` for complete v1 documentation and lessons learned.

### Key Issues (v1)
- Slidev iframe integration problems
- Over-engineered architecture
- Complex port management
- Difficult debugging experience

---

## Version Format

Following Semantic Versioning:
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)

Version bumps triggered by:
- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

See [ADR-001](./docs/adr/001-version-control-strategy.md) for details.

## Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
- **Documentation**: Documentation-only changes
- **Performance**: Performance improvements
