# AISliDev Containerfile
# Multi-stage build for unified frontend + backend container
# Compatible with both Podman and Docker

# Build stage - use Alpine for build (smaller, faster)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build both backend and frontend
RUN npm run build

# Runtime stage - use Debian slim for Playwright compatibility (glibc required)
FROM node:20-bookworm-slim

WORKDIR /app

# Install dumb-init and Playwright dependencies
RUN apt-get update && apt-get install -y \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Install Playwright browsers to shared location
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx playwright install chromium --with-deps && \
    chmod -R 755 /ms-playwright

# Create storage directory for presentations
RUN mkdir -p /app/data && \
    chown -R node:node /app

# Use non-root user for security
USER node

# Expose port
EXPOSE 13000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:13000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Set production environment
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/server/index.js"]
