import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsRangeSize = "small" | "medium" | "large";
export type BfDsRangeState = "default" | "error" | "success" | "disabled";

export type BfDsRangeProps =
  & {
    // Form context props
    /** Form field name for data binding */
    name?: string;

    // Standalone props
    /** Current range value */
    value?: number;
    /** Change event handler */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Common props
    /** Label text displayed above range */
    label?: string;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Show value display */
    showValue?: boolean;
    /** Custom value formatter */
    formatValue?: (value: number) => string;
    /** Show tick marks */
    showTicks?: boolean;
    /** Custom tick labels */
    tickLabels?: Array<{ value: number; label: string }>;
    /** Size variant */
    size?: BfDsRangeSize;
    /** Visual state of the range */
    state?: BfDsRangeState;
    /** Custom color for the fill and handle */
    color?: string;
    /** Error message to display */
    errorMessage?: string;
    /** Success message to display */
    successMessage?: string;
    /** Help text displayed below range */
    helpText?: string;
    /** Required for validation */
    required?: boolean;
    /** Additional CSS classes */
    className?: string;
  }
  & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "min" | "max" | "step" | "size"
  >;

export function BfDsRange({
  name,
  value: standaloneProp,
  onChange: standaloneOnChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue = (val) => val.toString(),
  showTicks = false,
  tickLabels,
  size = "medium",
  state = "default",
  color,
  errorMessage,
  successMessage,
  helpText,
  required = false,
  className,
  disabled,
  id,
  ...props
}: BfDsRangeProps) {
  const formContext = useBfDsFormContext();
  const inputId = id || React.useId();
  const helpTextId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  // Determine if we're in form context or standalone mode
  const isInFormContext = formContext !== null && name !== undefined;

  // Get value and onChange from form context or standalone props
  const value = isInFormContext && formContext?.data && name
    ? (formContext.data[name as keyof typeof formContext.data] as number) ?? min
    : standaloneProp ?? min;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFloat(e.target.value);

    // Round to the appropriate precision based on step to avoid floating point issues
    const decimalPlaces = step.toString().includes(".")
      ? step.toString().split(".")[1].length
      : 0;
    const newValue = Math.round(rawValue * Math.pow(10, decimalPlaces)) /
      Math.pow(10, decimalPlaces);

    if (isInFormContext && formContext?.onChange && formContext?.data && name) {
      formContext.onChange({ ...formContext.data, [name]: newValue });
    } else if (standaloneOnChange) {
      // Create a new event with the corrected value
      const correctedEvent = {
        ...e,
        target: { ...e.target, value: newValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      standaloneOnChange(correctedEvent);
    }
  };

  // Get error state from form context if available
  const formError = isInFormContext && formContext?.errors && name
    ? formContext.errors[name as keyof typeof formContext.errors]
    : undefined;
  const actualErrorMessage =
    (formError as unknown as { message?: string })?.message ||
    errorMessage;
  const actualState = disabled ? "disabled" : (formError ? "error" : state);

  // Calculate percentage and fill position for progress fill
  const percentage = ((value - min) / (max - min)) * 100;

  // Calculate fill for negative ranges (fill from zero)
  const hasNegativeRange = min < 0 && max > 0;
  const zeroPosition = hasNegativeRange ? ((0 - min) / (max - min)) * 100 : 0;

  const fillStyle = hasNegativeRange
    ? value >= 0
      ? { left: `${zeroPosition}%`, width: `${percentage - zeroPosition}%` }
      : {
        right: `${100 - zeroPosition}%`,
        width: `${zeroPosition - percentage}%`,
      }
    : { left: "0%", width: `${percentage}%` };

  const classes = [
    "bfds-range",
    `bfds-range--${size}`,
    `bfds-range--${actualState}`,
    className,
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "bfds-range-container",
    `bfds-range-container--${actualState}`,
    showTicks ? "bfds-range-container--with-ticks" : null,
  ].filter(Boolean).join(" ");

  // Generate tick marks if enabled
  const renderTicks = () => {
    if (!showTicks) return null;

    const ticks = [];
    if (tickLabels && tickLabels.length > 0) {
      // Use custom tick labels
      for (let i = 0; i < tickLabels.length; i++) {
        const tick = tickLabels[i];
        const rawPosition = ((tick.value - min) / (max - min)) * 100;
        const isFirst = i === 0;
        const isLast = i === tickLabels.length - 1;

        // Adjust position to align with handle center at min/max
        // Handle is ~18px wide (medium size), so we need ~9px offset from edges
        const handleRadius = 1; // approximate percentage of handle radius
        const handleOffset = isFirst
          ? handleRadius
          : isLast
          ? -handleRadius
          : 0;
        const position = rawPosition + handleOffset;

        const tickClass = [
          "bfds-range-tick",
          isFirst ? "bfds-range-tick--first" : null,
          isLast ? "bfds-range-tick--last" : null,
        ].filter(Boolean).join(" ");

        ticks.push(
          <div
            key={tick.value}
            className={tickClass}
            style={{ left: `${position}%` }}
          >
            <div className="bfds-range-tick-mark" />
            <div className="bfds-range-tick-label">{tick.label}</div>
          </div>,
        );
      }
    } else {
      // Generate automatic ticks
      const tickCount = 5; // Default to 5 ticks
      const tickStep = (max - min) / (tickCount - 1);
      for (let i = 0; i < tickCount; i++) {
        const tickValue = min + tickStep * i;
        const rawPosition = ((tickValue - min) / (max - min)) * 100;
        const isFirst = i === 0;
        const isLast = i === tickCount - 1;

        // Adjust position to align with handle center at min/max
        // Handle is ~18px wide (medium size), so we need ~9px offset from edges
        const handleRadius = 1; // approximate percentage of handle radius
        const handleOffset = isFirst
          ? handleRadius
          : isLast
          ? -handleRadius
          : 0;
        const position = rawPosition + handleOffset;

        const tickClass = [
          "bfds-range-tick",
          isFirst ? "bfds-range-tick--first" : null,
          isLast ? "bfds-range-tick--last" : null,
        ].filter(Boolean).join(" ");

        ticks.push(
          <div
            key={tickValue}
            className={tickClass}
            style={{ left: `${position}%` }}
          >
            <div className="bfds-range-tick-mark" />
            <div className="bfds-range-tick-label">
              {formatValue(tickValue)}
            </div>
          </div>,
        );
      }
    }
    return <div className="bfds-range-ticks">{ticks}</div>;
  };

  return (
    <div className={containerClasses}>
      <div className="bfds-range-header">
        {label && (
          <label htmlFor={inputId} className="bfds-range-label">
            {label}
            {required && <span className="bfds-range-required">*</span>}
          </label>
        )}
        {showValue && (
          <div className="bfds-range-value">{formatValue(value)}</div>
        )}
      </div>
      <div className="bfds-range-wrapper">
        <div className="bfds-range-track">
          <div
            className="bfds-range-fill"
            style={{
              ...fillStyle,
              ...(color && { backgroundColor: color }),
            }}
          />
        </div>
        <input
          {...props}
          type="range"
          id={inputId}
          name={name}
          className={classes}
          min={min}
          max={max}
          step={step}
          disabled={disabled || actualState === "disabled"}
          required={required}
          value={value}
          onChange={handleChange}
          style={{
            ...(color && {
              "--bfds-range-custom-color": color,
            } as React.CSSProperties),
          }}
          aria-describedby={[
            helpText ? helpTextId : null,
            actualErrorMessage ? errorId : null,
            successMessage ? successId : null,
          ].filter(Boolean).join(" ") || undefined}
          aria-invalid={actualState === "error"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
        />
        {renderTicks()}
      </div>
      {helpText && (
        <div id={helpTextId} className="bfds-range-help">
          {helpText}
        </div>
      )}
      {actualState === "error" && actualErrorMessage && (
        <div id={errorId} className="bfds-range-error" role="alert">
          {actualErrorMessage}
        </div>
      )}
      {actualState === "success" && successMessage && (
        <div id={successId} className="bfds-range-success">
          {successMessage}
        </div>
      )}
    </div>
  );
}
