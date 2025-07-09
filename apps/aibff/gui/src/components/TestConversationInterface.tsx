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

interface TestConversationInterfaceProps {
  systemPrompt: string;
  inputVariables: string;
}

export function TestConversationInterface({
  systemPrompt,
  inputVariables,
}: TestConversationInterfaceProps) {
  const [messages, setMessages] = useState<Array<TestMessage>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    console.log("🔍 [TestConversation] handleSend called with input:", input);
    console.log(
      "🔍 [TestConversation] handleSend state - isLoading:",
      isLoading,
      "input length:",
      input.length,
    );
    console.log(
      "🔍 [TestConversation] handleSend state - systemPrompt:",
      systemPrompt ? "exists" : "missing",
    );

    if (!input.trim() || isLoading) {
      console.log(
        "🚨 [TestConversation] handleSend early return - no input or loading",
      );
      return;
    }

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API call
      const apiMessages = [
        {
          role: "system",
          content: systemPrompt || "You are a helpful assistant.",
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: userMessage.content,
        },
      ];

      // Call the test chat API with system prompt
      logger.info("Making API call to /api/test-chat/stream");
      console.log(
        "🚀 [TestConversation] About to make fetch request to /api/test-chat/stream",
      );
      console.log("🚀 [TestConversation] Request payload:", {
        messages: apiMessages.length,
        systemPrompt: systemPrompt ? "present" : "missing",
        inputVariables: inputVariables ? "present" : "missing",
      });

      const response = await fetch("/api/test-chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: systemPrompt,
          inputVariables: inputVariables,
        }),
      });

      logger.info("Response received:", {
        ok: response.ok,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        bodyExists: !!response.body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("API error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create placeholder for streaming response
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: TestMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      console.log(
        "🔍 [TestConversation] Creating assistant message with ID:",
        assistantMessageId,
      );
      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        console.log(
          "🔍 [TestConversation] Messages after adding assistant:",
          updated,
        );
        return updated;
      });

      // Handle streaming response
      logger.info("🔄 [SSE] Setting up streaming response handler");
      console.log("🔄 [SSE] Setting up streaming response handler");
      console.log(
        "🔄 [SSE] Response headers:",
        Object.fromEntries(response.headers.entries()),
      );
      console.log(
        "🔄 [SSE] Response status:",
        response.status,
        response.statusText,
      );
      console.log("🔄 [SSE] Response ok:", response.ok);
      console.log("🔄 [SSE] Response body exists:", !!response.body);
      console.log(
        "🔄 [SSE] Response content-type:",
        response.headers.get("content-type"),
      );
      console.log(
        "🔄 [SSE] Response transfer-encoding:",
        response.headers.get("transfer-encoding"),
      );

      // Check if this is actually an SSE response
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("text/event-stream")) {
        console.warn(
          "⚠️ [SSE] Response is not text/event-stream, got:",
          contentType,
        );
        logger.warn(
          "⚠️ [SSE] Response is not text/event-stream, got:",
          contentType,
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        logger.error("🚨 [SSE] No response body available");
        console.error("🚨 [SSE] No response body available");
        throw new Error("No response body");
      }

      logger.info("🔄 [SSE] Starting to read stream");
      console.log("🔄 [SSE] Starting to read stream, reader:", reader);
      let buffer = "";
      let chunkCount = 0;
      let totalBytesReceived = 0;
      let contentReceived = "";
      let messageUpdateCount = 0;
      let lastChunkTime = Date.now();

      console.log(
        "🔄 [SSE] Stream reading started at:",
        new Date().toISOString(),
      );

      while (true) {
        try {
          const { done, value } = await reader.read();
          chunkCount++;
          const chunkSize = value?.length || 0;
          totalBytesReceived += chunkSize;
          const currentTime = Date.now();
          const timeSinceLastChunk = currentTime - lastChunkTime;
          lastChunkTime = currentTime;

          logger.info(
            `🔄 [SSE] Chunk ${chunkCount}: done=${done}, size=${chunkSize}, total=${totalBytesReceived}, timing=${timeSinceLastChunk}ms`,
          );
          console.log(
            `🔄 [SSE] Chunk ${chunkCount}: done=${done}, size=${chunkSize}, total=${totalBytesReceived}, timing=${timeSinceLastChunk}ms`,
          );

          // Log raw bytes for debugging
          if (value && value.length > 0) {
            console.log(
              `🔄 [SSE] Raw bytes (first 100):`,
              new Uint8Array(value.slice(0, 100)),
            );
          }

          if (done) {
            logger.info("✅ [SSE] Stream reading completed");
            console.log("✅ [SSE] Stream reading completed");
            console.log(
              `✅ [SSE] Final stats: ${chunkCount} chunks, ${totalBytesReceived} bytes, ${messageUpdateCount} updates`,
            );
            console.log(
              `✅ [SSE] Final content assembled (${contentReceived.length} chars):`,
              JSON.stringify(contentReceived),
            );
            console.log(`✅ [SSE] Final buffer state:`, JSON.stringify(buffer));
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          logger.info(`🔄 [SSE] Raw chunk: ${JSON.stringify(chunk)}`);
          console.log(`🔄 [SSE] Raw chunk: ${JSON.stringify(chunk)}`);
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          logger.info(
            `🔄 [SSE] Split into ${lines.length} lines, buffer length: ${buffer.length}, buffer: ${
              JSON.stringify(buffer.substring(0, 100))
            }${buffer.length > 100 ? "..." : ""}`,
          );
          console.log(
            `🔄 [SSE] Lines count: ${lines.length}, buffer remaining: ${buffer.length} chars`,
          );
          console.log(
            `🔄 [SSE] Lines:`,
            lines.map((l, i) =>
              `${i}: ${JSON.stringify(l.substring(0, 100))}${
                l.length > 100 ? "..." : ""
              }`
            ),
          );

          // Track buffer assembly
          if (buffer.length > 0) {
            console.log(`📝 [SSE] Buffer assembly: "${buffer}"`);
          }

          for (const [lineIndex, line] of lines.entries()) {
            logger.info(
              `🔄 [SSE] Processing line ${lineIndex}: ${JSON.stringify(line)}`,
            );
            console.log(
              `🔄 [SSE] Processing line ${lineIndex}: ${JSON.stringify(line)}`,
            );

            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              logger.info(`📦 [SSE] Extracted data: ${JSON.stringify(data)}`);
              console.log(`📦 [SSE] Extracted data: ${JSON.stringify(data)}`);

              if (data === "[DONE]") {
                logger.info("🏁 [SSE] Received [DONE] signal");
                console.log("🏁 [SSE] Received [DONE] signal");
                break;
              }

              if (!data.trim()) {
                logger.info("⚪ [SSE] Empty data, continuing");
                console.log("⚪ [SSE] Empty data, continuing");
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                logger.info("📋 [SSE] Parsed data:", parsed);
                console.log("📋 [SSE] Parsed SSE data:", parsed);
                console.log("📋 [SSE] Data keys:", Object.keys(parsed));
                console.log(
                  "📋 [SSE] Has content:",
                  "content" in parsed,
                  "Content value:",
                  parsed.content,
                );

                if (parsed.content) {
                  contentReceived += parsed.content;
                  messageUpdateCount++;
                  logger.info(
                    `✏️ [SSE] Adding content chunk ${messageUpdateCount}: ${
                      JSON.stringify(parsed.content)
                    }`,
                  );
                  console.log(
                    `✏️ [SSE] Adding content chunk ${messageUpdateCount}: ${
                      JSON.stringify(parsed.content)
                    }`,
                  );
                  console.log(
                    `✏️ [SSE] Total content so far (${contentReceived.length} chars): ${
                      JSON.stringify(contentReceived.substring(0, 200))
                    }${contentReceived.length > 200 ? "..." : ""}`,
                  );
                  console.log(
                    `✏️ [SSE] Content assembly progress: ${messageUpdateCount} chunks, ${contentReceived.length} total chars`,
                  );

                  setMessages((prev) => {
                    console.log(
                      `🔄 [SSE] setMessages called, prev length: ${prev.length}`,
                    );
                    console.log(
                      `🔄 [SSE] Looking for assistant message ID: ${assistantMessageId}`,
                    );
                    console.log(
                      `🔄 [SSE] Previous messages:`,
                      prev.map((m) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content.substring(0, 50) + "...",
                      })),
                    );

                    const updated = prev.map((msg) => {
                      const isMatch = msg.id === assistantMessageId;
                      console.log(
                        `🔄 [SSE] Checking message ${msg.id}, matches: ${isMatch}`,
                      );
                      return isMatch
                        ? { ...msg, content: msg.content + parsed.content }
                        : msg;
                    });

                    console.log(
                      `✅ [SSE] Updated messages:`,
                      updated.map((m) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content.substring(0, 50) + "...",
                      })),
                    );
                    return updated;
                  });
                } else {
                  logger.info("⚪ [SSE] No content field in parsed data");
                  console.log(
                    "⚪ [SSE] No content field in parsed data, available fields:",
                    Object.keys(parsed),
                  );
                }
              } catch (e) {
                logger.error(
                  "🚨 [SSE] Failed to parse SSE data:",
                  e,
                  "Raw data:",
                  data,
                );
                console.error("🚨 [SSE] JSON Parse Error:", e);
                console.error(
                  "🚨 [SSE] Raw data that failed:",
                  JSON.stringify(data),
                );
                console.error("🚨 [SSE] Data length:", data.length);
              }
            } else if (line.trim()) {
              logger.info(`⚪ [SSE] Non-data line: ${JSON.stringify(line)}`);
              console.log(`⚪ [SSE] Non-data line: ${JSON.stringify(line)}`);
            }
          }
        } catch (readError) {
          logger.error("🚨 [SSE] Error reading chunk:", readError);
          console.error("🚨 [SSE] Error reading chunk:", readError);
          throw readError;
        }
      }
    } catch (error) {
      logger.error("Failed to get test response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === (Date.now() + 1).toString()
            ? { ...msg, content: "Error: Failed to get response" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "400px",
        border: "1px solid #3a3b3c",
        borderRadius: "0.25rem",
        backgroundColor: "#141516",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            color: "#b8b8c0",
          }}
        >
          Test Conversation{" "}
          {systemPrompt ? "(Using System Prompt)" : "(No System Prompt)"}
        </div>
        <BfDsButton
          onClick={handleClear}
          variant="secondary"
          size="small"
          disabled={messages.length === 0}
        >
          Clear
        </BfDsButton>
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
        {messages.length === 0
          ? (
            <div
              style={{
                textAlign: "center",
                color: "#b8b8c0",
                fontSize: "0.875rem",
                padding: "2rem",
              }}
            >
              {systemPrompt
                ? "Start a conversation to test your system prompt"
                : "Add a system prompt above to begin testing"}
            </div>
          )
          : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.role === "user"
                    ? "flex-end"
                    : "flex-start",
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
                  <MessageContent
                    content={message.content}
                    role={message.role}
                  />
                </div>
              </div>
            ))
          )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem",
          borderTop: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={systemPrompt
            ? "Type a message to test..."
            : "Add a system prompt first"}
          disabled={!systemPrompt || isLoading}
          style={{
            flex: 1,
            resize: "none",
            minHeight: "2.5rem",
            maxHeight: "6rem",
            padding: "0.5rem",
            border: "1px solid #3a3b3c",
            borderRadius: "0.25rem",
            backgroundColor: "#141516",
            color: "#fafaff",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            lineHeight: "1.4",
            outline: "none",
            opacity: !systemPrompt || isLoading ? 0.5 : 1,
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔍 [TestConversation] REAL Send button clicked!");
            handleSend(e);
          }}
          disabled={!input.trim() || !systemPrompt || isLoading}
          type="button"
          data-testid="test-conversation-send-button"
          className="bfds-button bfds-button--primary bfds-button--small"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: !input.trim() || !systemPrompt || isLoading
              ? "not-allowed"
              : "pointer",
            opacity: !input.trim() || !systemPrompt || isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? "..." : "TestSend"}
        </button>
      </div>
    </div>
  );
}
