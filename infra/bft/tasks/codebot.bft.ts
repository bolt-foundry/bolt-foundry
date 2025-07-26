#!/usr/bin/env -S bft run

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

interface CodebotArgs {
  shell?: boolean;
  exec?: string;
  help?: boolean;
  "force-rebuild"?: boolean;
  cleanup?: boolean;
}

async function codebot(args: Array<string>): Promise<number> {
  const logger = getLogger("codebot");

  const parsed = parseArgs(args, {
    boolean: ["shell", "help", "force-rebuild", "cleanup"],
    string: ["exec"],
    alias: { h: "help" },
  }) as CodebotArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft codebot [OPTIONS]

Run Claude Code in an isolated container environment.

By default, starts Claude Code CLI and preserves the workspace for debugging.

OPTIONS:
  --shell           Enter container shell for debugging
  --exec CMD        Execute command in container
  --cleanup         Remove workspace after completion (default: keep)
  --force-rebuild   Force rebuild container image before starting
  --help            Show this help message

EXAMPLES:
  bft codebot                 # Start Claude Code CLI (keeps workspace)
  bft codebot --cleanup       # Start Claude Code CLI and cleanup when done
  bft codebot --shell         # Open container shell (keeps workspace)
  bft codebot --exec "ls -la" # Run command and exit (keeps workspace)
`);
    return 0;
  }

  // Check for required Claude Code OAuth token
  const claudeToken = getConfigurationVariable("CLAUDE_CODE_OAUTH_TOKEN");
  if (!claudeToken) {
    ui.error("❌ CLAUDE_CODE_OAUTH_TOKEN environment variable is required");
    ui.output("Run 'claude setup-token' on the host to obtain the token");
    return 1;
  }

  // Create workspace ID and directory with existence checking
  let workspaceId = `workspace-${Date.now()}`;
  let workspacePath = `./tmp/codebot-workspaces/${workspaceId}`;

  // Ensure ./tmp/codebot-workspaces directory exists
  await Deno.mkdir("./tmp/codebot-workspaces", { recursive: true });

  // Check if workspace already exists and find a unique one
  let counter = 1;
  while (true) {
    try {
      await Deno.stat(workspacePath);
      // Directory exists, try with a suffix
      ui.output(
        "🔍 TRACE: Workspace already exists, indicating duplicate execution",
      );
      ui.output(new Error().stack || "No stack trace available");
      ui.output(
        `⚠️ Workspace ${workspaceId} already exists, trying ${workspaceId}-${counter}`,
      );
      workspaceId = `workspace-${Date.now()}-${counter}`;
      workspacePath = `./tmp/codebot-workspaces/${workspaceId}`;
      counter++;
      if (counter > 10) {
        ui.error("❌ Unable to find unique workspace name after 10 attempts");
        return 1;
      }
    } catch {
      // Directory doesn't exist, we can use this name
      break;
    }
  }

  ui.output(`📁 Creating workspace: ${workspaceId}`);

  // Create abort controller for cancelling operations
  const abortController = new AbortController();

  // Start workspace copying and container preparation in parallel
  const copyWorkspacePromise = (async () => {
    // Create the workspace directory first to avoid race conditions
    await Deno.mkdir(workspacePath, { recursive: true });

    // Copy Claude config files using CoW to workspace if they exist
    const homeDir = getConfigurationVariable("HOME");

    // Create tmp directory for Claude config
    await Deno.mkdir(`${workspacePath}/tmp`, { recursive: true });

    try {
      await Deno.stat(`${homeDir}/.claude.json`);
      const copyClaudeJson = new Deno.Command("cp", {
        args: [
          "--reflink=auto",
          `${homeDir}/.claude.json`,
          `${workspacePath}/tmp/claude.json`,
        ],
      });
      await copyClaudeJson.output();
      ui.output("📋 CoW copied .claude.json to workspace/tmp/claude.json");
    } catch {
      // File doesn't exist, skip
    }

    try {
      await Deno.stat(`${homeDir}/.claude`);
      const copyClaudeDir = new Deno.Command("cp", {
        args: [
          "--reflink=auto",
          "-R",
          `${homeDir}/.claude`,
          `${workspacePath}/tmp/claude`,
        ],
      });
      await copyClaudeDir.output();
      ui.output("📂 CoW copied .claude directory to workspace/tmp/claude");
    } catch {
      // Directory doesn't exist, skip
    }

    // Copy entire directory using CoW (copy-on-write) for instant copying
    // Use Deno native fs to list directory contents and parallel cp --reflink
    const copyPromises = [];

    for await (const entry of Deno.readDir(".")) {
      // Skip .bft and tmp directories entirely
      if (entry.name === ".bft" || entry.name === "tmp") continue;

      const copyCmd = new Deno.Command("cp", {
        args: ["--reflink=auto", "-R", entry.name, `${workspacePath}/`],
      });

      copyPromises.push(copyCmd.output());
    }

    // Run all copies in parallel
    const copyResults = await Promise.all(copyPromises);

    // Check if any copies failed
    for (const result of copyResults) {
      if (!result.success) {
        const errorText = new TextDecoder().decode(result.stderr);
        logger.info(
          "🔍 WORKSPACE COPY FAILURE STACK TRACE:",
          new Error().stack || "No stack trace available",
        );
        ui.output(
          "🔍 TRACE: Workspace copy failed, indicating duplicate execution",
        );
        abortController.abort(); // Cancel container build
        throw new Error(`💥 CRITICAL: Workspace copy failed - ${errorText}`);
      }
    }

    ui.output("📂 Workspace copy complete");
  })();

  // Container preparation (check if rebuild needed)
  const containerReadyPromise = (async () => {
    // Ensure container system is running
    try {
      const statusCmd = new Deno.Command("container", {
        args: ["system", "status"],
      });
      const statusResult = await statusCmd.output();

      if (!statusResult.success) {
        ui.output("🚀 Starting container system...");
        const startCmd = new Deno.Command("container", {
          args: ["system", "start"],
          stdout: "inherit",
          stderr: "inherit",
        });
        const startResult = await startCmd.output();

        if (!startResult.success) {
          throw new Error("Failed to start container system");
        }
        ui.output("✅ Container system started");
      }
    } catch {
      ui.output("🚀 Starting container system...");
      const startCmd = new Deno.Command("container", {
        args: ["system", "start"],
        stdout: "inherit",
        stderr: "inherit",
      });
      const startResult = await startCmd.output();

      if (!startResult.success) {
        throw new Error("Failed to start container system");
      }
      ui.output("✅ Container system started");
    }

    let needsRebuild = parsed["force-rebuild"];

    if (!needsRebuild) {
      // Check if image exists
      const inspectCmd = new Deno.Command("container", {
        args: ["images", "inspect", "codebot"],
      });
      const inspectResult = await inspectCmd.output();
      const inspectOutput = new TextDecoder().decode(inspectResult.stdout)
        .trim();

      if (!inspectResult.success || inspectOutput === "[]") {
        ui.output("📦 Container image not found");
        needsRebuild = true;
      } else {
        // Check if flake files have changed since image was built
        try {
          const imageData = JSON.parse(inspectOutput);
          // Get the creation time from the last build layer
          const lastHistoryEntry = imageData[0]?.variants?.[0]?.config?.history
            ?.slice(-1)[0];
          const imageCreatedStr = lastHistoryEntry?.created;

          if (imageCreatedStr) {
            const imageCreated = new Date(imageCreatedStr);

            // Check modification times of flake files and Dockerfile
            const flakeNixStat = await Deno.stat("flake.nix");
            const flakeLockStat = await Deno.stat("flake.lock");
            const dockerfileStat = await Deno.stat(
              "infra/apps/codebot/Dockerfile",
            );

            if (
              flakeNixStat.mtime && flakeNixStat.mtime > imageCreated ||
              flakeLockStat.mtime && flakeLockStat.mtime > imageCreated ||
              dockerfileStat.mtime && dockerfileStat.mtime > imageCreated
            ) {
              ui.output("🔄 Build files newer than container image");
              needsRebuild = true;
            }
          } else {
            ui.output("⚠️ Could not determine image creation time, rebuilding");
            needsRebuild = true;
          }
        } catch {
          ui.output("⚠️ Failed to parse image info, rebuilding");
          needsRebuild = true;
        }
      }
    }

    if (needsRebuild) {
      ui.output("🔨 Rebuilding container image...");
      const buildCmd = new Deno.Command("container", {
        args: [
          "build",
          "-f",
          "infra/apps/codebot/Dockerfile",
          "-t",
          "codebot",
          ".",
        ],
        stdout: "inherit",
        stderr: "inherit",
        signal: abortController.signal,
      }).spawn();

      const buildResult = await buildCmd.status;
      if (!buildResult.success) {
        abortController.abort(); // Cancel workspace copy if still running
        throw new Error("Failed to rebuild container");
      }
      ui.output("🔨 Container rebuild complete");
    } else {
      ui.output("📦 Container image up to date");
    }
  })();

  // Wait for both operations to complete
  try {
    ui.output(`⚡ Starting parallel workspace copy and container prep...`);
    await Promise.all([copyWorkspacePromise, containerReadyPromise]);
    ui.output(`✅ Workspace ready: ${workspaceId}`);
  } catch (error) {
    ui.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    // Clean up workspace on error
    try {
      await Deno.remove(workspacePath, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
    return 1;
  }

  const currentDir = Deno.cwd();

  if (parsed.shell) {
    const child = new Deno.Command("container", {
      args: [
        "run",
        "--rm",
        "-it",
        "-e",
        `CLAUDE_CODE_OAUTH_TOKEN=${claudeToken}`,
        "--mount",
        `type=bind,source=${currentDir}/${workspacePath},target=/workspace`,
        "codebot",
      ],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    }).spawn();

    await child.status;

    // Cleanup workspace only if --cleanup flag is provided
    if (parsed.cleanup) {
      ui.output(`🧹 Cleaning up workspace: ${workspaceId}`);
      await Deno.remove(workspacePath, { recursive: true });
    } else {
      ui.output(`📁 Workspace preserved at: ${workspacePath}`);
    }
    return 0;
  }

  if (parsed.exec) {
    const child = new Deno.Command("container", {
      args: [
        "run",
        "--rm",
        "-e",
        `CLAUDE_CODE_OAUTH_TOKEN=${claudeToken}`,
        "--mount",
        `type=bind,source=${currentDir}/${workspacePath},target=/workspace`,
        "codebot",
        parsed.exec,
      ],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    }).spawn();

    const { success } = await child.status;

    // Cleanup workspace only if --cleanup flag is provided
    if (parsed.cleanup) {
      ui.output(`🧹 Cleaning up workspace: ${workspaceId}`);
      await Deno.remove(workspacePath, { recursive: true });
    } else {
      ui.output(`📁 Workspace preserved at: ${workspacePath}`);
    }
    return success ? 0 : 1;
  }

  // Default mode: Start Claude Code CLI
  ui.output("🤖 Starting Claude Code...");
  const child = new Deno.Command("container", {
    args: [
      "run",
      "--rm",
      "-it",
      "-e",
      `CLAUDE_CODE_OAUTH_TOKEN=${claudeToken}`,
      "--mount",
      `type=bind,source=${currentDir}/${workspacePath},target=/workspace`,
      "codebot",
      "-c",
      "claude; exec /bin/bash",
    ],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }).spawn();

  const { success } = await child.status;

  // Cleanup workspace only if --cleanup flag is provided
  if (parsed.cleanup) {
    ui.output(`🧹 Cleaning up workspace: ${workspaceId}`);
    await Deno.remove(workspacePath, { recursive: true });
  } else {
    ui.output(`📁 Workspace preserved at: ${workspacePath}`);
  }
  return success ? 0 : 1;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Run Claude Code in isolated container environment",
  aiSafe: true,
  fn: codebot,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await codebot(scriptArgs);
  Deno.exit(result);
}
