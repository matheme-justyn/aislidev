import { FastifyInstance } from "fastify";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { ThemeLoaderV2 } from "../services/ThemeLoaderV2.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../..");
const themeLoader = new ThemeLoaderV2(path.join(projectRoot, "data/themes"));

interface FilesRoutesOptions {
  storageDir: string;
}

const PRESENTATIONS_DIR = "presentations";
const TEMPLATES_DIR = "templates";

interface PresentationInfo {
  id: string;
  name: string;
  path: string;
  valid: boolean;
  errors?: string[];
}

async function validatePresentation(
  presentationPath: string,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    const slidesPath = path.join(presentationPath, "slides.md");
    await fs.access(slidesPath);

    const content = await fs.readFile(slidesPath, "utf-8");
    if (content.trim().length === 0) {
      errors.push("slides.md is empty");
    }
  } catch (error) {
    errors.push("slides.md not found or not accessible");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default async function filesRoutes(
  fastify: FastifyInstance,
  options: FilesRoutesOptions,
) {
  const { storageDir } = options;

  fastify.get("/files/presentations", async (_request, reply) => {
    try {
      const presentationsDir = path.join(storageDir, PRESENTATIONS_DIR);
      await fs.mkdir(presentationsDir, { recursive: true });
      const entries = await fs.readdir(presentationsDir, { withFileTypes: true });
      const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => ({
          name: entry.name,
          path: path.join(presentationsDir, entry.name),
        }));

      return { files };
    } catch (error) {
      fastify.log.error(`Failed to list presentations: ${error}`);
      return reply.code(500).send({ error: "Failed to list presentations" });
    }
  });

  fastify.get("/files/templates", async (_request, reply) => {
    try {
      const templatesDir = path.join(storageDir, TEMPLATES_DIR);
      await fs.mkdir(templatesDir, { recursive: true });
      const entries = await fs.readdir(templatesDir, { withFileTypes: true });
      const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => ({
          name: entry.name,
          path: path.join(templatesDir, entry.name),
        }));

      return { files };
    } catch (error) {
      fastify.log.error(`Failed to list templates: ${error}`);
      return reply.code(500).send({ error: "Failed to list templates" });
    }
  });

  fastify.get("/files/themes", async (_request, reply) => {
    try {
      const themes = await themeLoader.listThemes();
      return { themes };
    } catch (error) {
      fastify.log.error(`Failed to list themes: ${error}`);
      return reply.code(500).send({ error: "Failed to list themes" });
    }
  });

  fastify.get<{ Params: { presentationId: string } }>(
    "/files/presentations/:filename",
    async (request, reply) => {
      const { filename } = request.params as { filename: string };
      const presentationsDir = path.join(storageDir, PRESENTATIONS_DIR);
      const slidesPath = path.join(presentationsDir, filename);

      if (!slidesPath.startsWith(presentationsDir)) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(slidesPath, "utf-8");
        return { filename, content };
      } catch (error) {
        fastify.log.error(`Failed to read presentation: ${error}`);
        return reply.code(404).send({ error: "Presentation not found" });
      }
    },
  );

  fastify.get<{ Params: { filename: string } }>(
    "/files/templates/:filename",
    async (request, reply) => {
      const { filename } = request.params;
      const templatesDir = path.join(storageDir, TEMPLATES_DIR);
      const filePath = path.join(templatesDir, filename);

      if (!filePath.startsWith(templatesDir)) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(filePath, "utf-8");
        return { filename, content };
      } catch (error) {
        fastify.log.error(`Failed to read template: ${error}`);
        return reply.code(404).send({ error: "Template not found" });
      }
    },
  );
}
