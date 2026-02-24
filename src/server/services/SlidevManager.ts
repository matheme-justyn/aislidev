import { spawn, ChildProcess } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import getPort from "get-port";
import type { SlidevProcess, SlidevConfig } from "../types/slidev";

export class SlidevManager {
  private processes: Map<string, SlidevProcess & { process: ChildProcess }> =
    new Map();
  private storageDir: string;

  constructor(storageDir: string) {
    this.storageDir = storageDir;
  }

  async startPresentation(
    presentationId: string,
    content: string,
    config: SlidevConfig = {},
  ): Promise<SlidevProcess> {
    const existingProcess = this.processes.get(presentationId);
    if (existingProcess && existingProcess.status === "running") {
      return existingProcess;
    }

    const presentationDir = path.join(this.storageDir, presentationId);
    await fs.mkdir(presentationDir, { recursive: true });

    const slidesPath = path.join(presentationDir, "slides.md");
    await fs.writeFile(slidesPath, content, "utf-8");

    const port = config.port || (await getPort({ port: [13030, 13031, 13032, 13033, 13034, 13035, 13036, 13037, 13038, 13039, 13040] }));

    const slidevProcess = spawn(
      "npx",
      ["slidev", slidesPath, "--port", port.toString()],
      {
        cwd: presentationDir,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const processInfo: SlidevProcess & { process: ChildProcess } = {
      id: presentationId,
      port,
      pid: slidevProcess.pid!,
      status: "starting",
      presentationId,
      process: slidevProcess,
    };

    this.processes.set(presentationId, processInfo);

    slidevProcess.stdout?.on("data", (data) => {
      const output = data.toString();
      if (output.includes("ready in") || output.includes("Local:")) {
        processInfo.status = "running";
      }
    });

    slidevProcess.on("error", (error) => {
      console.error(`Slidev process error for ${presentationId}:`, error);
      processInfo.status = "error";
    });

    slidevProcess.on("exit", (code) => {
      console.log(
        `Slidev process exited for ${presentationId} with code ${code}`,
      );
      processInfo.status = "stopped";
      this.processes.delete(presentationId);
    });

    await this.waitForReady(presentationId, 10000);

    return processInfo;
  }

  async stopPresentation(presentationId: string): Promise<void> {
    const processInfo = this.processes.get(presentationId);
    if (!processInfo) {
      throw new Error(
        `No running presentation found with ID: ${presentationId}`,
      );
    }

    processInfo.process.kill("SIGTERM");

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        processInfo.process.kill("SIGKILL");
        resolve();
      }, 5000);

      processInfo.process.once("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    this.processes.delete(presentationId);
  }

  async reloadPresentation(
    presentationId: string,
    content: string,
  ): Promise<void> {
    const presentationDir = path.join(this.storageDir, presentationId);
    const slidesPath = path.join(presentationDir, "slides.md");

    await fs.writeFile(slidesPath, content, "utf-8");
  }

  getProcess(presentationId: string): SlidevProcess | undefined {
    const processInfo = this.processes.get(presentationId);
    if (!processInfo) return undefined;

    return {
      id: processInfo.id,
      port: processInfo.port,
      pid: processInfo.pid,
      status: processInfo.status,
      presentationId: processInfo.presentationId,
    };
  }

  getAllProcesses(): SlidevProcess[] {
    return Array.from(this.processes.values()).map((p) => ({
      id: p.id,
      port: p.port,
      pid: p.pid,
      status: p.status,
      presentationId: p.presentationId,
    }));
  }

  async cleanup(): Promise<void> {
    const stopPromises = Array.from(this.processes.keys()).map((id) =>
      this.stopPresentation(id),
    );
    await Promise.all(stopPromises);
  }

  private async waitForReady(
    presentationId: string,
    timeout: number,
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const processInfo = this.processes.get(presentationId);
      if (processInfo?.status === "running") {
        return;
      }
      if (processInfo?.status === "error") {
        throw new Error(`Slidev process failed to start for ${presentationId}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(
      `Slidev process did not become ready within ${timeout}ms for ${presentationId}`,
    );
  }
}
