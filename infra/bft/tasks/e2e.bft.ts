import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { getRequiredServers } from "@bfmono/infra/testing/e2e/server-registry.ts";
import { expandGlob } from "@std/fs/expand-glob";
import { relative } from "@std/path";

// Helper functions for server management
function findAvailablePort(startPort: number): number {
  for (let port = startPort; port < startPort + 100; port++) {
    try {
      const listener = Deno.listen({ port });
      listener.close();
      return port;
    } catch {
      // Port is in use, try next one
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer(
  serverPath: string,
  port: number,
): Promise<Deno.ChildProcess> {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", serverPath],
    stdout: "piped",
    stderr: "piped",
    env: {
      ...Deno.env.toObject(),
      PORT: port.toString(),
      WEB_PORT: port.toString(),
    },
  });

  const process = command.spawn();

  // Wait for server to be ready
  const maxAttempts = 30;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok || response.status < 500) {
        return process;
      }
    } catch {
      // Server not ready yet, continue waiting
    }
  }

  throw new Error(
    `Server failed to start on port ${port} after ${maxAttempts} attempts`,
  );
}

const logger = getLogger(import.meta);

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

  const smoothOption = options.find((opt) => opt.startsWith("--smooth="));
  const shouldEnableSmooth = smoothOption
    ? smoothOption === "--smooth=true"
    : true;

  // Filter out bft-specific options and pass everything else to deno test
  const denoTestOptions = options.filter((opt) =>
    !opt.startsWith("--headless=") &&
    !opt.startsWith("--smooth=") &&
    opt !== "--build" &&
    opt !== "-b"
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

  // Set smooth mode via environment variable
  if (shouldEnableSmooth) {
    Deno.env.set("BF_E2E_SMOOTH", "true");
    logger.info(
      "🎬  Smooth animations enabled (use --smooth=false for faster tests)",
    );
  } else {
    Deno.env.set("BF_E2E_SMOOTH", "false");
    logger.info("⚡ Fast mode: smooth animations disabled (--smooth=false)");
  }

  // Determine which servers are needed based on test files
  let testFilePaths = testFiles;
  if (testFilePaths.length === 0) {
    // Resolve glob pattern to get actual file paths
    testFilePaths = [];
    for await (const file of expandGlob("apps/**/*.e2e.ts")) {
      // Convert absolute path to relative path from project root
      const relativePath = relative(Deno.cwd(), file.path);
      testFilePaths.push(relativePath);
    }
  }

  const requiredServers = getRequiredServers(testFilePaths);
  logger.info(
    `📋 Found ${testFilePaths.length} test files: ${testFilePaths.join(", ")}`,
  );
  logger.info(
    `🔧 Required servers: ${requiredServers.map((s) => s.name).join(", ")}`,
  );

  const servers: Array<
    { name: string; process: Deno.ChildProcess; port: number }
  > = [];

  try {
    // Start all required servers
    for (const serverConfig of requiredServers) {
      logger.info(`🚀 Starting ${serverConfig.name} server...`);
      const serverPort = await findAvailablePort(serverConfig.defaultPort);
      const serverProcess = await startServer(
        serverConfig.serverPath,
        serverPort,
      );
      servers.push({
        name: serverConfig.name,
        process: serverProcess,
        port: serverPort,
      });

      // Set environment variable for tests to use
      Deno.env.set(serverConfig.envVar, `http://localhost:${serverPort}`);
      logger.info(
        `✅ ${serverConfig.name} server ready at http://localhost:${serverPort}`,
      );
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
  } finally {
    // Clean up all started servers
    for (const server of servers) {
      try {
        logger.info(`🧹 Cleaning up ${server.name} server...`);

        // Close streams first to prevent resource leaks
        if (server.process.stdout) {
          await server.process.stdout.cancel();
        }
        if (server.process.stderr) {
          await server.process.stderr.cancel();
        }

        // Kill the process
        server.process.kill();

        // Wait for process to exit with timeout
        await Promise.race([
          server.process.status,
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);

        logger.info(`✅ ${server.name} server cleaned up`);
      } catch (error) {
        logger.warn(`⚠️  Error cleaning up ${server.name} server:`, error);
      }
    }
  }
}

export const bftDefinition = {
  description:
    "Run end-to-end tests. Options: --headless=false, plus all deno test flags (--no-check, etc.)",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;
