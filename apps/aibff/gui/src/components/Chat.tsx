import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useRouter } from "../contexts/RouterContext.tsx";
import { useGrader } from "../contexts/GraderContext.tsx";
import { GraderEditor } from "./GraderEditor.tsx";
import { MessageContent } from "./MessageContent.tsx";
import { MessageInputUI } from "./MessageInput.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

// Generate a simple conversation ID
function generateConversationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `conv-${timestamp}-${random}`;
}

export function Chat() {
  const router = useRouter();
  const { navigate, params } = router;
  const conversationId = params?.conversationId;
  const conversationIdRef = useRef<string | undefined>(conversationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tool call state
  const [pendingToolCalls, setPendingToolCalls] = useState<
    Map<string, ToolCall>
  >(new Map());

  const { graderContent, updateGraderContent } = useGrader();

  // Execute tool calls
  const executeToolCall = (toolCall: ToolCall) => {
    logger.info("executeToolCall called with:", toolCall);
    try {
      if (toolCall.function.name === "replaceGraderDeck") {
        logger.info(
          "Parsing arguments for replaceGraderDeck:",
          toolCall.function.arguments,
        );
        const args = JSON.parse(toolCall.function.arguments);
        logger.info("Parsed arguments:", args);

        if (args.content) {
          logger.info(
            "Updating grader content with:",
            args.content.substring(0, 100) + "...",
          );
          // Update the grader content in the context
          updateGraderContent(args.content);
          logger.info("Grader deck updated via tool call successfully");
        } else {
          logger.warn("No content found in arguments:", args);
        }
      } else {
        logger.warn("Unknown tool call:", toolCall.function.name);
      }
    } catch (error) {
      logger.error(
        "Error executing tool call:",
        error,
        "Arguments:",
        toolCall.function.arguments,
      );
    }
  };

  // Load existing conversation or create new one
  useEffect(() => {
    // If navigating from error to home (no conversationId), reset error
    if (!conversationId && error) {
      setError(null);
      setLoading(true);
      conversationIdRef.current = undefined;
    }

    // If we're already processing this conversation, skip
    if (conversationIdRef.current === conversationId && !loading) {
      return;
    }

    // If we already have an error for this conversation, don't reload
    if (conversationIdRef.current === conversationId && error) {
      setLoading(false);
      return;
    }

    async function loadConversation() {
      const existingId = conversationId;

      // Always update the ref when we start loading
      conversationIdRef.current = existingId;

      if (existingId) {
        // Try to load existing conversation
        try {
          const response = await fetch(`/api/conversations/${existingId}`);
          if (response.ok) {
            const data = await response.json();
            setMessages(data.messages);
            setError(null);
            setLoading(false);
            return;
          } else if (response.status === 404) {
            // Conversation not found - show error
            setError(`Conversation "${existingId}" not found`);
            setLoading(false);
            return;
          }
        } catch (error) {
          logger.error("Failed to load conversation:", error);
          setError("Failed to load conversation. Please try again.");
          setLoading(false);
          return;
        }
      }

      // If no conversation ID provided, generate one and navigate
      if (!existingId) {
        // Check if we're already on a chat route (might be waiting for router to parse params)
        const hash = globalThis.location.hash;
        if (hash && hash.includes("/chat/")) {
          // Router is still parsing, wait
          return;
        }

        const newId = generateConversationId();
        navigate(`/chat/${newId}`);
        return;
      }
    }

    loadConversation();
  }, [conversationId, error]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea is now handled in MessageInputUI component

  // Handle escape key to cancel streaming
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStreaming && abortControllerRef.current) {
        // Abort the fetch request
        abortControllerRef.current.abort();

        // Remove the streaming message
        if (streamingMessageIdRef.current) {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== streamingMessageIdRef.current)
          );
          streamingMessageIdRef.current = null;
        }

        setIsStreaming(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isStreaming]);

  // These handlers have been moved into the MessageInputUI component

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          color: "#b8b8c0",
        }}
      >
        Loading conversation...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left panel - Error state */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "3px solid #3a3b3c",
            backgroundColor: "#141516",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                color: "#ff6b6b",
                marginBottom: "1rem",
              }}
            >
              Conversation Not Found
            </h2>
            <p
              style={{
                color: "#b8b8c0",
                marginBottom: "2rem",
              }}
            >
              {error}
            </p>
            <BfDsButton
              onClick={() => navigate("/")}
              variant="primary"
            >
              Start New Conversation
            </BfDsButton>
          </div>
        </div>

        {/* Right panel - Grader Editor */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1f2021",
          }}
        >
          <GraderEditor
            initialContent={graderContent}
            onContentChange={updateGraderContent}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left panel - Chat */}
      <div
        style={{
          flex: "1 1 50%",
          minWidth: 0, // Prevent flex items from overflowing
          display: "flex",
          flexDirection: "column",
          borderRight: "3px solid #3a3b3c",
          backgroundColor: "#141516",
        }}
      >
        {/* Header with New Conversation button */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #3a3b3c",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2a2b2c",
              color: "#fafaff",
              textDecoration: "none",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              display: "inline-block",
            }}
          >
            New Conversation
          </a>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: message.role === "user"
                    ? "#2a2b2c"
                    : "transparent",
                  borderRadius: "0.5rem",
                  border: message.role === "assistant"
                    ? "1px solid #3a3b3c"
                    : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#b8b8c0",
                    marginBottom: "0.25rem",
                  }}
                >
                  {message.role === "user" ? "You" : "Assistant"}
                </div>
                <MessageContent content={message.content} role={message.role} />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <MessageInputUI
          conversationId={conversationIdRef.current || ""}
          onSendMessage={async (content) => {
            logger.info(
              "onSendMessage START with raw content:",
              JSON.stringify(content),
            );
            logger.info("content.trim():", JSON.stringify(content.trim()));
            logger.info("!content.trim():", !content.trim());

            // Use the existing handleSend logic
            if (!content.trim()) {
              logger.info("Empty content, returning early");
              return;
            }

            let messageContent = content.trim();

            logger.info("onSendMessage called with:", messageContent);
            logger.info("Current conversation state:", {
              conversationId: conversationIdRef.current,
              messageCount: messages.length,
              isStreaming,
            });

            // Handle /test command - simulate a tool call locally
            if (messageContent.startsWith("/test")) {
              const toolName = messageContent.slice(5).trim() ||
                "replaceGraderDeck";

              logger.info("Processing /test command:", {
                messageContent,
                toolName,
              });

              if (toolName === "replaceGraderDeck") {
                // Create the user message first
                const userMessage: Message = {
                  id: Date.now().toString(),
                  role: "user",
                  content: messageContent,
                  timestamp: new Date().toISOString(),
                };

                // Simulate a fake tool call execution
                const fakeToolCall = {
                  id: "test_call_123",
                  type: "function" as const,
                  function: {
                    name: "replaceGraderDeck",
                    arguments: JSON.stringify({
                      content: `# Test Grader Deck - Generated by /test Command

## Overview
This is a test grader deck created by the /test command to verify that tool call execution works properly.

## Evaluation Criteria
- **Helpfulness**: Does the response address the customer's question?
- **Clarity**: Is the response easy to understand?
- **Completeness**: Does it provide all necessary information?

## Grading Scale
- **+3**: Excellent response
- **+2**: Good response  
- **+1**: Adequate response
- **0**: Neutral or invalid
- **-1**: Poor response
- **-2**: Bad response
- **-3**: Harmful response

Generated at: ${new Date().toISOString()}`,
                    }),
                  },
                };

                // Execute the fake tool call immediately
                logger.info(
                  "Executing fake tool call:",
                  fakeToolCall.function.name,
                );
                await executeToolCall(fakeToolCall);

                // Add both user message and system response
                const systemMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: `✅ Test tool call executed! Tool: ${toolName}`,
                  timestamp: new Date().toISOString(),
                };

                logger.info("Adding /test messages to UI and returning early");
                setMessages((prev) => [...prev, userMessage, systemMessage]);
                return;
              }
            }

            // Handle /force command
            if (messageContent.startsWith("/force")) {
              const toolName = messageContent.slice(6).trim() ||
                "replaceGraderDeck";

              if (toolName === "replaceGraderDeck") {
                messageContent =
                  "IMPORTANT: You MUST use the replaceGraderDeck tool now. Create a complete grader deck for evaluating customer support responses on helpfulness. Do not respond with text - only use the tool call.";
              } else {
                messageContent =
                  `IMPORTANT: You MUST use the ${toolName} tool now. Do not respond with text - only use the tool call.`;
              }

              logger.info(`Force command detected: ${toolName}`);
            }

            logger.info("Creating user message with content:", messageContent);

            const newMessage: Message = {
              id: Date.now().toString(),
              role: "user",
              content: messageContent,
              timestamp: new Date().toISOString(),
            };

            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);

            logger.info(
              "Messages updated, updatedMessages length:",
              updatedMessages.length,
            );

            // Create a placeholder for the assistant's response
            const assistantMessageId = (Date.now() + 1).toString();
            streamingMessageIdRef.current = assistantMessageId;
            setMessages((prev) => [
              ...prev,
              {
                id: assistantMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date().toISOString(),
              },
            ]);

            logger.info("About to start streaming...");
            setIsStreaming(true);
            abortControllerRef.current = new AbortController();
            logger.info("Streaming state set, abort controller created");

            try {
              // Filter out empty assistant messages that might cause server errors
              const cleanMessages = updatedMessages.filter((msg) =>
                !(msg.role === "assistant" &&
                  (!msg.content || msg.content.trim() === ""))
              );

              logger.info("Starting fetch to /api/chat/stream with messages:", {
                total: updatedMessages.length,
                clean: cleanMessages.length,
                filtered: updatedMessages.length - cleanMessages.length,
              });

              const response = await fetch("/api/chat/stream", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messages: cleanMessages,
                  conversationId: conversationIdRef.current,
                }),
                signal: abortControllerRef.current.signal,
              });

              logger.info("Fetch response received:", {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const reader = response.body?.getReader();
              const decoder = new TextDecoder();

              logger.info("Stream reader created:", !!reader);

              if (!reader) {
                throw new Error("No response body");
              }

              const processStream = async () => {
                logger.info("Starting processStream function");
                try {
                  let chunkCount = 0;
                  while (true) {
                    logger.info("Reading chunk", chunkCount++);
                    const { done, value } = await reader.read();
                    logger.info("Chunk read result:", {
                      done,
                      hasValue: !!value,
                      valueLength: value?.length,
                    });

                    if (done) {
                      logger.info("Stream done, breaking");
                      break;
                    }

                    const chunk = decoder.decode(value);
                    logger.info(
                      "Decoded chunk:",
                      chunk.substring(0, 200) +
                        (chunk.length > 200 ? "..." : ""),
                    );
                    const lines = chunk.split("\n");
                    logger.info("Split into lines:", lines.length);

                    for (const line of lines) {
                      if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                          logger.info("Stream received [DONE]");
                          return;
                        }

                        try {
                          const parsed = JSON.parse(data);
                          logger.info("Stream data received:", {
                            hasContent: !!parsed.content,
                            hasToolCalls: !!parsed.tool_calls,
                            conversationId: parsed.conversationId,
                            toolCallsCount: parsed.tool_calls?.length || 0,
                          });

                          if (
                            parsed.conversationId && !conversationIdRef.current
                          ) {
                            conversationIdRef.current = parsed.conversationId;
                            router.navigate(`/chat/${parsed.conversationId}`);
                            logger.info(
                              "Conversation ID set:",
                              parsed.conversationId,
                            );
                          }

                          if (parsed.content) {
                            logger.info(
                              "Adding content to message:",
                              parsed.content,
                            );
                            setMessages((prev) =>
                              prev.map((msg) =>
                                msg.id === streamingMessageIdRef.current
                                  ? {
                                    ...msg,
                                    content: msg.content + parsed.content,
                                  }
                                  : msg
                              )
                            );
                          }

                          // Handle tool calls
                          if (parsed.tool_calls) {
                            logger.info(
                              "Processing tool calls:",
                              parsed.tool_calls,
                            );
                            let hasNewToolCall = false;
                            for (const toolCallDelta of parsed.tool_calls) {
                              const { index, id, type, function: func } =
                                toolCallDelta;
                              logger.info("Tool call delta:", {
                                index,
                                id,
                                type,
                                func,
                              });

                              if (id && type === "function" && func) {
                                setPendingToolCalls((prev) => {
                                  const updated = new Map(prev);
                                  const existing = updated.get(id) || {
                                    id,
                                    type: "function",
                                    function: {
                                      name: func.name || "",
                                      arguments: "",
                                    },
                                  };

                                  // Accumulate function name and arguments
                                  if (func.name) {
                                    existing.function.name = func.name;
                                    hasNewToolCall = true;
                                    logger.info(
                                      "Tool call name set:",
                                      func.name,
                                    );
                                  }
                                  if (func.arguments) {
                                    existing.function.arguments +=
                                      func.arguments;
                                    logger.info(
                                      "Tool call args updated:",
                                      existing.function.arguments,
                                    );
                                  }

                                  updated.set(id, existing);
                                  return updated;
                                });
                              }
                            }

                            // Add visual feedback for tool calls in the message content
                            if (hasNewToolCall) {
                              logger.info(
                                "Adding tool call visual feedback to message",
                              );
                              setMessages((prev) =>
                                prev.map((msg) =>
                                  msg.id === streamingMessageIdRef.current
                                    ? {
                                      ...msg,
                                      content: msg.content ||
                                        "🔧 Executing tool calls...",
                                    }
                                    : msg
                                )
                              );
                            }
                          }
                        } catch (e) {
                          logger.error("Failed to parse SSE data:", e);
                        }
                      } else if (line.startsWith("event: done")) {
                        return;
                      }
                    }
                  }
                } catch (error: unknown) {
                  if (error instanceof Error && error.name === "AbortError") {
                    logger.info("Stream aborted");
                  } else {
                    throw error;
                  }
                } finally {
                  reader.releaseLock();
                }
              };

              logger.info("About to call processStream");
              await processStream();
              logger.info("processStream completed");
            } catch (error) {
              logger.error("Failed to send message:", error);
              logger.error("Error details:", {
                name: error instanceof Error ? error.name : "Unknown",
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
              });
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingMessageIdRef.current
                    ? { ...msg, content: "Error: Failed to get response" }
                    : msg
                )
              );
            } finally {
              setIsStreaming(false);
              streamingMessageIdRef.current = null;

              logger.info(
                "Stream finished. Pending tool calls:",
                Array.from(pendingToolCalls.values()),
              );

              // Execute any pending tool calls
              const executedToolCalls: Array<string> = [];
              for (const toolCall of pendingToolCalls.values()) {
                logger.info("Checking tool call for execution:", {
                  name: toolCall.function.name,
                  hasArguments: !!toolCall.function.arguments,
                  argumentsLength: toolCall.function.arguments?.length || 0,
                });

                if (toolCall.function.name && toolCall.function.arguments) {
                  logger.info("Executing tool call:", toolCall.function.name);
                  await executeToolCall(toolCall);
                  executedToolCalls.push(toolCall.function.name);
                } else {
                  logger.warn("Skipping incomplete tool call:", toolCall);
                }
              }

              logger.info(
                "All tool calls processed. Executed:",
                executedToolCalls,
              );

              // Add a message showing tool call execution if any were executed
              if (executedToolCalls.length > 0) {
                const toolCallMessage: Message = {
                  id: (Date.now() + 2).toString(),
                  role: "assistant",
                  content: `✅ Tool call${
                    executedToolCalls.length > 1 ? "s" : ""
                  } executed: ${executedToolCalls.join(", ")}`,
                  timestamp: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, toolCallMessage]);
                logger.info("Added tool execution message to UI");
              } else {
                logger.info("No tool calls were executed");
              }

              // Clear pending tool calls
              setPendingToolCalls(new Map());
            }
          }}
          disabled={isStreaming}
        />
      </div>

      {/* Right panel - Grader Editor */}
      <div
        style={{
          flex: "1 1 50%",
          minWidth: 0, // Prevent flex items from overflowing
          backgroundColor: "#1f2021",
        }}
      >
        <GraderEditor
          initialContent={graderContent}
          onContentChange={updateGraderContent}
        />
      </div>
    </div>
  );
}
