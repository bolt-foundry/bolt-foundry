#!/usr/bin/env -S bff

import { join } from "@std/path";
import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";

const logger = getLogger(import.meta);

export async function aibffBuildCommand(args: Array<string>): Promise<number> {
  const buildScript = join(
    import.meta.dirname!,
    "../../../apps/aibff/bin/build.ts",
  );

  // Default to building for current platform
  const buildArgs = ["run", "--allow-all", buildScript, ...args];

  logger.info("Building aibff binary...");

  const exitCode = await runShellCommand(
    ["deno", ...buildArgs],
    join(import.meta.dirname!, "../../.."),
  );

  if (exitCode === 0) {
    logger.info("✅ aibff build completed successfully");
  } else {
    logger.error("❌ aibff build failed");
  }

  return exitCode;
}

export async function aibffBuildAllCommand(
  args: Array<string>,
): Promise<number> {
  logger.info("Building aibff for all supported platforms...");

  const platforms = [
    { platform: "darwin", arch: "aarch64" },
    { platform: "linux", arch: "x86_64" },
  ];

  let failureCount = 0;

  for (const { platform, arch } of platforms) {
    logger.info(`\nBuilding for ${platform}-${arch}...`);

    const exitCode = await aibffBuildCommand([
      "--platform",
      platform,
      "--arch",
      arch,
      ...args,
    ]);

    if (exitCode !== 0) {
      failureCount++;
      logger.error(`Failed to build for ${platform}-${arch}`);
    }
  }

  if (failureCount === 0) {
    logger.info("\n✅ All platform builds completed successfully");
    return 0;
  } else {
    logger.error(
      `\n❌ ${failureCount} platform build(s) failed`,
    );
    return 1;
  }
}

register(
  "aibff:build",
  "Build aibff binary for current platform",
  aibffBuildCommand,
  [
    {
      option: "--platform <platform>",
      description: "Target platform (darwin, linux, windows)",
    },
    {
      option: "--arch <arch>",
      description: "Target architecture (x86_64, aarch64)",
    },
    {
      option: "--debug",
      description: "Enable debug output",
    },
  ],
  true, // AI-safe
);

register(
  "aibff:build:all",
  "Build aibff binary for all supported platforms",
  aibffBuildAllCommand,
  [
    {
      option: "--debug",
      description: "Enable debug output",
    },
  ],
  true, // AI-safe
);
