import type * as React from "react";
import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Simplified message input without BfDsForm
export function MessageInputUI(props: {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = message.trim();
    if (!content || isSending || props.disabled) return;

    setIsSending(true);
    try {
      await props.onSendMessage(content);
      setMessage(""); // Clear input after sending
    } catch (error) {
      logger.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="message-input-content" style={{ display: "flex", gap: "0.5rem", padding: "1rem" }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={props.disabled || isSending}
            onKeyDown={handleKeyDown}
            style={{ 
              flex: 1, 
              minHeight: "2.5rem", 
              maxHeight: "10rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              backgroundColor: "#1a1b1c",
              color: "#fafaff",
              resize: "vertical"
            }}
          />
          <BfDsButton
            type="submit"
            disabled={isSending || props.disabled || !message.trim()}
            variant="primary"
          >
            {isSending ? "Sending..." : "Send"}
          </BfDsButton>
        </div>
      </form>
    </div>
  );
}
