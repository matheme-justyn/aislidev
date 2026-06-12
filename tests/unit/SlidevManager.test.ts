import { EventEmitter } from "events";
import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

class ReadyStream extends EventEmitter {
  constructor(private readonly readyData?: string) {
    super();
  }

  override on(
    event: string | symbol,
    listener: (...args: any[]) => void,
  ): this {
    super.on(event, listener);

    if (event === "data" && this.readyData) {
      listener(Buffer.from(this.readyData));
    }

    return this;
  }
}

class FakeChildProcess extends EventEmitter {
  readonly pid: number;
  readonly stdout: ReadyStream;
  readonly stderr: ReadyStream;
  readonly kill: ReturnType<typeof vi.fn>;

  constructor(
    options: {
      pid?: number;
      stdoutReady?: string;
      stderrReady?: string;
      exitOnSigterm?: boolean;
      emitErrorOnListener?: boolean;
    } = {},
  ) {
    super();

    this.pid = options.pid ?? 4321;
    this.stdout = new ReadyStream(options.stdoutReady);
    this.stderr = new ReadyStream(options.stderrReady);

    this.kill = vi.fn((signal?: NodeJS.Signals | number) => {
      if (signal === "SIGTERM" && options.exitOnSigterm !== false) {
        setTimeout(() => this.emit("exit", 0), 0);
      }

      if (signal === "SIGKILL") {
        setTimeout(() => this.emit("exit", 0), 0);
      }

      return true;
    });

    if (options.emitErrorOnListener) {
      const originalOn = this.on.bind(this);
      this.on = ((
        event: string | symbol,
        listener: (...args: any[]) => void,
      ) => {
        const result = originalOn(event, listener);
        if (event === "error") {
          listener(new Error("spawn failed"));
        }
        return result;
      }) as typeof this.on;
    }
  }
}

const mocks = vi.hoisted(() => {
  const spawnMock = vi.fn();
  const mkdirMock = vi.fn();
  const writeFileMock = vi.fn();
  const readFileMock = vi.fn();
  const getPortMock = vi.fn();

  return {
    spawnMock,
    mkdirMock,
    writeFileMock,
    readFileMock,
    getPortMock,
  };
});

vi.mock("child_process", () => ({
  spawn: mocks.spawnMock,
}));

vi.mock("fs", () => ({
  promises: {
    mkdir: mocks.mkdirMock,
    writeFile: mocks.writeFileMock,
    readFile: mocks.readFileMock,
  },
}));

vi.mock("get-port", () => ({
  default: mocks.getPortMock,
}));

import { SlidevManager } from "../../src/server/services/SlidevManager";

describe("SlidevManager", () => {
  const storageDir = "/tmp/aislidev-slidev-manager";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    mocks.mkdirMock.mockResolvedValue(undefined);
    mocks.writeFileMock.mockResolvedValue(undefined);
    mocks.readFileMock.mockResolvedValue("export default {}");
    mocks.getPortMock.mockResolvedValue(13031);

    mocks.spawnMock.mockImplementation(
      () => new FakeChildProcess({ stdoutReady: "ready in 100ms" }) as any,
    );
  });

  it("starts presentation, writes files, and returns running process", async () => {
    const manager = new SlidevManager(storageDir);

    const processInfo = await manager.startPresentation("deck-1", "# Hello");

    expect(mocks.getPortMock).toHaveBeenCalledTimes(1);
    expect(mocks.mkdirMock).toHaveBeenCalledWith(
      path.join(storageDir, "deck-1"),
      { recursive: true },
    );
    expect(mocks.writeFileMock).toHaveBeenCalledWith(
      path.join(storageDir, "deck-1", "slides.md"),
      "# Hello",
      "utf-8",
    );
    expect(mocks.readFileMock).toHaveBeenCalledWith(
      expect.stringContaining("slidev-vite.config.ts"),
      "utf-8",
    );
    expect(mocks.writeFileMock).toHaveBeenCalledWith(
      path.join(storageDir, "deck-1", "vite.config.ts"),
      "export default {}",
      "utf-8",
    );

    expect(mocks.spawnMock).toHaveBeenCalledWith(
      "npx",
      ["@slidev/cli", "slides.md", "--port", "13031", "--remote", "--log", "info"],
      expect.objectContaining({
        cwd: path.join(storageDir, "deck-1"),
        detached: false,
      }),
    );

    expect(processInfo.presentationId).toBe("deck-1");
    expect(processInfo.port).toBe(13031);
    expect(processInfo.status).toBe("running");

    const status = manager.getProcess("deck-1");
    expect(status?.status).toBe("running");
  });

  it("reuses already running presentation process", async () => {
    const manager = new SlidevManager(storageDir);

    const first = await manager.startPresentation("deck-2", "# First");
    const second = await manager.startPresentation("deck-2", "# Second");

    expect(second.pid).toBe(first.pid);
    expect(mocks.spawnMock).toHaveBeenCalledTimes(1);
  });

  it("stops a running presentation via SIGTERM", async () => {
    const childProcess = new FakeChildProcess({
      stdoutReady: "localhost:13031",
      exitOnSigterm: true,
    });
    mocks.spawnMock.mockReturnValue(childProcess as any);

    const manager = new SlidevManager(storageDir);
    await manager.startPresentation("deck-3", "# Slide");

    await manager.stopPresentation("deck-3");

    expect(childProcess.kill).toHaveBeenCalledWith("SIGTERM");
    expect(manager.getProcess("deck-3")).toBeUndefined();
  });

  it("forces SIGKILL when process does not exit in time", async () => {
    vi.useFakeTimers();

    const childProcess = new FakeChildProcess({
      stdoutReady: "ready in 50ms",
      exitOnSigterm: false,
    });
    mocks.spawnMock.mockReturnValue(childProcess as any);

    const manager = new SlidevManager(storageDir);
    await manager.startPresentation("deck-4", "# Slide");

    const stopPromise = manager.stopPresentation("deck-4");
    await vi.advanceTimersByTimeAsync(5000);
    await stopPromise;

    expect(childProcess.kill).toHaveBeenNthCalledWith(1, "SIGTERM");
    expect(childProcess.kill).toHaveBeenNthCalledWith(2, "SIGKILL");
    expect(manager.getProcess("deck-4")).toBeUndefined();
  });

  it("reloads presentation content to slides.md", async () => {
    const manager = new SlidevManager(storageDir);

    await manager.reloadPresentation("deck-5", "# Updated");

    expect(mocks.writeFileMock).toHaveBeenCalledWith(
      path.join(storageDir, "deck-5", "slides.md"),
      "# Updated",
      "utf-8",
    );
  });

  it("throws when process startup enters error state", async () => {
    const childProcess = new FakeChildProcess({ emitErrorOnListener: true });
    mocks.spawnMock.mockReturnValue(childProcess as any);

    const manager = new SlidevManager(storageDir);

    await expect(
      manager.startPresentation("broken", "# Broken"),
    ).rejects.toThrow("Slidev process failed to start for broken");
  });
});
