import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";

const logger = getLogger(import.meta);

Deno.test("Homepage displays hero section with correct content", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording(
      "homepage-hero-test",
      {
        outputFormat: "mp4" as const,
        framerate: 24,
        quality: "medium" as const,
      },
    );

    // Navigate to the home page
    await navigateTo(context, "/");

    // Wait for page to load and hydrate
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check that the page title is correct
    const title = await context.page.title();
    assertEquals(title, "Bolt Foundry", "Page title should be 'Bolt Foundry'");

    // Get the body text to check content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    logger.info("Body text contains:", bodyText?.substring(0, 500));

    // Test for expected hero section content
    assert(
      bodyText?.includes("Structured prompts, reliable output"),
      "Homepage should display hero headline 'Structured prompts, reliable output'",
    );

    assert(
      bodyText?.includes(
        "Open source tooling to turn prompt engineering into more science",
      ),
      "Homepage should display hero subheadline about prompt engineering",
    );

    assert(
      bodyText?.includes("aibff calibrate grader.deck.md"),
      "Homepage should display the command example",
    );

    assert(
      bodyText?.includes("Stay updated"),
      "Homepage should display the 'Stay updated' section",
    );

    assert(
      bodyText?.includes("We're building the future of AI prompt engineering"),
      "Homepage should display the future of AI message",
    );

    assert(
      bodyText?.includes("© 2025 Bolt Foundry. All rights reserved."),
      "Homepage should display copyright footer",
    );

    // Check for navigation elements
    assert(
      bodyText?.includes("Blog"),
      "Homepage should display navigation link to Blog",
    );

    assert(
      bodyText?.includes("Docs"),
      "Homepage should display navigation link to Docs",
    );

    assert(
      bodyText?.includes("Discord"),
      "Homepage should display navigation link to Discord",
    );

    // Verify the page has proper CSS classes for styling
    const hasHeroSection = await context.page.evaluate(() => {
      return document.querySelector(".hero-section") !== null;
    });
    assert(hasHeroSection, "Page should have hero-section CSS class");

    const hasLandingPage = await context.page.evaluate(() => {
      return document.querySelector(".landing-page") !== null;
    });
    assert(hasLandingPage, "Page should have landing-page CSS class");

    const hasLandingHeader = await context.page.evaluate(() => {
      return document.querySelector(".landing-header") !== null;
    });
    assert(hasLandingHeader, "Page should have landing-header CSS class");

    // Check that GitHub stars button is present (even if showing "--")
    const githubButtonExists = await context.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.some((link) =>
        link.href.includes("github.com/bolt-foundry/bolt-foundry")
      );
    });
    assert(githubButtonExists, "Page should have GitHub link button");

    // Check that copy button is present
    const copyButtonExists = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((button) =>
        button.getAttribute("aria-label")?.includes("Copy")
      );
    });
    assert(copyButtonExists, "Page should have copy button for command");

    // Check that Discord and GitHub footer links exist
    const discordFooterLink = await context.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.some((link) => link.href.includes("discord.gg/tU5ksTBfEj"));
    });
    assert(discordFooterLink, "Page should have Discord footer link");

    const githubFooterLink = await context.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.some((link) =>
        link.href.includes("github.com/bolt-foundry/bolt-foundry")
      );
    });
    assert(githubFooterLink, "Page should have GitHub footer link");

    // Verify that we DON'T have the old "Coming Soon" content
    assert(
      !bodyText?.includes("Coming Soon"),
      "Homepage should NOT display 'Coming Soon' - this indicates old content",
    );

    assert(
      !bodyText?.includes("Phase 1 implementation"),
      "Homepage should NOT display 'Phase 1 implementation' - this indicates old content",
    );

    assert(
      !bodyText?.includes("Architecture foundation established"),
      "Homepage should NOT display 'Architecture foundation established' - this indicates old content",
    );

    logger.info("Homepage hero section test completed successfully");

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info(`Video saved to: ${videoResult.videoPath}`);
    }
  } catch (error) {
    await context.takeScreenshot("homepage-hero-test-error");
    logger.error("Homepage hero test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Homepage server-side rendering matches client-side content", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Get the server-side rendered HTML
    const response = await context.page.goto(context.baseUrl);
    const serverHtml = await response?.text();

    // Navigate to page and let client hydrate
    await navigateTo(context, "/");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get client-side content
    const clientBodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // The server HTML should contain the hero headline
    assert(
      serverHtml?.includes("Structured prompts, reliable output"),
      "Server-side HTML should contain hero headline",
    );

    assert(
      serverHtml?.includes("Open source tooling to turn prompt engineering"),
      "Server-side HTML should contain hero subheadline",
    );

    // The client should also show the same content after hydration
    assert(
      clientBodyText?.includes("Structured prompts, reliable output"),
      "Client-side content should contain hero headline after hydration",
    );

    assert(
      clientBodyText?.includes(
        "Open source tooling to turn prompt engineering",
      ),
      "Client-side content should contain hero subheadline after hydration",
    );

    // Both should NOT contain the old content
    assert(
      !serverHtml?.includes("Coming Soon") &&
        !clientBodyText?.includes("Coming Soon"),
      "Neither server nor client should show 'Coming Soon' content",
    );

    logger.info("Server-client content matching test completed successfully");
  } catch (error) {
    await context.takeScreenshot("homepage-ssr-client-match-error");
    logger.error("Homepage SSR-client match test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Homepage copy button functionality works", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to the home page
    await navigateTo(context, "/");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Find and click the copy button
    const copyButton = await context.page.locator('button[aria-label*="Copy"]');
    await copyButton.click();

    // We can't easily test clipboard in headless mode, but we can verify the button exists and is clickable
    const copyButtonExists = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((button) =>
        button.getAttribute("aria-label")?.includes("Copy")
      );
    });
    assert(copyButtonExists, "Copy button should exist and be clickable");

    logger.info("Copy button functionality test completed successfully");
  } catch (error) {
    await context.takeScreenshot("homepage-copy-button-error");
    logger.error("Homepage copy button test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
