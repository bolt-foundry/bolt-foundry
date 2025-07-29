import type * as React from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";

export type BfDsPillVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

export type BfDsPillProps = {
  /** Label text for the pill */
  label?: string;
  /** Main content text or number */
  text?: string | number;
  /** Icon name to display */
  icon?: BfDsIconName;
  /** Visual variant for the pill */
  variant?: BfDsPillVariant;
  /** Additional action element (e.g., button) */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsPill({
  label,
  text,
  icon,
  variant = "secondary",
  action,
  className,
}: BfDsPillProps) {
  const classes = [
    "bfds-pill",
    `bfds-pill--${variant}`,
    !text && !icon && !action && "bfds-pill--label-only",
    className,
  ].filter(Boolean).join(" ");

  const labelClasses = [
    "bfds-pill__label",
    !text && !icon && !action && "bfds-pill__label--no-content",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {label && (
        <div className={labelClasses}>
          {label}
        </div>
      )}
      {(text || icon || action) && (
        <div className="bfds-pill__content">
          {text}
          {icon && <BfDsIcon name={icon} size="small" />}
          {action}
        </div>
      )}
    </div>
  );
}
