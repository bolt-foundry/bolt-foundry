import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import {
  getRequiredServers,
  type ServerConfig,
} from "@bfmono/infra/testing/e2e/server-registry.ts";
import { expandGlob } from "@std/fs";
import { resolve } from "@std/path";

const logger = getLogger(import.meta);

/**
 * Storage for running servers to clean up later
 */
const runningServers = new Map<string, Deno.ChildProcess>();

/**
 * Find available port starting from the default port
 */
function findAvailablePort(defaultPort: number): number {
  let port = defaultPort;
  while (port < defaultPort + 100) {
    try {
      const listener = Deno.listen({ port });
      listener.close();
      return port;
    } catch {
      port++;
    }
  }
  throw new Error(`Could not find available port starting from ${defaultPort}`);
}

/**
 * Start a server and wait for it to be ready
 */
async function startServer(server: ServerConfig): Promise<string> {
  const port = await findAvailablePort(server.defaultPort);
  const serverUrl = `http://localhost:${port}`;

  logger.info(`Starting ${server.name} server on port ${port}...`);

  // Start the server process
  const command = new Deno.Command("deno", {
    args: ["run", "-A", server.serverPath, "--port", port.toString()],
    env: { ...Deno.env.toObject(), ...server.env },
    stdout: "piped",
    stderr: "piped",
  });

  const process = command.spawn();
  runningServers.set(server.name, process);

  // Wait for server to be ready by checking health
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        logger.info(`✅ ${server.name} server ready at ${serverUrl}`);
        return serverUrl;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `${server.name} server failed to start within ${maxRetries} seconds`,
  );
}

/**
 * Stop all running servers
 */
async function stopAllServers(): Promise<void> {
  for (const [name, process] of runningServers) {
    logger.info(`Stopping ${name} server...`);
    process.kill();
    await process.status;
  }
  runningServers.clear();
}

/**
 * Resolve test file paths from patterns
 */
async function resolveTestFiles(
  patterns: Array<string>,
): Promise<Array<string>> {
  const allFiles: Array<string> = [];

  for (const pattern of patterns) {
    if (pattern.endsWith(".e2e.ts") && !pattern.includes("*")) {
      // Direct file path
      allFiles.push(resolve(pattern));
    } else {
      // Glob pattern
      for await (const file of expandGlob(pattern, { root: Deno.cwd() })) {
        if (file.isFile && file.path.endsWith(".e2e.ts")) {
          allFiles.push(file.path);
        }
      }
    }
  }

  return allFiles;
}

/**
 * E2E test runner with server management
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

  const testFilePatterns = denoTestOptions.filter((opt) =>
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

  // Set up cleanup handler
  let cleanupCalled = false;
  const cleanup = async () => {
    if (cleanupCalled) return;
    cleanupCalled = true;
    await stopAllServers();
  };

  // Handle cleanup on exit
  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);

  let testResult = 1;

  try {
    // Resolve test file patterns to actual files
    const patterns = testFilePatterns.length > 0
      ? testFilePatterns
      : ["apps/**/*.e2e.ts"];
    const testFiles = await resolveTestFiles(patterns);

    if (testFiles.length === 0) {
      logger.info("No E2E test files found matching patterns");
      return 0;
    }

    // Determine which servers are needed
    const requiredServers = getRequiredServers(testFiles);

    if (requiredServers.length > 0) {
      logger.info(`📡 Starting ${requiredServers.length} required servers...`);

      // Build before starting servers to ensure latest code
      logger.info("🔨 Building project before starting servers...");
      const buildResult = await runShellCommand(["bft", "build"]);
      if (buildResult !== 0) {
        throw new Error(
          "Build failed - cannot start servers with outdated code",
        );
      }
      logger.info("✅ Build completed successfully");

      // Start all required servers
      for (const server of requiredServers) {
        const serverUrl = await startServer(server);
        // Set environment variable for the server
        Deno.env.set(server.envVar, serverUrl);
        logger.info(`🔗 ${server.envVar} = ${serverUrl}`);
      }
    } else {
      logger.info("No servers required for these tests");
    }

    // Run E2E tests
    logger.info("🧪 Running E2E tests...");

    const testArgs = ["deno", "test", "-A"];

    // Add all deno test options (including --no-check, etc.)
    const denoFlags = denoTestOptions.filter((opt) =>
      opt.startsWith("--") || opt.startsWith("-")
    );
    testArgs.push(...denoFlags);

    // Add resolved test files
    testArgs.push(...testFiles);

    testResult = await runShellCommand(testArgs);

    if (testResult === 0) {
      logger.info("✅ E2E tests passed!");
    } else {
      logger.error("❌ E2E tests failed");
    }
  } catch (error) {
    logger.error("❌ E2E test setup failed:", error);
    testResult = 1;
  } finally {
    // Cleanup servers
    await cleanup();
  }

  return testResult;
}

export const bftDefinition = {
  description:
    "Run end-to-end tests. Options: --headless=false, plus all deno test flags (--no-check, etc.)",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;
