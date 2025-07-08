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
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  /** Additional CSS classes */
  className?: string;
  /** URL to navigate to (for future link support) */
  href?: string;
  /** Icon name or custom icon element */
  icon?: BfDsIconName | React.ReactNode;
  /** Position of icon relative to text */
  iconPosition?: "left" | "right";
  /** When true, shows only icon without text */
  iconOnly?: boolean;
  /** When true, applies overlay styling, shows original variant on hover */
  overlay?: boolean;
  /** URL to navigate to (renders as anchor tag) */
  href?: string;
  /** Target attribute for links (defaults to _blank when href is provided) */
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
  /** React Router link path (not implemented yet, falls back to href) */
  link?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function BfDsButton({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  onClick,
  className,
  href: _href,
  icon,
  iconPosition = "left",
  iconOnly = false,
  overlay = false,
  href,
  target = "_blank",
  link,
  ...props
}: BfDsButtonProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (disabled) return;
    onClick?.(e);
    // TODO: href navigation will be implemented later
  };

  const classes = [
    "bfds-button",
    `bfds-button--${variant}`,
    `bfds-button--${size}`,
    iconOnly && "bfds-button--icon-only",
    overlay && "bfds-button--overlay",
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

  // TODO: Add React Router Link component when implemented
  if (link || href) {
    const linkHref = link || href;
    return (
      <a
        href={linkHref}
        className={classes}
        onClick={handleClick}
        target={target}
      >
        {iconPosition === "left" && iconElement}
        {!iconOnly && children}
        {iconPosition === "right" && iconElement}
      </a>
    );
  }

  return (
    <button
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
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
