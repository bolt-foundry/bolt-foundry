import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { type Browser, launch, type Page } from "puppeteer-core";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";
import {
  startScreencastRecording,
  stopScreencastRecording,
  stopScreencastRecordingWithVideo,
  type VideoRecordingSession as _VideoRecordingSession,
} from "../video-recording/recorder.ts";
import {
  startTimeBasedRecording,
  stopTimeBasedRecordingWithVideo,
  type TimeBasedRecordingSession as _TimeBasedRecordingSession,
} from "../video-recording/time-based-recorder.ts";
import type {
  VideoConversionOptions,
  VideoConversionResult,
} from "../video-recording/video-converter.ts";
import {
  injectCursorOverlay,
  removeCursorOverlay,
} from "../video-recording/cursor-overlay.ts";

const logger = getLogger(import.meta);

// Simple server startup without global registry - each test gets its own server

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

  // Note: We'll close streams after server startup to avoid interfering with startup detection

  // Wait for server to be ready
  const maxAttempts = 30; // 30 seconds
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (await isServerRunning(port)) {
      logger.info(`Server is ready at ${url}`);

      // Streams will be automatically closed when process is terminated

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
  navigateTo: (path: string) => Promise<void>;
  startVideoRecording: (name: string) => Promise<() => Promise<string | null>>;
  startVideoRecordingWithConversion: (
    name: string,
    options?: VideoConversionOptions,
  ) => Promise<() => Promise<VideoConversionResult | null>>;
  startTimeBasedVideoRecording: (
    name: string,
    targetFps?: number,
    options?: VideoConversionOptions,
  ) => Promise<() => Promise<VideoConversionResult | null>>;
  teardown: () => Promise<void>;
}

/**
 * Sets up the e2e test environment
 */
