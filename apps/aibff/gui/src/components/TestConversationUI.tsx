import { useEffect, useRef, useState } from "react";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface TestConversationUIProps {
  systemPrompt: string;
}

export function TestConversationUI({ systemPrompt }: TestConversationUIProps) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [userInput, setUserInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle escape key to cancel streaming
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStreaming && abortControllerRef.current) {
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

  const sendMessage = async (content?: string) => {
    const messageContent = content || userInput.trim();

    if (!messageContent && hasStarted) return;
    if (!systemPrompt.trim()) {
      logger.warn("Cannot start test conversation without system prompt");
      return;
    }

    let updatedMessages = messages;

    // Add user message if this isn't the initial start
    if (hasStarted && messageContent) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setUserInput("");
    }

    // Mark as started if this is the first message
    if (!hasStarted) {
      setHasStarted(true);
    }

    // Create placeholder for assistant response
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
      const response = await fetch("/api/test-conversation/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt,
          messages: updatedMessages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Process any remaining buffer content
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
                    if (parsed.content) {
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === streamingMessageIdRef.current
                            ? { ...msg, content: msg.content + parsed.content }
                            : msg
                        )
                      );
                    }
                  } catch (e) {
                    logger.error("Failed to parse final SSE data:", e);
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

                if (parsed.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? { ...msg, content: msg.content + parsed.content }
                        : msg
                    )
                  );
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
          logger.info("Test conversation stream aborted");
        } else {
          throw error;
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      logger.error("Failed to send test message:", error);
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasStarted && userInput.trim()) {
        sendMessage();
      }
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#141516",
        border: "1px solid #2a2b2c",
        borderRadius: "0.25rem",
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          minHeight: "200px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              color: "#666",
              fontSize: "0.875rem",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            {!hasStarted
              ? "Click 'Start' to begin a test conversation with your system prompt"
              : "Test conversation started..."}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                padding: "0.5rem 0.75rem",
                backgroundColor: message.role === "user"
                  ? "#2a2b2c"
                  : "transparent",
                borderRadius: "0.375rem",
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
              <div
                style={{
                  color: "#fafaff",
                  fontSize: "0.875rem",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                }}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: "1px solid #2a2b2c",
          padding: "0.75rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasStarted
            ? "Type a message..."
            : "Type a message to start..."}
          disabled={isStreaming}
          style={{
            flex: 1,
            minHeight: "36px",
            maxHeight: "120px",
            padding: "0.5rem",
            backgroundColor: "#1a1b1c",
            border: "1px solid #3a3b3c",
            borderRadius: "0.25rem",
            color: "#fafaff",
            fontSize: "0.875rem",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
        />

        {!hasStarted
          ? (
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isStreaming || !systemPrompt.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: systemPrompt.trim() ? "#4ade80" : "#374151",
                color: systemPrompt.trim() ? "#000" : "#9ca3af",
                border: "none",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: systemPrompt.trim() ? "pointer" : "not-allowed",
                transition: "background-color 0.2s ease",
              }}
            >
              {isStreaming ? "Starting..." : "Start"}
            </button>
          )
          : (
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isStreaming || !userInput.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: userInput.trim() && !isStreaming
                  ? "#4ade80"
                  : "#374151",
                color: userInput.trim() && !isStreaming ? "#000" : "#9ca3af",
                border: "none",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: userInput.trim() && !isStreaming
                  ? "pointer"
                  : "not-allowed",
                transition: "background-color 0.2s ease",
              }}
            >
              {isStreaming ? "Sending..." : "Send"}
            </button>
          )}
      </div>
    </div>
  );
}
