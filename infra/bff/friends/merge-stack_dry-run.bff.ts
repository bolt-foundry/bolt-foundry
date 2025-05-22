#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { mergeStack } from "./merge-stack.bff.ts";

export async function mergeStackDryRun(args: string[]): Promise<number> {
  // Always run in dry-run mode
  const dryRunArgs = ["--dry-run", ...args];
  return await mergeStack(dryRunArgs);
}

register(
  "merge-stack_dry-run",
  "Preview what PRs would be merged in the current stack (AI-safe)",
  mergeStackDryRun,
  [
    {
      option: "[METHOD]",
      description: "Merge method: merge, squash, or rebase (default: rebase)",
    },
  ],
  true, // AI-safe - only shows what would happen
);

export default mergeStackDryRun;