#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface CodebotArgs {
  shell?: boolean;
  exec?: string;
  rebuild?: boolean;
  help?: boolean;
}

async function codebot(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["shell", "help", "rebuild"],
    string: ["exec"],
    alias: { h: "help" },
  }) as CodebotArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft codebot [OPTIONS]

OPTIONS:
  --shell       Build and enter a basic NixOS container shell
  --exec CMD    Execute a command in the container without interactive shell
  --rebuild     Force rebuild of container image
  --help        Show this help message
`);
    return 0;
  }

  if (parsed.shell) {
    await buildBasicContainer(true, undefined, parsed.rebuild);
    return 0;
  }

  if (parsed.exec) {
    await buildBasicContainer(false, parsed.exec, parsed.rebuild);
    return 0;
  }

  ui.output("Use --help for usage information");
  return 0;
}

async function buildBasicContainer(
  interactive: boolean = false,
  execCommand?: string,
  forceRebuild: boolean = false,
) {
  const imageName = "codebot-nixos";

  // Check if image exists unless forcing rebuild
  if (!forceRebuild) {
    ui.output("🔍 Checking if container image exists...");
    const checkCmd = new Deno.Command("container", {
      args: ["images", "ls"],
    });

    const checkResult = await checkCmd.output();
    const imageList = new TextDecoder().decode(checkResult.stdout).trim();

    if (imageList.includes(imageName) && imageList.includes("latest")) {
      ui.output("✅ Using existing container image");
    } else {
      ui.output("🚀 Building local NixOS image...");
      await buildImage(imageName);
    }
  } else {
    ui.output("🚀 Rebuilding local NixOS image...");
    await buildImage(imageName);
  }

  // Now run the container
  if (interactive) {
    ui.output("✅ Starting container shell...");

    // Run interactive container shell using our local image
    const runCmd = new Deno.Command("container", {
      args: [
        "run",
        "--rm",
        "-it",
        `${imageName}:latest`,
        "sh",
        "-c",
        `echo "🎉 Basic NixOS shell ready! Use 'nix develop .#everything --command bash' for full environment. Type 'exit' to return." && sh`,
      ],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });

    const result = await runCmd.spawn();
    const status = await result.status;

    if (!status.success) {
      ui.error("❌ Container failed");
      Deno.exit(1);
    }

    ui.output("✅ Container session ended");
  } else if (execCommand) {
    ui.output(`✅ Executing: ${execCommand}`);

    // Run command in container without interactive mode using nix wrapper
    const runCmd = new Deno.Command("container", {
      args: [
        "run",
        "--rm",
        `${imageName}:latest`,
        "with-nix",
        "bash",
        "-c",
        execCommand,
      ],
    });

    const result = await runCmd.output();

    if (!result.success) {
      ui.error("❌ Command failed");
      ui.error(new TextDecoder().decode(result.stderr));
      Deno.exit(1);
    }

    ui.output(new TextDecoder().decode(result.stdout));
    ui.output("✅ Command completed");
  }
}

async function buildImage(imageName: string) {
  const buildImageCmd = new Deno.Command("container", {
    args: [
      "build",
      "-t",
      imageName,
      "-f",
      "infra/apps/codebot/Dockerfile",
      ".",
    ],
  });

  const buildResult = await buildImageCmd.output();
  if (!buildResult.success) {
    ui.error("❌ Failed to build container image");
    ui.error(new TextDecoder().decode(buildResult.stderr));
    Deno.exit(1);
  }
  ui.output("✅ Image build complete");
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Build and run basic NixOS containers for development",
  aiSafe: true,
  fn: codebot,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await codebot(scriptArgs);
  Deno.exit(result);
}
