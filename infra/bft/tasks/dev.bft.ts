#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";

const _logger = getLogger(import.meta);

async function dev(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft dev <app-name> [OPTIONS]");
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  const appName = args[0];
  const appArgs = args.slice(1);

  if (appName !== "boltfoundry-com") {
    ui.error(`Unknown app: ${appName}`);
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  // Handle boltfoundry.com app
  const flags = parseArgs(appArgs, {
    boolean: ["no-open", "help"],
    string: ["port"],
    default: {
      port: "8000",
    },
  });

  if (flags.help) {
    ui.output(`Usage: bft dev boltfoundry-com [OPTIONS]

Launch the Bolt Foundry landing page in development mode

Options:
  --port             Specify server port (default: 8000)
  --no-open          Don't auto-open browser on startup
  --help             Show this help message

Examples:
  bft dev boltfoundry-com                   # Run in development mode
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

  // Clean build directory in dev mode
  try {
    await Deno.remove(`${appPath}/static/build`, { recursive: true });
    ui.output("Cleaned build directory for dev mode");
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      ui.warn("Failed to clean build directory:", error.message);
    }
  }

  // Start isograph watcher
  ui.output("Starting isograph watcher...");

  const isoCommand = new Deno.Command("deno", {
    args: [
      "run",
      "-A",
      new URL(import.meta.resolve("../../../infra/bft/bft.ts")).pathname,
      "iso",
      "--watch",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const isoProcess = isoCommand.spawn();

  // Use a port offset from the main port for Vite (e.g., 8000 -> 8080)
  const vitePort = port + 80;

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
      VITE_HMR_PORT: (vitePort + 1).toString(),
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

  // Start the backend server
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
    isoProcess.kill();
    viteProcess.kill();
    serverProcess.kill();
  };

  // Handle various exit signals
  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);
  globalThis.addEventListener("beforeunload", cleanup);

  // Wait for server process to exit
  const serverResult = await serverProcess.status;

  // Clean up processes
  isoProcess.kill();
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
