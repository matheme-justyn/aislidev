export interface SlidevProcess {
  id: string;
  port: number;
  pid: number;
  status: "starting" | "running" | "stopped" | "error";
  presentationId: string;
}

export interface SlidevConfig {
  theme?: string;
  port?: number;
  open?: boolean;
}
