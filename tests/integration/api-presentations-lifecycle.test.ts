import { promises as fs } from "fs";
import path from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createTestApp,
  TestSlidevManager,
  type TestAppContext,
} from "../helpers/app-factory";

describe("Presentations Lifecycle API", () => {
  let context: TestAppContext;

  beforeAll(async () => {
    context = await createTestApp({
      slidevManager: new TestSlidevManager(),
    });

    await fs.mkdir(path.join(context.storageDir, "aislidev-demo"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(context.storageDir, "aislidev-demo", "slides.md"),
      "# AISlidev Demo",
      "utf-8",
    );
  });

  afterAll(async () => {
    await context.close();
  });

  describe("POST /api/presentations/:id/start", () => {
    it("starts presentation and returns process info", async () => {
      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/start",
      });

      expect(response.statusCode).toBe(200);
      const processInfo = response.json();

      expect(processInfo).toHaveProperty("id", "aislidev-demo");
      expect(processInfo).toHaveProperty("port");
      expect(processInfo).toHaveProperty("pid");
      expect(processInfo).toHaveProperty("status", "running");
      expect(typeof processInfo.port).toBe("number");
      expect(typeof processInfo.pid).toBe("number");
    });

    it("reuses existing process if already running", async () => {
      // Start first time
      const firstResponse = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/start",
      });
      const firstInfo = firstResponse.json();

      // Start again - should return same process
      const secondResponse = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/start",
      });
      const secondInfo = secondResponse.json();

      expect(secondResponse.statusCode).toBe(200);
      expect(secondInfo.port).toBe(firstInfo.port);
      expect(secondInfo.pid).toBe(firstInfo.pid);
    });

    it("returns 500 when presentation does not exist", async () => {
      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations/nonexistent-id/start",
      });

      expect(response.statusCode).toBe(500);
      const error = response.json();
      expect(error).toHaveProperty("error");
    });
  });

  describe("GET /api/presentations/:id/status", () => {
    it("returns running status when presentation is active", async () => {
      // First ensure it's running
      await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/start",
      });

      // Check status
      const response = await context.app.inject({
        method: "GET",
        url: "/api/presentations/aislidev-demo/status",
      });

      expect(response.statusCode).toBe(200);
      const status = response.json();

      expect(status).toHaveProperty("id", "aislidev-demo");
      expect(status).toHaveProperty("status", "running");
      expect(status).toHaveProperty("port");
      expect(status).toHaveProperty("pid");
    });

    it("returns stopped status when presentation is not running", async () => {
      const testId = "stopped-presentation";

      const response = await context.app.inject({
        method: "GET",
        url: `/api/presentations/${testId}/status`,
      });

      expect(response.statusCode).toBe(200);
      const status = response.json();

      expect(status).toHaveProperty("status", "stopped");
    });
  });

  describe("POST /api/presentations/:id/stop", () => {
    it("stops running presentation", async () => {
      // First start a presentation
      const startResponse = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/start",
      });
      expect(startResponse.statusCode).toBe(200);

      // Now stop it
      const stopResponse = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/stop",
      });

      expect(stopResponse.statusCode).toBe(200);
      const result = stopResponse.json();
      expect(result).toHaveProperty("success", true);

      // Verify it's stopped
      const statusResponse = await context.app.inject({
        method: "GET",
        url: "/api/presentations/aislidev-demo/status",
      });
      const status = statusResponse.json();
      expect(status.status).toBe("stopped");
    });

    it("returns 404 when stopping nonexistent presentation", async () => {
      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations/nonexistent-id/stop",
      });

      expect(response.statusCode).toBe(404);
    });

    it("handles stopping already stopped presentation gracefully", async () => {
      // Ensure it's stopped
      await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/stop",
      });

      // Try to stop again
      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations/aislidev-demo/stop",
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
