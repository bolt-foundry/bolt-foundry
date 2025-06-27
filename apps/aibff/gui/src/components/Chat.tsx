import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useRouter } from "../contexts/RouterContext.tsx";
import { useGrader } from "../contexts/GraderContext.tsx";
import { GraderEditor } from "./GraderEditor.tsx";
import { MessageContent } from "./MessageContent.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

// Generate a simple conversation ID
function generateConversationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `conv-${timestamp}-${random}`;
}

export function Chat() {
  const { navigate, params } = useRouter();
  const conversationId = params?.conversationId;
  const conversationIdRef = useRef<string | undefined>(conversationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { graderContent, updateGraderContent } = useGrader();

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

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

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsStreaming(true);

    try {
      // Send to the SSE endpoint
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          conversationId: conversationIdRef.current,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Set up SSE reader
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                // Update the assistant's message with the new content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore parse errors
            }
          } else if (line.startsWith("event: done")) {
            // Stream is complete
            break;
          } else if (line.startsWith("event: error")) {
            const errorLine = lines[lines.indexOf(line) + 1];
            if (errorLine?.startsWith("data: ")) {
              const errorData = JSON.parse(errorLine.slice(6));
              throw new Error(errorData.error || "Stream error");
            }
          }
        }
      }

      // Streaming completed successfully
      setIsStreaming(false);
      streamingMessageIdRef.current = null;
    } catch (error) {
      // Check if the error was due to abort
      if (error instanceof Error && error.name === "AbortError") {
        logger.debug("Stream cancelled by user");
        return;
      }

      logger.error("Error getting AI response:", error);
      // Update the assistant message with an error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
              ...msg,
              content:
                "I'm sorry, I encountered an error. Please make sure your OpenRouter API key is configured and try again.",
            }
            : msg
        )
      );
      setIsStreaming(false);
      streamingMessageIdRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid #3a3b3c",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            style={{
              flex: 1,
              resize: "none",
              minHeight: "2.5rem",
              maxHeight: "10rem",
              padding: "0.5rem",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              backgroundColor: "#141516",
              color: "#fafaff",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "1.5",
              outline: "none",
            }}
          />
          <BfDsButton
            onClick={handleSend}
            disabled={!input.trim()}
            variant="primary"
          >
            Send
          </BfDsButton>
        </div>
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
