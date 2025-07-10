#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function e2eCommand(args: Array<string>): Promise<number> {
  logger.info("Starting e2e tests");

  /**
   * Utility function to wait for a port to be available
   * @param port The port to check
   * @param timeout Maximum time to wait in milliseconds
   * @param interval Check interval in milliseconds
   */
  async function waitForPort(
    port: number,
    timeout = 30000,
    interval = 500,
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        // Attempt to connect to the port
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        try {
          const response = await fetch(`http://localhost:${port}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.status) {
            return true; // Port is available and responding
          }
        } catch {
          clearTimeout(timeoutId);
          // Connection refused or other error, port not ready yet
        }

        // Wait before trying again
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        logger.warn(`Error checking port ${port}: ${(error as Error).message}`);
      }
    }

    logger.warn(`Timed out waiting for port ${port} after ${timeout}ms`);
    return false;
  }

  try {
    // Create a unique run ID based on timestamp
    const runId = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotBaseDir = `${Deno.cwd()}/tmp/screenshots`;
    const runSpecificDir = `${screenshotBaseDir}/${runId}`;

    // Parse arguments
    const buildFlag = args.includes("--build") || args.includes("-b");
    // Remove flags from args
    const filteredArgs = args.filter((arg) => !arg.startsWith("-"));
    // The first non-flag argument is treated as a test file path
    const testFilePath = filteredArgs.length > 0 ? filteredArgs[0] : null;

    // Create the run-specific screenshot directory
    try {
      await Deno.mkdir(runSpecificDir, { recursive: true });
      logger.info(`Created screenshot directory for this run: ${runId}`);

      // Set environment variable for the test context to use
      Deno.env.set("BF_E2E_SCREENSHOT_DIR", runSpecificDir);
    } catch (error) {
      logger.warn(
        `Failed to create screenshot directory: ${(error as Error).message}`,
      );
    }

    // Check if we need to build first
    if (buildFlag) {
      logger.info("Building application...");
      await runShellCommand(["bff", "build"]);
    }

    // Start the web server in the background
    logger.info("Starting web server...");
    const serverCommand = new Deno.Command("./build/web", {});

    const serverProcess = serverCommand.spawn();

    // Wait for the server to be ready on port 8000
    logger.info("Waiting for web server to be ready on port 8000...");
    await waitForPort(8000, 30000); // Wait up to 30 seconds
    logger.info("Web server is ready on port 8000");

    // Determine test paths
    let testPaths: Array<string>;
    if (testFilePath) {
      // If a specific test file is provided, use it directly
      logger.info(`Running specific test file: ${testFilePath}`);
      testPaths = [testFilePath];
    } else {
      // Otherwise, use all e2e test files
      const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
      testPaths = paths.map((path) => `${path}/**/*.test.e2e.ts`);
      logger.info("Running all e2e tests");
    }

    try {
      // Run the e2e tests
      const testCommand = new Deno.Command("deno", {
        args: [
          "test",
          "--trace-leaks",
          "--allow-net",
          "--allow-run",
          "--allow-env",
          "--allow-read",
          "--allow-write",
          "--no-check",
          ...testPaths,
        ],
        stdout: "inherit",
        stderr: "inherit",
        env: {
          ...Deno.env.toObject(),
          "BF_E2E_SCREENSHOT_DIR": runSpecificDir,
        },
      });

      const testProcess = testCommand.spawn();
      const testStatus = await testProcess.status;

      // Display screenshot location information
      logger.info(`Screenshots were saved to: ${runSpecificDir}`);

      try {
        // Use asynchronous readDir instead of readDirSync
        const screenshotFiles = [];
        for await (const entry of Deno.readDir(runSpecificDir)) {
          if (entry.isFile && entry.name.endsWith(".png")) {
            screenshotFiles.push(entry);
          }
        }

        // Sort and display screenshots
        screenshotFiles
          .sort((a, b) => {
            // Sort by timestamp in filename
            return b.name.localeCompare(a.name);
          })
          .slice(0, 10) // Show only the last 10 screenshots
          .forEach((file) => {
            logger.info(`- ${file.name}`);
          });

        if (screenshotFiles.length > 0) {
          logger.info(`Latest screenshots:`);
        }
      } catch (error) {
        logger.warn(`Could not list screenshots: ${(error as Error).message}`);
      }

      if (!testStatus.success) {
        logger.error(`E2E tests failed with code ${testStatus.code}`);
        return testStatus.code;
      }

      logger.info("E2E tests completed successfully");
      return 0;
    } finally {
      // Clean up the server process
      logger.info("Shutting down server process...");
      serverProcess.kill("SIGTERM");

      // Give time for resources to clean up
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    logger.error(`E2E tests failed: ${(error as Error).message}`);
    return 1;
  }
}

register(
  "e2e",
  "Run end-to-end tests. Optionally specify a test file path.",
  e2eCommand,
  [],
  true, // AI-safe
);
