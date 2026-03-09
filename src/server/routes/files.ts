import { FastifyInstance } from "fastify";
import { promises as fs } from "fs";
import path from "path";

interface FilesRoutesOptions {
  storageDir: string;
}

export default async function filesRoutes(
  fastify: FastifyInstance,
  options: FilesRoutesOptions,
) {
  const { storageDir } = options;

  // List files in presentations directory
  fastify.get("/files/presentations", async (_request, reply) => {
    const presentationsDir = path.join(storageDir, "presentations");

    try {
      // Ensure directory exists
      await fs.mkdir(presentationsDir, { recursive: true });

      // Read directory
      const files = await fs.readdir(presentationsDir);

      // Filter only .md files
      const mdFiles = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => ({
          name: file,
          path: path.join(presentationsDir, file),
        }));

      return { files: mdFiles };
    } catch (error) {
      fastify.log.error(`Failed to list presentations: ${error}`);
      return reply.code(500).send({ error: "Failed to list presentations" });
    }
  });

  // List files in templates directory
  fastify.get("/files/templates", async (_request, reply) => {
    const templatesDir = path.join(storageDir, "templates");

    try {
      // Ensure directory exists
      await fs.mkdir(templatesDir, { recursive: true });

      // Read directory
      const files = await fs.readdir(templatesDir);

      // Filter only .md files
      const mdFiles = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => ({
          name: file,
          path: path.join(templatesDir, file),
        }));

      return { files: mdFiles };
    } catch (error) {
      fastify.log.error(`Failed to list templates: ${error}`);
      return reply.code(500).send({ error: "Failed to list templates" });
    }
  });

  // Read a specific presentation file
  fastify.get<{ Params: { filename: string } }>(
    "/files/presentations/:filename",
    async (request, reply) => {
      const { filename } = request.params;
      const filePath = path.join(storageDir, "presentations", filename);

      // Security: prevent path traversal
      if (!filePath.startsWith(path.join(storageDir, "presentations"))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(filePath, "utf-8");
        return { filename, content };
      } catch (error) {
        fastify.log.error(`Failed to read presentation: ${error}`);
        return reply.code(404).send({ error: "File not found" });
      }
    },
  );

  // Read a specific template file
  fastify.get<{ Params: { filename: string } }>(
    "/files/templates/:filename",
    async (request, reply) => {
      const { filename } = request.params;
      const filePath = path.join(storageDir, "templates", filename);

      // Security: prevent path traversal
      if (!filePath.startsWith(path.join(storageDir, "templates"))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(filePath, "utf-8");
        return { filename, content };
      } catch (error) {
        fastify.log.error(`Failed to read template: ${error}`);
        return reply.code(404).send({ error: "File not found" });
      }
    },
  );
}
