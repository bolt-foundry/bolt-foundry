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
        method: 'HEAD',
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok || response.status < 500) {
        return true;
      }
    } catch {
      // Port not ready yet, continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
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
  const testFiles = options.filter(opt => 
    !opt.startsWith("--") && !opt.startsWith("-") && opt.endsWith(".e2e.ts")
  );
  
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
  
  // Check if server is needed (look for e2e test files that might need it)
  logger.info("Checking for server on port 8000...");
  let serverProcess: Deno.ChildProcess | undefined;
  let needsServer = false;
  
  try {
    // Check if server is already running
    const serverReady = await waitForPort(8000, 2000);
    
    if (serverReady) {
      logger.info("✅ Server already running on port 8000");
      needsServer = true;
    } else {
      logger.info("No server detected on port 8000");
      logger.info("💡 For full E2E tests, start your server manually or use --build");
      // Continue without server for now - some e2e tests might not need it
    }
    
    // Run E2E tests
    logger.info("Running E2E tests...");
    const testArgs = ["deno", "test", "-A"];
    
    // Add test file patterns or specific files
    if (testFiles.length > 0) {
      testArgs.push(...testFiles);
    } else {
      // Default pattern for e2e tests
      testArgs.push("--filter", "e2e");
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
      logger.info("Stopping server...");
      serverProcess.kill();
      await serverProcess.status;
    }
  }
}

export const bftDefinition = {
  description: "Run end-to-end tests (simplified)",
  fn: e2eCommand,
  aiSafe: true,
} satisfies TaskDefinition;