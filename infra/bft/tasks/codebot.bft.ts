#!/usr/bin/env -S bft run

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface CodebotArgs {
  shell?: boolean;
  exec?: string;
  help?: boolean;
  "force-rebuild"?: boolean;
}

async function codebot(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["shell", "help", "force-rebuild"],
    string: ["exec"],
    alias: { h: "help" },
  }) as CodebotArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft codebot [OPTIONS]

OPTIONS:
  --shell           Enter container shell
  --exec CMD        Execute command in container
  --force-rebuild   Force rebuild container image before starting
  --help            Show this help message
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

  // Create workspace ID and directory
  const workspaceId = `workspace-${Date.now()}`;
  const workspacePath = `.bft/container/workspaces/${workspaceId}`;
  
  // Ensure .bft/container/workspaces directory exists
  await Deno.mkdir(".bft/container/workspaces", { recursive: true });
  
  ui.output(`📁 Creating workspace: ${workspaceId}`);
  
  // Create abort controller for cancelling operations
  const abortController = new AbortController();
  
  // Start workspace copying and container preparation in parallel
  const copyWorkspacePromise = (async () => {
    // Copy entire directory using CoW (copy-on-write) for instant copying
    // Use Deno native fs to list directory contents and parallel cp --reflink
    const copyPromises = [];
    
    for await (const entry of Deno.readDir(".")) {
      // Skip .bft directory entirely
      if (entry.name === ".bft") continue;
      
      const copyCmd = new Deno.Command("cp", {
        args: ["--reflink=auto", "-R", entry.name, workspacePath],
      });
      
      copyPromises.push(copyCmd.output());
    }
    
    // Run all copies in parallel
    const copyResults = await Promise.all(copyPromises);
    
    // Check if any copies failed
    for (const result of copyResults) {
      if (!result.success) {
        const errorText = new TextDecoder().decode(result.stderr);
        abortController.abort(); // Cancel container build
        throw new Error(`💥 CRITICAL: Workspace copy failed - ${errorText}`);
      }
    }
    
    ui.output("📂 Workspace copy complete");
  })();
  
  // Container preparation (check if rebuild needed)
  const containerReadyPromise = (async () => {
    let needsRebuild = parsed["force-rebuild"];
    
    if (!needsRebuild) {
      // Check if image exists
      const inspectCmd = new Deno.Command("container", {
        args: ["inspect", "codebot"],
      });
      const inspectResult = await inspectCmd.output();
      const inspectOutput = new TextDecoder().decode(inspectResult.stdout).trim();
      
      if (!inspectResult.success || inspectOutput === "[]") {
        ui.output("📦 Container image not found");
        needsRebuild = true;
      } else {
        // Check if flake files have changed since image was built
        const imageCreatedCmd = new Deno.Command("container", {
          args: ["inspect", "codebot", "--format", "{{.Created}}"],
        });
        const imageResult = await imageCreatedCmd.output();
        if (imageResult.success) {
          const imageCreated = new Date(new TextDecoder().decode(imageResult.stdout).trim());
          
          // Check modification times of flake files
          const flakeNixStat = await Deno.stat("flake.nix");
          const flakeLockStat = await Deno.stat("flake.lock");
          
          if (flakeNixStat.mtime && flakeNixStat.mtime > imageCreated ||
              flakeLockStat.mtime && flakeLockStat.mtime > imageCreated) {
            ui.output("🔄 Flake files newer than container image");
            needsRebuild = true;
          }
        }
      }
    }
    
    if (needsRebuild) {
      ui.output("🔨 Rebuilding container image...");
      const buildCmd = new Deno.Command("container", {
        args: ["build", "-f", "infra/apps/codebot/Dockerfile", "-t", "codebot", "."],
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
        "run", "--rm", "-it", 
        "-e", `CLAUDE_CODE_OAUTH_TOKEN=${claudeToken}`,
        "-v", `${currentDir}/${workspacePath}:/workspace:rw`,
        "codebot"
      ],
      stdin: "inherit",
      stdout: "inherit", 
      stderr: "inherit",
    }).spawn();
    
    await child.status;
    
    // Cleanup workspace
    ui.output(`🧹 Cleaning up workspace: ${workspaceId}`);
    await Deno.remove(workspacePath, { recursive: true });
    return 0;
  }

  if (parsed.exec) {
    const child = new Deno.Command("container", {
      args: [
        "run", "--rm", 
        "-e", `CLAUDE_CODE_OAUTH_TOKEN=${claudeToken}`,
        "-v", `${currentDir}/${workspacePath}:/workspace:rw`,
        "codebot", parsed.exec
      ],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit", 
    }).spawn();
    
    const { success } = await child.status;
    
    // Cleanup workspace
    ui.output(`🧹 Cleaning up workspace: ${workspaceId}`);
    await Deno.remove(workspacePath, { recursive: true });
    return success ? 0 : 1;
  }

  ui.output("Use --help for usage information");
  return 0;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Run container commands",
  aiSafe: true,
  fn: codebot,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await codebot(scriptArgs);
  Deno.exit(result);
}
