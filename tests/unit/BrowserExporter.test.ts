import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const chromiumLaunchMock = vi.fn();
  const browserNewPageMock = vi.fn();
  const browserCloseMock = vi.fn();

  const pageSetViewportSizeMock = vi.fn();
  const pageSetDefaultTimeoutMock = vi.fn();
  const pageGotoMock = vi.fn();
  const pageWaitForTimeoutMock = vi.fn();
  const pageWaitForFunctionMock = vi.fn();
  const pageScreenshotMock = vi.fn();
  const pageCloseMock = vi.fn();
  const pageKeyboardPressMock = vi.fn();
  const pageUrlMock = vi.fn();
  const pageEvaluateMock = vi.fn();
  const locatorTextContentMock = vi.fn();
  const locatorWaitForMock = vi.fn();

  const mkdirMock = vi.fn();
  const rmMock = vi.fn();
  const statMock = vi.fn();

  const addImageMock = vi.fn();
  const addSlideMock = vi.fn();
  const writeFileMock = vi.fn();
  const PptxGenJSMock = vi.fn();

  return {
    chromiumLaunchMock,
    browserNewPageMock,
    browserCloseMock,
    pageSetViewportSizeMock,
    pageSetDefaultTimeoutMock,
    pageGotoMock,
    pageWaitForTimeoutMock,
    pageWaitForFunctionMock,
    pageScreenshotMock,
    pageCloseMock,
    pageKeyboardPressMock,
    pageUrlMock,
    pageEvaluateMock,
    locatorTextContentMock,
    locatorWaitForMock,
    mkdirMock,
    rmMock,
    statMock,
    addImageMock,
    addSlideMock,
    writeFileMock,
    PptxGenJSMock,
  };
});

vi.mock("playwright", () => ({
  chromium: {
    launch: mocks.chromiumLaunchMock,
  },
}));

vi.mock("fs", () => ({
  promises: {
    mkdir: mocks.mkdirMock,
    rm: mocks.rmMock,
    stat: mocks.statMock,
  },
}));

vi.mock("pptxgenjs", () => ({
  default: mocks.PptxGenJSMock,
}));

import { BrowserExporter } from "../../src/server/services/BrowserExporter";

