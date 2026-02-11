# Roo Code Custom Instructions for AISliDev

Copy this content to your Roo Code Custom Instructions settings.

## Communication
- Use Traditional Chinese (Taiwan) for conversations
- Follow project conventions for documentation (see AI.md)
- Be direct and technical

## Project Context
- **Project**: AISliDev v0.1.0 (Pre-Release)
- **Architecture**: Single-container, lightweight design
- **Key principle**: Simplicity over complexity (learned from v1 failures)

## Before Any Work
1. Read AI.md (main configuration)
2. Check docs/architecture/ADR/ (architectural decisions)
3. Review .ai/context/ (conventions, workflows, architecture)

## Critical Rules
1. **Conventional Commits**: All commits must use `<type>(<scope>): <subject>`
2. **Version Analysis**: Before committing, analyze changes and present version bump plan to user
3. **ADR Enforcement**: Check for conflicts with ADRs, point them out explicitly
4. **Pre-Release**: Currently 0.x.x, even breaking changes = MINOR bump
5. **Wait for approval**: Never commit without user approval of version plan

## Technology Stack
- Node.js 20+ + Fastify + TypeScript
- Slidev (native integration)
- Podman containers
- SQLite/JSON storage

## Lessons from v1 (CRITICAL - Never Repeat)
- ❌ Multi-container over-engineering
- ❌ Iframe-based Slidev (failed)
- ✅ Single container is better
- ✅ Native integration works

## Personal Preferences (Customize)
[Add your work style preferences here]
