#!/usr/bin/env node

/**
 * Test: Compare screenshot behavior across different Slidev themes
 *
 * Purpose: Verify if theme affects background-image loading
 *
 * Test Cases:
 * 1. default theme (current)
 * 2. seriph theme (popular choice)
 * 3. apple-basic theme (minimal)
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const SLIDEV_PORT = 13030;
const OUTPUT_DIR = "test-outputs";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function testThemeScreenshot(themeName, slideNumber = 1) {
  console.log(`\n🧪 Testing theme: ${themeName}`);

  let browser;
  try {
    // Launch browser with full Chromium
    browser = await chromium.launch({
      headless: true,
      channel: "chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    // Navigate to slide
    const url = `http://localhost:${SLIDEV_PORT}/${slideNumber}`;
    console.log(`📍 Navigating to: ${url}`);

    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Wait for rendering
    console.log("⏳ Waiting for page to render...");
    await page.waitForTimeout(5000);

    // Check background image
    const bgImage = await page.evaluate(() => {
      const slideContainer = document.querySelector(".slidev-layout");
      if (!slideContainer) return null;
      const style = window.getComputedStyle(slideContainer);
      return style.backgroundImage;
    });

    console.log(`🖼️  Background image: ${bgImage || "none"}`);

    // Take screenshot
    const outputPath = path.join(
      OUTPUT_DIR,
      `theme-${themeName}-slide${slideNumber}.png`,
    );
    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    // Check file size
    const stats = fs.statSync(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`📏 File size: ${sizeKB} KB (${stats.size} bytes)`);

    // Determine success
    const hasBackground = sizeKB > 500; // Background images should be > 500KB
    console.log(
      hasBackground
        ? "✅ SUCCESS: Background loaded"
        : "❌ FAILED: White background",
    );

    await browser.close();

    return {
      theme: themeName,
      sizeKB,
      sizeBytes: stats.size,
      bgImage,
      success: hasBackground,
    };
  } catch (error) {
    console.error(`❌ Error testing theme ${themeName}:`, error.message);
    if (browser) await browser.close();
    return {
      theme: themeName,
      error: error.message,
      success: false,
    };
  }
}

async function main() {
  console.log("🎨 Theme Comparison Test");
  console.log("=".repeat(60));
  console.log(`Slidev Port: ${SLIDEV_PORT}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log("=".repeat(60));

  // Note: This test uses the CURRENT theme running on port 13030
  // To test different themes, user needs to manually change theme in slides.md
  // and restart Slidev

  const result = await testThemeScreenshot("current", 1);

  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Result Summary");
  console.log("=".repeat(60));
  console.log(`Theme: ${result.theme}`);
  console.log(`File Size: ${result.sizeKB} KB`);
  console.log(`Background Image: ${result.bgImage || "none"}`);
  console.log(`Status: ${result.success ? "✅ PASS" : "❌ FAIL"}`);
  console.log("=".repeat(60));

  console.log("\n💡 Note: To test different themes:");
  console.log("1. Edit data/aislidev-demo/slides.md");
  console.log("2. Change line 2: theme: default → theme: seriph (or other)");
  console.log("3. Restart Slidev: npm run dev");
  console.log("4. Run this script again");

  process.exit(result.success ? 0 : 1);
}

main();
