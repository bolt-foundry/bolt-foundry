import type * as React from "react";
import { useEffect, useState } from "react";
import { BfDsIcon } from "./BfDsIcon.tsx";

export type BfDsCalloutVariant = "info" | "success" | "warning" | "error";

export type BfDsCalloutProps = {
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
  children,
  variant = "info",
  details,
  defaultExpanded = false,
  visible = true,
  onDismiss,
  autoDismiss = 0,
  className,
}: React.PropsWithChildren<BfDsCalloutProps>) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(visible);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(autoDismiss);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize time remaining when component mounts or autoDismiss changes
  useEffect(() => {
    if (visible && autoDismiss > 0) {
      setTimeRemaining(autoDismiss);
    }
  }, [visible, autoDismiss]);

  // Auto-dismiss countdown functionality
  useEffect(() => {
    if (visible && autoDismiss > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          // Only count down if not paused
          if (!isPaused && prev > 0) {
            if (prev <= 100) {
              // Start exit animation
              setIsAnimatingOut(true);
              // Wait for animation duration (0.3s) then call onDismiss and hide
              setTimeout(() => {
                setIsVisible(false);
                onDismiss?.();
              }, 300);
              return 0;
            }
            return prev - 100;
          }
          return prev; // Return current value if paused or already at 0
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [visible, autoDismiss, onDismiss, isPaused]);

  // Update visibility when prop changes
  useEffect(() => {
    setIsVisible(visible);
    setIsAnimatingOut(false); // Reset animation state when visibility changes
  }, [visible]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    // Wait for animation duration (0.3s) then call onDismiss and hide
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
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
    isAnimatingOut ? "bfds-callout--animating-out" : null,
    className,
  ].filter(Boolean).join(" ");

  const handleMouseEnter = () => {
    if (autoDismiss > 0) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoDismiss > 0) {
      setIsPaused(false);
    }
  };

  return (
    <div
      className={calloutClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bfds-callout-header">
        <div className="bfds-callout-icon">
          <BfDsIcon name={iconName} size="small" />
        </div>
        <div className="bfds-callout-content">
          <div className="bfds-callout-message">
            {children}
          </div>
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
            {autoDismiss > 0 && (() => {
              const SVG_SIZE = 32;
              const CENTER = SVG_SIZE / 2;
              const RADIUS = 14;
              const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
              const STROKE_WIDTH = 2;

              return (
                <div className="bfds-callout-countdown">
                  <svg
                    className={`bfds-callout-countdown-ring ${
                      isPaused ? "bfds-callout-countdown-ring--paused" : ""
                    }`}
                    width={SVG_SIZE}
                    height={SVG_SIZE}
                    viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                  >
                    <circle
                      className="bfds-callout-countdown-track"
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={STROKE_WIDTH}
                      opacity="0.2"
                    />
                    <circle
                      className="bfds-callout-countdown-progress"
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE *
                        (1 - (timeRemaining / autoDismiss))}
                      transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    />
                  </svg>
                </div>
              );
            })()}
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
