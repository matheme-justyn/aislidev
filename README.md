# AISlidev

> AI-powered Slidev presentation platform

[![Version](https://img.shields.io/badge/version-0.1.5-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![AI-First](https://img.shields.io/badge/development-AI--First-purple.svg)](./AGENTS.md)

[繁體中文](./README.zh-TW.md)

---

## Features

- 📝 **AI-Assisted Content** - Smart suggestions for slide content and structure
- 🎨 **Intelligent Layout** - AI-powered design and style recommendations
- ⚡️ **Slidev Integration** - Built on [Slidev](https://sli.dev/) - Markdown-based presentations for developers
- 🐳 **Single Container** - Lightweight deployment with Docker (Colima on macOS)
- 🔐 **Rootless Security** - Runs as non-root user with proper signal handling
- 🎯 **Simple Architecture** - No over-engineering, easy to maintain

- 📤 **PPTX Export** - Export presentations to PowerPoint format with full styling support

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (for local development)
- [Docker](https://docker.com) + [Colima](https://github.com/abiosoft/colima) (for containerized deployment on macOS)

### With Container (Recommended)

```bash
# For macOS users: Install Colima + Docker
brew install colima docker
colima start

# Build the image
docker build -t aislidev .

# Run the container
docker run -d \
  --name aislidev \
  -p 13000:13000 \
  -v ./data:/app/data \
  aislidev

# Or use the deploy script (auto-detects Docker/Podman)
./deploy.sh
```


**Access the application**: http://localhost:13000

### Local Development

```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test tests/unit/BrowserExporter.test.ts

# Run with coverage
npm test -- --coverage
```

**Test Coverage**: 42 tests across 8 test files

- ✅ Unit Tests (9 tests) - `BrowserExporter`, `SlidevManager`
- ✅ Integration Tests (32 tests) - All API endpoints
- ✅ E2E Tests (1 test) - Complete export flow with real browser

### Environment Variables

Customize via environment variables:

```bash
podman run -d \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e LOG_LEVEL=info \
  -v ./data:/app/data:Z \
  -p 3000:3000 \
  aislidev
```

See [.env.example](./.env.example) for all available options.

---

## Container Architecture

- **Multi-stage build** - Optimized image size (~50MB)
- **Alpine Linux** - Minimal security footprint
- **Non-root user** - Security best practices
- **Health check** - Built-in monitoring (`/health` endpoint)
- **Signal handling** - Graceful shutdown with dumb-init

See [ADR-002: Lightweight Containerization](./docs/adr/002-lightweight-containerization.md) for design rationale.

---

## Tech Stack

- [Fastify](https://fastify.dev) + TypeScript - Fast web framework
- [Slidev](https://sli.dev) - Presentation slides for developers
- [Vite](https://vitejs.dev) - Lightning fast frontend tooling
- [Podman](https://podman.io) / Docker - OCI-compatible containerization

---

---

## PPTX Export

AISlidev supports exporting presentations to PowerPoint (PPTX) format with full styling, including:

- Background images (Unsplash, custom images)
- Click animations (v-click elements)
- Custom layouts and themes
- Markdown-rendered content

### Browser Requirements

**IMPORTANT**: PPTX export requires a **full Chromium browser binary** to properly render external CSS background images.

The export system uses Playwright with `channel: 'chromium'` configuration, which ensures:

- ✅ External CSS `background-image` URLs load correctly (e.g., Unsplash photos)
- ✅ Full rendering engine support (not the stripped-down `chromium-headless-shell`)
- ✅ Consistent screenshot quality (~845 KB per slide with backgrounds)

### Why This Matters

Playwright's default `headless: true` mode uses `chromium-headless-shell`, a minimal browser binary that **does not load external CSS background images**. This results in:

- ❌ White backgrounds instead of actual images
- ❌ Incorrect styling and layout
- ❌ Small screenshot file sizes (~97 KB instead of ~845 KB)

By using `channel: 'chromium'`, the export system forces the full Chrome/Chromium browser, which properly loads all external resources.

### Installation

Playwright automatically downloads Chromium when you install dependencies:

```bash
npm install
# Playwright downloads Chromium during postinstall
```

To manually install or update browsers:

```bash
npx playwright install chromium
```

### Usage

#### Basic Export

1. Open your presentation in AISlidev
2. Click the "Export PPTX" button in the navigation bar
3. Wait for the export to complete (~10 seconds per slide)
4. Download the generated `.pptx` file

#### Background Images Requirements

**IMPORTANT**: To use background images in your slides, you **must** specify `layout: cover` (or other layout that supports backgrounds) in the slide's frontmatter.

**Correct usage:**

```markdown
---
layout: cover
background: https://images.unsplash.com/photo-xxx
---

# Your Slide Title

Content here
```

**Without `layout: cover`, background images will NOT be applied** (slides will use the default theme background).

**Supported layouts with background:**
- `cover` - Full-screen background with centered content
- `intro` - Introduction slide with background
- `image` - Image-focused layout

See [Slidev Layouts Documentation](https://sli.dev/builtin/layouts.html) for more layout options.
### Troubleshooting

**White backgrounds in exported PPTX:**

- Verify Chromium is installed: `npx playwright install chromium`
- Check `BrowserExporter.ts` has `channel: 'chromium'` in launch options
- Ensure external URLs (Unsplash, etc.) are accessible from your server

**Export takes too long:**

- Expected: ~10 seconds per slide with animations
- Timeout is set to 2 minutes (120000ms)
- Check server logs for detailed progress

**Click animations not appearing:**

- The exporter automatically triggers 20 spacebar presses per slide
- If you have more than 20 v-click elements, increase the count in `BrowserExporter.ts`

### Technical Details

See `src/server/services/BrowserExporter.ts` for implementation details:

```typescript
const browser = await chromium.launch({
  headless: true,
  channel: 'chromium', // Forces full Chrome binary
  args: ['--disable-web-security', '--no-sandbox'],
});
```

This configuration ensures maximum compatibility with external resources while maintaining headless operation for server environments.

## Documentation

- [Architecture Decision Records](./docs/adr/) - Design decisions and rationale
- [Port Configuration Guide](./docs/guides/PORT_CONFIGURATION.md) - Port setup details
- [CHANGELOG](./CHANGELOG.md) - Version history

For AI development setup and contributing guidelines, see [AGENTS.md](./AGENTS.md)

---

## Contributing

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

MIT License - See [LICENSE](./LICENSE)

---

**Built with ❤️ using AI-First Development**
