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
      await fs.mkdir(storageDir, { recursive: true });

      const entries = await fs.readdir(storageDir, { withFileTypes: true });

      const presentations: PresentationInfo[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".")) continue;

        const presentationPath = path.join(storageDir, entry.name);
        const validation = await validatePresentation(presentationPath);

        presentations.push({
          id: entry.name,
          name: entry.name,
          path: `slides/${entry.name}`,
          valid: validation.valid,
          errors: validation.errors.length > 0 ? validation.errors : undefined,
        });
      }

      return { presentations };
    } catch (error) {
      fastify.log.error(`Failed to list presentations: ${error}`);
      return reply.code(500).send({ error: "Failed to list presentations" });
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
    "/files/presentations/:presentationId",
    async (request, reply) => {
      const { presentationId } = request.params;
      const presentationPath = path.join(storageDir, presentationId);
      const slidesPath = path.join(presentationPath, "slides.md");

      if (!slidesPath.startsWith(storageDir)) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(slidesPath, "utf-8");
        return { presentationId, content };
      } catch (error) {
        fastify.log.error(`Failed to read presentation: ${error}`);
        return reply.code(404).send({ error: "Presentation not found" });
      }
    },
  );
}
