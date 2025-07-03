import * as React from "react";

export type BfDsListItemProps = {
  /** Content to display in the list item */
  children: React.ReactNode;
  /** When true, shows active state styling */
  active?: boolean;
  /** When true, disables interaction and shows disabled styling */
  disabled?: boolean;
  /** Click handler - when provided, renders as button instead of li */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsListItem({
  children,
  active = false,
  disabled = false,
  onClick,
  className,
}: BfDsListItemProps) {
  const itemClasses = [
    "bfds-list-item",
    active && "bfds-list-item--active",
    disabled && "bfds-list-item--disabled",
    onClick && !disabled && "bfds-list-item--clickable",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const element = onClick && !disabled ? "button" : "li";
  const buttonProps = element === "button"
    ? {
      type: "button" as const,
      onClick: handleClick,
    }
    : {};

  return React.createElement(
    element,
    {
      className: itemClasses,
      ...buttonProps,
    },
    children,
  );
}
