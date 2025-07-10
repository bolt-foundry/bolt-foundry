import { useState } from "react";
import { useChat } from "ai/react";
import Head from "next/head";
import styles from "../styles/Chat.module.css";
import TextareaAutosize from "react-textarea-autosize";
import Link from "next/link";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat();

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chat</title>
        <meta name="description" content="Chat with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Chat with AI</h1>

        <div className={styles.chatContainer}>
          {error && (
            <div className={styles.errorBanner}>
              <h3>🔑 OpenAI API Key Required</h3>
              <p>To use this chat demo, please set the OPENAI_API_KEY environment variable.</p>
              <p>
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get an API key from OpenAI →
                </a>
              </p>
            </div>
          )}
          
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <p>Ask me anything...</p>
              </div>
            )}

            {messages.map((message: any) => (
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
          <Link href="/" className={styles.navLink}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
