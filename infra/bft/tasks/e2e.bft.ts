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

  // Parse options - extract bft-specific options and forward the rest to deno test
  const shouldBuild = options.includes("--build") || options.includes("-b");
  const headlessOption = options.find((opt) => opt.startsWith("--headless="));
  const shouldForceHeadless = headlessOption
    ? headlessOption === "--headless=true"
    : true;

  // Filter out bft-specific options and pass everything else to deno test
  const denoTestOptions = options.filter((opt) =>
    opt !== "--build" && opt !== "-b" && !opt.startsWith("--headless=")
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

  // Start both servers for comprehensive e2e testing
  logger.info("🚀 Starting both servers for e2e tests...");

  const boltFoundryPort = 8000;
  const aibffPort = 3001;

  let boltFoundryProcess: Deno.ChildProcess | undefined;
  let aibffProcess: Deno.ChildProcess | undefined;

  try {
    // Check and start Bolt Foundry server (port 8000)
    logger.info(
      `Checking for Bolt Foundry server on port ${boltFoundryPort}...`,
    );
    const boltFoundryReady = await waitForPort(boltFoundryPort, 2000);

    if (boltFoundryReady) {
      logger.info(
        `✅ Bolt Foundry server already running on port ${boltFoundryPort}`,
      );
    } else {
      logger.info(
        `🚀 Starting Bolt Foundry server on port ${boltFoundryPort}...`,
      );
      boltFoundryProcess = new Deno.Command("./build/web", {
        cwd: Deno.cwd(),
        stdout: "piped",
        stderr: "piped",
      }).spawn();

      logger.info("⏳ Waiting for Bolt Foundry server to start...");
      const boltFoundryStarted = await waitForPort(boltFoundryPort, 30000);
      if (!boltFoundryStarted) {
        logger.error(
          `❌ Bolt Foundry server failed to start on port ${boltFoundryPort}`,
        );
        if (boltFoundryProcess) {
          boltFoundryProcess.kill();
          await boltFoundryProcess.status;
        }
        return 1;
      }
      logger.info(`✅ Bolt Foundry server started on port ${boltFoundryPort}`);
    }

    // Check and start aibff GUI server (port 3001)
    logger.info(`Checking for aibff GUI server on port ${aibffPort}...`);
    const aibffReady = await waitForPort(aibffPort, 2000);

    if (aibffReady) {
      logger.info(`✅ aibff GUI server already running on port ${aibffPort}`);
    } else {
      logger.info(`🚀 Starting aibff GUI server on port ${aibffPort}...`);
      try {
        aibffProcess = new Deno.Command("aibff", {
          args: ["gui", "--port", aibffPort.toString(), "--no-open"],
          cwd: Deno.cwd(),
          stdout: "piped",
          stderr: "piped",
        }).spawn();

        logger.info("⏳ Waiting for aibff GUI server to start...");
        const aibffStarted = await waitForPort(aibffPort, 30000);
        if (!aibffStarted) {
          logger.error(
            `❌ aibff GUI server failed to start on port ${aibffPort}`,
          );

          // Try to get error output from the process
          if (aibffProcess) {
            try {
              const { stdout, stderr } = await aibffProcess.output();
              const stdoutText = new TextDecoder().decode(stdout);
              const stderrText = new TextDecoder().decode(stderr);

              if (stdoutText) {
                logger.error("aibff GUI stdout:", stdoutText);
              }
              if (stderrText) {
                logger.error("aibff GUI stderr:", stderrText);
              }
            } catch (outputError) {
              logger.debug("Failed to capture aibff output:", outputError);
            }

            aibffProcess.kill();
            await aibffProcess.status;
          }

          logger.warn(
            "⚠️  Continuing without aibff GUI server - aibff tests will fail",
          );
          aibffProcess = undefined; // Clear so we don't try to clean it up
        } else {
          logger.info(`✅ aibff GUI server started on port ${aibffPort}`);
        }
      } catch (error) {
        logger.error(`❌ Failed to start aibff GUI server:`, error);
        logger.warn(
          "⚠️  Continuing without aibff GUI server - aibff tests will fail",
        );
        aibffProcess = undefined;
      }
    }

    // Run E2E tests
    logger.info("Running E2E tests...");
    const testArgs = ["deno", "test", "-A"];

    // Add all deno test options (including --no-check, etc.)
    const denoFlags = denoTestOptions.filter((opt) =>
      opt.startsWith("--") || opt.startsWith("-")
    );
    testArgs.push(...denoFlags);

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
    // Cleanup: kill servers if we started them
    const cleanupPromises = [];

    if (boltFoundryProcess) {
      logger.info("🛑 Stopping Bolt Foundry server...");
      cleanupPromises.push(
        (async () => {
          try {
            boltFoundryProcess.kill("SIGTERM");
            const statusPromise = boltFoundryProcess.status;
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Bolt Foundry server cleanup timeout")),
                5000,
              )
            );
            await Promise.race([statusPromise, timeoutPromise]);
            logger.info("✅ Bolt Foundry server stopped successfully");
          } catch (error) {
            logger.debug("Error stopping Bolt Foundry server:", error);
            try {
              boltFoundryProcess.kill("SIGKILL");
            } catch {
              // Process may already be terminated
            }
          }
        })(),
      );
    }

    if (aibffProcess) {
      logger.info("🛑 Stopping aibff GUI server...");
      cleanupPromises.push(
        (async () => {
          try {
            aibffProcess.kill("SIGTERM");
            const statusPromise = aibffProcess.status;
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("aibff GUI server cleanup timeout")),
                5000,
              )
            );
            await Promise.race([statusPromise, timeoutPromise]);
            logger.info("✅ aibff GUI server stopped successfully");
          } catch (error) {
            logger.debug("Error stopping aibff GUI server:", error);
            try {
              aibffProcess.kill("SIGKILL");
            } catch {
              // Process may already be terminated
            }
          }
        })(),
      );
    }

    // Wait for all cleanup to complete
    if (cleanupPromises.length > 0) {
      await Promise.all(cleanupPromises);
    }
  }
}

export const bftDefinition = {
  description:
    "Run end-to-end tests with automatic server management. Options: --build, --headless=false, plus all deno test flags (--no-check, etc.)",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;
