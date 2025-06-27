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

  const { graderContent, updateGraderContent } = useGrader();

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
            // Use the existing handleSend logic
            if (!content.trim()) return;

            const newMessage: Message = {
              id: Date.now().toString(),
              role: "user",
              content: content.trim(),
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
              const decoder = new TextDecoder();

              if (!reader) {
                throw new Error("No response body");
              }

              const processStream = async () => {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                      if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                          return;
                        }

                        try {
                          const parsed = JSON.parse(data);

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
