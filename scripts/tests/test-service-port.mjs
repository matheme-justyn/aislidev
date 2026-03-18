#!/usr/bin/env node
// 測試服務環境中的 Playwright 截圖
import { chromium } from "playwright";
import { promises as fs } from "fs";

const PORT = 13031; // Slidev 運行的 port
const OUTPUT = "/tmp/test-service-env-slide-1.png";

console.log("🧪 Testing in service-like environment (with dotenv loaded)");
console.log(`📊 NODE_ENV before: ${process.env.NODE_ENV || "(unset)"}`);

// 模擬 dotenv 載入
process.env.NODE_ENV = "development";
console.log(`📊 NODE_ENV after dotenv: ${process.env.NODE_ENV}`);
console.log("");

// 套用修復邏輯
const originalNodeEnv = process.env.NODE_ENV;
delete process.env.NODE_ENV;
console.log(
  `✅ NODE_ENV during Playwright: ${process.env.NODE_ENV || "(unset)"}`,
);
console.log("");

try {
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
  await page.goto(`http://localhost:${PORT}/#1`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(10000);

  await page.screenshot({ path: OUTPUT, fullPage: false });
  await browser.close();

  // 恢復環境
  if (originalNodeEnv !== undefined) {
    process.env.NODE_ENV = originalNodeEnv;
  }
  console.log(`✅ NODE_ENV restored: ${process.env.NODE_ENV || "(unset)"}`);
  console.log("");

  const stats = await fs.stat(OUTPUT);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 Screenshot: ${OUTPUT}`);
  console.log(`📏 Size: ${sizeKB} KB (${stats.size} bytes)`);
  console.log("");

  if (sizeKB >= 800) {
    console.log("✅ SUCCESS: Background loaded!");
    process.exit(0);
  } else {
    console.log("❌ FAILURE: White background (no image)");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
