import "dotenv/config";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import "@fastify/middie";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { networkInterfaces } from "os";
import getPort from "get-port";
import path from "path";
import { SlidevManager } from "./services/SlidevManager.js";
import presentationsRoutes from "./routes/presentations.js";
import filesRoutes from "./routes/files.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PREFERRED_PORT = parseInt(process.env.PORT || "13000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const AUTO_PORT_SELECTION = process.env.AUTO_PORT_SELECTION !== "false"; // Default: true
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_DEV = NODE_ENV === "development";

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
});

// Register CORS
await fastify.register(fastifyCors, {
  origin: true, // Allow all origins in development
});

const storageDir = path.join(__dirname, "../../data/slides");
const slidevManager = new SlidevManager(storageDir);

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// 移除舊的自定義代理邏輯 - 現在使用 http-proxy-middleware 處理

// Slidev root proxy route (exact match)
fastify.all<{ Params: { port: string } }>(
  "/slidev/:port",
  async (request, reply) => {
    fastify.log.info(`[PROXY] Root route /slidev/:port for ${request.url}`);
    const port = parseInt(request.params.port);
    const path = request.url.replace(`/slidev/${port}`, "") || "/";
    const targetUrl = `http://localhost:${port}${path}`;

    try {
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(request.headers)) {
        if (
          !["host", "connection"].includes(key.toLowerCase()) &&
          typeof value === "string"
        ) {
          headers[key] = value;
        }
      }

      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? JSON.stringify(request.body)
            : undefined,
      });

      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "content-length") {
          reply.header(key, value);
        }
      });
      reply.header("X-AISlidev-Proxy", "root");

      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "";

      // Inject base tag for HTML root
      if (
        contentType.includes("text/html") &&
        (path === "/" || path.startsWith("/?"))
      ) {
        let html = Buffer.from(buffer).toString("utf-8");
        html = html.replace(
          "<head>",
          `<head>\n  <base href="/slidev/${port}/">`,
        );
        reply.code(response.status).send(html);
      } else {
        reply.code(response.status).send(Buffer.from(buffer));
      }
    } catch (error) {
      fastify.log.error(`Proxy error for ${targetUrl}: ${error}`);
      reply.code(502).send({ error: "Proxy error" });
    }
  },
);

// NOTE: These routes are now handled by http-proxy-middleware above (with WebSocket support)
// Keeping them commented for reference
/*
// Register Vite special path proxies BEFORE wildcard
// These must be registered before /slidev/:port/* to match correctly
fastify.all<{ Params: { port: string } }>("/slidev/:port/@fs/*", createViteProxyRoute('/@fs/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@vite/*", createViteProxyRoute('/@vite/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@id/*", createViteProxyRoute('/@id/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@slidev/*", createViteProxyRoute('/@slidev/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/__uno*", createViteProxyRoute('/__uno*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@server-reactive/*", createViteProxyRoute('/@server-reactive/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/slides.md__slidev_*", createViteProxyRoute('/slides.md__slidev_*'));

// Wildcard route for other Slidev paths
fastify.all<{ Params: { port: string } }>("/slidev/:port/*", async (request, reply) => {
  // ... (omitted for brevity)
});
*/

// API routes
await fastify.register(presentationsRoutes, {
  prefix: "/api",
  slidevManager,
  storageDir,
});

await fastify.register(filesRoutes, {
  prefix: "/api",
  storageDir,
});

// Register middie for Express/Connect middleware support
await fastify.register(import("@fastify/middie"));

// WebSocket-aware proxy for Slidev (must be after middie)
// Store proxy middleware instances for each port to reuse
const slidevProxies = new Map();

// Vite special paths proxy (/@fs/, /@vite/, etc.)
// Extract target port from Referer header

