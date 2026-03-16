import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: "chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log("[TEST] Navigating to Slidev first slide...");
  await page.goto("http://localhost:13030/1", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  console.log("[TEST] Waiting 10 seconds for background...");
  await page.waitForTimeout(10000);

  console.log("[TEST] Taking screenshot...");
  await page.screenshot({ path: "/tmp/test-screenshot-first-slide.png" });

  await browser.close();
  console.log("✓ Screenshot saved to /tmp/test-screenshot-first-slide.png");
})();
