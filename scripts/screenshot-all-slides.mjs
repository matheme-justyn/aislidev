#!/usr/bin/env node
/**
 * Standalone screenshot generator for Slidev presentations
 * This script successfully captures backgrounds where BrowserExporter fails
 *
 * Usage: node scripts/screenshot-all-slides.mjs <port> <slideCount> <outputDir>
 */

import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function screenshotAllSlides(port, slideCount, outputDir) {
  console.log(`Starting screenshot generation...`);
  console.log(`Port: ${port}, Slides: ${slideCount}, Output: ${outputDir}`);

  const browser = await chromium.launch({
    headless: true,
    channel: "chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    for (let i = 1; i <= slideCount; i++) {
      console.log(`[${i}/${slideCount}] Processing slide ${i}...`);

      const page = await browser.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });

      const slideUrl = `http://localhost:${port}/${i}`;
      await page.goto(slideUrl, { waitUntil: "networkidle", timeout: 30000 });

      // Wait for background images to load
      await page.waitForTimeout(10000);

      // Trigger v-click animations
      for (let click = 0; click < 20; click++) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(200);
      }

      await page.waitForTimeout(500);

      const outputPath = path.join(outputDir, `slide-${i}.png`);
      await page.screenshot({ path: outputPath, type: "png" });

      console.log(`  ✓ Saved: ${outputPath}`);

      await page.close();
    }

    console.log(`✅ All ${slideCount} slides captured successfully!`);
  } finally {
    await browser.close();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error(
    "Usage: node screenshot-all-slides.mjs <port> <slideCount> <outputDir>",
  );
  process.exit(1);
}

const [port, slideCount, outputDir] = args;
screenshotAllSlides(parseInt(port), parseInt(slideCount), outputDir).catch(
  (error) => {
    console.error("Error:", error);
    process.exit(1);
  },
);
