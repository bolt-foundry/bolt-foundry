import type * as React from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";

export type BfDsButtonSize = "small" | "medium" | "large";
export type BfDsButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

export type BfDsButtonProps = {
  /** Button content text or elements */
  children?: React.ReactNode;
  /** Size variant for button */
  size?: BfDsButtonSize;
  /** Visual style variant */
  variant?: BfDsButtonVariant;
  /** Disables button interaction */
  disabled?: boolean;
  /** Click event handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Icon name or custom icon element */
  icon?: BfDsIconName | React.ReactNode;
  /** Position of icon relative to text */
  iconPosition?: "left" | "right";
  /** When true, shows only icon without text */
  iconOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function BfDsButton({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  onClick,
  className,
  icon,
  iconPosition = "left",
  iconOnly = false,
  ...props
}: BfDsButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  const classes = [
    "bfds-button",
    `bfds-button--${variant}`,
    `bfds-button--${size}`,
    iconOnly && "bfds-button--icon-only",
    className,
  ].filter(Boolean).join(" ");

  // Determine icon size based on button size
  const iconSize = size === "small"
    ? "small"
    : size === "large"
    ? "large"
    : "medium";

  // Render icon element
  const iconElement = icon
    ? (
      typeof icon === "string"
        ? <BfDsIcon name={icon as BfDsIconName} size={iconSize} />
        : icon
    )
    : null;

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
    >
      {iconPosition === "left" && iconElement}
      {!iconOnly && children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}
