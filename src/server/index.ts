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

const storageDir = path.join(__dirname, "../../data");
const slidevManager = new SlidevManager(storageDir);

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});




// Helper function to create Vite resource proxy routes
const createViteProxyRoute = (pathPattern: string) => {
  return async (request: any, reply: any) => {
    const port = parseInt(request.params.port);
    
    // Extract the Vite path (e.g., /@fs/..., /@vite/..., etc.)
    let vitePath = request.url.replace(`/slidev/${port}`, '');
    
    // CRITICAL: Vite's @fs requires double slash for absolute paths (@fs//...)
    // Fix single slash to double slash for absolute paths
    if (vitePath.startsWith('/@fs/') && !vitePath.startsWith('/@fs//')) {
      vitePath = vitePath.replace('/@fs/', '/@fs//');//
    }
    
    // Include base path in target URL (Slidev uses --base /slidev/:port/)
    const targetUrl = `http://localhost:${port}/slidev/${port}${vitePath}`;
    
    try {
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(request.headers)) {
        if (!['host', 'connection'].includes(key.toLowerCase()) && typeof value === 'string') {
          headers[key] = value;
        }
      }
      
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? JSON.stringify(request.body) : undefined,
      });
      
      // Forward response headers
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-length') {
          reply.header(key, value);
        }
      });
      reply.header('X-AISlidev-Vite-Proxy', pathPattern);
      
      const buffer = await response.arrayBuffer();
      reply.code(response.status).send(Buffer.from(buffer));
    } catch (error) {
      fastify.log.error(`Vite proxy error for ${targetUrl}: ${error}`);
      reply.code(502).send({ error: 'Vite proxy error' });
    }
  };
};

// Slidev root proxy route (exact match)
fastify.all<{ Params: { port: string } }>("/slidev/:port", async (request, reply) => {
  fastify.log.info(`[PROXY] Root route /slidev/:port for ${request.url}`);
  const port = parseInt(request.params.port);
  const path = request.url.replace(`/slidev/${port}`, '') || '/';
  const targetUrl = `http://localhost:${port}${path}`;
  
  try {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(request.headers)) {
      if (!['host', 'connection'].includes(key.toLowerCase()) && typeof value === 'string') {
        headers[key] = value;
      }
    }
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? JSON.stringify(request.body) : undefined,
    });
    
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        reply.header(key, value);
      }
    });
    reply.header('X-AISlidev-Proxy', 'root');
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || '';
    
    // Inject base tag for HTML root
    if (contentType.includes('text/html') && path === '/') {
      let html = Buffer.from(buffer).toString('utf-8');
      html = html.replace('<head>', `<head>\n  <base href="/slidev/${port}/">`);
      reply.code(response.status).send(html);
    } else {
      reply.code(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    fastify.log.error(`Proxy error for ${targetUrl}: ${error}`);
    reply.code(502).send({ error: 'Proxy error' });
  }
});

// Register Vite special path proxies BEFORE wildcard
// These must be registered before /slidev/:port/* to match correctly
fastify.all<{ Params: { port: string } }>("/slidev/:port/@fs/*", createViteProxyRoute('/@fs/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@vite/*", createViteProxyRoute('/@vite/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@id/*", createViteProxyRoute('/@id/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@slidev/*", createViteProxyRoute('/@slidev/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/__uno*", createViteProxyRoute('/__uno*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/@server-reactive/*", createViteProxyRoute('/@server-reactive/*'));
fastify.all<{ Params: { port: string } }>("/slidev/:port/slides.md__slidev_*", createViteProxyRoute('/slides.md__slidev_*'));

// Wildcard route for other Slidev paths (must be registered LAST)
fastify.all<{ Params: { port: string } }>("/slidev/:port/*", async (request, reply) => {
  const port = parseInt(request.params.port);
  const path = request.url.replace(`/slidev/${port}`, '');
  const targetUrl = `http://localhost:${port}${path}`;
  
  fastify.log.info(`[PROXY] Wildcard route: ${request.url} → ${targetUrl}`);
  
  try {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(request.headers)) {
      if (!['host', 'connection'].includes(key.toLowerCase()) && typeof value === 'string') {
        headers[key] = value;
      }
    }
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? JSON.stringify(request.body) : undefined,
    });
    
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        reply.header(key, value);
      }
    });
    reply.header('X-AISlidev-Proxy', 'wildcard');
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || '';
    
    // Inject base tag for HTML (if somehow root gets here)
    if (contentType.includes('text/html') && path === '/') {
      let html = Buffer.from(buffer).toString('utf-8');
      html = html.replace('<head>', `<head>\n  <base href="/slidev/${port}/">`);
      reply.code(response.status).send(html);
    } else {
      reply.code(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    fastify.log.error(`Wildcard proxy error for ${targetUrl}: ${error}`);
    reply.code(502).send({ error: 'Proxy error' });
  }
});


// API routes
await fastify.register(presentationsRoutes, {
  prefix: "/api",
  slidevManager,
  storageDir,
});

// Register middie for Express/Connect middleware support
await fastify.register(import("@fastify/middie"));

// Frontend integration
if (IS_DEV) {
  // Development mode: Use Vite dev server
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  // Use vite's connect instance as middleware
  // Wrap in a function to skip API routes
  await fastify.use((req, res, next) => {
    // Skip Vite middleware for API routes and Slidev proxy routes
    if (req.url?.startsWith('/api/') || req.url === '/health' || req.url?.startsWith('/slidev/')) {
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
