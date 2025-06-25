#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bolt-foundry/logger";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import type { ConsoleMessage } from "puppeteer-core";

const logger = getLogger(import.meta);

Deno.test.ignore(
  "aibff gui --dev loads successfully with routing and Isograph",
  async () => {
    // Assume the dev server is already running on port 3006
    // Check if server is available
    let serverReady = false;
    try {
      const response = await fetch("http://localhost:3006/health");
      await response.body?.cancel();
      serverReady = response.ok;
    } catch {
      // Server not available
    }

    assertEquals(
      serverReady,
      true,
      "Dev server should be running on port 3006. Please start it with: aibff gui --dev --port 3006",
    );

    // Setup Puppeteer e2e test
    const context = await setupE2ETest({
      baseUrl: "http://localhost:3006",
      headless: true, // Run headless in tests
    });

    try {
      // Navigate to the GUI
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      // Add comprehensive error logging
      context.page.on("pageerror", (error: Error) => {
        logger.error("Page error:", error.message);
      });

      context.page.on("console", async (msg: ConsoleMessage) => {
        if (msg.type() === "error") {
          logger.error("Console error:", msg.text());
          // Try to get more details about the error
          for (let i = 0; i < msg.args().length; i++) {
            try {
              const arg = msg.args()[i];
              const properties = await arg.getProperties();
              // deno-lint-ignore no-explicit-any
              const errorDetails: any = {};
              for (const [key, value] of properties) {
                try {
                  errorDetails[key] = await value.jsonValue();
                } catch {
                  errorDetails[key] = "Unable to serialize";
                }
              }
              logger.error(`  Error details:`, errorDetails);
            } catch (e) {
              logger.error(`  Could not get error details: ${e}`);
            }
          }
        }
      });

      // Check for any script errors
      const scriptErrors = await context.page.evaluate(() => {
        // deno-lint-ignore no-explicit-any
        return (window as any).__SCRIPT_ERRORS__ || [];
      });
      if (scriptErrors.length > 0) {
        logger.error("Script errors:", scriptErrors);
      }

      // Take initial screenshot
      await context.takeScreenshot("aibff-gui-initial");

      // Debug: Check what's on the page
      const pageContent = await context.page.content();
      logger.debug("Page HTML length:", pageContent.length);

      // Debug: Check for any error messages
      const bodyText = await context.page.evaluate(() =>
        document.body?.textContent || "No body"
      );
      logger.debug("Body text:", bodyText.substring(0, 200));

      // Debug: Check if root div exists
      const rootExists = await context.page.evaluate(() => {
        return !!document.getElementById("root");
      });
      logger.debug("Root div exists:", rootExists);

      // Debug: Check for React rendering
      const rootContent = await context.page.evaluate(() => {
        const root = document.getElementById("root");
        return root ? root.innerHTML : "No root div";
      });
      logger.debug("Root content:", rootContent.substring(0, 200));

      // Check for module load errors
      const moduleErrors = await context.page.evaluate(() => {
        // deno-lint-ignore no-explicit-any
        return (window as any).__vite_ssr_dynamic_import_support__ === false;
      });
      logger.debug("Module import issues:", moduleErrors);

      // Check for any Isograph errors
      const isographCheck = await context.page.evaluate(() => {
        try {
          // Check if iso function exists
          const scripts = Array.from(document.querySelectorAll("script"));
          const srcScripts = scripts.filter((s) => s.src).map((s) => s.src);
          return {
            scriptCount: scripts.length,
            srcScripts,
            // deno-lint-ignore no-explicit-any
            hasIso: typeof (window as any).iso !== "undefined",
          };
        } catch (e) {
          return { error: (e as Error).message };
        }
      });
      logger.debug("Isograph check:", isographCheck);

      // Wait a bit more for React to render
      await delay(2000);

      // Check again after delay
      const rootContentAfterDelay = await context.page.evaluate(() => {
        const root = document.getElementById("root");
        return root ? root.innerHTML : "No root div";
      });
      logger.debug(
        "Root content after delay:",
        rootContentAfterDelay.substring(0, 200),
      );

      // Check if error was displayed
      const errorContent = await context.page.evaluate(() => {
        const errorH1 = document.querySelector("h1");
        const errorPre = document.querySelector("pre");
        return {
          hasError: errorH1?.textContent === "Error",
          errorMessage: errorPre?.textContent || null,
          bodyHTML: document.body.innerHTML.substring(0, 500),
        };
      });
      logger.debug("Error check:", errorContent);

      // Wait for content to load - look for the new header
      await context.page.waitForSelector("h1", { timeout: 5000 });

      // Wait a bit more for React to hydrate
      await delay(500);

      const title = await context.page.title();
      logger.info(`Page title: ${title}`);
      assertEquals(title, "Vite + React + TS"); // Title hasn't been updated yet

      // Check that the header exists with correct text
      const headerText = await context.page.evaluate(() => {
        const h1 = document.querySelector("h1");
        return h1?.textContent;
      });
      assertEquals(headerText, "aibff GUI", "Header should show 'aibff GUI'");

      // Check that navigation links exist
      const navLinks = await context.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("nav a"));
        return links.map((link) => link.textContent);
      });
      logger.info("Found navigation links:", navLinks);
      assert(navLinks.includes("Chat"), "Should have Chat link");
      assert(navLinks.includes("Samples"), "Should have Samples link");
      assert(navLinks.includes("Graders"), "Should have Graders link");
      assert(navLinks.includes("Evaluations"), "Should have Evaluations link");

      // Check that we're on the Chat page by default
      const chatHeading = await context.page.evaluate(() => {
        const h2 = document.querySelector("h2");
        return h2?.textContent;
      });
      assertEquals(
        chatHeading,
        "Chat Interface",
        "Should show Chat Interface heading",
      );

      // Check for the GraphQL placeholder text
      const hasGraphQLPlaceholder = await context.page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll("div"));
        return divs.some((div) =>
          div.textContent === "GraphQL integration coming soon..."
        );
      });
      assert(hasGraphQLPlaceholder, "Should show GraphQL placeholder message");

      // Navigate to Samples page
      await context.page.click('a[href="#/samples"]');
      await delay(100);

      const samplesHeading = await context.page.evaluate(() => {
        const h2 = document.querySelector("h2");
        return h2?.textContent;
      });
      assertEquals(
        samplesHeading,
        "Samples",
        "Should show Samples heading after navigation",
      );

      // Take screenshot after interaction
      await context.takeScreenshot("aibff-gui-after-click");

      logger.info("aibff GUI e2e test completed successfully");
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("aibff-gui-error");
      logger.error("Test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);
