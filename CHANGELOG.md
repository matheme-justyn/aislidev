# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
