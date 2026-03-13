import { promises as fs } from "fs";
import path from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createTestApp,
  TestSlidevManager,
  type TestAppContext,
} from "../helpers/app-factory";

describe("Presentations CRUD API", () => {
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

  describe("GET /api/presentations", () => {
    it("returns list of presentations", async () => {
      const response = await context.app.inject({
        method: "GET",
        url: "/api/presentations",
      });

      expect(response.statusCode).toBe(200);
      const presentations = response.json();
      expect(Array.isArray(presentations)).toBe(true);

      if (presentations.length > 0) {
        const first = presentations[0];
        expect(first).toHaveProperty("id");
        expect(first).toHaveProperty("title");
        expect(first).toHaveProperty("content");
      }
    });
  });

  describe("GET /api/presentations/:id", () => {
    it("returns presentation by id when exists", async () => {
      const response = await context.app.inject({
        method: "GET",
        url: "/api/presentations/aislidev-demo",
      });

      expect(response.statusCode).toBe(200);
      const presentation = response.json();
      expect(presentation.id).toBe("aislidev-demo");
      expect(presentation).toHaveProperty("title");
      expect(presentation).toHaveProperty("content");
      expect(typeof presentation.content).toBe("string");
    });

    it("returns 404 when presentation not found", async () => {
      const response = await context.app.inject({
        method: "GET",
        url: "/api/presentations/nonexistent-id",
      });

      expect(response.statusCode).toBe(404);
      const error = response.json();
      expect(error).toHaveProperty("error");
    });
  });

  describe("POST /api/presentations", () => {
    it("creates new presentation with valid data", async () => {
      const newPresentation = {
        title: "Test Presentation",
        content: "---\ntitle: Test\n---\n\n# Hello",
      };

      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations",
        headers: { "content-type": "application/json" },
        payload: newPresentation,
      });

      expect(response.statusCode).toBe(200);
      const created = response.json();
      expect(created).toHaveProperty("id");
      expect(created.title).toBe(newPresentation.title);
      expect(created.content).toBe(newPresentation.content);
    });

    it("returns 500 when missing required fields", async () => {
      const response = await context.app.inject({
        method: "POST",
        url: "/api/presentations",
        headers: { "content-type": "application/json" },
        payload: { title: "Only Title" }, // Missing content
      });

      expect(response.statusCode).toBe(500);
    });
  });

  describe("PUT /api/presentations/:id", () => {
    it("updates presentation content when exists", async () => {
      const updatedContent = "---\ntitle: Updated\n---\n\n# Updated Content";

      const response = await context.app.inject({
        method: "PUT",
        url: "/api/presentations/aislidev-demo",
        headers: { "content-type": "application/json" },
        payload: { content: updatedContent },
      });

      expect(response.statusCode).toBe(200);
      const updated = response.json();
      expect(updated.id).toBe("aislidev-demo");
      expect(updated.content).toBe(updatedContent);
    });

    it("returns 404 when updating nonexistent presentation", async () => {
      const response = await context.app.inject({
        method: "PUT",
        url: "/api/presentations/nonexistent-id",
        headers: { "content-type": "application/json" },
        payload: { content: "# Test" },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/presentations/:id", () => {
    it("deletes presentation when exists", async () => {
      // First create a test presentation to delete
      const createResponse = await context.app.inject({
        method: "POST",
        url: "/api/presentations",
        headers: { "content-type": "application/json" },
        payload: {
          title: "To Delete",
          content: "# Temporary",
        },
      });

      const created = createResponse.json();
      const idToDelete = created.id;

      // Now delete it
      const deleteResponse = await context.app.inject({
        method: "DELETE",
        url: `/api/presentations/${idToDelete}`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      const result = deleteResponse.json();
      expect(result.success).toBe(true);

      // Verify it's gone
      const getResponse = await context.app.inject({
        method: "GET",
        url: `/api/presentations/${idToDelete}`,
      });
      expect(getResponse.statusCode).toBe(404);
    });

    it("returns success when deleting nonexistent presentation", async () => {
      const response = await context.app.inject({
        method: "DELETE",
        url: "/api/presentations/nonexistent-id",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ success: true });
    });
  });
});
