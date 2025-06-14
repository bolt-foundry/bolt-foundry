import { useState } from "react";
import Head from "next/head";
import TextareaAutosize from "react-textarea-autosize";

// Message type for our chat
type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

export default function Chat() {
  // State to store chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the input field
  const [input, setInput] = useState("");
  // State to track if we're waiting for a response
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if input is empty or we're already loading
    if (input.trim() === "" || isLoading) return;

    // Create the user message
    const userMessage: Message = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };

    // Add user message to chat and clear input
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send messages to our API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          id: Date.now().toString(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          id: Date.now().toString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Bolt Foundry Chat Example</title>
        <meta
          name="description"
          content="Minimal chat example using Bolt Foundry SDK"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Bolt Foundry Chat Example</h1>
        <p className="subtitle">
          A minimal example showing how to use the Bolt Foundry SDK
        </p>

        <div className="chat-container">
          {/* Messages area */}
          <div className="messages">
            {messages.length === 0 && (
              <div className="empty-state">
                Start a conversation...
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                <strong>{message.role === "user" ? "You:" : "AI:"}</strong>
                <div>{message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant loading">
                <strong>AI:</strong>
                <div>Thinking...</div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="input-form">
            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input"
              minRows={1}
              maxRows={5}
              onKeyDown={(e) => {
                // Submit on Enter (but not Shift+Enter for new lines)
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className="submit-button"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
