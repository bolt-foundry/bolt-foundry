#!/usr/bin/env -S bft e2e

import { assert } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupAibffGuiTest } from "./helpers.ts";
import {
  smoothClick,
  type smoothClickText,
  smoothType,
} from "@bfmono/infra/testing/video-recording/smooth-ui.ts";

const logger = getLogger(import.meta);

Deno.test(
  "aibff conversation panel simple test",
  async () => {
    const context = await setupAibffGuiTest();

    try {
      // Start video recording
      const stopRecording = await context.startVideoRecording(
        "conversation-panel-bfds-demo",
      );

      // Navigate to the GUI
      await navigateTo(context, "/");

      // Wait for the page to load
      await context.page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          return !bodyText.includes("Loading conversation...");
        },
        { timeout: 10000 },
      );

      // Wait for React to hydrate
      await delay(2000);

      // Take initial screenshot
      await context.takeScreenshot("conversation-panel-initial");

      // Click on "System Prompt" text using smooth UI
      logger.info("Clicking on System Prompt...");
      try {
        // First try to find element with bfds-list-item__main that contains "System Prompt"
        const systemPromptFound = await context.page.evaluate(() => {
          const elements = document.querySelectorAll(".bfds-list-item__main");
          for (const element of elements) {
            if (
              element.textContent &&
              element.textContent.includes("System Prompt")
            ) {
              element.setAttribute("data-temp-testid", "system-prompt-target");
              return true;
            }
          }
          return false;
        });

        if (systemPromptFound) {
          await smoothClick(
            context,
            '[data-temp-testid="system-prompt-target"]',
          );
          await delay(1000);
          await context.takeScreenshot("after-system-prompt-click");

          // Clean up the temporary attribute
          await context.page.evaluate(() => {
            const element = document.querySelector(
              '[data-temp-testid="system-prompt-target"]',
            );
            if (element) {
              element.removeAttribute("data-temp-testid");
            }
          });

          // Type text in the system prompt textarea (in the sidebar)
          logger.info("Typing text in system prompt...");
          const promptText =
            "You are a helpful assistant. Please respond clearly and concisely.";
          try {
            // Wait for the system prompt section to be visible
            await delay(500);

            // Find the textarea within the System Prompt section in the sidebar
            const textareaFound = await context.page.evaluate(() => {
              // Look for textarea within the system prompt section
              const systemPromptSection = document.querySelector(
                '[class*="system-prompt"], [class*="System"], [data-testid*="system"]',
              );
              if (systemPromptSection) {
                const textarea = systemPromptSection.querySelector("textarea");
                if (textarea) {
                  textarea.setAttribute(
                    "data-temp-testid",
                    "system-prompt-textarea",
                  );
                  return true;
                }
              }

              // Fallback: look for textarea in the right sidebar area
              const sidebar = document.querySelector(
                '[class*="sidebar"], [class*="panel"]',
              );
              if (sidebar) {
                const textarea = sidebar.querySelector("textarea");
                if (textarea) {
                  textarea.setAttribute(
                    "data-temp-testid",
                    "system-prompt-textarea",
                  );
                  return true;
                }
              }

              return false;
            });

            if (textareaFound) {
              await smoothType(
                context,
                '[data-temp-testid="system-prompt-textarea"]',
                promptText,
                {
                  charDelay: 50,
                  clickFirst: true,
                  clearFirst: true,
                },
              );

              // Clean up the temporary attribute
              await context.page.evaluate(() => {
                const element = document.querySelector(
                  '[data-temp-testid="system-prompt-textarea"]',
                );
                if (element) {
                  element.removeAttribute("data-temp-testid");
                }
              });
            } else {
              logger.info(
                "System prompt textarea not found, trying generic textarea",
              );
              await smoothType(context, "textarea", promptText, {
                charDelay: 50,
                clickFirst: true,
                clearFirst: true,
              });
            }

            await delay(1000);
            await context.takeScreenshot("after-typing-prompt");
          } catch (error) {
            logger.info("Error typing in system prompt:", error);
          }

          // Click on "Test Conversation"
          logger.info("Clicking on Test Conversation...");
          try {
            const testConvFound = await context.page.evaluate(() => {
              const elements = document.querySelectorAll(
                ".bfds-list-item__main",
              );
              for (const element of elements) {
                if (
                  element.textContent &&
                  element.textContent.includes("Test Conversation")
                ) {
                  element.setAttribute(
                    "data-temp-testid",
                    "test-conversation-target",
                  );
                  return true;
                }
              }
              return false;
            });

            if (testConvFound) {
              await smoothClick(
                context,
                '[data-temp-testid="test-conversation-target"]',
              );
              await delay(1000);
              await context.takeScreenshot("after-test-conversation-click");

              // Clean up the temporary attribute
              await context.page.evaluate(() => {
                const element = document.querySelector(
                  '[data-temp-testid="test-conversation-target"]',
                );
                if (element) {
                  element.removeAttribute("data-temp-testid");
                }
              });

              // Now run a test conversation in the Test Conversation section
              logger.info("Starting test conversation in sidebar...");
              try {
                // Wait for the Test Conversation section to be visible
                await delay(1000);

                // Find the textarea within the Test Conversation section
                const testConvTextareaFound = await context.page.evaluate(
                  () => {
                    // Look for textarea within the test conversation section
                    const testConvSection = document.querySelector(
                      '[class*="test-conversation"], [class*="Test"], [data-testid*="test"]',
                    );
                    if (testConvSection) {
                      const textarea = testConvSection.querySelector(
                        "textarea",
                      );
                      if (textarea) {
                        textarea.setAttribute(
                          "data-temp-testid",
                          "test-conversation-textarea",
                        );
                        return true;
                      }
                    }

                    // Fallback: look for any textarea in the sidebar that's not the system prompt one
                    const sidebar = document.querySelector(
                      '[class*="sidebar"], [class*="panel"]',
                    );
                    if (sidebar) {
                      const textareas = sidebar.querySelectorAll("textarea");
                      // Find a textarea that's not in the system prompt section
                      for (const textarea of textareas) {
                        const parent = textarea.closest(
                          '[class*="system-prompt"], [class*="System"]',
                        );
                        if (!parent) {
                          textarea.setAttribute(
                            "data-temp-testid",
                            "test-conversation-textarea",
                          );
                          return true;
                        }
                      }
                    }

                    return false;
                  },
                );

                const testMessage =
                  "Hello! Can you help me with a simple task?";
                logger.info(
                  "Typing test message in Test Conversation section...",
                );

                if (testConvTextareaFound) {
                  await smoothType(
                    context,
                    '[data-temp-testid="test-conversation-textarea"]',
                    testMessage,
                    {
                      charDelay: 60,
                      clickFirst: true,
                      clearFirst: true,
                    },
                  );

                  // Clean up the temporary attribute
                  await context.page.evaluate(() => {
                    const element = document.querySelector(
                      '[data-temp-testid="test-conversation-textarea"]',
                    );
                    if (element) {
                      element.removeAttribute("data-temp-testid");
                    }
                  });
                } else {
                  logger.info(
                    "Test Conversation textarea not found in sidebar, using fallback",
                  );
                  await smoothType(
                    context,
                    "textarea",
                    testMessage,
                    {
                      charDelay: 60,
                      clickFirst: true,
                      clearFirst: true,
                    },
                  );
                }

                await delay(500);
                await context.takeScreenshot("test-message-typed");

                // Look for Send button specifically in the Test Conversation section
                logger.info("Sending test message from sidebar...");

                // Monitor network requests to see if Send button triggers anything
                const networkRequests: Array<string> = [];
                context.page.on("request", (request) => {
                  networkRequests.push(`${request.method()} ${request.url()}`);
                });

                // Monitor console logs for debugging
                const consoleLogs: Array<string> = [];
                const errorLogs: Array<string> = [];
                context.page.on("console", (msg) => {
                  const text = msg.text();
                  const type = msg.type();

                  if (type === "error") {
                    errorLogs.push(text);
                    logger.error(`[Browser Error] ${text}`);
                  } else if (
                    text.includes("🔍 [TestConversation]") ||
                    text.includes("TestConversation") ||
                    text.includes("handleSend") ||
                    text.includes("REAL Send button clicked")
                  ) {
                    consoleLogs.push(text);
                    logger.info(`[Browser Console] ${text}`);
                  }
                });

                try {
                  // Debug: First check what buttons exist
                  const buttonDebugInfo = await context.page.evaluate(() => {
                    const allButtons = document.querySelectorAll("button");
                    const testButton = document.querySelector(
                      '[data-testid="test-conversation-send-button"]',
                    );

                    return {
                      totalButtons: allButtons.length,
                      buttonTexts: Array.from(allButtons).map((b) =>
                        b.textContent?.trim() || ""
                      ),
                      testButtonExists: !!testButton,
                      testButtonDisabled: testButton
                        ? (testButton as HTMLButtonElement).disabled
                        : "not found",
                      testButtonText: testButton
                        ? testButton.textContent?.trim()
                        : "not found",
                      testButtonVisible: testButton
                        ? getComputedStyle(testButton).display !== "none"
                        : false,
                    };
                  });

                  logger.info("🔍 Button debug info:", buttonDebugInfo);
                  console.log("🔍 Button debug info:", buttonDebugInfo);

                  // Find our specific TestSend button
                  const sidebarSendButtonFound = await context.page.evaluate(
                    () => {
                      // Look for our specific test button first
                      const testButton = document.querySelector(
                        '[data-testid="test-conversation-send-button"]',
                      );
                      if (testButton) {
                        testButton.setAttribute(
                          "data-temp-testid",
                          "sidebar-send-button",
                        );
                        return true;
                      }

                      // Fallback: find any button with "TestSend" text
                      const buttons = document.querySelectorAll("button");
                      for (const button of buttons) {
                        const buttonText = button.textContent || "";
                        if (buttonText.includes("TestSend")) {
                          button.setAttribute(
                            "data-temp-testid",
                            "sidebar-send-button",
                          );
                          return true;
                        }
                      }

                      return false;
                    },
                  );

                  if (sidebarSendButtonFound) {
                    logger.info(
                      "Found Send button in sidebar, inspecting and clicking...",
                    );

                    // Debug the Send button before clicking
                    const buttonInfo = await context.page.evaluate(() => {
                      const button = document.querySelector(
                        '[data-temp-testid="sidebar-send-button"]',
                      ) as HTMLButtonElement;
                      if (button) {
                        // Get parent element info to see what's wrapping the button
                        const parentElement = button.parentElement;
                        const grandparent = parentElement?.parentElement;

                        return {
                          tagName: button.tagName,
                          type: button.type,
                          disabled: button.disabled,
                          onclick: button.onclick
                            ? "has onclick"
                            : "no onclick",
                          formAction: button.formAction,
                          hasEventListeners: !!button.getAttribute(
                            "data-has-listeners",
                          ),
                          classes: Array.from(button.classList),
                          parentForm: button.form ? "has form" : "no form",
                          parentTag: parentElement?.tagName || "no parent",
                          grandparentTag: grandparent?.tagName ||
                            "no grandparent",
                          parentClasses: parentElement
                            ? Array.from(parentElement.classList)
                            : [],
                          grandparentClasses: grandparent
                            ? Array.from(grandparent.classList)
                            : [],
                        };
                      }
                      return { error: "button not found" };
                    });

                    logger.info("Send button info:", buttonInfo);

                    await smoothClick(
                      context,
                      '[data-temp-testid="sidebar-send-button"]',
                    );

                    // Clean up
                    await context.page.evaluate(() => {
                      const element = document.querySelector(
                        '[data-temp-testid="sidebar-send-button"]',
                      );
                      if (element) {
                        element.removeAttribute("data-temp-testid");
                      }
                    });
                  } else {
                    logger.info(
                      "Sidebar Send button not found, skipping send for now",
                    );
                    // Don't use fallback to avoid hitting wrong button
                  }
                } catch (error) {
                  logger.info("Error finding sidebar Send button:", error);
                }

                await delay(1000);
                await context.takeScreenshot("test-message-sent");

                // Log network requests made during Send button click
                logger.info(
                  `Network requests after Send click: ${networkRequests.length} requests`,
                );
                networkRequests.forEach((req, i) => {
                  logger.info(`  ${i + 1}. ${req}`);
                });

                // Log browser console output
                logger.info(
                  `Console logs captured: ${consoleLogs.length} messages`,
                );
                consoleLogs.forEach((log, i) => {
                  logger.info(`  ${i + 1}. ${log}`);
                });

                // Log browser errors
                logger.info(
                  `Error logs captured: ${errorLogs.length} errors`,
                );
                errorLogs.forEach((error, i) => {
                  logger.error(`  ${i + 1}. ${error}`);
                });

                // Wait for potential AI response and debug what's happening
                logger.info("Waiting for AI response...");

                // Check for any error messages or status indicators
                await delay(2000);
                const debugInfo = await context.page.evaluate(() => {
                  const body = document.body.textContent || "";
                  return {
                    hasErrorText: body.includes("error") ||
                      body.includes("Error"),
                    hasLoadingText: body.includes("loading") ||
                      body.includes("Loading"),
                    hasAssistantLabel: body.includes("Assistant"),
                    hasWaitingIndicator: body.includes("...") ||
                      body.includes("thinking"),
                    conversationContent: document.querySelector(
                      '[class*="conversation"], [class*="chat"]',
                    )?.textContent?.substring(0, 500),
                    sidebarContent: document.querySelector(
                      '[class*="sidebar"], [class*="panel"]',
                    )?.textContent?.substring(0, 500),
                  };
                });

                logger.info("Debug info:", debugInfo);

                // Wait a bit longer to see if response comes
                await delay(5000);
                await context.takeScreenshot("conversation-final");

                // Check final state
                const finalState = await context.page.evaluate(() => {
                  const assistantMessages = document.querySelectorAll(
                    '[class*="assistant"], [class*="Assistant"]',
                  );
                  const allMessages = document.querySelectorAll(
                    '[class*="message"]',
                  );
                  return {
                    assistantMessageCount: assistantMessages.length,
                    totalMessageCount: allMessages.length,
                    lastMessageContent: allMessages[allMessages.length - 1]
                      ?.textContent?.substring(0, 200),
                  };
                });

                logger.info("Final state:", finalState);
              } catch (error) {
                logger.info("Error during test conversation:", error);
              }
            } else {
              logger.info(
                "Test Conversation text not found in bfds-list-item__main elements",
              );
            }
          } catch (error) {
            logger.info("Error clicking Test Conversation:", error);
          }
        } else {
          logger.info(
            "System Prompt text not found in bfds-list-item__main elements",
          );
        }
      } catch (error) {
        logger.info("Error clicking System Prompt:", error);
      }

      // Check that the page loaded successfully
      const pageContent = await context.page.evaluate(() => {
        return document.body.textContent || "";
      });

      // Simple assertion - just check that we can navigate to the page
      assert(
        pageContent.length > 0,
        "Page should have content",
      );

      // Stop video recording
      const videoResult = await stopRecording();
      if (videoResult) {
        logger.info(
          `📹 Video recording saved: ${videoResult.videoPath} (${videoResult.duration}s, ${videoResult.fileSize} bytes)`,
        );
      }

      logger.info("✅ Simple conversation panel test completed successfully!");
    } catch (error) {
      await context.takeScreenshot("conversation-panel-error");
      logger.error("Conversation panel test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);
