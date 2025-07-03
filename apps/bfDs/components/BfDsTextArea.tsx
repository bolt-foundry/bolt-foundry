import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsTextAreaState = "default" | "error" | "success" | "disabled";

export type BfDsTextAreaProps =
  & {
    // Form context props
    /** Form field name for data binding */
    name?: string;

    // Standalone props
    /** Current textarea value */
    value?: string;
    /** Change event handler */
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    // Common props
    /** Label text displayed above textarea */
    label?: string;
    /** Placeholder text when empty */
    placeholder?: string;
    /** Required for validation */
    required?: boolean;
    /** Visual state of the textarea */
    state?: BfDsTextAreaState;
    /** Error message to display */
    errorMessage?: string;
    /** Success message to display */
    successMessage?: string;
    /** Help text displayed below textarea */
    helpText?: string;
    /** Additional CSS classes */
    className?: string;
    /** Resize behavior for textarea */
    resize?: "none" | "both" | "horizontal" | "vertical";
  }
  & Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  >;

export function BfDsTextArea({
  name,
  value: standaloneProp,
  onChange: standaloneOnChange,
  label,
  placeholder,
  required = false,
  state = "default",
  errorMessage,
  successMessage,
  helpText,
  className,
  disabled,
  id,
  resize = "vertical",
  ...props
}: BfDsTextAreaProps) {
  const formContext = useBfDsFormContext();
  const textAreaId = id || React.useId();
  const helpTextId = `${textAreaId}-help`;
  const errorId = `${textAreaId}-error`;
  const successId = `${textAreaId}-success`;

  // Determine if we're in form context or standalone mode
  const isInFormContext = formContext !== null && name !== undefined;

  // Get value and onChange from form context or standalone props
  const value = isInFormContext && formContext?.data && name
    ? (formContext.data[name as keyof typeof formContext.data] as string) ?? ""
    : standaloneProp ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isInFormContext && formContext?.onChange && formContext?.data && name) {
      formContext.onChange({ ...formContext.data, [name]: e.target.value });
    } else if (standaloneOnChange) {
      standaloneOnChange(e);
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

  const classes = [
    "bfds-textarea",
    `bfds-textarea--${actualState}`,
    `bfds-textarea--resize-${resize}`,
    className,
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "bfds-textarea-container",
    `bfds-textarea-container--${actualState}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={textAreaId} className="bfds-textarea-label">
          {label}
          {required && <span className="bfds-textarea-required">*</span>}
        </label>
      )}
      <textarea
        {...props}
        id={textAreaId}
        name={name}
        className={classes}
        placeholder={placeholder}
        disabled={disabled || actualState === "disabled"}
        required={required}
        value={value}
        onChange={handleChange}
        aria-describedby={[
          helpText ? helpTextId : null,
          actualErrorMessage ? errorId : null,
          successMessage ? successId : null,
        ].filter(Boolean).join(" ") || undefined}
        aria-invalid={actualState === "error"}
      />
      {helpText && (
        <div id={helpTextId} className="bfds-textarea-help">
          {helpText}
        </div>
      )}
      {actualState === "error" && actualErrorMessage && (
        <div id={errorId} className="bfds-textarea-error" role="alert">
          {actualErrorMessage}
        </div>
      )}
      {actualState === "success" && successMessage && (
        <div id={successId} className="bfds-textarea-success">
          {successMessage}
        </div>
      )}
    </div>
  );
}

BfDsTextArea.Example = function BfDsTextAreaExample() {
  const [value1, setValue1] = React.useState("");
  const [value2, setValue2] = React.useState(
    "This is some existing content in the textarea that demonstrates how it looks with text.",
  );
  const [value3, setValue3] = React.useState(
    "Valid content that passed validation",
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsTextArea Examples</h2>

      <div>
        <h3>Standalone Mode</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsTextArea
            label="Your Message"
            placeholder="Enter your message here..."
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText="This is a standalone textarea field"
            rows={3}
          />
          <BfDsTextArea
            label="Description"
            placeholder="Describe your project..."
            required
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div>
        <h3>TextArea States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsTextArea
            label="Error State"
            placeholder="Enter some content"
            state="error"
            errorMessage="Content is too short"
            rows={3}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Success State"
            placeholder="Valid content"
            state="success"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            successMessage="Content looks great!"
            rows={3}
          />
          <BfDsTextArea
            label="Disabled State"
            placeholder="Cannot edit this"
            state="disabled"
            value="This content cannot be edited"
            rows={3}
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3>Resize Options</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsTextArea
            label="No Resize"
            placeholder="Cannot be resized"
            resize="none"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Horizontal Resize"
            placeholder="Can be resized horizontally"
            resize="horizontal"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Vertical Resize (Default)"
            placeholder="Can be resized vertically"
            resize="vertical"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Both Directions"
            placeholder="Can be resized in both directions"
            resize="both"
            rows={2}
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3>Different Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsTextArea
            label="Small (2 rows)"
            placeholder="Small textarea"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Medium (4 rows)"
            placeholder="Medium textarea"
            rows={4}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Large (6 rows)"
            placeholder="Large textarea"
            rows={6}
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3>Without Label</h3>
        <BfDsTextArea
          placeholder="Just a placeholder with help text"
          helpText="This textarea has no label but includes help text"
          rows={3}
          value=""
          onChange={() => {}}
        />
      </div>
    </div>
  );
};
