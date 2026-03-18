#!/usr/bin/env node
/**
 * Test script to verify environment variable fix for PPTX export background images
 *
 * This script simulates the service environment by:
 * 1. Loading dotenv/config (just like src/server/index.ts does)
 * 2. Launching Playwright with the fixed BrowserExporter logic
 * 3. Taking a screenshot and comparing file size
 *
 * Expected result: ~844KB screenshot with Unsplash background (not 99KB white)
 */

import "dotenv/config"; // Simulate service environment
import { chromium } from "playwright";
import { promises as fs } from "fs";

const PORT = 13030;
const OUTPUT_PATH = "/tmp/test-env-fix-slide-1.png";

console.log("🧪 Testing environment variable fix for BrowserExporter");
console.log(`📊 Current NODE_ENV: ${process.env.NODE_ENV || "(unset)"}`);
console.log("");

try {
  // CRITICAL: Save and clean environment (matching BrowserExporter.ts fix)
  const originalNodeEnv = process.env.NODE_ENV;
  delete process.env.NODE_ENV;

  console.log("✅ Environment cleaned (NODE_ENV unset for Playwright)");
  console.log(
    `📊 NODE_ENV during Playwright: ${process.env.NODE_ENV || "(unset)"}`,
  );
  console.log("");

  // Launch browser
  const browser = await chromium.launch({
    channel: "chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });

  // Navigate to first slide
  await page.goto(`http://localhost:${PORT}/#1`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(10000); // Extended wait for Unsplash backgrounds

  // Take screenshot
  await page.screenshot({ path: OUTPUT_PATH, fullPage: false });

  await browser.close();

  // Restore environment
  if (originalNodeEnv !== undefined) {
    process.env.NODE_ENV = originalNodeEnv;
  }

  console.log(
    `✅ Environment restored (NODE_ENV: ${process.env.NODE_ENV || "(unset)"})`,
  );
  console.log("");

  // Check file size
  const stats = await fs.stat(OUTPUT_PATH);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 Screenshot saved: ${OUTPUT_PATH}`);
  console.log(`📏 File size: ${sizeKB} KB (${stats.size} bytes)`);
  console.log("");

  // Verify success
  if (sizeKB >= 800) {
    console.log("✅ SUCCESS: Background image loaded correctly!");
    console.log("   Expected: ~844 KB with Unsplash background");
    console.log(`   Got: ${sizeKB} KB`);
    process.exit(0);
  } else if (sizeKB < 150) {
    console.log("❌ FAILURE: White background (no external image)");
    console.log("   Expected: ~844 KB with background");
    console.log(`   Got: ${sizeKB} KB (white background)`);
    process.exit(1);
  } else {
    console.log("⚠️  UNCLEAR: Size between expected ranges");
    console.log(`   Got: ${sizeKB} KB`);
    console.log("   Manual verification needed");
    process.exit(2);
  }
} catch (error) {
  console.error("❌ Test failed with error:", error);
  process.exit(1);
}
