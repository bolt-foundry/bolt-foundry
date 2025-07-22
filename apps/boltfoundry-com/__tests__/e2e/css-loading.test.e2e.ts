import { assert } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";

const logger = getLogger(import.meta);

Deno.test("CSS loading - inline and external CSS on home page", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to the home page (where our test squares are)
    await navigateTo(context, "/");

    // Take screenshot of home page to verify CSS squares are visible
    await context.takeScreenshot("css-test-home-page");

    // Verify both squares are visible in the DOM
    const squaresStatus = await context.page.evaluate(() => {
      // Check for green square (inline CSS)
      const hasGreenSquare = Array.from(document.querySelectorAll("div")).some(
        (div) => {
          const styles = globalThis.getComputedStyle(div);
          return (
            styles.backgroundColor === "green" ||
            styles.backgroundColor === "rgb(0, 128, 0)"
          );
        },
      );

      // Check for red square (external CSS)
      const redSquare = document.getElementById("test-red-square");
      const hasRedSquare = redSquare !== null;
      let redSquareStyled = false;
      if (redSquare) {
        const styles = globalThis.getComputedStyle(redSquare);
        redSquareStyled = styles.backgroundColor === "red" ||
          styles.backgroundColor === "rgb(255, 0, 0)";
      }

      return {
        greenSquarePresent: hasGreenSquare,
        redSquarePresent: hasRedSquare,
        redSquareStyled: redSquareStyled,
        allDivs: Array.from(document.querySelectorAll("div")).length,
        pageText: document.body.textContent?.substring(0, 200),
      };
    });

    logger.info(`CSS squares status:`, squaresStatus);

    // Verify the page loaded correctly first
    assert(
      squaresStatus.pageText?.includes("Bolt Foundry"),
      "Home page should contain 'Bolt Foundry' text",
    );

    // Verify green square (inline CSS) is present and styled
    assert(
      squaresStatus.greenSquarePresent,
      "Green square with inline CSS should be visible and styled",
    );

    // Verify red square element exists
    assert(
      squaresStatus.redSquarePresent,
      "Red square element with ID 'test-red-square' should exist in DOM",
    );

    // Verify red square is styled (external CSS loaded)
    assert(
      squaresStatus.redSquareStyled,
      "Red square should be styled with red background from external CSS",
    );

    // Check that the bundled CSS file is loaded correctly
    const cssInfo = await context.page.evaluate(() => {
      const cssLinks = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]'),
      );
      return {
        cssLinksCount: cssLinks.length,
        cssHrefs: cssLinks.map((link) => link.getAttribute("href")),
        hasBundledCSS: cssLinks.some((link) => {
          const href = link.getAttribute("href");
          return href && href.includes("/static/build/assets/") &&
            href.includes(".css");
        }),
      };
    });

    logger.info("CSS loading info:", cssInfo);

    assert(
      cssInfo.hasBundledCSS,
      "Bundled CSS file should be loaded from /static/build/assets/",
    );

    assert(
      cssInfo.cssLinksCount > 0,
      "At least one CSS file should be loaded",
    );

    // Take a final screenshot showing the successful state
    await context.takeScreenshot("css-test-success");

    logger.info(
      "CSS loading test completed successfully - both inline and external CSS working",
    );
  } catch (error) {
    await context.takeScreenshot("css-test-error");
    logger.error("CSS loading test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
