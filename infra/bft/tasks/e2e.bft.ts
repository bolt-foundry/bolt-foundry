import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

/**
 * Simple E2E test runner - just runs deno test with E2E configuration
 */
export async function e2eCommand(options: Array<string>): Promise<number> {
  logger.info("Running E2E tests...");

  // Parse options
  const headlessOption = options.find((opt) => opt.startsWith("--headless="));
  const shouldForceHeadless = headlessOption
    ? headlessOption === "--headless=true"
    : true;

  // Filter out bft-specific options and pass everything else to deno test
  const denoTestOptions = options.filter((opt) =>
    !opt.startsWith("--headless=") && opt !== "--build" && opt !== "-b"
  );

  const testFiles = denoTestOptions.filter((opt) =>
    !opt.startsWith("--") && !opt.startsWith("-") && opt.endsWith(".e2e.ts")
  );

  // Set headless mode via environment variable
  if (shouldForceHeadless) {
    Deno.env.set("BF_E2E_HEADLESS", "true");
    logger.info(
      "🕶️  Running in headless mode (use --headless=false to see browser)",
    );
  } else {
    Deno.env.set("BF_E2E_HEADLESS", "false");
    logger.info("🖥️  Running with visible browser (--headless=false)");
  }

  // Run E2E tests
  logger.info("🧪 Running E2E tests...");

  const testArgs = ["deno", "test", "-A"];

  // Add all deno test options (including --no-check, etc.)
  const denoFlags = denoTestOptions.filter((opt) =>
    opt.startsWith("--") || opt.startsWith("-")
  );
  testArgs.push(...denoFlags);

  // Add test file patterns or specific files
  if (testFiles.length > 0) {
    testArgs.push(...testFiles);
  } else {
    // Default pattern for e2e tests - match files ending in .e2e.ts
    testArgs.push("apps/**/*.e2e.ts");
  }

  const testResult = await runShellCommand(testArgs);

  if (testResult === 0) {
    logger.info("✅ E2E tests passed!");
  } else {
    logger.error("❌ E2E tests failed");
  }

  return testResult;
}

export const bftDefinition = {
  description:
    "Run end-to-end tests. Options: --headless=false, plus all deno test flags (--no-check, etc.)",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;
