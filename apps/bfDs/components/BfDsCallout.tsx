import * as React from "react";
import { BfDsIcon } from "./BfDsIcon.tsx";

export type BfDsCalloutVariant = "info" | "success" | "warning" | "error";

export type BfDsCalloutProps = {
  /** The main message to display */
  message: string;
  /** Visual variant of the callout */
  variant?: BfDsCalloutVariant;
  /** Optional detailed content (like JSON data) */
  details?: string;
  /** Whether details are expanded by default */
  defaultExpanded?: boolean;
  /** Whether to show the callout */
  visible?: boolean;
  /** Callback when callout is dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss after milliseconds (0 = no auto-dismiss) */
  autoDismiss?: number;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsCallout({
  message,
  variant = "info",
  details,
  defaultExpanded = false,
  visible = true,
  onDismiss,
  autoDismiss = 0,
  className,
}: BfDsCalloutProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [isVisible, setIsVisible] = React.useState(visible);

  // Auto-dismiss functionality
  React.useEffect(() => {
    if (visible && autoDismiss > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss, onDismiss]);

  // Update visibility when prop changes
  React.useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const iconName = {
    info: "infoCircle" as const,
    success: "checkCircle" as const,
    warning: "infoCircle" as const,
    error: "cross" as const,
  }[variant];

  const calloutClasses = [
    "bfds-callout",
    `bfds-callout--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={calloutClasses}>
      <div className="bfds-callout-header">
        <div className="bfds-callout-icon">
          <BfDsIcon name={iconName} size="small" />
        </div>
        <div className="bfds-callout-content">
          <div className="bfds-callout-message">{message}</div>
          {details && (
            <button
              className="bfds-callout-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
            >
              {isExpanded ? "Hide details" : "Show details"}
              <BfDsIcon
                name={isExpanded ? "arrowUp" : "arrowDown"}
                size="small"
              />
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            className="bfds-callout-dismiss"
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss notification"
          >
            <BfDsIcon name="cross" size="small" />
          </button>
        )}
      </div>
      {details && isExpanded && (
        <div className="bfds-callout-details">
          <pre>{details}</pre>
        </div>
      )}
    </div>
  );
}

BfDsCallout.Example = function BfDsCalloutExample() {
  const [notifications, setNotifications] = React.useState<
    Array<{
      id: number;
      message: string;
      variant: BfDsCalloutVariant;
      details?: string;
    }>
  >([]);
  const [nextId, setNextId] = React.useState(1);

  const addNotification = (
    message: string,
    variant: BfDsCalloutVariant,
    details?: string,
  ) => {
    setNotifications(
      (prev) => [...prev, { id: nextId, message, variant, details }],
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
          <BfDsCallout
            message="This is an informational message"
            variant="info"
          />
          <BfDsCallout
            message="Operation completed successfully!"
            variant="success"
          />
          <BfDsCallout
            message="Please review your settings"
            variant="warning"
          />
          <BfDsCallout
            message="An error occurred while processing"
            variant="error"
          />
        </div>
      </div>

      <div>
        <h3>With Details</h3>
        <BfDsCallout
          message="Form submitted successfully"
          variant="success"
          details={JSON.stringify(sampleData, null, 2)}
          onDismiss={() => {}}
        />
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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notifications.map((notification) => (
            <BfDsCallout
              key={notification.id}
              message={notification.message}
              variant={notification.variant}
              details={notification.details}
              onDismiss={() => removeNotification(notification.id)}
              autoDismiss={5000}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
