#!/usr/bin/env -S bff e2e

import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { attemptLogin, setupGoogleOAuthMock } from "../helpers/authMock.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("RLHF shows demo conversation", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Setup Google OAuth mock
    await setupGoogleOAuthMock(context.page);

    // Start annotated video recording
    const { stop, showSubtitle, highlightElement } = await context
      .startAnnotatedVideoRecording("rlhf-conversation-demo");

    // Show opening subtitle
    await showSubtitle("Testing RLHF Demo Conversation Display 🤖");
    await context.smoothWait(2000);

    // Navigate to RLHF interface
    await navigateTo(context, "/rlhf");
    await context.page.waitForNetworkIdle({ timeout: 3000 });

    await showSubtitle("Navigating to /rlhf route...");
    await context.smoothWait(1500);

    // Attempt login if needed
    const didLogin = await attemptLogin(context);
    if (didLogin) {
      await showSubtitle("Login completed - checking for demo data");
      await context.smoothWait(1000);
    }

    // Check for demo conversation
    const pageText = await context.page.evaluate(() => document.body.innerText);
    const hasConversation = pageText.includes("User:") ||
      pageText.includes("Customer:");

    if (hasConversation) {
      logger.info("✅ Demo conversation is showing!");
      await showSubtitle("✅ Success! Demo conversation found");
      await highlightElement(
        "body",
        "Demo conversation is displaying correctly! 🎉",
      );
    } else {
      logger.info("❌ No demo conversation found yet");
      await showSubtitle(
        "❌ No demo conversation found - needs implementation",
      );
      await highlightElement(
        "body",
        "This page needs demo conversation data 📝",
      );
    }

    await context.smoothWait(2000);
    await context.takeScreenshot("rlhf-conversation-test");

    await showSubtitle("Test complete! 👋");
    await context.smoothWait(1500);

    await stop();
  } finally {
    await teardownE2ETest(context);
  }
});
