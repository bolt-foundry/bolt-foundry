import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useRouter } from "../contexts/RouterContext.tsx";
import { useGrader } from "../contexts/GraderContext.tsx";
import { TabbedEditor } from "./TabbedEditor.tsx";
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

export function ChatWithIsograph() {
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

  // TODO: Replace this with Isograph query
  // This will be something like:
  // const conversation = useQuery(ConversationQuery, { conversationId });

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

        {/* Right panel - Tabbed Editor */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1f2021",
          }}
        >
          <TabbedEditor
            initialGraderContent={graderContent}
            onGraderContentChange={updateGraderContent}
            conversationId={conversationIdRef.current}
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
            // Use the existing handleSend logic
            if (!content.trim()) return;

            const messageContent = content.trim();

            logger.info("onSendMessage called with:", messageContent);

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

            const newMessage: Message = {
              id: Date.now().toString(),
              role: "user",
              content: messageContent,
              timestamp: new Date().toISOString(),
            };

            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);

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

            setIsStreaming(true);
            abortControllerRef.current = new AbortController();

            try {
              const response = await fetch("/api/chat/stream", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messages: updatedMessages,
                  conversationId: conversationIdRef.current,
                }),
                signal: abortControllerRef.current.signal,
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const reader = response.body?.getReader();
              const decoder = new TextDecoder("utf-8", { stream: true });

              if (!reader) {
                throw new Error("No response body");
              }

              const processStream = async () => {
                let buffer = "";
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                      // Flush any remaining bytes and process final buffer
                      const finalChunk = decoder.decode();
                      if (finalChunk) {
                        buffer += finalChunk;
                      }
                      if (buffer.trim()) {
                        const lines = buffer.split("\n");
                        for (const line of lines) {
                          if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") {
                              break;
                            }
                            try {
                              const parsed = JSON.parse(data);
                              logger.debug("Final chunk parsed:", parsed);
                            } catch (e) {
                              logger.error(
                                "Failed to parse final SSE data:",
                                e,
                              );
                            }
                          }
                        }
                      }
                      break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;
                    const lines = buffer.split("\n");

                    // Keep the last line in buffer if it doesn't end with newline
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                      logger.debug("Processing line:", line.substring(0, 50));
                      if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                          return;
                        }

                        // Skip empty data lines
                        if (!data.trim()) {
                          continue;
                        }

                        try {
                          const parsed = JSON.parse(data);

                          // Debug log to see what we're receiving
                          logger.debug("Raw SSE data received:", {
                            data: data.substring(0, 100),
                            hasToolCalls: !!parsed.tool_calls,
                            toolCallsCount: parsed.tool_calls?.length || 0,
                          });

                          // Log all parsed data for debugging
                          logger.debug("Parsed SSE data:", {
                            hasContent: !!parsed.content,
                            hasToolCalls: !!parsed.tool_calls,
                            hasConversationId: !!parsed.conversationId,
                            keys: Object.keys(parsed),
                          });

                          if (
                            parsed.conversationId && !conversationIdRef.current
                          ) {
                            conversationIdRef.current = parsed.conversationId;
                            router.navigate(`/chat/${parsed.conversationId}`);
                          }

                          if (parsed.content) {
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
                              // Log the entire delta structure first
                              logger.info(
                                "Raw tool call delta:",
                                toolCallDelta,
                              );

                              const { index, id, type, function: func } =
                                toolCallDelta;
                              logger.info("Extracted tool call delta fields:", {
                                index,
                                id,
                                type,
                                func,
                                allKeys: Object.keys(toolCallDelta),
                              });

                              // For tool calls, we need to use index as the primary key since
                              // OpenAI streaming sends the first delta with ID, then subsequent deltas without ID
                              // but with the same index. We'll use index as the consistent identifier.
                              const toolCallKey = `tool_call_${index}`;

                              logger.info("Using tool call key:", {
                                originalId: id,
                                index,
                                toolCallKey,
                              });

                              // More permissive condition - index and type are sufficient to start building
                              if (index !== undefined && type === "function") {
                                // Use a ref to avoid race conditions with rapid state updates
                                setPendingToolCalls((prev) => {
                                  const updated = new Map(prev);
                                  const existing = updated.get(toolCallKey) || {
                                    id: id || toolCallKey,
                                    type: "function",
                                    function: {
                                      name: "",
                                      arguments: "",
                                    },
                                  };

                                  // Track if we made any updates to this tool call
                                  let wasUpdated = false;
                                  const beforeArgsLength =
                                    existing.function.arguments.length;

                                  // Accumulate function name and arguments
                                  if (func?.name && !existing.function.name) {
                                    existing.function.name = func.name;
                                    wasUpdated = true;
                                    logger.info(
                                      "Tool call name set:",
                                      func.name,
                                    );
                                  }
                                  if (func?.arguments) {
                                    // Only add if this chunk isn't already at the end
                                    if (
                                      !existing.function.arguments.endsWith(
                                        func.arguments,
                                      )
                                    ) {
                                      existing.function.arguments +=
                                        func.arguments;
                                      wasUpdated = true;
                                      logger.info(
                                        "Tool call args updated:",
                                        {
                                          beforeLength: beforeArgsLength,
                                          afterLength:
                                            existing.function.arguments.length,
                                          addedChunk: func.arguments,
                                        },
                                      );
                                    } else {
                                      logger.debug(
                                        "Skipping duplicate chunk:",
                                        func.arguments,
                                      );
                                    }
                                  }

                                  // Mark as new tool call if we made updates
                                  if (wasUpdated) {
                                    hasNewToolCall = true;
                                    logger.info(
                                      "Tool call state after update:",
                                      {
                                        id: existing.id,
                                        name: existing.function.name,
                                        argsLength:
                                          existing.function.arguments.length,
                                        hasName: !!existing.function.name,
                                        hasArgs:
                                          existing.function.arguments !== "",
                                      },
                                    );
                                  }

                                  updated.set(toolCallKey, existing);
                                  return updated;
                                });
                              } else {
                                logger.warn(
                                  "Skipping tool call delta - missing index or type:",
                                  {
                                    originalId: id || "<missing>",
                                    index: index ?? "<missing>",
                                    type: type || "<missing>",
                                    hasFunc: !!func,
                                  },
                                );
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

              await processStream();
            } catch (error) {
              logger.error("Failed to send message:", error);
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
                Array.from(pendingToolCalls.values()).map((tc) => ({
                  id: tc.id,
                  name: tc.function.name,
                  argsLength: tc.function.arguments.length,
                  firstChars: tc.function.arguments.substring(0, 50),
                })),
              );

              // Execute any pending tool calls
              const executedToolCalls: Array<string> = [];
              for (const toolCall of pendingToolCalls.values()) {
                logger.info("Checking tool call for execution:", {
                  id: toolCall.id,
                  name: toolCall.function.name,
                  hasArguments: !!toolCall.function.arguments,
                  argumentsLength: toolCall.function.arguments?.length || 0,
                  argumentsValid: toolCall.function.arguments
                    ? "valid"
                    : "empty/null",
                });

                // Execute if we have a name and arguments (even if empty string)
                // Some tool calls might have empty arguments, which is valid
                if (
                  toolCall.function.name &&
                  toolCall.function.arguments !== undefined
                ) {
                  logger.info("Executing tool call:", toolCall.function.name);
                  try {
                    await executeToolCall(toolCall);
                    executedToolCalls.push(toolCall.function.name);
                  } catch (error) {
                    logger.error("Failed to execute tool call:", error);
                    // Continue with other tool calls
                  }
                } else {
                  logger.warn("Skipping incomplete tool call:", {
                    id: toolCall.id,
                    name: toolCall.function.name || "<missing>",
                    argumentsDefined: toolCall.function.arguments !== undefined,
                  });
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

      {/* Right panel - Tabbed Editor */}
      <div
        style={{
          flex: "1 1 50%",
          minWidth: 0, // Prevent flex items from overflowing
          backgroundColor: "#1f2021",
        }}
      >
        <TabbedEditor
          initialGraderContent={graderContent}
          onGraderContentChange={updateGraderContent}
          conversationId={conversationIdRef.current}
        />
      </div>
    </div>
  );
}
