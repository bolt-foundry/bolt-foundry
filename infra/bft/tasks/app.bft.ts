#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";

const _logger = getLogger(import.meta);

async function app(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft app <app-name> [OPTIONS]");
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
    boolean: ["dev", "build", "no-open", "help"],
    string: ["port"],
    default: {
      port: "3000",
    },
  });

  if (flags.help) {
    ui.output(`Usage: bft app boltfoundry-com [OPTIONS]

Launch the Bolt Foundry landing page

Options:
  --dev              Run in development mode with Vite HMR
  --build            Build assets without starting server
  --port             Specify server port (default: 3000)
  --no-open          Don't auto-open browser on startup
  --help             Show this help message

Examples:
  bft app boltfoundry-com                   # Run production server
  bft app boltfoundry-com --dev             # Run in development mode
  bft app boltfoundry-com --build           # Build assets only
  bft app boltfoundry-com --port 4000       # Run on port 4000`);
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

  // Start Vite dev server if in dev mode
  let viteProcess: Deno.ChildProcess | undefined;
  let vitePort: number | undefined;

  if (flags.dev) {
    // Use a port offset from the main port for Vite (e.g., 3000 -> 5000)
    vitePort = port + 2000;

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

    viteProcess = viteCommand.spawn();

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
  }

  // Start the backend server
  ui.output(`Starting boltfoundry-com server on http://localhost:${port}`);

  const serverArgs = [
    "run",
    "-A",
    "--watch",
    new URL(import.meta.resolve("../../../apps/boltfoundry-com/server.ts"))
      .pathname,
    `--port=${port}`,
  ];

  if (flags.dev) {
    serverArgs.push("--dev");
  }

  const serverCommand = new Deno.Command("deno", {
    args: serverArgs,
    stdout: "inherit",
    stderr: "inherit",
  });

  const serverProcess = serverCommand.spawn();

  // Open browser if not disabled
  if (!flags["no-open"] && !flags.dev) {
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
    if (viteProcess) {
      viteProcess.kill();
    }
    serverProcess.kill();
  };

  // Handle various exit signals
  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);
  globalThis.addEventListener("beforeunload", cleanup);

  // Wait for server process to exit
  const serverResult = await serverProcess.status;

  // Clean up Vite process
  if (viteProcess) {
    viteProcess.kill();
  }

  return serverResult.success ? 0 : 1;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Launch web applications",
  aiSafe: true,
  fn: app,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await app(scriptArgs));
}
