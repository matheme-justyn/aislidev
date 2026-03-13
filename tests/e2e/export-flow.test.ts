import Fastify, { type FastifyInstance } from "fastify";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BrowserExporter } from "../../src/server/services/BrowserExporter";

describe("E2E Export Flow", () => {
  let app: FastifyInstance;
  let port: number;
  let tempDir: string;
  let exporter: BrowserExporter;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(tmpdir(), "aislidev-e2e-export-"));

    app = Fastify({ logger: false });

    app.get<{ Params: { slide: string } }>(
      "/:slide",
      async (request, reply) => {
        const totalSlides = 3;
        const slideNumber = Number.parseInt(request.params.slide, 10);

        if (
          !Number.isFinite(slideNumber) ||
          slideNumber < 1 ||
          slideNumber > totalSlides
        ) {
          return reply.code(404).send({ error: "Slide not found" });
        }

        const color = ["#0f172a", "#1d4ed8", "#065f46"][slideNumber - 1];

        return reply.type("text/html").send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Slide ${slideNumber}</title>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${color};
        color: #fff;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .slidev-page-indicator {
        position: fixed;
        top: 20px;
        right: 24px;
        font-size: 20px;
        opacity: 0.95;
      }
      h1 {
        font-size: 72px;
        line-height: 1;
      }
    </style>
  </head>
  <body>
    <div class="slidev-page-indicator">${slideNumber} / ${totalSlides}</div>
    <h1>Slide ${slideNumber}</h1>
  </body>
</html>
        `);
      },
    );

    await app.listen({ port: 0, host: "127.0.0.1" });
    const address = app.server.address();

    if (!address || typeof address === "string") {
      throw new Error("Failed to determine e2e test server port");
    }

    port = address.port;

    exporter = new BrowserExporter();
    await exporter.initialize();
  });

  afterAll(async () => {
    await exporter.cleanup();
    await app.close();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("exports a real PPTX using browser automation", async () => {
    const outputPath = path.join(tempDir, "real-browser-export.pptx");

    const exportedPath = await exporter.exportPPTX(port, outputPath, 30000);

    expect(exportedPath).toBe(outputPath);

    const stats = await fs.stat(outputPath);
    expect(stats.size).toBeGreaterThan(0);
  });
});
