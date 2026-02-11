import 'dotenv/config';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { networkInterfaces } from 'os';
import getPort from 'get-port';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PREFERRED_PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const AUTO_PORT_SELECTION = process.env.AUTO_PORT_SELECTION !== 'false'; // Default: true

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
await fastify.register(fastifyCors, {
  origin: true, // Allow all origins in development
});

// Serve static files
await fastify.register(fastifyStatic, {
  root: join(__dirname, '../../public'),
  prefix: '/public/',
});

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root endpoint
fastify.get('/', async () => {
  return {
    name: 'AISliDev',
    version: '0.0.2',
    description: 'AI-powered Slidev presentation platform',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  };
});

// API routes placeholder
fastify.get('/api', async () => {
  return {
    message: 'AISliDev API',
    version: 'v1',
    endpoints: {
      presentations: '/api/presentations',
    },
  };
});

// Start server
const start = async () => {
  try {
    let port: number;

    if (AUTO_PORT_SELECTION) {
      // Development mode: Auto-select available port if preferred is taken
      port = await getPort({ port: PREFERRED_PORT });

      // Warn if using a different port than preferred
      if (port !== PREFERRED_PORT) {
        console.warn(`⚠️  Port ${PREFERRED_PORT} is already in use.`);
        console.warn(`✅ Using port ${port} instead.`);
        console.warn(`💡 To use a fixed port, set AUTO_PORT_SELECTION=false in your .env file\n`);
      }
    } else {
      // Production mode: Use preferred port strictly (fail if occupied)
      port = PREFERRED_PORT;
      console.log(`🔒 AUTO_PORT_SELECTION is disabled. Using port ${port} strictly.`);
    }

    await fastify.listen({ port, host: HOST });

    console.log(`\n🚀 AISliDev server is running!`);
    console.log(`\n📍 Local:    http://localhost:${port}`);
    if (HOST === '0.0.0.0') {
      console.log(`📍 Network:  http://${getNetworkAddress()}:${port}`);
    }
    console.log(`\n📊 Health:   http://localhost:${port}/health`);
    console.log(`📡 API:      http://localhost:${port}/api`);
    console.log(`\n✨ Ready to accept requests!\n`);

  } catch (err) {
    fastify.log.error(err);
    console.error('\n❌ Failed to start server:');
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
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

// Handle shutdown gracefully
const shutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, closing server...`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
