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
  private originalNodeEnv: string | undefined;

  /**
   * Initialize browser instance (reusable across exports)
   */
  async initialize(): Promise<void> {
    if (this.browser) return;

    // CRITICAL FIX: NODE_ENV=development breaks Playwright's external CSS background image loading
    // Save and temporarily unset NODE_ENV before launching browser
    // See: docs/adr/010-revert-child-process-screenshot-approach.md for full investigation
    this.originalNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    try {
      this.browser = await chromium.launch({
        headless: true,
        channel: "chromium",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });
    } finally {
      // Restore NODE_ENV after browser launch
      if (this.originalNodeEnv !== undefined) {
        process.env.NODE_ENV = this.originalNodeEnv;
      }
    }
  }

  /**
   * Export presentation to PPTX using screenshot-based generation
   *
   * @param port - Slidev instance port
   * @param slidesPath - Path to slides.md file for counting slides
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
      // Create page with dark color scheme to match Slidev's default theme
      page = await this.browser!.newPage({
        colorScheme: 'dark'  // Force dark mode for Slidev theme
      });

      // Set viewport to standard presentation size (16:9 aspect ratio)
      await page.setViewportSize({ width: 1920, height: 1080 });
      page.setDefaultTimeout(timeout);

      // Navigate to Slidev presentation (direct access, no proxy path)
      const slideUrl = `http://localhost:${port}/1`;
      console.log(`[BrowserExporter] Navigating to ${slideUrl}`);
      await this.gotoWithCleanEnv(page, slideUrl, { waitUntil: "networkidle", timeout: 30000 });

      // Wait for Vue app and theme CSS to load
      await page.waitForSelector('#app', { state: 'attached' });
      await page.waitForSelector('.slidev-layout', { state: 'visible' });
      await page.waitForTimeout(2000);

      // Get slide count from Slidev's API (most reliable)
      const slideCount = await page.evaluate(() => {
        const slidev = (window as any).__slidev__;
        return slidev?.nav?.total || 0;
      });
      console.log(`[BrowserExporter] Detected ${slideCount} slides from Slidev API`);
      if (slideCount === 0) {
        throw new Error("No slides detected in presentation");
      }

      // Create temp directory for screenshots
      await fs.mkdir(tempDir, { recursive: true });

      // Screenshot each slide by navigating to each URL directly
      // This ensures proper theme CSS and background image loading
      const screenshotPaths: string[] = [];
      for (let i = 1; i <= slideCount; i++) {
        const screenshotPath = path.join(tempDir, `slide-${i}.png`);
        await this.screenshotSlideByUrl(page, port, i, screenshotPath, timeout);
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
   * Navigate to URL with NODE_ENV workaround
   * CRITICAL: NODE_ENV=development breaks Playwright's CSS background-image loading
   */
  private async gotoWithCleanEnv(
    page: Page,
    url: string,
    options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle"; timeout?: number },
  ): Promise<void> {
    // Save and temporarily unset NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    try {
      await page.goto(url, options);
    } finally {
      // Restore NODE_ENV
      if (originalNodeEnv !== undefined) {
        process.env.NODE_ENV = originalNodeEnv;
      }
    }
  }



  /**
   * Screenshot a slide by navigating to its URL
   * Each slide gets a fresh page load to ensure proper CSS and background loading
   */
  private async screenshotSlideByUrl(
    page: Page,
    port: number,
    slideNumber: number,
    outputPath: string,
    timeout: number,
  ): Promise<void> {
    const slideUrl = `http://localhost:${port}/${slideNumber}`;
    console.log(`[BrowserExporter] Loading slide ${slideNumber}: ${slideUrl}`);
    
    // Navigate to slide URL with clean environment
    await this.gotoWithCleanEnv(page, slideUrl, { 
      waitUntil: "networkidle", 
      timeout: timeout 
    });
    
    // Wait for Vue app and theme CSS to load
    await page.waitForSelector('#app', { state: 'attached', timeout: 10000 });
    
    // Wait for Slidev theme CSS to be fully applied
    // Check for computed background color to ensure theme is loaded
    await page.waitForFunction(() => {
      const app = document.querySelector('#app');
      if (!app) return false;
      
      const bgColor = window.getComputedStyle(app).backgroundColor;
      // Theme is loaded when background color is not transparent/default
      return bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== '';
    }, { timeout: 5000 }).catch(() => {
      console.warn('[BrowserExporter] Theme CSS timeout - proceeding anyway');
    });
    
    // Additional wait for UnoCSS and animations
    await page.waitForTimeout(2000);
    
    // Check if slide has background image (check multiple possible elements)
    const bgInfo = await page.evaluate(() => {
      // Try multiple selectors for background detection
      const selectors = [
        '.slidev-layout',
        '.slidev-page',
        '#slide-content',
        '.cover'
      ];
      
      let bgImage = 'none';
      let foundElement = null;
      
      for (const selector of selectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          const bg = window.getComputedStyle(element).backgroundImage;
          if (bg !== 'none' && bg !== '') {
            bgImage = bg;
            foundElement = selector;
            break;
          }
        }
      }
      
      const hasBackground = bgImage !== 'none' && bgImage !== '';
      
      return { hasBackground, bgImage, foundElement };
    });
    
    console.log(`[BrowserExporter] Slide ${slideNumber} background:`, bgInfo.hasBackground ? `Yes (${bgInfo.foundElement})` : 'No');
    
    // Wait for background image to fully load if present
    if (bgInfo.hasBackground) {
      // Extract URL from background-image CSS (handles both linear-gradient and url)
      const urlMatches = bgInfo.bgImage.match(/url\(["']?([^"')]+)["']?\)/g);
      if (urlMatches && urlMatches.length > 0) {
        // Get the last URL (in case of linear-gradient + url)
        const lastUrlMatch = urlMatches[urlMatches.length - 1].match(/url\(["']?([^"')]+)["']?\)/);
        if (lastUrlMatch && lastUrlMatch[1]) {
          const imageUrl = lastUrlMatch[1];
          console.log(`[BrowserExporter] Waiting for image: ${imageUrl}`);
          
          // Wait for the image to load by checking if it's in browser cache
          await page.evaluate((url) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Still resolve to avoid blocking
              img.src = url;
              
              // If image loads from cache, onload fires immediately
              if (img.complete) resolve();
            });
          }, imageUrl);
        }
      }
      
      // Additional wait for rendering
      await page.waitForTimeout(2000);
    } else {
      // No background, just wait for layout stability
      await page.waitForTimeout(1000);
    }
    
    // Trigger all v-click animations to reveal all content
    // Use Slidev's internal API to check click state
    const clickInfo = await page.evaluate(() => {
      const slidev = (window as any).__slidev__;
      if (!slidev || !slidev.nav) return { total: 0, current: 0 };
      
      // Slidev tracks clicks per slide
      // clicks: current position (0-based)
      // clicksTotal: total number of clicks available
      return {
        total: slidev.nav.clicksTotal || 0,
        current: slidev.nav.clicks || 0
      };
    });
    
    const clicksNeeded = clickInfo.total - clickInfo.current;
    
    if (clicksNeeded > 0) {
      console.log(`[BrowserExporter] Slide ${slideNumber}: Revealing ${clicksNeeded} clicks (${clickInfo.current}/${clickInfo.total})`);
      
      // Press Space to trigger each remaining click
      for (let i = 0; i < clicksNeeded; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(300);  // Wait for animation
        
        // Verify click was advanced (safety check to prevent over-clicking)
        const currentClicks = await page.evaluate(() => {
          return (window as any).__slidev__?.nav?.clicks || 0;
        });
        
        // If we've reached the total, stop (prevents advancing to next slide)
        if (currentClicks >= clickInfo.total) {
          console.log(`[BrowserExporter] All clicks revealed (${currentClicks}/${clickInfo.total})`);
          break;
        }
      }
      
      // Wait for final animations to complete
      await page.waitForTimeout(500);
    }
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
