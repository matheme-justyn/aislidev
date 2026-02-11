# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- v2 architecture design
- Technology stack selection
- Core feature implementation

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

See [ADR-001](./docs/architecture/ADR/001-version-control-strategy.md) for details.

## Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
- **Documentation**: Documentation-only changes
- **Performance**: Performance improvements
