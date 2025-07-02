import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

/**
 * Wait for a port to be available
 */
async function waitForPort(port: number, timeoutMs = 30000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(`http://localhost:${port}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok || response.status < 500) {
        return true;
      }
    } catch {
      // Port not ready yet, continue waiting
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

/**
 * Simplified E2E test runner
 */
export async function e2eCommand(options: Array<string>): Promise<number> {
  logger.info("Running E2E tests...");

  // Parse options
  const shouldBuild = options.includes("--build") || options.includes("-b");
  const headlessOption = options.find((opt) => opt.startsWith("--headless="));
  const shouldForceHeadless = headlessOption
    ? headlessOption === "--headless=true"
    : true;

  const testFiles = options.filter((opt) =>
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

  // Build if requested
  if (shouldBuild) {
    logger.info("Building application...");
    const buildResult = await runShellCommand(["bft", "build"]);
    if (buildResult !== 0) {
      logger.error("❌ Build failed");
      return buildResult;
    }
    logger.info("✅ Build complete");
  }

  // Detect which type of tests we're running to start the appropriate server
  const isAibffTest = testFiles.some((file) => file.includes("aibff")) ||
    (!testFiles.length && options.some((opt) => opt.includes("aibff")));

  const serverPort = 8000;
  const serverCommand = isAibffTest
    ? ["aibff", "gui", "--port", "8000"]
    : ["./build/web"];

  logger.info(`Checking for server on port ${serverPort}...`);
  let serverProcess: Deno.ChildProcess | undefined;

  try {
    // Check if server is already running
    const serverReady = await waitForPort(serverPort, 2000);

    if (serverReady) {
      logger.info(`✅ Server already running on port ${serverPort}`);
    } else {
      logger.info(`No server detected on port ${serverPort}`);
      logger.info(
        `🚀 Starting ${
          isAibffTest ? "aibff gui" : "web"
        } server automatically...`,
      );

      // Start the server process
      serverProcess = new Deno.Command(serverCommand[0], {
        args: serverCommand.slice(1),
        cwd: Deno.cwd(),
        stdout: "piped",
        stderr: "piped",
      }).spawn();

      // Wait for server to be ready
      logger.info("⏳ Waiting for server to start...");
      const serverStarted = await waitForPort(serverPort, 30000);

      if (!serverStarted) {
        logger.error(`❌ Server failed to start on port ${serverPort}`);
        if (serverProcess) {
          serverProcess.kill();
          await serverProcess.status;
        }
        return 1;
      }

      logger.info(`✅ Server started successfully on port ${serverPort}`);
    }

    // Run E2E tests
    logger.info("Running E2E tests...");
    const testArgs = ["deno", "test", "-A"];

    // All tests now use port 8000
    Deno.env.set("BF_E2E_BASE_URL", "http://localhost:8000");

    // Add test file patterns or specific files
    if (testFiles.length > 0) {
      testArgs.push(...testFiles);
    } else {
      // Default pattern for e2e tests - match files ending in .e2e.ts
      // Use more specific patterns to avoid duplicate discovery
      testArgs.push("apps/**/*.e2e.ts");
    }

    const testResult = await runShellCommand(testArgs);

    if (testResult === 0) {
      logger.info("✅ E2E tests passed!");
    } else {
      logger.error("❌ E2E tests failed");
    }

    return testResult;
  } finally {
    // Cleanup: kill server if we started it
    if (serverProcess) {
      logger.info("🛑 Stopping server...");
      try {
        serverProcess.kill("SIGTERM");

        // Wait for process to exit with timeout
        const statusPromise = serverProcess.status;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Server cleanup timeout")), 5000)
        );

        await Promise.race([statusPromise, timeoutPromise]);
        logger.info("✅ Server stopped successfully");
      } catch (error) {
        logger.debug("Error stopping server:", error);
        // Force kill if graceful shutdown failed
        try {
          serverProcess.kill("SIGKILL");
        } catch {
          // Process may already be terminated
        }
      }
    }
  }
}

export const bftDefinition = {
  description:
    "Run end-to-end tests with automatic server management. Options: --build, --headless=false",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;
