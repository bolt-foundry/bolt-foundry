import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { type Browser, launch, type Page } from "puppeteer-core";
import { getLogger } from "packages/logger/logger.ts";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";

const logger = getLogger(import.meta);

export interface E2ETestContext {
  browser: Browser;
  page: Page;
  baseUrl: string;
  takeScreenshot: (name: string) => Promise<string>;
}

/**
 * Sets up the e2e test environment
 */
export async function setupE2ETest(options: {
  baseUrl?: string;
  headless?: boolean;
} = {}): Promise<E2ETestContext> {
  const baseUrl = options.baseUrl || "http://localhost:8000";
  const headless = options.headless !== false ? true : getConfigurationVariable(
    "BF_E2E_HEADLESS",
  ) != "false";

  logger.info(`Starting e2e test with baseUrl: ${baseUrl}`);

  try {
    // Find the chromium executable path
    let chromiumPath = "chromium";
    try {
      const command = new Deno.Command("which", {
        args: ["chromium"],
        stdout: "piped",
      });
      const output = await command.output();
      const path = new TextDecoder().decode(output.stdout).trim();
      if (path) {
        chromiumPath = path;
        logger.info(`Found Chromium at: ${chromiumPath}`);
      }
    } catch (error) {
      logger.warn(
        `Could not detect Chromium path: ${
          (error as Error).message
        }. Using default.`,
      );
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
      const filePath = join(screenshotsDir, fileName);

      try {
        await page.screenshot({ path: filePath, fullPage: true });
        logger.info(`Screenshot saved to: ${filePath}`);
        return filePath;
      } catch (error) {
        logger.error(`Failed to take screenshot: ${(error as Error).message}`);
        return "";
      }
    };

    return { browser, page, baseUrl, takeScreenshot };
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
