import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";
import type { Command } from "./types.ts";
import { createGraphQLServer } from "./graphql-schema.ts";

const logger = getLogger(import.meta);

export const guiCommand: Command = {
  name: "gui",
  description: "Launch the aibff GUI web interface",
  run: async (args: Array<string>) => {
    const flags = parseArgs(args, {
      boolean: ["dev", "build", "no-open", "help"],
      string: ["port"],
      default: {
        port: "3000",
      },
    });

    if (flags.help) {
      logger.println(`Usage: aibff gui [OPTIONS]

Launch the aibff GUI web interface

Options:
  --dev        Run in development mode with Vite HMR
  --build      Build GUI assets without starting server
  --port       Specify server port (default: 3000)
  --no-open    Don't auto-open browser on startup
  --help       Show this help message

Examples:
  aibff gui                    # Run GUI server
  aibff gui --port 4000        # Run on port 4000
  aibff gui --dev              # Run in development mode`);
      return;
    }

    // Note: Background mode is not supported until Deno adds detached process support
    // See: https://github.com/denoland/deno/issues/5501

    const port = parseInt(flags.port);
    if (isNaN(port)) {
      logger.printErr(`Invalid port: ${flags.port}`);
      Deno.exit(1);
    }

    // Continue with foreground execution

    if (flags.build) {
      logger.println("Building GUI assets...");

      // Change to GUI directory
      const guiPath = new URL(import.meta.resolve("../gui")).pathname;

      // Run vite build
      const buildCommand = new Deno.Command("deno", {
        args: ["run", "-A", "npm:vite", "build"],
        cwd: guiPath,
        stdout: "inherit",
        stderr: "inherit",
      });

      const buildProcess = buildCommand.outputSync();

      if (!buildProcess.success) {
        logger.printErr("Build failed");
        Deno.exit(1);
      }

      logger.println("Build completed successfully");
      return;
    }

    // Start Vite dev server if in dev mode
    let viteProcess: Deno.ChildProcess | undefined;
    // Use a port offset from the main port for Vite (e.g., 3000 -> 5000, 3001 -> 5001)
    const vitePort = port + 2000;

    if (flags.dev) {
      logger.println(`Starting Vite dev server on port ${vitePort}...`);

      const guiPath = new URL(import.meta.resolve("../gui")).pathname;
      const viteCommand = new Deno.Command("deno", {
        args: ["run", "-A", "npm:vite", "--port", vitePort.toString()],
        cwd: guiPath,
        stdout: "inherit",
        stderr: "inherit",
      });

      viteProcess = viteCommand.spawn();

      // Wait a bit for Vite to start
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Start the server
    logger.println(`Starting aibff GUI server on port ${port}...`);

    // Create GraphQL server
    const graphQLServer = createGraphQLServer(flags.dev);

    // Define routes using URLPattern
    const routes = [
      {
        pattern: new URLPattern({ pathname: "/health" }),
        handler: () => new Response("OK", { status: 200 }),
      },
      {
        pattern: new URLPattern({ pathname: "/graphql" }),
        handler: (request: Request) => graphQLServer.handle(request),
      },
      {
        pattern: new URLPattern({ pathname: "/api/stream" }),
        handler: () => {
          // SSE endpoint for streaming AI responses
          const body = new ReadableStream({
            start(controller) {
              // Send initial connection message
              controller.enqueue(
                new TextEncoder().encode(
                  `: Connected to aibff GUI SSE endpoint\n\n`,
                ),
              );

              // Keep connection alive with periodic comments
              const keepAlive = setInterval(() => {
                try {
                  controller.enqueue(
                    new TextEncoder().encode(`: keepalive\n\n`),
                  );
                } catch {
                  // Stream closed, cleanup
                  clearInterval(keepAlive);
                }
              }, 30000);
            },
          });

          return new Response(body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "Connection": "keep-alive",
            },
          });
        },
      },
    ];

    const handler = async (request: Request): Promise<Response> => {
      const url = new URL(request.url);

      // Try to match against defined routes
      for (const route of routes) {
        if (route.pattern.test(url)) {
          return await route.handler(request);
        }
      }

      // In dev mode, proxy all other requests to Vite
      if (flags.dev) {
        try {
          const viteUrl =
            `http://localhost:${vitePort}${url.pathname}${url.search}`;
          const viteResponse = await fetch(viteUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
          });

          // Create new headers to avoid immutable headers issue
          const headers = new Headers();
          viteResponse.headers.forEach((value, key) => {
            // Skip hop-by-hop headers
            if (
              !["connection", "keep-alive", "transfer-encoding"].includes(
                key.toLowerCase(),
              )
            ) {
              headers.set(key, value);
            }
          });

          return new Response(viteResponse.body, {
            status: viteResponse.status,
            statusText: viteResponse.statusText,
            headers,
          });
        } catch (error) {
          logger.error("Error proxying to Vite:", error);
          return new Response("Error proxying to Vite dev server", {
            status: 502,
          });
        }
      }

      // In production mode, serve static assets
      if (!flags.dev) {
        const distPath = new URL(import.meta.resolve("../gui/dist")).pathname;

        // API routes should return 404 if not found
        if (url.pathname.startsWith("/api/")) {
          return new Response("Not Found", { status: 404 });
        }

        // Default to index.html for root
        let filePath = url.pathname;
        if (filePath === "/") {
          filePath = "/index.html";
        }

        const fullPath = `${distPath}${filePath}`;

        try {
          const file = await Deno.open(fullPath);
          const stat = await file.stat();

          // Determine content type
          let contentType = "application/octet-stream";
          if (filePath.endsWith(".html")) contentType = "text/html";
          else if (filePath.endsWith(".js")) {
            contentType = "application/javascript";
          } else if (filePath.endsWith(".css")) contentType = "text/css";
          else if (filePath.endsWith(".json")) contentType = "application/json";

          return new Response(file.readable, {
            headers: {
              "Content-Type": contentType,
              "Content-Length": stat.size.toString(),
            },
          });
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            // For client-side routes (not starting with /api/ or containing a file extension)
            if (
              !url.pathname.includes(".") && !url.pathname.startsWith("/api/")
            ) {
              try {
                const indexPath = `${distPath}/index.html`;
                const file = await Deno.open(indexPath);
                return new Response(file.readable, {
                  headers: { "Content-Type": "text/html" },
                });
              } catch {
                // Fall through to 404
              }
            }
          }
        }
      }

      return new Response("Not Found", { status: 404 });
    };

    const server = Deno.serve({ port }, handler);

    // Set up graceful shutdown handler
    const shutdown = async () => {
      logger.println("\nShutting down gracefully...");

      // Clean up Vite process if it was started
      if (viteProcess) {
        try {
          viteProcess.kill();
          await viteProcess.status;
        } catch {
          // Process may have already exited
        }
      }

      // Exit cleanly
      Deno.exit(0);
    };

    // Handle SIGTERM and SIGINT for graceful shutdown
    Deno.addSignalListener("SIGTERM", shutdown);
    Deno.addSignalListener("SIGINT", shutdown);

    // Open browser unless --no-open flag is set
    if (!flags["no-open"]) {
      const url = `http://localhost:${port}`;
      logger.println(`Opening ${url} in browser...`);
      // Browser opening will be implemented later
    }

    logger.println(`Server running at http://localhost:${port}`);
    if (flags.dev) {
      logger.println(
        `Proxying to Vite dev server at http://localhost:${vitePort}`,
      );
    }
    logger.println("Press Ctrl+C to stop");

    try {
      await server.finished;
    } finally {
      // Clean up Vite process if it was started
      if (viteProcess) {
        try {
          viteProcess.kill();
          await viteProcess.status;
        } catch {
          // Process may have already exited
        }
      }
    }
  },
};
