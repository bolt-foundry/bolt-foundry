#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net --watch

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";
import { createGraphQLServer } from "../commands/graphql-schema.ts";
import { renderDeck } from "../index.ts";
import { AibffConversation } from "@bfmono/apps/bfDb/nodeTypes/aibff/AibffConversation.ts";

const logger = getLogger(import.meta);

// Type definitions
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Function to copy default files to a new conversation
async function copyDefaultsToConversation(
  conversationId: string,
): Promise<void> {
  const conversationsPath = getConversationsDir();
  const conversationFolder = `${conversationsPath}/${conversationId}`;
  const defaultsPath = new URL(import.meta.resolve("./defaults")).pathname;

  // Ensure conversation directory exists
  try {
    await Deno.mkdir(conversationFolder, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  // List of default files to copy
  const defaultFiles = [
    "input-samples.jsonl",
    "actor-deck.md",
    "grader-deck.md",
    "grader-base.deck.md",
    "grader-base.deck.toml",
    "ground-truth.deck.toml",
    "notes.md",
  ];

  // Copy each default file
  for (const fileName of defaultFiles) {
    try {
      const defaultFilePath = `${defaultsPath}/${fileName}`;
      const conversationFilePath = `${conversationFolder}/${fileName}`;

      const content = await Deno.readTextFile(defaultFilePath);
      await Deno.writeTextFile(conversationFilePath, content);

      logger.debug(
        `Copied default ${fileName} to conversation ${conversationId}`,
      );
    } catch (error) {
      logger.warn(`Failed to copy default ${fileName}:`, error);
      // Continue with other files even if one fails
    }
  }

  logger.info(`Copied default files to conversation ${conversationId}`);
}

// Function to generate initial assistant message
async function generateInitialMessage(): Promise<string> {
  // Load the assistant deck
  const deckPath = new URL(
    import.meta.resolve("./decks/onboarding-actor.deck.md"),
  ).pathname;

  try {
    // Get the OpenAI request from renderDeck
    const openAiRequest = renderDeck(deckPath, {}, {
      model: "openai/gpt-4o",
      stream: false,
    });

    // Call OpenRouter API
    const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
    if (!apiKey) {
      logger.error("OpenRouter API key not configured");
      // Return fallback message if API key not available
      return "Hi! I'm here to help you build a grader for your classification task. Let's start with an example - we'll build a topic classifier for YouTube comments. What dimension would you like your grader to evaluate?";
    }

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/boltfoundry/bolt-foundry",
          "X-Title": "aibff GUI",
        },
        body: JSON.stringify({
          ...openAiRequest,
          stream: false,
        }),
      },
    );

    if (!openRouterResponse.ok) {
      logger.error(
        "Failed to get initial AI response:",
        await openRouterResponse.text(),
      );
      // Return fallback message if API call fails
      return "Hi! I'm here to help you build a grader for your classification task. Let's start with an example - we'll build a topic classifier for YouTube comments. What dimension would you like your grader to evaluate?";
    }

    const result = await openRouterResponse.json();
    return result.choices?.[0]?.message?.content ||
      "Hi! I'm here to help you build a grader for your classification task. Let's start with an example - we'll build a topic classifier for YouTube comments. What dimension would you like your grader to evaluate?";
  } catch (error) {
    logger.error("Error generating initial message:", error);
    // Return fallback message on error
    return "Hi! I'm here to help you build a grader for your classification task. Let's start with an example - we'll build a topic classifier for YouTube comments. What dimension would you like your grader to evaluate?";
  }
}

// Parse command line arguments
const flags = parseArgs(Deno.args, {
  string: ["port", "mode", "vite-port", "conversations-dir"],
  default: {
    port: "3000",
    mode: "production",
    "conversations-dir": undefined,
  },
});

const port = parseInt(flags.port);
if (isNaN(port)) {
  logger.printErr(`Invalid port: ${flags.port}`);
  Deno.exit(1);
}

const isDev = flags.mode === "development";
const vitePort = flags["vite-port"] ? parseInt(flags["vite-port"]) : undefined;

