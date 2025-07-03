import * as React from "react";
import { BfDsButton, type BfDsButtonProps } from "./BfDsButton.tsx";
import { BfDsCallout } from "./BfDsCallout.tsx";
import { BfDsForm } from "./BfDsForm.tsx";
import { BfDsInput } from "./BfDsInput.tsx";

export type BfDsFormSubmitButtonProps =
  & Omit<BfDsButtonProps, "type" | "onClick">
  & {
    /** Button text (defaults to "Submit") */
    text?: string;
    /** Optional click handler called before form submission */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };

export function BfDsFormSubmitButton({
  text = "Submit",
  onClick,
  children,
  ...props
}: BfDsFormSubmitButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call custom onClick first if provided
    onClick?.(e);

    // Let the form handle submission if we're in form context
    // The form's onSubmit will be called automatically by the form element
  };

  return (
    <BfDsButton
      {...props}
      type="submit"
      onClick={handleClick}
    >
      {children || text}
    </BfDsButton>
  );
}

BfDsFormSubmitButton.Example = function BfDsFormSubmitButtonExample() {
  const [formData, setFormData] = React.useState({ name: "" });
  const [notification, setNotification] = React.useState({
    message: "",
    details: "",
    visible: false,
  });

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
      <h2>BfDsFormSubmitButton Examples</h2>

      <div>
        <h3>Form Integration</h3>
        <p style={{ margin: "0 0 16px 0", color: "var(--bfds-text-muted)" }}>
          Submit button automatically integrates with form context for
          submission handling.
        </p>
        <BfDsForm
          initialData={formData}
          onSubmit={(data) => {
            setNotification({
              message: "Form submitted successfully!",
              details: JSON.stringify(data, null, 2),
              visible: true,
            });
            setFormData(data as typeof formData);
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <BfDsInput
              name="name"
              label="Your Name"
              placeholder="Enter your name"
              required
            />
            <BfDsFormSubmitButton text="Submit Form" />
          </div>
        </BfDsForm>
        <BfDsCallout
          message={notification.message}
          variant="success"
          details={notification.details}
          visible={notification.visible}
          onDismiss={() =>
            setNotification({ message: "", details: "", visible: false })}
          autoDismiss={5000}
        />
      </div>
    </div>
  );
};
