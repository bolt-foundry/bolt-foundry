import type * as React from "react";
import type { ReactNode } from "react";

export type BfDsCardProps = {
  /** Content inside the card */
  children: ReactNode;
  /** Card header content */
  header?: ReactNode;
  /** Card footer content */
  footer?: ReactNode;
  /** Variant style of the card */
  variant?: "default" | "elevated" | "outlined" | "flat";
  /** Size variant */
  size?: "small" | "medium" | "large";
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Click handler for clickable cards */
  onClick?: () => void;
  /** Whether the card is selected/active */
  selected?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">;

export function BfDsCard({
  children,
  header,
  footer,
  variant = "default",
  size = "medium",
  clickable = false,
  onClick,
  selected = false,
  disabled = false,
  className,
  ...props
}: BfDsCardProps) {
  const classes = [
    "bfds-card",
    `bfds-card--${variant}`,
    `bfds-card--${size}`,
    clickable && "bfds-card--clickable",
    selected && "bfds-card--selected",
    disabled && "bfds-card--disabled",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = () => {
    if (clickable && !disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      clickable && !disabled && onClick && (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      {...props}
      className={classes}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      role={clickable ? "button" : undefined}
      aria-disabled={disabled}
      aria-pressed={clickable && selected ? true : undefined}
    >
      {header && (
        <div className="bfds-card__header">
          {header}
        </div>
      )}

      <div className="bfds-card__body">
        {children}
      </div>

      {footer && (
        <div className="bfds-card__footer">
          {footer}
        </div>
      )}
    </div>
  );
}
