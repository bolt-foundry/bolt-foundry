import { type Browser, launch, type Page } from "puppeteer-core";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface E2ETestContext {
  browser: Browser;
  page: Page;
  baseUrl: string;
}

/**
 * Sets up the e2e test environment
 */
export async function setupE2ETest(options: {
  baseUrl?: string;
  headless?: boolean;
} = {}): Promise<E2ETestContext> {
  const baseUrl = options.baseUrl || "http://localhost:8000";
  const headless = options.headless !== false;

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

    // Launch browser using puppeteer-core
    const browser = await launch({
      headless,
      executablePath: chromiumPath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    return { browser, page, baseUrl };
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
    if (context.browser) {
      await context.browser.close();
    }
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
