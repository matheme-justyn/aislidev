import { promises as fs } from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const exporterMocks = vi.hoisted(() => {
  const initialize = vi.fn();
  const exportPPTX = vi.fn();

  return {
    initialize,
    exportPPTX,
  };
});

vi.mock("../../src/server/services/BrowserExporter", () => ({
  getBrowserExporter: () => ({
    initialize: exporterMocks.initialize,
    exportPPTX: exporterMocks.exportPPTX,
  }),
}));

import {
  createTestApp,
  TestSlidevManager,
  type TestAppContext,
} from "../helpers/app-factory";

describe("Presentations API", () => {
  let context: TestAppContext;
  let slidevManager: TestSlidevManager;

  beforeAll(async () => {
    slidevManager = new TestSlidevManager();
    context = await createTestApp({ slidevManager });

    exporterMocks.initialize.mockResolvedValue(undefined);
    exporterMocks.exportPPTX.mockImplementation(
      async (_port: number, outputPath: string) => {
        await fs.writeFile(outputPath, "pptx-content", "utf-8");
      },
    );

    await fs.mkdir(path.join(context.storageDir, "deck-existing"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(context.storageDir, "deck-existing", "slides.md"),
      "# Existing",
      "utf-8",
    );

    await fs.mkdir(path.join(context.storageDir, "deck-missing-export"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(context.storageDir, "deck-missing-export", "slides.md"),
      "# Missing Export",
      "utf-8",
    );
  });

  afterAll(async () => {
    await context.close();
  });

  it("GET /api/presentations returns existing presentation list", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/presentations",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<{
      id: string;
      title: string;
      content: string;
    }>;

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "deck-existing",
          title: "deck-existing",
          content: "# Existing",
          theme: "default",
        }),
      ]),
    );
  });

  it("GET /api/presentations/:id returns a presentation", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/presentations/deck-existing",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: "deck-existing",
        title: "deck-existing",
        content: "# Existing",
      }),
    );
  });

  it("POST /api/presentations creates a new presentation", async () => {
    const response = await context.app.inject({
      method: "POST",
      url: "/api/presentations",
      payload: {
        title: "New Deck",
        content: "# New Deck",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json() as {
      id: string;
      title: string;
      content: string;
    };
    expect(body.id).toMatch(/^pres-\d+$/);
    expect(body.title).toBe("New Deck");
    expect(body.content).toBe("# New Deck");

    const savedContent = await fs.readFile(
      path.join(context.storageDir, body.id, "slides.md"),
      "utf-8",
    );
    expect(savedContent).toBe("# New Deck");
  });

  it("PUT /api/presentations/:id updates content and triggers reload", async () => {
    const response = await context.app.inject({
      method: "PUT",
      url: "/api/presentations/deck-existing",
      payload: {
        content: "# Updated Deck",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: "deck-existing",
        title: "deck-existing",
        content: "# Updated Deck",
      }),
    );

    expect(slidevManager.reloadCalls).toContainEqual({
      presentationId: "deck-existing",
      content: "# Updated Deck",
    });

    const savedContent = await fs.readFile(
      path.join(context.storageDir, "deck-existing", "slides.md"),
      "utf-8",
    );
    expect(savedContent).toBe("# Updated Deck");
  });

  it("POST /api/presentations/:id/start starts preview process", async () => {
    const response = await context.app.inject({
      method: "POST",
      url: "/api/presentations/deck-existing/start",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: "deck-existing",
        presentationId: "deck-existing",
        status: "running",
      }),
    );

    expect(slidevManager.startCalls).toContainEqual({
      presentationId: "deck-existing",
      content: "# Updated Deck",
    });
  });

  it("GET /api/presentations/:id/status returns running when started", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/presentations/deck-existing/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: "deck-existing",
        status: "running",
      }),
    );
  });

  it("POST /api/presentations/:id/export exports pptx and returns download url", async () => {
    const response = await context.app.inject({
      method: "POST",
      url: "/api/presentations/deck-existing/export",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json() as {
      success: boolean;
      filename: string;
      size: number;
      downloadUrl: string;
    };

    expect(body.success).toBe(true);
    expect(body.filename).toMatch(/^deck-existing-\d+\.pptx$/);
    expect(body.size).toBeGreaterThan(0);
    expect(body.downloadUrl).toBe(
      `/api/presentations/deck-existing/export/${body.filename}`,
    );

    expect(exporterMocks.initialize).toHaveBeenCalledTimes(1);
    expect(exporterMocks.exportPPTX).toHaveBeenCalledWith(
      expect.any(Number),
      path.join(context.storageDir, "deck-existing", "exports", body.filename),
      120000,
    );
  });

  it("GET /api/presentations/:id/export/:filename downloads exported file", async () => {
    const exportDir = path.join(context.storageDir, "deck-existing", "exports");
    await fs.mkdir(exportDir, { recursive: true });

    const filename = "deck-existing-download.pptx";
    const filePath = path.join(exportDir, filename);
    await fs.writeFile(filePath, "download-payload", "utf-8");

    const response = await context.app.inject({
      method: "GET",
      url: `/api/presentations/deck-existing/export/${filename}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    expect(response.headers["content-disposition"]).toBe(
      'attachment; filename="deck-existing.pptx"',
    );
    expect(response.body).toBe("download-payload");
  });

  it("POST /api/presentations/:id/stop stops preview process", async () => {
    const response = await context.app.inject({
      method: "POST",
      url: "/api/presentations/deck-existing/stop",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ success: true });
    expect(slidevManager.stopCalls).toContain("deck-existing");

    const statusResponse = await context.app.inject({
      method: "GET",
      url: "/api/presentations/deck-existing/status",
    });
    expect(statusResponse.json()).toEqual({ status: "stopped" });
  });

  it("DELETE /api/presentations/:id removes presentation directory", async () => {
    await fs.mkdir(path.join(context.storageDir, "deck-delete"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(context.storageDir, "deck-delete", "slides.md"),
      "# Delete",
      "utf-8",
    );

    const response = await context.app.inject({
      method: "DELETE",
      url: "/api/presentations/deck-delete",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ success: true });

    await expect(
      fs.access(path.join(context.storageDir, "deck-delete")),
    ).rejects.toThrow();
  });
});
