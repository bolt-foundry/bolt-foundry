import { useState } from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsCallout, type BfDsCalloutVariant } from "../BfDsCallout.tsx";

const logger = getLogger(import.meta);

export function BfDsCalloutExample() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: number;
      message: string;
      variant: BfDsCalloutVariant;
      details?: string;
      autoDismiss?: number;
    }>
  >([]);
  const [nextId, setNextId] = useState(1);

  const addNotification = (
    message: string,
    variant: BfDsCalloutVariant,
    details?: string,
    autoDismiss?: number,
  ) => {
    setNotifications(
      (
        prev,
      ) => [...prev, { id: nextId, message, variant, details, autoDismiss }],
    );
    setNextId((prev) => prev + 1);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const sampleData = {
    name: "John Doe",
    email: "john@example.com",
    preferences: {
      theme: "dark",
      notifications: true,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsCallout Examples</h2>

      <div>
        <h3>Static Examples</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsCallout variant="info">
            This is an informational message
          </BfDsCallout>
          <BfDsCallout variant="success">
            Operation completed successfully!
          </BfDsCallout>
          <BfDsCallout variant="warning">
            Please review your settings
          </BfDsCallout>
          <BfDsCallout variant="error">
            An error occurred while processing
          </BfDsCallout>
        </div>
      </div>

      <div>
        <h3>With Details</h3>
        <BfDsCallout
          variant="success"
          details={JSON.stringify(sampleData, null, 2)}
          onDismiss={() => {}}
        >
          Form submitted successfully
        </BfDsCallout>
      </div>

      <div>
        <h3>With Auto-dismiss and Countdown</h3>
        <BfDsCallout
          variant="info"
          autoDismiss={10000}
          onDismiss={() => logger.info("Auto-dismissed")}
        >
          This callout will auto-dismiss in 10 seconds. Notice the countdown
          ring around the close button.
          <strong>
            Try hovering over this callout to pause the countdown!
          </strong>
        </BfDsCallout>
      </div>

      <div>
        <h3>Dynamic Notifications</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => addNotification("Info notification", "info")}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--bfds-primary)",
              color: "var(--bfds-background)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Info
          </button>
          <button
            type="button"
            onClick={() => addNotification("Success!", "success")}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--bfds-success)",
              color: "var(--bfds-background)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Success
          </button>
          <button
            type="button"
            onClick={() =>
              addNotification(
                "Form data saved",
                "success",
                JSON.stringify(sampleData, null, 2),
              )}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--bfds-success)",
              color: "var(--bfds-background)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add with Details
          </button>
          <button
            type="button"
            onClick={() =>
              addNotification(
                "Auto-dismiss in 5 seconds",
                "warning",
                undefined,
                5000,
              )}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--bfds-primary)",
              color: "var(--bfds-background)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Auto-dismiss
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notifications.map((notification) => (
            <BfDsCallout
              key={notification.id}
              variant={notification.variant}
              details={notification.details}
              autoDismiss={notification.autoDismiss}
              onDismiss={() => removeNotification(notification.id)}
            >
              {notification.message}
            </BfDsCallout>
          ))}
        </div>
      </div>
    </div>
  );
}
