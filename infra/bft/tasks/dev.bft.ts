#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";

const _logger = getLogger(import.meta);

async function dev(args: Array<string>): Promise<number> {
  // Check for global help flag
  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    ui.output(`Usage: bft dev <app-name> [OPTIONS]

Launch web applications in development mode

Available apps:
  boltfoundry-com    Bolt Foundry landing page

Examples:
  bft dev boltfoundry-com           # Run boltfoundry-com in development mode
  bft dev boltfoundry-com --help    # Show app-specific help`);
    return 0;
  }

  if (args.length === 0) {
    ui.error("Usage: bft dev <app-name> [OPTIONS]");
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  const appName = args[0];
  const devArgs = args.slice(1);

  if (appName !== "boltfoundry-com") {
    ui.error(`Unknown app: ${appName}`);
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  // Handle boltfoundry.com app in development mode
  const flags = parseArgs(devArgs, {
    boolean: ["build", "no-open", "help"],
    string: ["port"],
    default: {
      port: "8000",
    },
  });

  if (flags.help) {
    ui.output(`Usage: bft dev boltfoundry-com [OPTIONS]

Launch the Bolt Foundry landing page in development mode

Options:
  --build            Build assets without starting server
  --port             Specify server port (default: 8000)
  --no-open          Don't auto-open browser on startup
  --help             Show this help message

Examples:
  bft dev boltfoundry-com                   # Run in development mode
  bft dev boltfoundry-com --build           # Build assets only
  bft dev boltfoundry-com --port 4000       # Run on port 4000`);
    return 0;
  }

  const port = parseInt(flags.port);
  if (isNaN(port)) {
    ui.error(`Invalid port: ${flags.port}`);
    return 1;
  }

  const appPath =
    new URL(import.meta.resolve("../../../apps/boltfoundry-com")).pathname;

  if (flags.build) {
    ui.output("Building boltfoundry-com assets...");

    // Run vite build
    const buildCommand = new Deno.Command("deno", {
      args: ["run", "-A", "--node-modules-dir", "npm:vite", "build"],
      cwd: appPath,
      stdout: "inherit",
      stderr: "inherit",
    });

    const buildProcess = buildCommand.outputSync();

    if (!buildProcess.success) {
      ui.error("Build failed");
      return 1;
    }

    ui.output("Build completed successfully");
    return 0;
  }

  // Start Vite dev server (always in development mode)
  const vitePort = 8080; // Fixed Vite port

  ui.output(`Starting Vite dev server on port ${vitePort}...`);

  const viteCommand = new Deno.Command("deno", {
    args: [
      "run",
      "-A",
      "--node-modules-dir",
      "npm:vite",
      "--port",
      vitePort.toString(),
    ],
    cwd: appPath,
    stdout: "inherit",
    stderr: "inherit",
    env: {
      ...Deno.env.toObject(),
      VITE_HMR_PORT: "8081",
    },
  });

  const viteProcess = viteCommand.spawn();

  // Wait for Vite to be ready
  let viteReady = false;
  const maxRetries = 30;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${vitePort}`);
      await response.body?.cancel();
      if (response.ok) {
        viteReady = true;
        break;
      }
    } catch {
      // Vite not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (!viteReady) {
    ui.error("Vite dev server failed to start");
    viteProcess.kill();
    return 1;
  }

  ui.output("Vite dev server ready");

  // Start the backend server in development mode
  ui.output(`Starting boltfoundry-com server on http://localhost:${port}`);

  const serverArgs = [
    "run",
    "-A",
    "--watch",
    new URL(import.meta.resolve("../../../apps/boltfoundry-com/server.tsx"))
      .pathname,
    "--port",
    String(port),
    "--mode",
    "development",
    "--vite-port",
    String(vitePort),
  ];

  const serverCommand = new Deno.Command("deno", {
    args: serverArgs,
    stdout: "inherit",
    stderr: "inherit",
  });

  const serverProcess = serverCommand.spawn();

  // Open browser if not disabled
  if (!flags["no-open"]) {
    // Give the server a moment to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const openCommand = new Deno.Command(
        Deno.build.os === "darwin"
          ? "open"
          : Deno.build.os === "windows"
          ? "start"
          : "xdg-open",
        {
          args: [`http://localhost:${port}`],
          stdout: "null",
          stderr: "null",
        },
      );
      openCommand.outputSync();
    } catch {
      // Ignore errors opening browser
    }
  }

  // Handle cleanup on exit
  const cleanup = () => {
    viteProcess.kill();
    serverProcess.kill();
  };

  // Handle various exit signals
  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);
  globalThis.addEventListener("beforeunload", cleanup);

  // Wait for server process to exit
  const serverResult = await serverProcess.status;

  // Clean up Vite process
  viteProcess.kill();

  return serverResult.success ? 0 : 1;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Launch web applications in development mode",
  aiSafe: true,
  fn: dev,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await dev(scriptArgs));
}
