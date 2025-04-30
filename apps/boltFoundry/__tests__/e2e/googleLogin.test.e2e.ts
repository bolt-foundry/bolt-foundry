
#!/usr/bin/env -S bff e2e

import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("User can log in with Google", async () => {
  // Check if we have the required environment variable
  const googleTestJwt = Deno.env.get("GOOGLE_TEST_JWT");
  if (!googleTestJwt) {
    logger.warn("GOOGLE_TEST_JWT environment variable not set, skipping test");
    return;
  }

  const context = await setupE2ETest();
  try {
    const { page } = context;

    // Set up request interception to mock Google authentication
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();

      // 1️⃣  Let the Identity-Services SDK & its iframe through
      if (url.startsWith("https://accounts.google.com/gsi/")) {
        return req.continue();
      }

      // 2️⃣  Intercept ONLY the top-level popup document
      if (
        url.startsWith("https://accounts.google.com/") &&
        req.resourceType() === "document"          // pop-up navigations
      ) {
        return req.respond({
          status: 200,
          contentType: "text/html",
          body: `
            <html><body>
              <script>
                window.opener.postMessage(
                  { credential: "${googleTestJwt}" },
                  "*"
                );
                window.close();
              </script>
            </body></html>`,
        });
      }

      // 3️⃣  Fake token-introspection
      if (url.startsWith("https://oauth2.googleapis.com/tokeninfo")) {
        return req.respond({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            email: "test@example.com",
            email_verified: true,
            sub: "123456789",
          }),
        });
      }

      req.continue();
    });

    // Navigate to login page
    await navigateTo(context, "/login");
    
    // Take screenshot before login attempt
    await context.takeScreenshot("before-google-login");
    
    // Find and click the Google sign-in button
    const googleButton = await page.waitForSelector('[data-testid="google-login-button"]', { 
      timeout: 5000,
      visible: true 
    });
    
    logger.info("Clicking Google login button");
    await googleButton.click();
    
    // Wait for authenticated state
    logger.info("Waiting for authenticated state");
    await page.waitForFunction(() => {
      return document.body.textContent?.includes("logged in as CurrentViewerLoggedIn");
    }, { timeout: 10000 });
    
    // Take screenshot after successful login
    await context.takeScreenshot("after-google-login");
    
    // Verify login was successful
    const content = await page.content();
    assert(content.includes("logged in as CurrentViewerLoggedIn"), 
      "Page should show user is logged in after Google authentication");
    
    logger.info("Google login test completed successfully");
  } catch (error) {
    // Take screenshot on error
    await context.takeScreenshot("google-login-error");
    logger.error("Google login test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
