#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "./helpers.ts";

const logger = getLogger(import.meta);

Deno.test.ignore(
  "boltfoundry-com loads successfully with Isograph integration",
  async () => {
    const context = await setupBoltFoundryComTest();

    try {
      // Navigate to the app
      await navigateTo(context, "/");

      // Take initial screenshot
      await context.takeScreenshot("boltfoundry-com-initial");

      // Wait for the app to load
      await context.page.waitForFunction(
        () => {
          return document.body.textContent?.includes("Bolt Foundry");
        },
        { timeout: 10000 },
      );

      // Wait a bit more for React to hydrate and Isograph to load
      await delay(2000);

      const title = await context.page.title();
      logger.info(`Page title: ${title}`);

      // Check basic page structure
      const hasBoltFoundryTitle = await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("h1"));
        return elements.some((el) => el.textContent?.trim() === "Bolt Foundry");
      });
      assert(hasBoltFoundryTitle, "Should show 'Bolt Foundry' title");

      // Check for the "Coming Soon" text
      const hasComingSoon = await context.page.evaluate(() => {
        const allText = document.body.textContent || "";
        return allText.includes("Coming Soon");
      });
      assert(hasComingSoon, "Should show 'Coming Soon' text");

      // Most importantly: Check for Isograph GraphQL integration
      const hasGraphQLContent = await context.page.evaluate(() => {
        const allText = document.body.textContent || "";
        return allText.includes("GraphQL Says:");
      });
      assert(
        hasGraphQLContent,
        "Should show 'GraphQL Says:' from Isograph component",
      );

      // Check for the actual hello message from GraphQL
      const hasHelloMessage = await context.page.evaluate(() => {
        const allText = document.body.textContent || "";
        return allText.includes("Hello from Bolt Foundry!");
      });
      assert(
        hasHelloMessage,
        "Should show 'Hello from Bolt Foundry!' message from GraphQL resolver",
      );

      // Take screenshot after successful load
      await context.takeScreenshot("boltfoundry-com-loaded");

      logger.info(
        "boltfoundry-com Isograph integration e2e test completed successfully",
      );
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("boltfoundry-com-error");
      logger.error("Test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);

Deno.test(
  "boltfoundry-com GraphQL endpoint works directly",
  async () => {
    const context = await setupBoltFoundryComTest();

    try {
      // Test GraphQL endpoint directly
      const response = await fetch(`${context.baseUrl}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "query { hello }",
        }),
      });

      assert(response.ok, "GraphQL endpoint should respond successfully");

      const result = await response.json();
      logger.info("GraphQL response:", result);

      assert(result.data, "GraphQL response should have data field");
      assertEquals(
        result.data.hello,
        "Hello from Bolt Foundry!",
        "Should return correct hello message",
      );

      logger.info("GraphQL endpoint test completed successfully");
    } catch (error) {
      logger.error("GraphQL endpoint test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);
