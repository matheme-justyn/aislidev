import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp, type TestAppContext } from "../helpers/app-factory";

describe("Health API", () => {
  let context: TestAppContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.close();
  });

  it("GET /health returns ok status and timestamp", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});
