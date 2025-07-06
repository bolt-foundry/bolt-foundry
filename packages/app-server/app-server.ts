import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

export interface AppServerOptions {
  port?: number;
  isDev?: boolean;
  distPath?: string;
  viteDevServerUrl?: string;
  enableSpaFallback?: boolean;
}

export interface AppServerContext {
  port: number;
  isDev: boolean;
  distPath: string;
  viteDevServerUrl: string;
  enableSpaFallback: boolean;
}

export class AppServer {
  private context: AppServerContext;
  private server?: Deno.HttpServer;

  constructor(options: AppServerOptions = {}) {
    this.context = {
      port: options.port ?? 8000,
      isDev: options.isDev ?? false,
      distPath: options.distPath ?? "./dist",
      viteDevServerUrl: options.viteDevServerUrl ?? "http://localhost:5173",
      enableSpaFallback: options.enableSpaFallback ?? true,
    };
  }

  start(): void {
    const handler = this.createRequestHandler();

    this.server = Deno.serve({
      port: this.context.port,
      handler,
    });

    const mode = this.context.isDev ? "development" : "production";
    logger.info(`Server running on port ${this.context.port} in ${mode} mode`);
  }

  async stop(): Promise<void> {
    if (this.server) {
      await this.server.shutdown();
      logger.info("Server stopped");
    }
  }

  private createRequestHandler(): (request: Request) => Promise<Response> {
    return async (request: Request): Promise<Response> => {
      const url = new URL(request.url);

      // Health check endpoint
      if (url.pathname === "/health") {
        return new Response("OK", { status: 200 });
      }

      // Development mode: proxy to Vite dev server
      if (this.context.isDev) {
        return await this.handleDevRequest(request);
      }

      // Production mode: serve static files
      return await this.handleProdRequest(request);
    };
  }

  private async handleDevRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const viteUrl = new URL(
      url.pathname + url.search,
      this.context.viteDevServerUrl,
    );

    try {
      // Forward the request to Vite dev server
      const response = await fetch(viteUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch (error) {
      logger.error("Error proxying to Vite dev server:", error);
      return new Response("Dev server unavailable", { status: 503 });
    }
  }

  private async handleProdRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let filePath = url.pathname;

    // Remove leading slash and handle root
    if (filePath === "/") {
      filePath = "/index.html";
    }

    // Construct file path - in compiled binaries, use the distPath directly
    const resolvedPath = `${this.context.distPath}${filePath}`;

    try {
      // Try to serve the requested file - if Deno.open succeeds, file exists
      const file = await Deno.open(resolvedPath, { read: true });

      const headers = new Headers();
      const contentType = this.getContentType(filePath);
      if (contentType) {
        headers.set("Content-Type", contentType);
      }

      return new Response(file.readable, {
        status: 200,
        headers,
      });
    } catch (error) {
      // File not found or other error
      if (error instanceof Deno.errors.NotFound) {
        // SPA fallback: serve index.html for client-side routing
        if (this.context.enableSpaFallback && !filePath.includes(".")) {
          return await this.serveSpaFallback();
        }
      }

      logger.error("Error serving file:", error);
    }

    return new Response("Not Found", { status: 404 });
  }

  private async serveSpaFallback(): Promise<Response> {
    const indexPath =
      new URL("./index.html", `file://${this.context.distPath}/`).pathname;

    try {
      const file = await Deno.open(indexPath, { read: true });
      return new Response(file.readable, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      logger.error("Error serving SPA fallback:", error);
      return new Response("Not Found", { status: 404 });
    }
  }

  private getContentType(filePath: string): string | null {
    const ext = filePath.split(".").pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      "html": "text/html",
      "css": "text/css",
      "js": "application/javascript",
      "json": "application/json",
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "gif": "image/gif",
      "svg": "image/svg+xml",
      "ico": "image/x-icon",
      "woff": "font/woff",
      "woff2": "font/woff2",
      "ttf": "font/ttf",
      "eot": "font/eot",
    };

    return mimeTypes[ext || ""] || null;
  }
}

export function createAppServer(options?: AppServerOptions): AppServer {
  return new AppServer(options);
}
