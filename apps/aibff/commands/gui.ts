#!/usr/bin/env -S deno run --allow-all

import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";
import type { Command } from "./types.ts";

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
      throw new Error(`Invalid port: ${flags.port}`);
    }

    // Continue with foreground execution

    if (flags.build) {
      logger.println("Building GUI assets...");

      // Change to GUI directory
      const guiPath = new URL(import.meta.resolve("../gui")).pathname;

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
        throw new Error("Build failed");
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
        args: [
          "run",
          "-A",
          "--node-modules-dir",
          "npm:vite",
          "--port",
          vitePort.toString(),
        ],
        cwd: guiPath,
        stdout: "inherit",
        stderr: "inherit",
        env: {
          ...Deno.env.toObject(),
          VITE_HMR_PORT: (vitePort + 1).toString(),
        },
      });

      viteProcess = viteCommand.spawn();

      // Wait a bit for Vite to start
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Start the GUI server subprocess
    logger.println(`Starting aibff GUI server on port ${port}...`);

    const guiServerPath =
      new URL(import.meta.resolve("../gui/guiServer.ts")).pathname;
    const serverArgs = [
      "--port",
      port.toString(),
      "--mode",
      flags.dev ? "development" : "production",
    ];

    // In dev mode, also pass the vite port for proxying
    if (flags.dev) {
      serverArgs.push("--vite-port", vitePort.toString());
    }

    const serverCommand = new Deno.Command(guiServerPath, {
      args: serverArgs,
      stdout: "inherit",
      stderr: "inherit",
    });

    const serverProcess = serverCommand.spawn();

    // Set up graceful shutdown handler
    const shutdown = async () => {
      logger.println("\nShutting down gracefully...");

      // Clean up server process
      try {
        serverProcess.kill();
        await serverProcess.status;
      } catch {
        // Process may have already exited
      }

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
      return;
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
      // Wait for server process to finish
      await serverProcess.status;
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
