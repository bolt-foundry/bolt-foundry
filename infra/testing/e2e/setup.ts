import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { type Browser, launch, type Page } from "puppeteer-core";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";
import {
  addRecordingThrobber,
  removeRecordingThrobber,
} from "../video-recording/smooth-ui.ts";
import {
  startScreencastRecording,
  stopScreencastRecording,
  stopScreencastRecordingFramesOnly,
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
async function _isServerRunning(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      method: "HEAD",
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
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
  takeScreenshot: (
    name: string,
    options?: { fullPage?: boolean },
  ) => Promise<string>;
  navigateTo: (path: string) => Promise<void>;
  startVideoRecording: (
    name: string,
    options?: VideoConversionOptions,
  ) => Promise<() => Promise<VideoConversionResult | null>>;
  startVideoRecordingFramesOnly: (
    name: string,
  ) => Promise<() => Promise<string | null>>;
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

  // Always require servers to be pre-started by bft e2e
  if (options.server) {
    throw new Error(
      `Server startup requested but setup.ts no longer handles server management. ` +
        `Please run tests through 'bft e2e' which will start required servers automatically ` +
        `based on the server registry. Server requested: ${options.server}`,
    );
  }

  // Fallback to environment variable if no server started and no baseUrl provided
  if (!baseUrl) {
    baseUrl = getConfigurationVariable("BF_E2E_BASE_URL") ||
      "http://localhost:8000";
  }

  // Run in headless mode by default for consistency and performance
  // Only show browser when explicitly requested via BF_E2E_SHOW_BROWSER environment variable
  let headless: boolean;
  const showBrowserEnv = getConfigurationVariable("BF_E2E_SHOW_BROWSER");
  if (showBrowserEnv !== undefined) {
    headless = showBrowserEnv !== "true";
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
      dumpio: false, // Don't dump Chrome's stdio to prevent resource leaks
    });

    // Unref the browser process to prevent it from keeping the event loop alive
    try {
      const processMethod =
        (browser as { process?: () => { unref?: () => void } })
          .process;
      if (processMethod) {
        const process = processMethod();
        if (process && process.unref) {
          process.unref();
          logger.debug("Browser process unref'd to prevent resource leaks");
        }
      }
    } catch (error) {
      logger.debug("Could not unref browser process:", error);
    }

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
    const takeScreenshot = async (
      name: string,
      options?: { fullPage?: boolean },
    ): Promise<string> => {
      const fileName = `${Date.now()}_${name.replace(/\s+/g, "-")}.png`;
      const filePath = join(screenshotsDir, fileName) as `${string}.png`;

      try {
        await page.screenshot({
          path: filePath,
          fullPage: options?.fullPage ?? false,
        });
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

        // Re-inject cursor overlay after navigation since DOM gets replaced
        try {
          await injectCursorOverlay(page);
          logger.debug("Cursor overlay re-injected after navigation");
        } catch (error) {
          logger.warn(
            "Failed to re-inject cursor overlay after navigation:",
            error,
          );
        }

        // Re-inject recording throbber after navigation since DOM gets replaced
        try {
          await addRecordingThrobber(page);
          logger.debug("Recording throbber re-injected after navigation");
        } catch (error) {
          logger.warn(
            "Failed to re-inject recording throbber after navigation:",
            error,
          );
        }
      },
      startVideoRecording: async (
        name: string,
        options?: VideoConversionOptions,
      ): Promise<() => Promise<VideoConversionResult | null>> => {
        const videosDir = getConfigurationVariable("BF_E2E_VIDEO_DIR") ||
          join(Deno.cwd(), "tmp", "videos");

        // Ensure videos directory exists
        await ensureDir(videosDir);

        // Inject cursor overlay for better video visibility
        try {
          await injectCursorOverlay(page);
          logger.debug("Cursor overlay injected for video recording");
        } catch (error) {
          logger.warn("Failed to inject cursor overlay:", error);
        }

        const session = await startScreencastRecording(page, name, videosDir);

        // Start throbber for entire recording session to keep screencast active
        await addRecordingThrobber(page);

        return async (): Promise<VideoConversionResult | null> => {
          try {
            // Stop throbber before stopping recording
            await removeRecordingThrobber(page);

            const videoResult = await stopScreencastRecording(
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
              `Failed to stop video recording: ${(error as Error).message}`,
            );
            return null;
          }
        };
      },
      startVideoRecordingFramesOnly: async (
        name: string,
      ): Promise<() => Promise<string | null>> => {
        const videosDir = getConfigurationVariable("BF_E2E_VIDEO_DIR") ||
          join(Deno.cwd(), "tmp", "videos");

        // Ensure videos directory exists
        await ensureDir(videosDir);

        // Inject cursor overlay for better video visibility
        try {
          await injectCursorOverlay(page);
          logger.debug(
            "Cursor overlay injected for frames-only video recording",
          );
        } catch (error) {
          logger.warn("Failed to inject cursor overlay:", error);
        }

        const session = await startScreencastRecording(page, name, videosDir);

        return async (): Promise<string | null> => {
          try {
            const framesPath = await stopScreencastRecordingFramesOnly(
              page,
              session,
            );

            // Clean up cursor overlay
            try {
              await removeCursorOverlay(page);
            } catch (error) {
              logger.debug("Failed to remove cursor overlay:", error);
            }

            logger.info(`Video frames saved to: ${framesPath}`);
            return framesPath;
          } catch (error) {
            logger.error(
              `Failed to stop frames-only video recording: ${
                (error as Error).message
              }`,
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
          join(Deno.cwd(), "tmp", "videos");

        // Ensure videos directory exists
        await ensureDir(videosDir);

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

    // Give time for all resources to be released
    await new Promise((resolve) => setTimeout(resolve, 100));

    logger.info("E2E test environment torn down (browser only)");
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
  // Just delegate to the context method which handles cursor overlay re-injection
  await context.navigateTo(path);
}