// Get conversations directory - either from flag (already resolved) or default to ./conversations
const getConversationsDir = () => {
  if (flags["conversations-dir"]) {
    // Flag value is already resolved to absolute path by gui.ts
    return flags["conversations-dir"];
  }
  // Default to ./aibff-conversations relative to the GUI directory
  return new URL(import.meta.resolve("./aibff-conversations")).pathname;
};

// Create GraphQL server
const graphQLServer = createGraphQLServer(isDev);

// Define routes using URLPattern
const routes = [
  {
    pattern: new URLPattern({ pathname: "/health" }),
    handler: () => {
      const healthInfo = {
        status: "OK",
        timestamp: new Date().toISOString(),
        mode: isDev ? "development" : "production",
        port: port,
        uptime: Math.floor(performance.now() / 1000) + " seconds",
      };
      return new Response(JSON.stringify(healthInfo, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/graphql" }),
    handler: (request: Request) => graphQLServer.handle(request),
  },
  {
    pattern: new URLPattern({ pathname: "/api/stream" }),
    handler: () => {
      // SSE endpoint for streaming AI responses
      const body = new ReadableStream({
        start(controller) {
          // Send initial connection message
          controller.enqueue(
            new TextEncoder().encode(
              `: Connected to aibff GUI SSE endpoint\n\n`,
            ),
          );

          // Keep connection alive with periodic comments
          const keepAlive = setInterval(() => {
            try {
              controller.enqueue(
                new TextEncoder().encode(`: keepalive\n\n`),
              );
            } catch {
              // Stream closed, cleanup
              clearInterval(keepAlive);
            }
          }, 30000);
        },
      });

      return new Response(body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/api/conversations/:conversationId" }),
    handler: async (request: Request) => {
      const url = new URL(request.url);
      const conversationId = url.pathname.split("/").pop();

      if (!conversationId) {
        return new Response("No conversation ID provided", { status: 400 });
      }

      try {
        // Try to load existing conversation
        const conversation = await AibffConversation.load(conversationId);
        const messages = conversation.getMessages();

        return new Response(JSON.stringify({ conversationId, messages }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes("not found")) {
          // Check if this is a newly created conversation ID
          if (
            conversationId.startsWith("conv-") &&
            conversationId.match(/^conv-\d+-\w+$/)
          ) {
            const timestampMatch = conversationId.match(/conv-(\d+)-/);
            if (timestampMatch) {
              const timestamp = parseInt(timestampMatch[1]);
              const now = Date.now();
              // If created within last 10 seconds, create initial conversation
              if (now - timestamp < 10000) {
                // Generate initial assistant message
                const initialContent = await generateInitialMessage();

                // Create initial conversation with generated greeting
                const conversation = new AibffConversation(conversationId);
                conversation.addMessage({
                  id: "1",
                  role: "assistant",
                  content: initialContent,
                  timestamp: new Date().toISOString(),
                });
                await conversation.save();

                // Copy default files to the new conversation
                await copyDefaultsToConversation(conversationId);

                const messages = conversation.getMessages();

                return new Response(
                  JSON.stringify({ conversationId, messages }),
                  {
                    headers: { "Content-Type": "application/json" },
                  },
                );
              }
            }
          }
          return new Response("Conversation not found", { status: 404 });
        }
        logger.error("Failed to load conversation:", error);
        return new Response("Failed to load conversation", { status: 500 });
      }
    },
  },
  {
    pattern: new URLPattern({ pathname: "/api/chat/stream" }),
    handler: async (request: Request) => {
      // Parse the conversation from request body
      const { messages, conversationId, saveOnly } = await request.json();

      // If this is just a save request, save the messages and return
      if (saveOnly) {
        if (!conversationId) {
          return new Response("No conversation ID provided", { status: 400 });
        }

        try {
          // Create a new conversation with the updated messages
          // This effectively replaces all existing messages
          const conversation = new AibffConversation(conversationId);

          // Add all the messages from the frontend
          for (const msg of messages) {
            conversation.addMessage(msg);
          }

          // Save the conversation (this will overwrite the existing file)
          await conversation.save();

          logger.info(
            `Saved ${messages.length} messages for conversation ${conversationId}`,
          );

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          logger.error("Failed to save messages:", error);
          return new Response("Failed to save messages", { status: 500 });
        }
      }

      // Load the assistant deck
      const deckPath = new URL(
        import.meta.resolve("./decks/onboarding-actor.deck.md"),
      ).pathname;

      try {
        // Get the OpenAI request from renderDeck to get the system message
        const baseRequest = renderDeck(deckPath, {}, {
          model: "openai/gpt-4o",
          stream: true,
        });

        // Log if tools are included
        if (baseRequest.tools) {
          logger.debug(
            `Including ${baseRequest.tools.length} tools in request:`,
            baseRequest.tools.map((t) => t.function.name),
          );
          logger.debug(
            "Tools detail:",
            JSON.stringify(baseRequest.tools, null, 2),
          );
        } else {
          logger.warn("No tools found in baseRequest!");
        }

        // Combine the system message from renderDeck with our conversation messages
        const openAiRequest = {
          ...baseRequest,
          messages: [
            // Keep the system message from renderDeck
            baseRequest.messages[0],
            // Add our conversation messages
            ...messages.map((m: ChatMessage) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        };

        // Call OpenRouter API with streaming
        const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
        if (!apiKey) {
          return new Response("OpenRouter API key not configured", {
            status: 500,
          });
        }

        const finalRequest = {
          ...openAiRequest,
          stream: true,
        };

        // Log the final request (excluding sensitive data)
        logger.debug("Final request to OpenRouter:", {
          model: (finalRequest as Record<string, unknown>).model,
          messages: finalRequest.messages?.length,
          tools: finalRequest.tools?.length,
          stream: finalRequest.stream,
        });

        const openRouterResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://github.com/boltfoundry/bolt-foundry",
              "X-Title": "aibff GUI",
            },
            body: JSON.stringify(finalRequest),
          },
        );

        if (!openRouterResponse.ok) {
          return new Response("Failed to get AI response", { status: 500 });
        }

        // Load or create conversation
        let conversation: AibffConversation;
        try {
          conversation = await AibffConversation.load(conversationId);
        } catch {
          // Create new conversation if it doesn't exist
          conversation = new AibffConversation(conversationId);
        }

        // Add all messages to the conversation
        for (const msg of messages) {
          if (!conversation.getMessages().some((m) => m.id === msg.id)) {
            conversation.addMessage(msg);
          }
        }

        // Save the conversation with the user's message
        await conversation.save();

        // Create SSE stream
        const encoder = new TextEncoder();
        let assistantMessage = "";

        const body = new ReadableStream({
          async start(controller) {
            const reader = openRouterResponse.body!.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") {
                      // Add the assistant's response and save
                      conversation.addMessage({
                        role: "assistant",
                        content: assistantMessage,
                      });
                      await conversation.save();

                      controller.enqueue(
                        encoder.encode("event: done\ndata: {}\n\n"),
                      );
                      break;
                    }

                    try {
                      const parsed = JSON.parse(data);
                      const delta = parsed.choices?.[0]?.delta;

                      // Handle content
                      if (delta?.content) {
                        assistantMessage += delta.content;
                        controller.enqueue(
                          encoder.encode(
                            `data: ${
                              JSON.stringify({ content: delta.content })
                            }\n\n`,
                          ),
                        );
                      }

                      // Handle tool calls
                      if (delta?.tool_calls) {
                        logger.debug("Received tool call:", delta.tool_calls);
                        controller.enqueue(
                          encoder.encode(
                            `data: ${
                              JSON.stringify({ tool_calls: delta.tool_calls })
                            }\n\n`,
                          ),
                        );
                      }
                    } catch {
                      // Ignore parse errors
                    }
                  }
                }
              }
            } catch (error) {
              logger.error("Stream error:", error);
              controller.enqueue(
                encoder.encode(
                  `event: error\ndata: ${
                    JSON.stringify({
                      error: "Stream interrupted",
                    })
                  }\n\n`,
                ),
              );
            } finally {
              controller.close();
            }
          },
        });

        return new Response(body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } catch (error) {
        logger.error("Chat stream error:", error);
        return new Response("Internal server error", { status: 500 });
      }
    },
  },
  {
    pattern: new URLPattern({
      pathname: "/api/conversations/:conversationId/save",
    }),
    handler: async (request: Request) => {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const url = new URL(request.url);
      const conversationId = url.pathname.split("/")[3]; // /api/conversations/{id}/save

      if (!conversationId) {
        return new Response("No conversation ID provided", { status: 400 });
      }

      try {
        const saveData = await request.json();
        const { inputSamples, actorDeck, graderDeck, groundTruth, notes } =
          saveData;

        // Create the conversation folder path
        const conversationsPath = getConversationsDir();
        const conversationFolder = `${conversationsPath}/${conversationId}`;

        // Ensure conversations directory exists
        try {
          await Deno.mkdir(conversationsPath, { recursive: true });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        // Ensure conversation folder exists
        try {
          await Deno.mkdir(conversationFolder, { recursive: true });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        // Load the conversation to get the messages
        let conversation: AibffConversation;
        try {
          conversation = await AibffConversation.load(conversationId);
        } catch (error) {
          logger.error("Failed to load conversation for saving:", error);
          return new Response("Conversation not found", { status: 404 });
        }

        const messages = conversation.getMessages();

        // Save conversation.md
        const conversationMd = messages.map((msg) => {
          const role = msg.role === "user" ? "User" : "Assistant";
          return `## ${role}\n\n${msg.content}\n`;
        }).join("\n");

        await Deno.writeTextFile(
          `${conversationFolder}/conversation.md`,
          conversationMd,
        );

        // Save input-samples.jsonl
        await Deno.writeTextFile(
          `${conversationFolder}/input-samples.jsonl`,
          inputSamples || "",
        );

        // Save actor-deck.md
        await Deno.writeTextFile(
          `${conversationFolder}/actor-deck.md`,
          actorDeck || "",
        );

        // Save grader-deck.md
        await Deno.writeTextFile(
          `${conversationFolder}/grader-deck.md`,
          graderDeck || "",
        );

        // Save ground-truth.deck.toml
        await Deno.writeTextFile(
          `${conversationFolder}/ground-truth.deck.toml`,
          groundTruth || "",
        );

        // Save notes.md
        await Deno.writeTextFile(`${conversationFolder}/notes.md`, notes || "");

        logger.info(
          `Saved conversation ${conversationId} to ${conversationFolder}`,
        );

        return new Response(
          JSON.stringify({
            success: true,
            message: `Conversation saved to ${conversationFolder}`,
            files: [
              "conversation.md",
              "input-samples.jsonl",
              "actor-deck.md",
              "grader-deck.md",
              "ground-truth.deck.toml",
              "notes.md",
            ],
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        logger.error("Failed to save conversation:", error);
        return new Response(
          `Failed to save conversation: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          {
            status: 500,
          },
        );
      }
    },
  },
  {
    pattern: new URLPattern({
      pathname: "/api/conversations/:conversationId/files/:filename",
    }),
    handler: async (request: Request) => {
      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const conversationId = pathParts[3]; // /api/conversations/{id}/files/{filename}
      const filename = pathParts[5];

      if (!conversationId || !filename) {
        return new Response("Conversation ID and filename required", {
          status: 400,
        });
      }

      try {
        // Create the file path
        const conversationsPath = getConversationsDir();
        const filePath = `${conversationsPath}/${conversationId}/${filename}`;

        // Read the file content
        const content = await Deno.readTextFile(filePath);

        return new Response(JSON.stringify({ content }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          return new Response("File not found", { status: 404 });
        }
        logger.error(
          `Failed to load file ${filename} for conversation ${conversationId}:`,
          error,
        );
        return new Response("Internal server error", { status: 500 });
      }
    },
  },
  {
    pattern: new URLPattern({
      pathname: "/api/conversations/:conversationId/load",
    }),
    handler: async (request: Request) => {
      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      const url = new URL(request.url);
      const conversationId = url.pathname.split("/")[3]; // /api/conversations/{id}/load

      if (!conversationId) {
        return new Response("No conversation ID provided", { status: 400 });
      }

      try {
        // Create the conversation folder path
        const conversationsPath = getConversationsDir();
        const conversationFolder = `${conversationsPath}/${conversationId}`;

        // Initialize response data
        const loadData = {
          inputSamples: "",
          actorDeck: "",
          graderDeck: "",
          groundTruth: "",
          notes: "",
        };

        // Try to load each file, but don't fail if they don't exist
        const fileMap = {
          inputSamples: "input-samples.jsonl",
          actorDeck: "actor-deck.md",
          graderDeck: "grader-deck.md",
          groundTruth: "ground-truth.deck.toml",
          notes: "notes.md",
        };

        for (const [key, fileName] of Object.entries(fileMap)) {
          try {
            const filePath = `${conversationFolder}/${fileName}`;
            const content = await Deno.readTextFile(filePath);
            loadData[key as keyof typeof loadData] = content;
          } catch (error) {
            // File doesn't exist or can't be read - that's fine, keep empty string
            logger.debug(
              `Could not load ${fileName} for conversation ${conversationId}:`,
              error,
            );
          }
        }

        return new Response(JSON.stringify(loadData), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        logger.error("Failed to load conversation data:", error);
        return new Response(
          `Failed to load conversation data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          { status: 500 },
        );
      }
    },
  },
];

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  // Try to match against defined routes
  for (const route of routes) {
    if (route.pattern.test(url)) {
      return await route.handler(request);
    }
  }

  // Don't redirect in dev mode - let the frontend handle routing
  // The redirect logic is now handled by the frontend React app

  // In dev mode, proxy to Vite for frontend assets
  if (isDev && vitePort) {
    try {
      const viteUrl =
        `http://localhost:${vitePort}${url.pathname}${url.search}`;
      const viteResponse = await fetch(viteUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      // Create new headers to avoid immutable headers issue
      const headers = new Headers();
      viteResponse.headers.forEach((value, key) => {
        // Skip hop-by-hop headers
        if (
          !["connection", "keep-alive", "transfer-encoding"].includes(
            key.toLowerCase(),
          )
        ) {
          headers.set(key, value);
        }
      });

      return new Response(viteResponse.body, {
        status: viteResponse.status,
        statusText: viteResponse.statusText,
        headers,
      });
    } catch (error) {
      logger.error("Error proxying to Vite:", error);
      return new Response("Error proxying to Vite dev server", {
        status: 502,
      });
    }
  }

  // In production mode, serve static assets
  const distPath = new URL(import.meta.resolve("./dist")).pathname;

  // API routes should return 404 if not found
  if (url.pathname.startsWith("/api/")) {
    return new Response("Not Found", { status: 404 });
  }

  // Default to index.html for root
  let filePath = url.pathname;
  if (filePath === "/") {
    filePath = "/index.html";
  }

  const fullPath = `${distPath}${filePath}`;

  try {
    const file = await Deno.open(fullPath);
    const stat = await file.stat();

    // Determine content type
    let contentType = "application/octet-stream";
    if (filePath.endsWith(".html")) contentType = "text/html";
    else if (filePath.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (filePath.endsWith(".css")) contentType = "text/css";
    else if (filePath.endsWith(".json")) contentType = "application/json";

    return new Response(file.readable, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // For client-side routes (not starting with /api/ or containing a file extension)
      if (
        !url.pathname.includes(".") && !url.pathname.startsWith("/api/")
      ) {
        try {
          const indexPath = `${distPath}/index.html`;
          const file = await Deno.open(indexPath);
          return new Response(file.readable, {
            headers: { "Content-Type": "text/html" },
          });
        } catch {
          // Fall through to 404
        }
      }
    }
  }

  return new Response("Not Found", { status: 404 });
};

// Start the server
const server = Deno.serve({ port }, handler);

logger.println(`GUI server running at http://localhost:${port}`);
logger.println(`Mode: ${isDev ? "development" : "production"}`);
logger.println(`Conversations directory: ${getConversationsDir()}`);
if (isDev && vitePort) {
  logger.println(
    `Proxying frontend requests to Vite at http://localhost:${vitePort}`,
  );
}
logger.println("Watching for file changes...");

// Wait for server to finish
await server.finished;
