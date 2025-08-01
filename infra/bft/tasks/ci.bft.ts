import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";
import { loggerGithub } from "@bfmono/infra/bff/githubLogger.ts";
import { refreshAllSecrets } from "@bfmono/packages/get-configuration-var/get-configuration-var.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { testCommand } from "./test.bft.ts";
import { formatCommand } from "./format.bft.ts";
import { lintCommand } from "./lint.bft.ts";
import { e2eCommand } from "./e2e.bft.ts";
import { checkCommand } from "./check.bft.ts";

const logger = getLogger(import.meta);

type GhMeta = {
  file?: string;
  line?: number;
  col?: number;
};

// Quick helpers to unify normal logging & GH annotations
const logCI = {
  info: (msg: string) => {
    logger.info(msg);
  },
  error: (msg: string, meta?: GhMeta) => {
    if (meta) {
      loggerGithub.error(msg, meta);
    } else {
      logger.error(msg);
    }
  },
  warn: (msg: string, meta?: GhMeta) => {
    if (meta) {
      loggerGithub.warn(msg, meta);
    } else {
      logger.warn(msg);
    }
  },
  debug: (msg: string, meta?: GhMeta) => {
    if (meta) {
      loggerGithub.warn(msg, meta);
    } else {
      logger.debug(msg);
    }
  },
};

async function runInstallStep(_useGithub: boolean): Promise<number> {
  logger.info("Caching dependencies via deno install");
  const { code } = await runShellCommandWithOutput(
    ["deno", "install"],
    {},
    true,
    false,
  );
  return code;
}

export async function ciCommand(options: Array<string>): Promise<number> {
  await refreshAllSecrets();
  logger.info("Running CI checks...");
  const useGithub = options.includes("-g");

  // 1) Install / "deno install"
  const installResult = await runInstallStep(useGithub);
  if (installResult !== 0) {
    logCI.error("Install step failed");
    return installResult;
  }

  // 2) Lint (with GitHub annotations if requested)
  const lintArgs = useGithub ? ["-g"] : [];
  const lintResult = await lintCommand(lintArgs);
  if (lintResult !== 0) {
    logCI.error("Lint step failed");
    return lintResult;
  }

  // 3) Unit Tests
  const testResult = await testCommand([]);
  if (testResult !== 0) {
    logCI.error("Test step failed");
    return testResult;
  }

  // 4) E2E Tests
  const e2eTestResult = await e2eCommand(["--build"]);
  if (e2eTestResult !== 0) {
    logCI.error("E2E test step failed");
    return e2eTestResult;
  }

  // 5) Format check
  const fmtResult = await formatCommand(["--check"]);
  if (fmtResult !== 0) {
    logCI.error("Format check failed");
    return fmtResult;
  }

  // 6) Type check
  const typecheckResult = await checkCommand([]);
  if (typecheckResult !== 0) {
    logCI.error("Type check failed");
    return typecheckResult;
  }

  logger.info("\n📊 CI Checks Summary:");
  logger.info(`Install:   ✅`);
  logger.info(`Lint:      ✅`);
  logger.info(`Test:      ✅`);
  logger.info(`E2E Test:  ✅`);
  logger.info(`Format:    ✅`);
  logger.info(`TypeCheck: ✅`);

  logger.info("All CI checks passed");
  return 0;
}

export const bftDefinition = {
  description:
    "Run CI checks (lint, test, format). E.g. `bft ci -g` for GH annotations.",
  fn: ciCommand,
} satisfies TaskDefinition;