describe("BrowserExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.browserCloseMock.mockResolvedValue(undefined);
    mocks.pageSetViewportSizeMock.mockResolvedValue(undefined);
    mocks.pageSetDefaultTimeoutMock.mockReturnValue(undefined);
    mocks.pageGotoMock.mockResolvedValue(undefined);
    mocks.pageWaitForTimeoutMock.mockResolvedValue(undefined);
    mocks.pageWaitForFunctionMock.mockResolvedValue(undefined);
    mocks.pageScreenshotMock.mockResolvedValue(undefined);
    mocks.pageCloseMock.mockResolvedValue(undefined);
    mocks.pageKeyboardPressMock.mockResolvedValue(undefined);
    mocks.pageUrlMock.mockReturnValue("http://localhost:13030/1");
    mocks.pageEvaluateMock.mockResolvedValue(2);
    mocks.locatorTextContentMock.mockResolvedValue("1 / 2");
    mocks.locatorWaitForMock.mockResolvedValue(undefined);

    const pageMock = {
      setViewportSize: mocks.pageSetViewportSizeMock,
      setDefaultTimeout: mocks.pageSetDefaultTimeoutMock,
      goto: mocks.pageGotoMock,
      waitForTimeout: mocks.pageWaitForTimeoutMock,
      waitForFunction: mocks.pageWaitForFunctionMock,
      screenshot: mocks.pageScreenshotMock,
      close: mocks.pageCloseMock,
      keyboard: {
        press: mocks.pageKeyboardPressMock,
      },
      url: mocks.pageUrlMock,
      evaluate: mocks.pageEvaluateMock,
      locator: vi.fn(() => ({
        waitFor: mocks.locatorWaitForMock,
        first: vi.fn(() => ({
          textContent: mocks.locatorTextContentMock,
        })),
      })),
    };

    const browserMock = {
      newPage: mocks.browserNewPageMock,
      close: mocks.browserCloseMock,
    };

    mocks.browserNewPageMock.mockResolvedValue(pageMock);
    mocks.chromiumLaunchMock.mockResolvedValue(browserMock);

    mocks.mkdirMock.mockResolvedValue(undefined);
    mocks.rmMock.mockResolvedValue(undefined);
    mocks.statMock.mockResolvedValue({ size: 2048 });

    mocks.addImageMock.mockReturnValue(undefined);
    mocks.addSlideMock.mockImplementation(() => ({
      addImage: mocks.addImageMock,
    }));
    mocks.writeFileMock.mockResolvedValue(undefined);

    mocks.PptxGenJSMock.mockImplementation(() => ({
      addSlide: mocks.addSlideMock,
      writeFile: mocks.writeFileMock,
    }));
  });

  it("reuses a single browser across exports", async () => {
    const exporter = new BrowserExporter();

    // Run two exports
    await exporter.exportPPTX(13030, "/tmp/export1.pptx", 5000);
    await exporter.exportPPTX(13030, "/tmp/export2.pptx", 5000);

    // Browser is initialized once and reused across exports
    expect(mocks.chromiumLaunchMock).toHaveBeenCalledTimes(1);
    expect(mocks.chromiumLaunchMock).toHaveBeenCalledWith({
      channel: 'chromium',
      headless: true,
      args: expect.arrayContaining([
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ]),
    });

    expect(mocks.browserCloseMock).not.toHaveBeenCalled();
  });

  it("exports pptx by screenshoting slides with inline logic", async () => {
    const exporter = new BrowserExporter();
    const outputPath = "/tmp/aislidev-export.pptx";

    const result = await exporter.exportPPTX(13030, outputPath, 5000);

    expect(result).toBe(outputPath);

    // Fresh page created for each slide (2 slides detected)
    expect(mocks.browserNewPageMock).toHaveBeenCalledTimes(1);

    // Navigate to slides with networkidle
    expect(mocks.pageGotoMock).toHaveBeenCalledWith(
      "http://localhost:13030/1",
      {
        waitUntil: "networkidle",
        timeout: expect.any(Number),
      },
    );

    // Screenshots should be taken for both slides
    expect(mocks.pageScreenshotMock).toHaveBeenCalledTimes(2);
    expect(mocks.pageScreenshotMock).toHaveBeenNthCalledWith(1, {
      path: "/tmp/.temp-screenshots/slide-1.png",
      type: "png",
      fullPage: false,
    });
    expect(mocks.pageScreenshotMock).toHaveBeenNthCalledWith(2, {
      path: "/tmp/.temp-screenshots/slide-2.png",
      type: "png",
      fullPage: false,
    });

    // PPTX generation
    expect(mocks.addSlideMock).toHaveBeenCalledTimes(2);
    expect(mocks.addImageMock).toHaveBeenCalledTimes(2);
    expect(mocks.writeFileMock).toHaveBeenCalledWith({ fileName: outputPath });

    // Temp directory lifecycle
    expect(mocks.mkdirMock).toHaveBeenCalledWith("/tmp/.temp-screenshots", {
      recursive: true,
    });
    expect(mocks.rmMock).toHaveBeenCalledWith("/tmp/.temp-screenshots", {
      recursive: true,
      force: true,
    });

    expect(mocks.statMock).toHaveBeenCalledWith(outputPath);
    
    // Pages closed after screenshots
    expect(mocks.pageCloseMock).toHaveBeenCalledTimes(1);
  });

  it("fails when no slides are detected and cleans up temp resources", async () => {
    mocks.pageEvaluateMock.mockResolvedValue(0);

    const exporter = new BrowserExporter();

    await expect(
      exporter.exportPPTX(13030, "/tmp/empty-export.pptx"),
    ).rejects.toThrow(
      "Failed to export PPTX: No slides detected in presentation",
    );

    expect(mocks.pageScreenshotMock).not.toHaveBeenCalled();
    expect(mocks.writeFileMock).not.toHaveBeenCalled();

    expect(mocks.rmMock).toHaveBeenCalledWith("/tmp/.temp-screenshots", {
      recursive: true,
      force: true,
    });
    expect(mocks.pageCloseMock).toHaveBeenCalledTimes(1);
  });
});
