import { FastifyPluginAsync } from "fastify";
import { promises as fs } from "fs";
import path from "path";
import type { Presentation } from "../../types/presentation";
import type { SlidevManager } from "../services/SlidevManager";

interface PresentationsRouteOptions {
  slidevManager: SlidevManager;
  storageDir: string;
}

const presentationsRoutes: FastifyPluginAsync<
  PresentationsRouteOptions
> = async (fastify, options) => {
  const { slidevManager, storageDir } = options;

  fastify.get("/presentations", async () => {
    const presentations: Presentation[] = [];
    const dirs = await fs.readdir(storageDir, { withFileTypes: true });

    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const slidesPath = path.join(storageDir, dir.name, "slides.md");
        try {
          const content = await fs.readFile(slidesPath, "utf-8");
          const lines = content.split("\n");
          const title =
            lines.find((l) => l.startsWith("# "))?.replace("# ", "") ||
            dir.name;

          presentations.push({
            id: dir.name,
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            theme: 'default',
          });
        } catch {}
      }
    }

    return presentations;
  });

  fastify.get<{ Params: { id: string } }>(
    "/presentations/:id",
    async (request, reply) => {
      const { id } = request.params;
      const slidesPath = path.join(storageDir, id, "slides.md");

      try {
        const content = await fs.readFile(slidesPath, "utf-8");
        const lines = content.split("\n");
        const title =
          lines.find((l) => l.startsWith("# "))?.replace("# ", "") || id;

        return {
          id,
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'default',
        };
      } catch (error) {
        reply.code(404).send({ error: "Presentation not found" });
      }
    },
  );

  fastify.post<{ Body: { title: string; content: string } }>(
    "/presentations",
    async (request) => {
      const { title, content } = request.body;
      const id = `pres-${Date.now()}`;
      const presentationDir = path.join(storageDir, id);

      await fs.mkdir(presentationDir, { recursive: true });
      const slidesPath = path.join(presentationDir, "slides.md");
      await fs.writeFile(slidesPath, content, "utf-8");

      return {
        id,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'default',
      };
    },
  );

  fastify.put<{ Params: { id: string }; Body: { content: string } }>(
    "/presentations/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { content } = request.body;
      const slidesPath = path.join(storageDir, id, "slides.md");

      try {
        await fs.access(slidesPath);
        await fs.writeFile(slidesPath, content, "utf-8");

        await slidevManager.reloadPresentation(id, content);

        const lines = content.split("\n");
        const title =
          lines.find((l) => l.startsWith("# "))?.replace("# ", "") || id;

        return {
          id,
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'default',
        };
      } catch (error) {
        reply.code(404).send({ error: "Presentation not found" });
      }
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/presentations/:id",
    async (request, reply) => {
      const { id } = request.params;
      const presentationDir = path.join(storageDir, id);

      try {
        await slidevManager.stopPresentation(id);
      } catch {}

      try {
        await fs.rm(presentationDir, { recursive: true, force: true });
        return { success: true };
      } catch (error) {
        reply.code(404).send({ error: "Presentation not found" });
      }
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/presentations/:id/start",
    async (request, reply) => {
      const { id } = request.params;
      const slidesPath = path.join(storageDir, id, "slides.md");

      try {
        const content = await fs.readFile(slidesPath, "utf-8");
        const processInfo = await slidevManager.startPresentation(id, content);

        return processInfo;
      } catch (error) {
        reply.code(500).send({ error: "Failed to start presentation" });
      }
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/presentations/:id/stop",
    async (request, reply) => {
      const { id } = request.params;

      try {
        await slidevManager.stopPresentation(id);
        return { success: true };
      } catch (error) {
        reply.code(404).send({ error: "Presentation not running" });
      }
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/presentations/:id/status",
    async (request) => {
      const { id } = request.params;
      const processInfo = slidevManager.getProcess(id);

      if (!processInfo) {
        return { status: "stopped" };
      }

      return processInfo;
    },
  );
};

export default presentationsRoutes;
