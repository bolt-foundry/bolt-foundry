import type * as React from "react";
import type { ReactNode } from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";

export type BfDsBadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

export type BfDsBadgeSize = "small" | "medium" | "large";

export type BfDsBadgeProps = {
  /** Content inside the badge */
  children: ReactNode;
  /** Visual variant of the badge */
  variant?: BfDsBadgeVariant;
  /** Size of the badge */
  size?: BfDsBadgeSize;
  /** Icon to display before the text */
  icon?: BfDsIconName;
  /** Whether the badge should be outlined instead of filled */
  outlined?: boolean;
  /** Whether the badge should be rounded (pill shape) */
  rounded?: boolean;
  /** Whether the badge is clickable */
  clickable?: boolean;
  /** Click handler for clickable badges */
  onClick?: () => void;
  /** Whether the badge is removable */
  removable?: boolean;
  /** Handler for remove action */
  onRemove?: () => void;
  /** Additional CSS classes */
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick">;

export function BfDsBadge({
  children,
  variant = "default",
  size = "medium",
  icon,
  outlined = false,
  rounded = false,
  clickable = false,
  onClick,
  removable = false,
  onRemove,
  className,
  ...props
}: BfDsBadgeProps) {
  const classes = [
    "bfds-badge",
    `bfds-badge--${variant}`,
    `bfds-badge--${size}`,
    outlined && "bfds-badge--outlined",
    rounded && "bfds-badge--rounded",
    clickable && "bfds-badge--clickable",
    removable && "bfds-badge--removable",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = (_e: React.MouseEvent<HTMLSpanElement>) => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const iconSize = size === "small"
    ? "small"
    : size === "large"
    ? "medium"
    : "small";

  return (
    <span
      {...props}
      className={classes}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
    >
      {icon && (
        <BfDsIcon
          name={icon}
          size={iconSize}
          className="bfds-badge__icon"
        />
      )}

      <span className="bfds-badge__content">
        {children}
      </span>

      {removable && (
        <button
          type="button"
          className="bfds-badge__remove"
          onClick={handleRemoveClick}
          aria-label="Remove badge"
          tabIndex={-1}
        >
          <BfDsIcon
            name="cross"
            size={iconSize}
          />
        </button>
      )}
    </span>
  );
}
