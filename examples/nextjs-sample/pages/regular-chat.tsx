import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Chat.module.css";
import TextareaAutosize from "react-textarea-autosize";
import Link from "next/link";

export default function RegularChatPage() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; id: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() === "" || isLoading) return;

    // Add user message to the chat
    const userMessage = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send request to API
      const response = await fetch("/api/regular-chat", {
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

      // Add AI response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.content,
          id: Date.now().toString(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Regular Chat (Non-Streaming)</title>
        <meta name="description" content="Non-streaming chat with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Regular Chat (Non-Streaming)</h1>

        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <p>Ask me anything...</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.aiMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.loadingDots}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <TextareaAutosize
              className={styles.input}
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              minRows={1}
              maxRows={5}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || input.trim() === ""}
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>

        <div className={styles.navigation}>
          <Link href="/">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
