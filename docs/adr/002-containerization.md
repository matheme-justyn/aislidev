# ADR-002: Containerization Strategy

**Status**: Accepted  
**Date**: 2025-12-21 (Original), Updated 2026-03-16  
**Supersedes**: Original ADR-002 (Lightweight), ADR-013 (Docker Migration)

## Context

Need efficient, secure container deployment that works reliably on macOS development machines and production servers.

## Evolution

### Phase 1: Lightweight Containerization (2025-12-21)

**Decision**: Alpine Linux with multi-stage builds

**Implementation**:
- Base: `node:20-alpine`
- Multi-stage build (builder + runtime)
- Non-root user (UID 1000)
- dumb-init for signal handling
- Health check endpoint

**Results**: ~50 MB image, secure baseline

### Phase 2: Docker + Colima Migration (2026-03-16)

**Problem**: Podman on macOS (via vfkit) frequently becomes unresponsive:
- `podman build` hangs indefinitely
- VM requires `pkill -9 vfkit` to restart
- Unreliable for daily development

**Decision**: Migrate to Docker + Colima

**Rationale**:
1. **Stability**: Colima more stable on macOS than Podman's vfkit
2. **Compatibility**: Docker CLI more widely supported
3. **Team familiarity**: Most developers know Docker
4. **OCI compliance**: Both Podman and Docker are OCI-compatible (easy migration)

**Migration**:
```bash
# Install
brew install colima docker

# Start
colima start

# Convert Containerfile → Dockerfile
cp Containerfile Dockerfile
```

### Phase 3: Playwright Integration (2026-03-23)

**Addition**: Full Chromium for PPTX export

**Change**: Switch from `node:20-alpine` to `node:20-bookworm-slim`
- **Reason**: Alpine incompatible with Playwright's Chromium dependencies
- **Trade-off**: Image size ~200 MB (but necessary for browser automation)

**Dockerfile**:
```dockerfile
FROM node:20-bookworm-slim
RUN npx playwright install chromium --with-deps
```

## Current Architecture

**Container Features**:
- Multi-stage build (optimize layer caching)
- Non-root user (security)
- Health check (`/health` endpoint)
- Signal handling (graceful shutdown)
- Volume mount for data persistence

**Deployment**:
```bash
docker build -t aislidev .
docker run -d \
  -p 13000:13000 \
  -v ./data:/app/data \
  aislidev
```

## Consequences

**Positive**:
- Reliable development environment on macOS
- Fast build times with layer caching
- Production-ready security practices
- Browser automation for PPTX export

**Negative**:
- Image size increased (Alpine 50MB → Debian 200MB)
- Requires Colima setup on macOS
- Cannot use Alpine (Playwright incompatible)

## References

- [Colima](https://github.com/abiosoft/colima)
- [OCI Specification](https://opencontainers.org/)
- [Playwright System Requirements](https://playwright.dev/docs/browsers)