export async function setupE2ETest(options: {
  baseUrl?: string;
  server?: string;
} = {}): Promise<E2ETestContext> {
  let baseUrl = options.baseUrl;

  // If server option is provided, check if it's already running first
  if (options.server) {
    // Check if we're in the bft e2e environment with pre-started servers
    const bfE2eBaseUrl = getConfigurationVariable("BF_E2E_BASE_URL");

    if (bfE2eBaseUrl && options.server.includes("guiServer.ts")) {
      // aibff GUI server - use port 3001 from bft e2e
      baseUrl = "http://localhost:3001";
      logger.info(`Using pre-started aibff GUI server: ${baseUrl}`);
    } else if (bfE2eBaseUrl && options.server.includes("boltFoundry")) {
      // Bolt Foundry server - use the BF_E2E_BASE_URL
      baseUrl = bfE2eBaseUrl;
      logger.info(`Using pre-started Bolt Foundry server: ${baseUrl}`);
    } else {
      // No pre-started server available, start our own
      const { url } = await startServer(options.server);
      baseUrl = url;
      logger.info(`Started server for test: ${baseUrl}`);
    }
  }

  // Fallback to environment variable if no server started and no baseUrl provided
  if (!baseUrl) {
    baseUrl = getConfigurationVariable("BF_E2E_BASE_URL") ||
      "http://localhost:8000";
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

    // Create context methods
    const context = {
      browser,
      page,
      baseUrl,
      takeScreenshot,
      navigateTo: async (path: string): Promise<void> => {
        const url = new URL(path, baseUrl).toString();
        logger.info(`Navigating to ${url}`);
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });
      },
      startVideoRecording: async (
        name: string,
      ): Promise<() => Promise<string | null>> => {
        const videosDir = getConfigurationVariable("BF_E2E_VIDEO_DIR") ||
          "/tmp/videos";

        // Inject cursor overlay for better video visibility
        try {
          await injectCursorOverlay(page);
          logger.debug("Cursor overlay injected for video recording");
        } catch (error) {
          logger.warn("Failed to inject cursor overlay:", error);
        }

        const session = await startScreencastRecording(page, name, videosDir);

        return async (): Promise<string | null> => {
          try {
            const videoPath = await stopScreencastRecording(page, session);

            // Clean up cursor overlay
            try {
              await removeCursorOverlay(page);
            } catch (error) {
              logger.debug("Failed to remove cursor overlay:", error);
            }

            logger.info(`Video recording saved to: ${videoPath}`);
            return videoPath;
          } catch (error) {
            logger.error(
              `Failed to stop video recording: ${(error as Error).message}`,
            );
            return null;
          }
        };
      },
      startVideoRecordingWithConversion: async (
        name: string,
        options?: VideoConversionOptions,
      ): Promise<() => Promise<VideoConversionResult | null>> => {
        const videosDir = getConfigurationVariable("BF_E2E_VIDEO_DIR") ||
          "/tmp/videos";

        // Inject cursor overlay for better video visibility
        try {
          await injectCursorOverlay(page);
          logger.debug(
            "Cursor overlay injected for video recording with conversion",
          );
        } catch (error) {
          logger.warn("Failed to inject cursor overlay:", error);
        }

        const session = await startScreencastRecording(page, name, videosDir);

        return async (): Promise<VideoConversionResult | null> => {
          try {
            const videoResult = await stopScreencastRecordingWithVideo(
              page,
              session,
              options,
            );

            // Clean up cursor overlay
            try {
              await removeCursorOverlay(page);
            } catch (error) {
              logger.debug("Failed to remove cursor overlay:", error);
            }

            logger.info(
              `Video recording completed: ${videoResult.videoPath} (${videoResult.fileSize} bytes)`,
            );
            return videoResult;
          } catch (error) {
            logger.error(
              `Failed to convert video recording: ${(error as Error).message}`,
            );
            return null;
          }
        };
      },
      startTimeBasedVideoRecording: async (
        name: string,
        targetFps = 20,
        options?: VideoConversionOptions,
      ): Promise<() => Promise<VideoConversionResult | null>> => {
        const videosDir = getConfigurationVariable("BF_E2E_VIDEO_DIR") ||
          "/tmp/videos";

        // Inject cursor overlay for better video visibility
        try {
          const { injectCursorOverlayOnAllPages } = await import(
            "../video-recording/cursor-overlay-page-injection.ts"
          );
          await injectCursorOverlayOnAllPages(page);
          logger.debug(
            "Page injection cursor overlay injected for time-based video recording",
          );
        } catch (error) {
          logger.warn("Failed to inject cursor overlay:", error);
        }

        const session = await startTimeBasedRecording(
          page,
          name,
          targetFps,
          videosDir,
        );

        return async (): Promise<VideoConversionResult | null> => {
          try {
            const videoResult = await stopTimeBasedRecordingWithVideo(
              page,
              session,
              options,
            );

            // Clean up cursor overlay
            try {
              const { removeCursorOverlay } = await import(
                "../video-recording/cursor-overlay-page-injection.ts"
              );
              await removeCursorOverlay(page);
            } catch (error) {
              logger.debug("Failed to remove cursor overlay:", error);
            }

            logger.info(
              `Time-based video recording completed: ${videoResult.videoPath} (${videoResult.fileSize} bytes)`,
            );
            return videoResult;
          } catch (error) {
            logger.error(
              `Failed to convert time-based video recording: ${
                (error as Error).message
              }`,
            );
            return null;
          }
        };
      },
      teardown: async (): Promise<void> => {
        try {
          // First close any open pages
          if (page && !page.isClosed()) {
            await page.close();
          }

          // Then close the browser completely
          if (browser) {
            await browser.close();
          }

          // NOTE: Server cleanup is intentionally NOT done here to avoid
          // resource conflicts. Servers will be cleaned up when the test
          // process exits. This matches the original teardownE2ETest behavior.

          // Give time for all resources to be released
          await new Promise((resolve) => setTimeout(resolve, 100));

          logger.info("E2E test environment torn down (browser only)");
        } catch (error) {
          logger.error("Error during teardown:", error);
          throw error;
        }
      },
    };

    return context;
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

    // NOTE: Server cleanup is intentionally NOT done here to avoid
    // resource conflicts. Servers will be cleaned up when the test
    // process exits. This matches the original teardownE2ETest behavior.

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
