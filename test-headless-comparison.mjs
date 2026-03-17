#!/usr/bin/env node
/**
 * 测试 Playwright new headless vs old headless-shell 的差异
 *
 * 假设：使用 chromium-headless-shell（不指定 channel）可能解决背景图片问题
 */

import { chromium } from "playwright";
import { promises as fs } from "fs";

const PORT = 13030;

async function testHeadlessShell() {
  console.log("🧪 测试 1: chromium-headless-shell (不指定 channel)");
  console.log("════════════════════════════════════════════════════\n");

  // 不指定 channel，使用 Playwright 内置的 headless-shell
  const browser = await chromium.launch({
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
  await page.goto(`http://localhost:${PORT}/#1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(10000);

  const output = "/tmp/test-headless-shell.png";
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();

  const stats = await fs.stat(output);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 输出: ${output}`);
  console.log(`📏 大小: ${sizeKB} KB (${stats.size} bytes)`);
  console.log(sizeKB >= 800 ? "✅ 成功：背景已加载" : "❌ 失败：白背景");
  console.log("");

  return sizeKB;
}

async function testNewHeadless() {
  console.log("🧪 测试 2: new headless (channel: 'chromium')");
  console.log("════════════════════════════════════════════════════\n");

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
  await page.goto(`http://localhost:${PORT}/#1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(10000);

  const output = "/tmp/test-new-headless.png";
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();

  const stats = await fs.stat(output);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 输出: ${output}`);
  console.log(`📏 大小: ${sizeKB} KB (${stats.size} bytes)`);
  console.log(sizeKB >= 800 ? "✅ 成功：背景已加载" : "❌ 失败：白背景");
  console.log("");

  return sizeKB;
}

async function testNewHeadlessWithWebSecurity() {
  console.log("🧪 测试 3: new headless + --disable-web-security");
  console.log("════════════════════════════════════════════════════\n");

  const browser = await chromium.launch({
    channel: "chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security", // 关键：允许跨域加载 Unsplash
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await page.goto(`http://localhost:${PORT}/#1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(10000);

  const output = "/tmp/test-new-headless-no-websec.png";
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();

  const stats = await fs.stat(output);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 输出: ${output}`);
  console.log(`📏 大小: ${sizeKB} KB (${stats.size} bytes)`);
  console.log(sizeKB >= 800 ? "✅ 成功：背景已加载" : "❌ 失败：白背景");
  console.log("");

  return sizeKB;
}

async function testWithWaitForFunction() {
  console.log("🧪 测试 4: chromium-headless-shell + waitForFunction");
  console.log("════════════════════════════════════════════════════\n");

  const browser = await chromium.launch({
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
  await page.goto(`http://localhost:${PORT}/#1`, { waitUntil: "networkidle" });

  // 等待背景图片真正加载
  await page.waitForFunction(
    () => {
      const el = document.querySelector(".slidev-layout");
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      return bgImage && bgImage !== "none" && !bgImage.includes('url("")');
    },
    { timeout: 20000 },
  );

  await page.waitForTimeout(2000);

  const output = "/tmp/test-headless-shell-waitfunc.png";
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();

  const stats = await fs.stat(output);
  const sizeKB = Math.round(stats.size / 1024);

  console.log(`📸 输出: ${output}`);
  console.log(`📏 大小: ${sizeKB} KB (${stats.size} bytes)`);
  console.log(sizeKB >= 800 ? "✅ 成功：背景已加载" : "❌ 失败：白背景");
  console.log("");

  return sizeKB;
}

// 运行所有测试
try {
  console.log("\n🚀 开始测试 Playwright headless 模式差异\n");
  console.log("════════════════════════════════════════════════════");
  console.log("");

  const result1 = await testHeadlessShell();
  const result2 = await testNewHeadless();
  const result3 = await testNewHeadlessWithWebSecurity();
  const result4 = await testWithWaitForFunction();

  console.log("\n📊 测试结果汇总");
  console.log("════════════════════════════════════════════════════");
  console.log(
    `1️⃣  chromium-headless-shell:           ${result1} KB ${result1 >= 800 ? "✅" : "❌"}`,
  );
  console.log(
    `2️⃣  new headless (channel):            ${result2} KB ${result2 >= 800 ? "✅" : "❌"}`,
  );
  console.log(
    `3️⃣  new headless + no-websec:         ${result3} KB ${result3 >= 800 ? "✅" : "❌"}`,
  );
  console.log(
    `4️⃣  headless-shell + waitForFunction: ${result4} KB ${result4 >= 800 ? "✅" : "❌"}`,
  );
  console.log("");

  const successCount = [result1, result2, result3, result4].filter(
    (r) => r >= 800,
  ).length;
  console.log(
    `\n✨ 成功率: ${successCount}/4 (${Math.round((successCount / 4) * 100)}%)`,
  );

  if (successCount > 0) {
    console.log("\n🎉 找到可行方案！");
  } else {
    console.log("\n😞 所有方案均失败，需要进一步调查");
  }
} catch (error) {
  console.error("\n❌ 测试失败:", error.message);
  process.exit(1);
}
