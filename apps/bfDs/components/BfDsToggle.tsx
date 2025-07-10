import type * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsToggleSize = "small" | "medium" | "large";

export type BfDsToggleProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Whether the toggle is on/off */
  checked?: boolean;
  /** Callback when toggle state changes */
  onChange?: (checked: boolean) => void;

  // Common props
  /** Label text displayed next to toggle */
  label?: string;
  /** Disables component */
  disabled?: boolean;
  /** Size variant for toggle switch */
  size?: BfDsToggleSize;
  /** Additional CSS classes */
  className?: string;
  /** Element ID */
  id?: string;
};

export function BfDsToggle({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className,
  id,
  size = "medium",
}: BfDsToggleProps) {
  const formContext = useBfDsFormContext();
  const isInForm = !!formContext;

  // Use form context if available
  const actualChecked = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name || ""] === true
    : checked || false;
  const actualOnChange = isInForm
    ? (newChecked: boolean) => {
      if (name && formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newChecked,
        });
      }
    }
    : onChange;

  const toggleClasses = [
    "bfds-toggle",
    `bfds-toggle--${size}`,
    actualChecked && "bfds-toggle--checked",
    disabled && "bfds-toggle--disabled",
    className,
  ].filter(Boolean).join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (actualOnChange) {
      actualOnChange(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (actualOnChange && !disabled) {
        actualOnChange(!actualChecked);
      }
    }
  };

  return (
    <label className="bfds-toggle-wrapper">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={actualChecked}
        onChange={handleChange}
        disabled={disabled}
        className="bfds-toggle-input"
      />
      <div
        className={toggleClasses}
        role="switch"
        aria-checked={actualChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className="bfds-toggle-track">
          <div className="bfds-toggle-thumb" />
        </div>
      </div>
      {label && (
        <span className="bfds-toggle-label">
          {label}
        </span>
      )}
    </label>
  );
}
