import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { type Browser, launch, type Page } from "puppeteer-core";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";

const logger = getLogger(import.meta);

/**
 * Checks if a server is already running on the given port
 */
async function isServerRunning(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}`, {
      method: "HEAD",
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Finds an available port starting from the given port
 */
async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 100; port++) {
    if (!(await isServerRunning(port))) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

/**
 * Starts a server from the given path and returns the URL and process
 */
async function startServer(
  serverPath: string,
): Promise<{ url: string; process: Deno.ChildProcess }> {
  const port = await findAvailablePort(8000);
  const url = `http://localhost:${port}`;

  // Convert file:// URL to filesystem path if needed
  const executablePath = serverPath.startsWith("file://")
    ? new URL(serverPath).pathname
    : serverPath;

  logger.info(`Starting server from ${executablePath} on port ${port}`);

  // Start the server process with PORT environment variable
  const command = new Deno.Command(executablePath, {
    args: [],
    stdout: "piped",
    stderr: "piped",
    env: {
      ...Deno.env.toObject(),
      PORT: port.toString(),
      WEB_PORT: port.toString(), // For apps that use WEB_PORT
    },
  });

  const process = command.spawn();

  // Wait for server to be ready
  const maxAttempts = 30; // 30 seconds
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (await isServerRunning(port)) {
      logger.info(`Server is ready at ${url}`);
      return { url, process };
    }

    // Check if process is still alive
    try {
      const status = await Promise.race([
        process.status,
        new Promise((resolve) => setTimeout(() => resolve(null), 10)),
      ]);
      if (status !== null) {
        // Process has exited
        const output = await process.output();
        const stderr = new TextDecoder().decode(output.stderr);
        throw new Error(`Server process exited: ${stderr}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("exited")) {
        throw error;
      }
      // Continue waiting
    }
  }

  // Server didn't start in time, kill the process
  process.kill();
  throw new Error(`Server failed to start within 30 seconds`);
}

/**
 * Detects if the current environment is a CI environment
 */
function _isCI(): boolean {
  // Check if this is Replit - Replit has display server and should not be treated as CI
  if (
    getConfigurationVariable("REPL_ID") ||
    getConfigurationVariable("REPL_SLUG") ||
    getConfigurationVariable("REPLIT_DB_URL")
  ) {
    logger.info(
      "Detected Replit environment - treating as non-CI for E2E tests",
    );
    return false;
  }

  // Check for Bolt Foundry specific CI flag first
  const bfCI = getConfigurationVariable("BF_CI");
  if (bfCI === "true") return true;

  // Check for common CI environment variables
  const ciVars = [
    "CI",
    "CONTINUOUS_INTEGRATION",
    "GITHUB_ACTIONS",
    "GITLAB_CI",
    "JENKINS_HOME",
    "JENKINS_URL",
    "CIRCLECI",
    "TRAVIS",
    "BUILDKITE",
    "DRONE",
    "TEAMCITY_VERSION",
    "TF_BUILD", // Azure DevOps
    "BITBUCKET_BUILD_NUMBER",
    "SEMAPHORE",
    "APPVEYOR",
    "CODEBUILD_BUILD_ID", // AWS CodeBuild
  ];

  return ciVars.some((varName) => {
    const value = getConfigurationVariable(varName);
    return value === "true" || value === "1";
  });
}

export interface E2ETestContext {
  browser: Browser;
  page: Page;
  baseUrl: string;
  takeScreenshot: (name: string) => Promise<string>;
  serverProcess?: Deno.ChildProcess;
}

/**
 * Sets up the e2e test environment
 */
export async function setupE2ETest(options: {
  baseUrl?: string;
  headless?: boolean;
  server?: string;
} = {}): Promise<E2ETestContext> {
  let baseUrl = options.baseUrl ||
    getConfigurationVariable("BF_E2E_BASE_URL");

  let serverProcess: Deno.ChildProcess | undefined;

  // If server option is provided, start the server
  if (options.server) {
    const { url, process } = await startServer(options.server);
    baseUrl = url;
    serverProcess = process;
  }

  // Fallback to default URL if no server started and no baseUrl provided
  if (!baseUrl) {
    baseUrl = "http://localhost:8000";
  }

  // Force headless mode for consistency and performance
  // Only allow override via BF_E2E_HEADLESS environment variable
  let headless: boolean;
  const headlessEnv = getConfigurationVariable("BF_E2E_HEADLESS");
  if (headlessEnv !== undefined) {
    headless = headlessEnv !== "false";
  } else {
    // Always default to headless for automated testing
    headless = true;
  }

  logger.info(
    `Starting e2e test with baseUrl: ${baseUrl}, headless: ${headless}`,
  );

  try {
    // Find the browser executable path
    let chromiumPath = "chromium";

    // First check for environment variable
    const envPath = getConfigurationVariable("PUPPETEER_EXECUTABLE_PATH");
    if (envPath) {
      chromiumPath = envPath;
      logger.info(
        `Using browser from PUPPETEER_EXECUTABLE_PATH: ${chromiumPath}`,
      );
    } else {
      // Try chromium first, then chrome - check both PATH and known locations
      const browsersToCheck = [
        // Check PATH first
        { name: "chromium", checkType: "which" },
        { name: "google-chrome", checkType: "which" },
        { name: "google-chrome-stable", checkType: "which" },
        // Check macOS application paths
        {
          name: "Chromium",
          checkType: "path",
          path: "/Applications/Chromium.app/Contents/MacOS/Chromium",
        },
        {
          name: "Google Chrome",
          checkType: "path",
          path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        },
      ];

      for (const browser of browsersToCheck) {
        try {
          if (browser.checkType === "which") {
            const command = new Deno.Command("which", {
              args: [browser.name],
              stdout: "piped",
            });
            const output = await command.output();
            if (output.success) {
              const path = new TextDecoder().decode(output.stdout).trim();
              if (path) {
                chromiumPath = path;
                logger.info(`Found ${browser.name} at: ${chromiumPath}`);
                break;
              }
            }
          } else if (browser.checkType === "path" && browser.path) {
            const stat = await Deno.stat(browser.path);
            if (stat.isFile) {
              chromiumPath = browser.path;
              logger.info(`Found ${browser.name} at: ${chromiumPath}`);
              break;
            }
          }
        } catch {
          // Try next browser
        }
      }

      if (chromiumPath === "chromium") {
        logger.warn(
          "No Chromium or Chrome found. Please install one or set PUPPETEER_EXECUTABLE_PATH",
        );
      }
    }

    // Ensure screenshots directory exists, using environment variable if available
    const runSpecificDir = getConfigurationVariable("BF_E2E_SCREENSHOT_DIR");
    const screenshotsDir = runSpecificDir ||
      join(Deno.cwd(), "tmp", "screenshots");
    await ensureDir(screenshotsDir);
    logger.info(`Screenshots will be saved to: ${screenshotsDir}`);

    // Launch browser using puppeteer-core
    const browser = await launch({
      headless,
      executablePath: chromiumPath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on("console", (msg) => {
      const line = `[browser ${msg.type()}] ${msg.text()}`;
      // choose ONE of these:
      logger.info(line); // if you have a structured logger
      // console.log(line); // or plain stdout for Deno test runner

      // optional: dump objects the page logs
      for (const arg of msg.args()) {
        arg.jsonValue()
          .then((v) => logger.debug(v))
          .catch(() => {/* circular/remote handles */});
      }
    });

    // Create screenshot function
    const takeScreenshot = async (name: string): Promise<string> => {
      const fileName = `${Date.now()}_${name.replace(/\s+/g, "-")}.png`;
      const filePath = join(screenshotsDir, fileName) as `${string}.png`;

      try {
        await page.screenshot({ path: filePath, fullPage: true });
        logger.info(`Screenshot saved to: ${filePath}`);
        return filePath;
      } catch (error) {
        logger.error(`Failed to take screenshot: ${(error as Error).message}`);
        return "";
      }
    };

    return { browser, page, baseUrl, takeScreenshot, serverProcess };
  } catch (error) {
    logger.error("Failed to setup e2e test:", error);
    throw error;
  }
}

/**
 * Tears down the e2e test environment
 */
export async function teardownE2ETest(context: E2ETestContext): Promise<void> {
  try {
    // First close any open pages
    if (context.page && !context.page.isClosed()) {
      await context.page.close();
    }

    // Then close the browser completely
    if (context.browser) {
      await context.browser.close();
    }

    // Clean up server process if it was started
    if (context.serverProcess) {
      try {
        context.serverProcess.kill();
        await context.serverProcess.status;
        logger.info("Server process cleaned up");
      } catch (error) {
        logger.warn("Error cleaning up server process:", error);
      }
    }

    // Give time for all resources to be released
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    logger.error("Error during teardown:", error);
  }
}

/**
 * Helper for navigation and waiting for page load
 */
export async function navigateTo(
  context: E2ETestContext,
  path: string,
): Promise<void> {
  const url = new URL(path, context.baseUrl).toString();
  logger.info(`Navigating to ${url}`);

  await context.page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
}
