// Global test setup
import { beforeAll, afterAll } from "vitest";

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DATA_DIR = "./test-data";
process.env.PORT = "13999";

beforeAll(() => {
  console.log("🧪 Test environment initialized");
});

afterAll(() => {
  console.log("✅ Test suite completed");
});
