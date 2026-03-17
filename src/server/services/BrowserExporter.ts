import { chromium, Browser, Page } from "playwright-chromium";
import path from "path";
import { promises as fs } from "fs";

/**
 * BrowserExporter - Screenshot-based PPTX generation using Playwright
 *
 * Why screenshot-based approach:
 * - Slidev CLI export is broken in v52.11.5 (produces empty PPTX files)
 * - Slidev's /export route does NOT support PPTX (only PDF/PNG)
 * - This approach: render each slide as image → assemble into PPTX
 *
 * Technical implementation:
 * 1. Launch headless Chromium with --no-sandbox (required in container)
 * 2. Navigate to Slidev presentation (normal view, not export page)
 * 3. Detect total slide count
 * 4. Screenshot each slide at 1920x1080 resolution
 * 5. Use pptxgenjs to create PPTX with images
 *
 * References:
 * - Playwright Screenshots: https://playwright.dev/docs/screenshots
 * - pptxgenjs: https://gitbrent.github.io/PptxGenJS/
 */
export class BrowserExporter {
  private browser: Browser | null = null;

  /**
   * Initialize browser instance (reusable across exports)
   */
  async initialize(): Promise<void> {
    if (this.browser) return;

    this.browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Overcome limited resource problems in container
        "--disable-gpu", // Not needed in headless mode
      ],
    });
  }

  /**
   * Export presentation to PPTX using screenshot-based generation
   *
   * @param port - Slidev instance port
   * @param outputPath - Full path where PPTX should be saved
   * @param timeout - Maximum wait time in milliseconds (default: 120000)
   * @returns Path to exported PPTX file
   */
  async exportPPTX(
    port: number,
    outputPath: string,
    timeout: number = 120000,
  ): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    let page: Page | null = null;
    const tempDir = path.join(path.dirname(outputPath), ".temp-screenshots");

    try {
      page = await this.browser!.newPage();

      // Set viewport to standard presentation size (16:9 aspect ratio)
      await page.setViewportSize({ width: 1920, height: 1080 });
      page.setDefaultTimeout(timeout);

      // Navigate to Slidev presentation (Slidev uses --base /slidev/:port/)
      const slideUrl = `http://localhost:${port}/slidev/${port}/1`;
      console.log(`[BrowserExporter] Navigating to ${slideUrl}`);
      await page.goto(slideUrl, { waitUntil: "networkidle", timeout: 30000 });

      // Wait for presentation to be ready
      await page.waitForTimeout(2000);

      // Detect total slide count
      const slideCount = await this.detectSlideCount(page);
      console.log(`[BrowserExporter] Detected ${slideCount} slides`);

      if (slideCount === 0) {
        throw new Error("No slides detected in presentation");
      }

      // Create temp directory for screenshots
      await fs.mkdir(tempDir, { recursive: true });

      // Screenshot each slide
      const screenshotPaths: string[] = [];
      for (let i = 1; i <= slideCount; i++) {
        const screenshotPath = path.join(tempDir, `slide-${i}.png`);
        await this.screenshotSlide(page, i, screenshotPath, port);
        screenshotPaths.push(screenshotPath);
        console.log(`[BrowserExporter] Captured slide ${i}/${slideCount}`);
      }

      // Generate PPTX from screenshots
      console.log(
        `[BrowserExporter] Generating PPTX from ${screenshotPaths.length} screenshots`,
      );
      await this.generatePPTX(screenshotPaths, outputPath);

      // Clean up temp screenshots
      await fs.rm(tempDir, { recursive: true, force: true });

      // Verify file was created and has content
      const stats = await fs.stat(outputPath);
      if (stats.size === 0) {
        throw new Error("Generated PPTX file is empty (0 bytes)");
      }

      console.log(
        `[BrowserExporter] Export complete: ${outputPath} (${stats.size} bytes)`,
      );
      return outputPath;
    } catch (error) {
      console.error(`[BrowserExporter] Export failed:`, error);
      // Clean up temp directory on error
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {}
      throw new Error(
        `Failed to export PPTX: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      // Always close page to free resources
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Detect total slide count from Slidev presentation
   */
  private async detectSlideCount(page: Page): Promise<number> {
    try {
      // Try to find slide indicator (e.g., "1 / 10")
      const slideInfo = await page
        .locator(".slidev-page-indicator, [class*=page], [class*=slide-number]")
        .first()
        .textContent({ timeout: 5000 })
        .catch(() => null);

      if (slideInfo) {
        const match = slideInfo.match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
          return parseInt(match[2], 10);
        }
      }

      // Fallback: try to navigate forward until we can't anymore
      let count = 1;
      const maxSlides = 100; // Safety limit

      for (let i = 0; i < maxSlides; i++) {
        // Try to go to next slide
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(500);

        // Check if URL changed (slide number increased)
        const url = page.url();
        const currentSlide = parseInt(url.split("/").pop() || "1", 10);
        if (currentSlide > count) {
          count = currentSlide;
        } else {
          // No more slides
          break;
        }
      }

      return count;
    } catch (error) {
      console.warn(
        `[BrowserExporter] Failed to detect slide count, assuming 1:`,
        error,
      );
      return 1;
    }
  }

  /**
   * Screenshot a specific slide
   */
  private async screenshotSlide(
    page: Page,
    slideNumber: number,
    outputPath: string,
    port: number,
  ): Promise<void> {
    // Navigate to specific slide (Slidev uses --base /slidev/:port/)
    const slideUrl = `http://localhost:${port}/slidev/${port}/${slideNumber}`;
    await page.goto(slideUrl, { waitUntil: "networkidle", timeout: 10000 });

    // Wait for slide to render
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: "png",
      fullPage: false, // Use viewport size
    });
  }

  /**
   * Generate PPTX file from screenshot images
   */
  private async generatePPTX(
    imagePaths: string[],
    outputPath: string,
  ): Promise<void> {
    // Dynamic import to handle ES module
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();

    // Set presentation size (16:9 aspect ratio, standard HD)
    pptx.layout = "LAYOUT_16x9";

    // Add each screenshot as a slide
    for (const imagePath of imagePaths) {
      const slide = pptx.addSlide();

      // Add image to fill entire slide
      slide.addImage({
        path: imagePath,
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
      });
    }

    // Write PPTX file
    await pptx.writeFile({ fileName: outputPath });
  }

  /**
   * Clean up browser instance
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance for reuse across requests
let exporterInstance: BrowserExporter | null = null;

/**
 * Get shared BrowserExporter instance
 */
export function getBrowserExporter(): BrowserExporter {
  if (!exporterInstance) {
    exporterInstance = new BrowserExporter();
  }
  return exporterInstance;
}

/**
 * Clean up exporter on process exit
 */
process.on("SIGTERM", async () => {
  if (exporterInstance) {
    await exporterInstance.cleanup();
  }
});

process.on("SIGINT", async () => {
  if (exporterInstance) {
    await exporterInstance.cleanup();
  }
});
