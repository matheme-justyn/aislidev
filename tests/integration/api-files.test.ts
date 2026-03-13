import { promises as fs } from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp, type TestAppContext } from "../helpers/app-factory";

describe("Files API", () => {
  let context: TestAppContext;

  beforeAll(async () => {
    context = await createTestApp();

    await fs.mkdir(path.join(context.storageDir, "presentations"), {
      recursive: true,
    });
    await fs.mkdir(path.join(context.storageDir, "templates"), {
      recursive: true,
    });

    await fs.writeFile(
      path.join(context.storageDir, "presentations", "deck-a.md"),
      "# Deck A",
      "utf-8",
    );
    await fs.writeFile(
      path.join(context.storageDir, "presentations", "ignore.txt"),
      "skip",
      "utf-8",
    );

    await fs.writeFile(
      path.join(context.storageDir, "templates", "template-a.md"),
      "# Template A",
      "utf-8",
    );
    await fs.writeFile(
      path.join(context.storageDir, "templates", "ignore.json"),
      "{}",
      "utf-8",
    );
  });

  afterAll(async () => {
    await context.close();
  });

  it("GET /api/files/presentations lists only markdown files", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/files/presentations",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json() as {
      files: Array<{ name: string; path: string }>;
    };

    expect(body.files).toEqual([
      {
        name: "deck-a.md",
        path: path.join(context.storageDir, "presentations", "deck-a.md"),
      },
    ]);
  });

  it("GET /api/files/templates lists only markdown files", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/files/templates",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json() as {
      files: Array<{ name: string; path: string }>;
    };

    expect(body.files).toEqual([
      {
        name: "template-a.md",
        path: path.join(context.storageDir, "templates", "template-a.md"),
      },
    ]);
  });

  it("GET /api/files/presentations/:filename reads file content", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/files/presentations/deck-a.md",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      filename: "deck-a.md",
      content: "# Deck A",
    });
  });

  it("GET /api/files/templates/:filename reads file content", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/files/templates/template-a.md",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      filename: "template-a.md",
      content: "# Template A",
    });
  });
});
