import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function e2eCommand(args: string[]): Promise<number> {
  logger.info("Starting e2e tests");

  try {
    // Check if we need to build first
    if (args.includes("--build") || args.includes("-b")) {
      logger.info("Building application...");
      await runShellCommand(["bff", "build"]);
    }

    // Start the web server in the background
    logger.info("Starting web server...");
    const serverCommand = new Deno.Command("./build/web", {
      stdout: "piped",
      stderr: "piped",
    });

    const serverProcess = serverCommand.spawn();

    // Wait a moment for the server to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Run the e2e tests
      logger.info("Running e2e tests...");
      const testCommand = new Deno.Command("deno", {
        args: [
          "test",
          "--allow-net",
          "--allow-run",
          "--allow-env",
          "--allow-read",
          "--allow-write",
          "infra/testing/e2e/tests/",
        ],
        stdout: "inherit",
        stderr: "inherit",
      });

      const testProcess = testCommand.spawn();
      const testStatus = await testProcess.status;

      if (!testStatus.success) {
        logger.error(`E2E tests failed with code ${testStatus.code}`);
        return testStatus.code;
      }

      logger.info("E2E tests completed successfully");
      return 0;
    } finally {
      // Clean up the server process
      serverProcess.kill();
    }
  } catch (error) {
    logger.error(`E2E tests failed: ${(error as Error).message}`);
    return 1;
  }
}

register(
  "e2e",
  "Run end-to-end tests",
  e2eCommand,
);
