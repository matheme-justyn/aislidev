import Fastify, { type FastifyInstance } from "fastify";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import filesRoutes from "../../src/server/routes/files";
import presentationsRoutes from "../../src/server/routes/presentations";
import type { SlidevProcess, SlidevConfig } from "../../src/types/slidev";

export interface SlidevManagerLike {
  startPresentation(
    presentationId: string,
    content: string,
    config?: SlidevConfig,
  ): Promise<SlidevProcess>;
  stopPresentation(presentationId: string): Promise<void>;
  reloadPresentation(presentationId: string, content: string): Promise<void>;
  getProcess(presentationId: string): SlidevProcess | undefined;
  getAllProcesses(): SlidevProcess[];
  cleanup(): Promise<void>;
}

export class TestSlidevManager implements SlidevManagerLike {
  private readonly processes = new Map<string, SlidevProcess>();
  private readonly basePort = 14000;

  readonly startCalls: Array<{ presentationId: string; content: string }> = [];
  readonly stopCalls: string[] = [];
  readonly reloadCalls: Array<{ presentationId: string; content: string }> = [];

  async startPresentation(
    presentationId: string,
    content: string,
    config: SlidevConfig = {},
  ): Promise<SlidevProcess> {
    this.startCalls.push({ presentationId, content });

    const existing = this.processes.get(presentationId);
    if (existing && existing.status === "running") {
      return existing;
    }

    const processInfo: SlidevProcess = {
      id: presentationId,
      presentationId,
      port: config.port ?? this.basePort + this.processes.size,
      pid: 5000 + this.processes.size,
      status: "running",
    };

    this.processes.set(presentationId, processInfo);
    return processInfo;
  }

  async stopPresentation(presentationId: string): Promise<void> {
    this.stopCalls.push(presentationId);

    const processInfo = this.processes.get(presentationId);
    if (!processInfo) {
      throw new Error(
        `No running presentation found with ID: ${presentationId}`,
      );
    }

    this.processes.delete(presentationId);
  }

  async reloadPresentation(
    presentationId: string,
    content: string,
  ): Promise<void> {
    this.reloadCalls.push({ presentationId, content });
  }

  getProcess(presentationId: string): SlidevProcess | undefined {
    return this.processes.get(presentationId);
  }

  getAllProcesses(): SlidevProcess[] {
    return Array.from(this.processes.values());
  }

  async cleanup(): Promise<void> {
    this.processes.clear();
  }
}

interface CreateTestAppOptions {
  storageDir?: string;
  slidevManager?: SlidevManagerLike;
}

export interface TestAppContext {
  app: FastifyInstance;
  storageDir: string;
  slidevManager: SlidevManagerLike;
  close: () => Promise<void>;
}

export async function createTestApp(
  options: CreateTestAppOptions = {},
): Promise<TestAppContext> {
  const app = Fastify({ logger: false });

  const ownStorageDir = !options.storageDir;
  const storageDir =
    options.storageDir ??
    (await fs.mkdtemp(path.join(tmpdir(), "aislidev-test-storage-")));

  const slidevManager = options.slidevManager ?? new TestSlidevManager();

  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  await app.register(presentationsRoutes, {
    prefix: "/api",
    slidevManager: slidevManager as any,
    storageDir,
  });

  await app.register(filesRoutes, {
    prefix: "/api",
    storageDir,
  });

  await app.ready();

  return {
    app,
    storageDir,
    slidevManager,
    close: async () => {
      await slidevManager.cleanup();
      await app.close();
      if (ownStorageDir) {
        await fs.rm(storageDir, { recursive: true, force: true });
      }
    },
  };
}
