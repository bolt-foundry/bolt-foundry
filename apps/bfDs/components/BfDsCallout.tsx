import { useEffect, useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(visible);

  // Auto-dismiss functionality
  useEffect(() => {
    if (visible && autoDismiss > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss, onDismiss]);

  // Update visibility when prop changes
  useEffect(() => {
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
    warning: "exclamationTriangle" as const,
    error: "exclamationStop" as const,
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
