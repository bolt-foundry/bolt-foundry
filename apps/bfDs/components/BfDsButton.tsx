import type * as React from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";
import { BfDsSpinner } from "./BfDsSpinner.tsx";

export type BfDsButtonSize = "small" | "medium" | "large";
export type BfDsButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-secondary"
  | "ghost"
  | "ghost-primary";

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
  /** React Router link path (not implemented yet, falls back to anchor tag) */
  link?: string;
  /** When true, shows spinner animation */
  spinner?: boolean;
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
  spinner = false,
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

  // Set icon size based on button size
  const iconSize = size;

  // Determine spinner size based on button size
  let spinnerSize;
  switch (size) {
    case "small":
      spinnerSize = iconOnly ? 24 : 16;
      break;
    case "large":
      spinnerSize = iconOnly ? 40 : 32;
      break;
    default:
      spinnerSize = iconOnly ? 32 : 24;
  }

  // Render icon element
  const iconElement = icon
    ? (
      typeof icon === "string"
        ? <BfDsIcon name={icon as BfDsIconName} size={iconSize} />
        : icon
    )
    : null;

  // TODO: Change to React Router Link component when implemented
  if (link) {
    return (
      <a
        href={link}
        className={classes}
        onClick={handleClick}
        target="_self"
      >
        {spinner && (
          <div className="bfds-button-spinner">
            <BfDsSpinner size={spinnerSize} />
          </div>
        )}
        {iconPosition === "left" && iconElement}
        {!iconOnly && children}
        {iconPosition === "right" && iconElement}
      </a>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={handleClick}
        target={target}
      >
        {spinner && (
          <div className="bfds-button-spinner">
            <BfDsSpinner size={spinnerSize} />
          </div>
        )}
        {iconPosition === "left" && iconElement}
        {!iconOnly && children}
        {iconPosition === "right" && iconElement}
      </a>
    );
  }

  return (
    <button
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      type={props.type ?? "button"}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
    >
      {spinner && (
        <div className="bfds-button-spinner">
          <BfDsSpinner size={spinnerSize} />
        </div>
      )}
      {iconPosition === "left" && iconElement}
      {!iconOnly && children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}
