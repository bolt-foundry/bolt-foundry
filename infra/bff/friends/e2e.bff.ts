import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function e2eCommand(args: string[]): Promise<number> {
  logger.info("Starting e2e tests");

  let serverProcess: Deno.ChildProcess | undefined;
  let testProcess: Deno.ChildProcess | undefined;
  let testStatus: Deno.CommandStatus | undefined;

  try {
    // Create a unique run ID based on timestamp
    const runId = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotBaseDir = `${Deno.cwd()}/tmp/screenshots`;
    const runSpecificDir = `${screenshotBaseDir}/${runId}`;

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

    serverProcess = serverCommand.spawn();

    // Wait a moment for the server to start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
    const pathsStrings = paths.map((path) => `${path}/**/*.test.e2e.ts`);

    try {
      // Run the e2e tests with sanitization disabled
      logger.info("Running e2e tests...");
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
          ...pathsStrings,
        ],
        stdout: "inherit",
        stderr: "inherit",
        env: {
          ...Deno.env.toObject(),
          "BF_E2E_SCREENSHOT_DIR": runSpecificDir,
        },
      });

      testProcess = testCommand.spawn();
      testStatus = await testProcess.status;

      // Display screenshot location information
      logger.info(`Screenshots were saved to: ${runSpecificDir}`);

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

    if (!testStatus?.success) {
      logger.error(`E2E tests failed with code ${testStatus?.code}`);
      return testStatus?.code ?? 1;
    }

    logger.info("E2E tests completed successfully");
    return 0;
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
