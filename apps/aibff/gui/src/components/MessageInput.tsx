import type * as React from "react";
import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm.tsx";
import { BfDsTextArea } from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// First, let's create a component that can display and handle message input
// This will be a regular React component that we'll use with Isograph
export function MessageInputUI(props: {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    const message = formData.message?.trim();
    if (!message || isSending || props.disabled) return;

    setIsSending(true);
    try {
      await props.onSendMessage(message);
    } catch (error) {
      logger.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Trigger form submission
      const form = e.currentTarget.closest('form');
      form?.requestSubmit();
    }
  };

  return (
    <div className="message-input-container">
      <BfDsForm onSubmit={handleSubmit} className="message-input-form">
        <div className="message-input-content">
          <BfDsTextArea
            name="message"
            placeholder="Type a message..."
            disabled={props.disabled || isSending}
            rows={1}
            resize="vertical"
            onKeyDown={handleKeyDown}
            style={{ flex: 1, minHeight: "2.5rem", maxHeight: "10rem" }}
          />
          <BfDsButton
            type="submit"
            disabled={isSending || props.disabled}
            variant="primary"
          >
            {isSending ? "Sending..." : "Send"}
          </BfDsButton>
        </div>
      </BfDsForm>
    </div>
  );
}

// TODO: Add Isograph component once @iso is properly configured
// This will be used to integrate with GraphQL queries and mutations