await fastify.use((req, res, next) => {
  const url = req.url || "";

  // Check if this is a Vite special path request for Slidev
  // ONLY proxy if referer contains /slidev/ to avoid capturing main app's Vite resources
  if (
    url.match(/^\/@(fs|vite|id|slidev|server-reactive)/) ||
    url.includes("__slidev_") ||
    url.match(/^\/slides\.md__slidev_/)
  ) {
    const referer = req.headers.referer || req.headers.referrer || "";
    console.log(`[Vite Proxy] Request: ${url}, Referer: ${referer}`);

    // Only proxy if referer is from Slidev (contains /slidev/)
    const refererMatch = referer.match(/\/slidev\/(\d+)/);

    if (refererMatch) {
      const port = parseInt(refererMatch[1]);
      console.log(`[Vite Proxy] Proxying to port ${port}`);

      // Get or create proxy for this port
      if (!slidevProxies.has(port)) {
        const proxy = createProxyMiddleware({
          target: `http://localhost:${port}`,
          changeOrigin: true,
          ws: false,
        });
        slidevProxies.set(port, proxy);
      }

      return slidevProxies.get(port)(req, res, next);
    } else {
      // No Slidev referer - let main Vite handle it
      console.log(`[Vite Proxy] No Slidev referer, passing to main Vite`);
    }
  }

  next();
});
await fastify.use((req, res, next) => {
  const url = req.url || "";

  // Check if this is a Slidev proxy request
  const slidevMatch = url.match(/^\/slidev\/(\d+)(\/.*)?$/);

  if (slidevMatch) {
    const port = parseInt(slidevMatch[1]);

    // Get or create proxy for this port (reuse to maintain WebSocket upgrade handlers)
    if (!slidevProxies.has(port)) {
      const proxy = createProxyMiddleware({
        target: `http://localhost:${port}`,
        changeOrigin: true,
        ws: true,
        pathRewrite: (path) => path.replace(`/slidev/${port}`, ""),
        selfHandleResponse: true,
        on: {
          proxyRes: (proxyRes: any, _req: any, res: any) => {
            const contentType = proxyRes.headers["content-type"] || "";

            // Only intercept HTML responses
            if (contentType.includes("text/html")) {
              let body = "";
              proxyRes.on("data", (chunk: any) => {
                body += chunk.toString("utf8");
              });
              proxyRes.on("end", () => {
                // Fix relative Vite paths by adding /slidev/${port} prefix
                // /@fs/... → /slidev/${port}/@fs/...
                // /@vite/... → /slidev/${port}/@vite/...
                // /@id/... → /slidev/${port}/@id/...
                body = body.replace(
                  /(<script[^>]*src=")(\/@[^"]*)/gi,
                  `$1/slidev/${port}$2`,
                );
                body = body.replace(
                  /(<link[^>]*href=")(\/@[^"]*)/gi,
                  `$1/slidev/${port}$2`,
                );
                body = body.replace(
                  /(<img[^>]*src=")(\/@[^"]*)/gi,
                  `$1/slidev/${port}$2`,
                );
                // Set response headers
                res.statusCode = proxyRes.statusCode || 200;
                Object.keys(proxyRes.headers).forEach((key) => {
                  if (key.toLowerCase() !== "content-length") {
                    res.setHeader(key, proxyRes.headers[key]);
                  }
                });
                res.setHeader("Content-Length", Buffer.byteLength(body));
                res.end(body);
              });
            } else {
              // For non-HTML, forward directly
              res.statusCode = proxyRes.statusCode || 200;
              Object.keys(proxyRes.headers).forEach((key) => {
                res.setHeader(key, proxyRes.headers[key]);
              });
              proxyRes.pipe(res);
            }
          },
        },
      });
      slidevProxies.set(port, proxy);

      // Setup WebSocket upgrade listener for this port
      fastify.server.on("upgrade", (req, socket, head) => {
        const upgradeUrl = req.url || "";
        if (upgradeUrl.startsWith(`/slidev/${port}`)) {
          proxy.upgrade?.(req, socket as any, head); // 型別斷言
        }
      });
    }

    return slidevProxies.get(port)(req, res, next);
  }

  next();
});
// Frontend integration
if (IS_DEV) {
  // Development mode: Use Vite dev server
  const { createServer } = await import("vite");
  const vite = await createServer({
    // 讀取 vite.config.ts 而不是內聯配置
    configFile: join(__dirname, "../../vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
  });

  // Use vite's connect instance as middleware
  // Wrap in a function to skip API routes
  await fastify.use((req, res, next) => {
    // Skip Vite middleware for:
    // 1. API routes
    // 2. Health check
    // 3. Slidev proxy routes
    // 4. Slidev resources (node_modules/@slidev, /@fs paths)
    if (
      req.url?.startsWith("/api/") ||
      req.url === "/health" ||
      req.url?.startsWith("/slidev/") ||
      req.url?.includes("/@fs/") ||
      req.url?.includes("/node_modules/@slidev/") ||
      req.url?.includes("__slidev_")
    ) {
      return next();
    }
    vite.middlewares(req, res, next);
  });

  console.log("🔧 Running in DEVELOPMENT mode with Vite HMR");
} else {
  // Production mode: Serve static files
  const frontendPath = join(__dirname, "../frontend");

  await fastify.register(fastifyStatic, {
    root: frontendPath,
    prefix: "/",
  });

  // SPA fallback - serve index.html for non-API, non-proxy routes
  fastify.setNotFoundHandler(async (request, reply) => {
    // Don't serve SPA for API routes or proxy routes
    if (
      request.url.startsWith("/api/") ||
      request.url.startsWith("/slidev/") ||
      request.url.startsWith("/@") ||
      request.url.startsWith("/__") ||
      request.url.includes("__slidev_")
    ) {
      reply.code(404).send({ error: "Not found" });
    } else {
      reply.sendFile("index.html");
    }
  });

  console.log("🚀 Running in PRODUCTION mode with static files");
}

// Start server
const start = async () => {
  try {
    let port: number;

    if (AUTO_PORT_SELECTION) {
      // Development mode: Auto-select available port if preferred is taken
      port = await getPort({
        port: [
          13000, 13001, 13002, 13003, 13004, 13005, 13006, 13007, 13008, 13009,
          13010,
        ],
      });

      // Warn if using a different port than preferred
      if (port !== PREFERRED_PORT) {
        console.warn(`⚠️  Port ${PREFERRED_PORT} is already in use.`);
        console.warn(`✅ Using port ${port} instead.`);
        console.warn(
          `💡 To use a fixed port, set AUTO_PORT_SELECTION=false in your .env file\n`,
        );
      }
    } else {
      // Production mode: Use preferred port strictly (fail if occupied)
      port = PREFERRED_PORT;
      console.log(
        `🔒 AUTO_PORT_SELECTION is disabled. Using port ${port} strictly.`,
      );
    }

    await fastify.listen({ port, host: HOST });

    console.log(`\n🚀 AISliDev server is running!`);
    console.log(`\n📍 Local:    http://localhost:${port}`);
    if (HOST === "0.0.0.0") {
      console.log(`📍 Network:  http://${getNetworkAddress()}:${port}`);
    }
    console.log(`\n📊 Health:   http://localhost:${port}/health`);
    console.log(`📡 API:      http://localhost:${port}/api`);
    console.log(`\n✨ Ready to accept requests!\n`);
  } catch (err) {
    fastify.log.error(err);
    console.error("\n❌ Failed to start server:");
    console.error(err);
    process.exit(1);
  }
};

// Helper function to get network address
function getNetworkAddress(): string {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return "localhost";
}

// Handle shutdown gracefully
const shutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, closing server...`);
  await slidevManager.cleanup();
  await fastify.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start();
