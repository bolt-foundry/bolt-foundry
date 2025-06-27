import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// First, let's create a component that can display and handle message input
// This will be a regular React component that we'll use with Isograph
export function MessageInputUI(props: {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isSending || props.disabled) return;

    setIsSending(true);
    try {
      await props.onSendMessage(input.trim());
      setInput("");
    } catch (error) {
      logger.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "flex-end",
        padding: "1rem",
        borderTop: "1px solid #3a3b3c",
        backgroundColor: "#1c1c1c",
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={props.disabled || isSending}
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
          opacity: props.disabled || isSending ? 0.5 : 1,
        }}
      />
      <BfDsButton
        onClick={handleSend}
        disabled={!input.trim() || isSending || props.disabled}
        variant="primary"
      >
        {isSending ? "Sending..." : "Send"}
      </BfDsButton>
    </div>
  );
}

// TODO: Add Isograph component once @iso is properly configured
// This will be used to integrate with GraphQL queries and mutations
