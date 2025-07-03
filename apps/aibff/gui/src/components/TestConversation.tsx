import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { MessageContent } from "./MessageContent.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface TestMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface TestConversationProps {
  systemPrompt: string;
  onSaveResult?: (messages: Array<TestMessage>) => void;
}

export function TestConversation(
  { systemPrompt, onSaveResult }: TestConversationProps,
) {
  const [messages, setMessages] = useState<Array<TestMessage>>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle escape key to cancel streaming
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStreaming && abortControllerRef.current) {
        abortControllerRef.current.abort();
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

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

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
      // Format messages for API - include system prompt as first message
      const apiMessages = [
        {
          role: "system",
          content: systemPrompt || "You are a helpful assistant.",
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const response = await fetch("/api/test-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
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
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            if (!data.trim()) continue;

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
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        logger.info("Test conversation stream aborted");
      } else {
        logger.error("Failed to send test message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageIdRef.current
              ? { ...msg, content: "Error: Failed to get response" }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      streamingMessageIdRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleSaveResult = () => {
    if (onSaveResult && messages.length > 0) {
      onSaveResult(messages);
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        height: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ color: "#fafaff", margin: 0, fontSize: "1rem" }}>
          Test Conversation
        </h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <BfDsButton
            onClick={handleSaveResult}
            variant="secondary"
            disabled={messages.length === 0}
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
          >
            Save Result
          </BfDsButton>
          <BfDsButton
            onClick={handleClear}
            variant="secondary"
            disabled={messages.length === 0}
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
          >
            Clear
          </BfDsButton>
        </div>
      </div>

      {/* System Prompt Info */}
      {systemPrompt && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#b8b8c0",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#232425",
            borderRadius: "0.25rem",
            border: "1px solid #3a3b3c",
          }}
        >
          <strong>System Prompt:</strong> {systemPrompt.substring(0, 100)}
          {systemPrompt.length > 100 ? "..." : ""}
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #3a3b3c",
          borderRadius: "0.25rem",
          padding: "0.5rem",
          backgroundColor: "#1e1f20",
          marginBottom: "1rem",
        }}
      >
        {messages.length === 0
          ? (
            <div
              style={{
                color: "#b8b8c0",
                textAlign: "center",
                padding: "2rem",
                fontSize: "0.875rem",
              }}
            >
              Start testing your system prompt by typing a message below.
            </div>
          )
          : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  backgroundColor: message.role === "user"
                    ? "#2a2b2c"
                    : "transparent",
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
            ))
          )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your test message..."
          disabled={isStreaming}
          style={{
            flex: 1,
            minHeight: "2.5rem",
            maxHeight: "5rem",
            backgroundColor: "#2a2b2c",
            border: "1px solid #3a3b3c",
            borderRadius: "0.25rem",
            color: "#fafaff",
            padding: "0.5rem",
            fontSize: "0.875rem",
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4a9eff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#3a3b3c";
          }}
        />
        <BfDsButton
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          variant="primary"
          style={{ alignSelf: "flex-end" }}
        >
          {isStreaming ? "..." : "Send"}
        </BfDsButton>
      </div>

      {/* Status */}
      {isStreaming && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#b8b8c0",
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          Press Escape to cancel
        </div>
      )}
    </div>
  );
}
