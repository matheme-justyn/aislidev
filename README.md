# AISlidev

> AI-powered Slidev presentation platform

[![Version](https://img.shields.io/badge/version-0.1.3-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![AI-First](https://img.shields.io/badge/development-AI--First-purple.svg)](./AGENTS.md)

[繁體中文](./README.zh-TW.md)

---

## Features

- 📝 **AI-Assisted Content** - Smart suggestions for slide content and structure
- 🎨 **Intelligent Layout** - AI-powered design and style recommendations
- ⚡️ **Slidev Integration** - Built on [Slidev](https://sli.dev/) - Markdown-based presentations for developers
- 🐳 **Single Container** - Lightweight deployment with Podman or Docker
- 🔐 **Rootless Security** - Runs as non-root user with proper signal handling
- 🎯 **Simple Architecture** - No over-engineering, easy to maintain

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (for local development)
- [Podman](https://podman.io) or [Docker](https://docker.com) (for containerized deployment)

### With Container (Recommended)

```bash
# Build the image
podman build -t aislidev .

# Run the container
podman run -d \
  --name aislidev \
  -p 13000:13000 \
  -v ./data:/app/data:Z \
  aislidev

# Or use the deploy script
./deploy.sh
```

<details>
<summary>Using Docker instead of Podman</summary>

```bash
docker build -t aislidev .
docker run -d \
  --name aislidev \
  -p 13000:13000 \
  -v ./data:/app/data \
  aislidev
```

Note: Docker doesn't need the `:Z` flag for SELinux.
</details>

**Access the application**: http://localhost:13000

### Local Development

```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`

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
