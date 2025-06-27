#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("grader multiple blocks - handles multiple code blocks in one message", async () => {
  // Start the aibff gui dev server
  const serverPort = 3019;
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", String(serverPort), "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const serverProcess = command.spawn();

  // Wait for server to be ready
  let serverReady = false;
  const maxRetries = 50;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${serverPort}/health`);
      await response.body?.cancel();
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch {
      // Server not ready yet
    }
    await delay(100);
  }

  assertEquals(
    serverReady,
    true,
    "Dev server failed to start within timeout",
  );

  // Mock the AI response to return multiple code blocks
  // We'll intercept the SSE endpoint
  const mockAIResponse =
    `I'll help you create a comprehensive grader. Here's the main structure:

\`\`\`markdown
# YouTube Comment Technical Tutorial Classifier

This grader evaluates whether a YouTube comment is about technical tutorials.

## Scoring Guidelines
- **+3**: Clearly discussing technical tutorial content
- **+2**: Mostly about technical aspects
- **+1**: Some technical discussion
- **0**: Cannot determine / Invalid input
- **-1**: Slightly off-topic
- **-2**: Mostly non-technical
- **-3**: Completely unrelated to tutorials
\`\`\`

And here's an example section you can add:

\`\`\`markdown
## Example Classifications

### +3 Examples
- "Great explanation of the async/await pattern!"
- "The Docker setup at 5:23 really helped me understand containers"

### -3 Examples  
- "First!"
- "Who else is watching in 2024?"
\`\`\`

You can also include some non-markdown code for reference:

\`\`\`javascript
// This is just an example, not for the grader
const score = evaluateComment(comment);
\`\`\`

Feel free to modify these templates as needed!`;

  // Setup Puppeteer e2e test
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

  try {
    // Navigate to home
    await context.page.goto(context.baseUrl, {
      waitUntil: "networkidle2",
    });

    // Wait for initial conversation to load
    await context.page.waitForFunction(
      () => globalThis.location.hash.includes("/chat/conv-"),
      { timeout: 5000 },
    );

    await delay(1000);

    // Inject our mock response by intercepting fetch
    await context.page.evaluateOnNewDocument((mockResponse) => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        const url = typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;

        if (url.includes("/api/chat/stream")) {
          // Return a mock SSE stream
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              // Send the mock response as SSE data
              const lines = mockResponse.split(" ");
              lines.forEach((word) => {
                const data = `data: ${
                  JSON.stringify({ content: word + " " })
                }\n\n`;
                controller.enqueue(encoder.encode(data));
              });
              controller.enqueue(encoder.encode("event: done\ndata: {}\n\n"));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        }

        return await originalFetch(input, init);
      };
    }, mockAIResponse);

    // Send a message
    const testMessage = "Show me multiple grader templates";
    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      testMessage,
    );

    // Click send
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((btn) => btn.textContent === "Send");
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
      }
    });

    // Wait for response to render
    await delay(3000);

    // Count the number of code blocks
    const codeBlockCount = await context.page.evaluate(() => {
      return document.querySelectorAll("pre").length;
    });

    assertEquals(codeBlockCount, 3, "Should have 3 code blocks");

    // Count "Add to Grader" buttons (should only be on markdown blocks)
    const addButtonCount = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.filter((btn) => btn.textContent === "Add to Grader")
        .length;
    });

    assertEquals(
      addButtonCount,
      2,
      "Should have 2 'Add to Grader' buttons (only for markdown blocks)",
    );

    // Click the first "Add to Grader" button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const firstAddButton = buttons.find((btn) =>
        btn.textContent === "Add to Grader"
      );
      if (firstAddButton) {
        (firstAddButton as HTMLButtonElement).click();
      }
    });

    await delay(500);

    // Check grader content
    let graderContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assert(
      graderContent.includes("YouTube Comment Technical Tutorial Classifier"),
      "First code block should be in grader",
    );
    assert(
      !graderContent.includes("Example Classifications"),
      "Second code block should not be in grader yet",
    );

    // Click the second "Add to Grader" button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const addButtons = buttons.filter((btn) =>
        btn.textContent === "Add to Grader"
      );
      if (addButtons[1]) {
        (addButtons[1] as HTMLButtonElement).click();
      }
    });

    await delay(500);

    // Check grader content again
    graderContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assert(
      graderContent.includes("YouTube Comment Technical Tutorial Classifier"),
      "First code block should still be in grader",
    );
    assert(
      graderContent.includes("Example Classifications"),
      "Second code block should now be in grader",
    );
    assert(
      !graderContent.includes("javascript"),
      "JavaScript code block should not be in grader",
    );

    // Take screenshot
    await context.takeScreenshot("grader-multiple-code-blocks");

    logger.info("Multiple code blocks test completed successfully");
  } finally {
    await teardownE2ETest(context);

    // Stop the server process
    try {
      await serverProcess.stdout.cancel();
      await serverProcess.stderr.cancel();
      serverProcess.kill();
      await serverProcess.status;
    } catch {
      // Process may have already exited
    }

    // Clean up conversations
    try {
      await Deno.remove("conversations", { recursive: true });
    } catch {
      // Directory might not exist
    }
  }
});
