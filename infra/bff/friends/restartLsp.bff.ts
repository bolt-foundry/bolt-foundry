#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

register(
  "restartLsp",
  "Restart Deno LSP server by killing the current process",
  async () => {
    try {
      await runShellCommand(["pkill", "-f", "deno lsp"]);
      logger.info("LSP server killed successfully");
      return 0;
    } catch {
      logger.info("No LSP process found");
      return 0;
    }
  },
);
