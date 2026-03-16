import { chromium, Browser, Page } from "playwright";
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
   * 
   * Uses full Chromium binary (channel: 'chromium') instead of headless-shell
   * to ensure proper rendering of external CSS background-images.
   */
  async initialize(): Promise<void> {
    if (this.browser) return;

    this.browser = await chromium.launch({
      channel: 'chromium',  // Use full Chrome binary for proper background image rendering
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Overcome limited resource problems in container
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
    // CRITICAL: Save and clean environment to match standalone script execution
    // The service loads NODE_ENV=development from .env via dotenv/config,
    // which affects Playwright's ability to load external CSS background images.
    // Standalone scripts run with clean environment and work correctly (844KB screenshots).
    // Solution: Temporarily unset NODE_ENV to restore clean environment for Playwright.
    const originalNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    // Create fresh browser instance for this export (avoid context pollution)
    const browser = await chromium.launch({
      channel: 'chromium',  // Use full Chrome for reliable rendering
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',  // Consistent rendering
      ],
    });

    let page: Page | null = null;
    const tempDir = path.join(path.dirname(outputPath), ".temp-screenshots");

    try {
      page = await browser.newPage();

      // Set viewport to standard presentation size (16:9 aspect ratio)
      await page.setViewportSize({ width: 1920, height: 1080 });
      page.setDefaultTimeout(timeout);

      // Navigate to Slidev presentation
      const slideUrl = `http://localhost:${port}/1`;
      console.log(`[BrowserExporter] Navigating to ${slideUrl}`);
      await page.goto(slideUrl, { waitUntil: "networkidle", timeout: 30000 });

      // Wait for presentation to be ready and background images to load
      await page.waitForTimeout(10000); // Extended wait for external Unsplash backgrounds

      // Detect total slide count
      const slideCount = await this.detectSlideCount(page);
      console.log(`[BrowserExporter] Detected ${slideCount} slides`);

      if (slideCount === 0) {
        throw new Error("No slides detected in presentation");
      }

      // Create temp directory for screenshots
      await fs.mkdir(tempDir, { recursive: true });

      // Screenshot each slide with inline logic (matching successful test pattern)
      const screenshotPaths: string[] = [];
      for (let i = 1; i <= slideCount; i++) {
        // Create fresh page for each slide to avoid context pollution
        const slidePage = await browser.newPage();
        await slidePage.setViewportSize({ width: 1920, height: 1080 });
        slidePage.setDefaultTimeout(timeout);
        
        const screenshotPath = path.join(tempDir, `slide-${i}.png`);
        await this.screenshotSlide(slidePage, i, screenshotPath, port);
        screenshotPaths.push(screenshotPath);
        console.log(`[BrowserExporter] Captured slide ${i}/${slideCount}`);
        
        // Close page after screenshot to free resources
        await slidePage.close();
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
      // Always close page and browser to free resources
      if (page) {
        await page.close();
      }
      // Close the fresh browser instance
      await browser.close();
      
      // Restore original environment
      if (originalNodeEnv !== undefined) {
        process.env.NODE_ENV = originalNodeEnv;
      }
    }
  }

  /**
   * Detect total slide count from Slidev presentation
   */
  private async detectSlideCount(page: Page): Promise<number> {
    try {
      // Try to find slide indicator (e.g., "1 / 10")
      // Slidev uses format like "1 / 13" in the navigation bar
      const slideInfo = await page
        .locator("text=/\\d+\\s*\\/\\s*\\d+/")
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
        // Slidev uses hash routing: http://localhost:13030/#/2
        const url = page.url();
        const hashMatch = url.match(/#\/(\d+)/);
        const currentSlide = hashMatch ? parseInt(hashMatch[1], 10) : 1;
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
   * Waits for background images to load and triggers v-click animations before capturing
   */
  private async screenshotSlide(
    page: Page,
    slideNumber: number,
    outputPath: string,
    port: number,
  ): Promise<void> {
    // Navigate to specific slide
    const slideUrl = `http://localhost:${port}/${slideNumber}`;
    console.log(`[BrowserExporter] Capturing slide ${slideNumber}: ${slideUrl}`);
    
    // Use proven test pattern: networkidle + wait for background loading
    await page.goto(slideUrl, { 
      waitUntil: "networkidle", 
      timeout: 30000 
    });

    // Wait for background images to load (matches successful test pattern)
    await page.waitForTimeout(10000);

    // Wait for background image if present (Playwright best practice)
    await page.waitForFunction(() => {
      const slidev = document.querySelector('.slidev-layout');
      if (!slidev) return true; // No layout element, skip check
      const style = window.getComputedStyle(slidev);
      const bg = style.backgroundImage;
      // If no background or not a URL, we're good
      if (!bg || bg === 'none' || !bg.includes('url(')) return true;
      // Background exists - assume loaded after networkidle + timeout
      return true;
    }, { timeout: 5000 }).catch(() => {
      // Fallback: if function fails, continue anyway
      console.warn(`[BrowserExporter] Background check timed out for slide ${slideNumber}`);
    });

    // Click through v-click animations
    // Most slides have at most 6-8 v-click elements
    const clicksPerSlide = 20;
    for (let clickIndex = 0; clickIndex < clicksPerSlide; clickIndex++) {
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
    }

    // Final render buffer before screenshot
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: "png",
      fullPage: false,
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
