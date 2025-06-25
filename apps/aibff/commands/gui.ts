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
  --help       Show this help message`);
      return;
    }

    const port = parseInt(flags.port);
    if (isNaN(port)) {
      logger.printErr(`Invalid port: ${flags.port}`);
      Deno.exit(1);
    }

    if (flags.build) {
      logger.println("Building GUI assets...");

      // Change to GUI directory
      const guiPath = new URL("../gui", import.meta.url).pathname;

      // Run vite build
      const buildCommand = new Deno.Command("deno", {
        args: ["run", "-A", "--node-modules-dir", "npm:vite", "build"],
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
    const vitePort = 5173; // Default Vite port

    if (flags.dev) {
      logger.println("Starting Vite dev server...");

      const guiPath = new URL("../gui", import.meta.url).pathname;
      const viteCommand = new Deno.Command("deno", {
        args: ["run", "-A", "--node-modules-dir", "npm:vite", "--port", vitePort.toString()],
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

    const handler = async (request: Request): Promise<Response> => {
      const url = new URL(request.url);

      if (url.pathname === "/health") {
        return new Response("OK", { status: 200 });
      }

      // Handle GraphQL endpoint
      if (url.pathname === "/graphql") {
        return await graphQLServer.handle(request);
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

      return new Response("Not Found", { status: 404 });
    };

    const server = Deno.serve({ port }, handler);

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
