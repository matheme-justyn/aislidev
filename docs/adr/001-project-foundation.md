# ADR-001: Project Foundation

**Status**: Accepted  
**Date**: 2025-12-20 (Original), Updated 2026-03-23  
**Supersedes**: Original ADR-001 (Version Control), ADR-003 (AI Architecture)

## Context

AISlidev requires solid foundations for version management, development workflow, and AI-assisted development.

## Decisions

### 1. Semantic Versioning (SemVer 2.0.0)

**Format**: `MAJOR.MINOR.PATCH`

**Pre-Release (0.x.x) Rules**:
- Stay in 0.x.x until POC/MVP ready
- Breaking changes = MINOR bump (not MAJOR)
- Regular features = MINOR bump
- Bug fixes = PATCH bump

**Post-1.0 Rules**:
- Breaking changes = MAJOR bump
- New features = MINOR bump
- Bug fixes = PATCH bump

### 2. Conventional Commits (Angular Convention)

**Format**: `<type>(<scope>): <subject>`

**Types that trigger version bumps**:
- `feat:` → MINOR bump
- `fix:` → PATCH bump
- `feat!:` / `fix!:` / `BREAKING CHANGE:` → MAJOR bump (or MINOR in 0.x.x)

**Types without version bumps**: `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

### 3. OpenCode-First Development

**Agent Configuration**:
- **Sisyphus** (Claude Opus 4.6) - Main orchestrator
- **Prometheus** (Claude Opus 4.6) - Planner
- **Oracle** (GPT 5.2) - Architecture consultant
- **Librarian** (Claude Sonnet 4.5) - Documentation search
- **Explore** (Claude Haiku 4.5) - Fast codebase exploration

**Workflow**:
1. AI-facing docs in English (AGENTS.md, ADRs, .ai/context/)
2. User docs in any language (README, etc.)
3. Use oh-my-opencode plugin for ultrawork mode

## Consequences

**Positive**:
- Clear version semantics for users and automation
- Consistent git history for automated changelog
- High productivity with AI-assisted development
- Centralized knowledge in ADRs

**Negative**:
- Learning curve for team members
- Requires discipline in commit messages

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
