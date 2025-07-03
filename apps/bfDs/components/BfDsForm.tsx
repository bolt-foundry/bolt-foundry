import * as React from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsCallout } from "./BfDsCallout.tsx";
import { BfDsInput } from "./BfDsInput.tsx";
import { BfDsTextArea } from "./BfDsTextArea.tsx";
import { BfDsSelect } from "./BfDsSelect.tsx";
import { BfDsCheckbox } from "./BfDsCheckbox.tsx";
import { BfDsRadio } from "./BfDsRadio.tsx";
import { BfDsToggle } from "./BfDsToggle.tsx";
import { BfDsFormSubmitButton } from "./BfDsFormSubmitButton.tsx";

const { useState, createContext, useContext } = React;
const logger = getLogger(import.meta);

type FormError = {
  message: string;
  field: string;
  type: "error" | "warn" | "info";
};

type BfDsFormErrorRecord<T> = {
  [key in keyof T]: FormError;
};

type BfDsFormCallbacks<T> = {
  onSubmit?: (value: T) => void;
  onChange?: (value: T) => void;
  onError?: (errors: BfDsFormErrorRecord<T>) => void;
};

export type BfDsFormValue<T = Record<string, string | number | boolean>> = {
  errors?: BfDsFormErrorRecord<T>;
  data?: T;
} & BfDsFormCallbacks<T>;

const BfDsFormContext = createContext<BfDsFormValue<unknown> | null>(null);

type BfDsFormProps<T = Record<string, string | number | boolean | null>> =
  & React.PropsWithChildren<BfDsFormCallbacks<T>>
  & {
    /** Initial form data values */
    initialData: T;
    /** Additional CSS classes */
    className?: string;
    /** Test ID for testing purposes */
    testId?: string;
  };

export function BfDsForm<T>({
  initialData,
  className,
  children,
  testId,
  ...bfDsFormCallbacks
}: BfDsFormProps<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<BfDsFormErrorRecord<T>>(
    {} as BfDsFormErrorRecord<T>,
  );

  function onChange(value: T) {
    setData(value);
    bfDsFormCallbacks.onChange?.(value);
  }

  function onError(errors: BfDsFormErrorRecord<T>) {
    setErrors(errors);
    bfDsFormCallbacks.onError?.(errors);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    logger.debug("form callbacks", bfDsFormCallbacks);
    e.preventDefault();
    bfDsFormCallbacks.onSubmit?.(data);
  }

  const formClasses = [
    "bfds-form",
    className,
  ].filter(Boolean).join(" ");

  return (
    <BfDsFormContext.Provider
      value={{ data, errors, onChange, onError, onSubmit } as BfDsFormValue<
        unknown
      >}
    >
      <form
        data-testid={testId}
        onSubmit={onSubmit}
        className={formClasses}
      >
        {children}
      </form>
    </BfDsFormContext.Provider>
  );
}

export function useBfDsFormContext<T>() {
  return useContext(BfDsFormContext) as BfDsFormValue<T> | null;
}

export type BfDsFormElementProps<
  TAdditionalFormElementProps = Record<string, unknown>,
> = TAdditionalFormElementProps & {
  name: string;
  label?: string;
};

BfDsForm.Example = function BfDsFormExample() {
  type ExampleFormData = {
    name: string;
    email: string;
    message: string;
    country: string;
    newsletter: boolean;
    contactMethod: string;
    notifications: boolean;
  };

  const exampleInitialFormData: ExampleFormData = {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello world!",
    country: "us",
    newsletter: false,
    contactMethod: "email",
    notifications: true,
  };

  const [notification, setNotification] = useState({
    message: "",
    details: "",
    visible: false,
  });

  function exampleOnSubmit(value: ExampleFormData) {
    logger.info("Form submitted:", value);
    setNotification({
      message: "Form submitted successfully!",
      details: JSON.stringify(value, null, 2),
      visible: true,
    });
  }

  function exampleOnChange(value: ExampleFormData) {
    logger.debug("Form changed:", value);
  }

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
      <h2>BfDsForm Examples</h2>

      <div>
        <h3>Complete Form with Context Integration</h3>
        <p style={{ margin: "0 0 16px 0", color: "var(--bfds-text-muted)" }}>
          All form fields automatically sync with centralized form state without
          individual value/onChange props.
        </p>
        <BfDsForm<ExampleFormData>
          onSubmit={exampleOnSubmit}
          onChange={exampleOnChange}
          initialData={exampleInitialFormData}
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
            <BfDsInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              required
            />
            <BfDsTextArea
              name="message"
              label="Message"
              placeholder="Enter your message..."
              rows={4}
            />
            <BfDsSelect
              name="country"
              label="Country"
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "uk", label: "United Kingdom" },
                { value: "au", label: "Australia" },
              ]}
            />
            <BfDsCheckbox
              name="newsletter"
              label="Subscribe to newsletter"
            />
            <BfDsRadio
              name="contactMethod"
              label="Preferred Contact Method"
              options={[
                { value: "email", label: "Email" },
                { value: "phone", label: "Phone" },
                { value: "text", label: "Text Message" },
              ]}
            />
            <BfDsToggle
              name="notifications"
              label="Push notifications"
            />
            <BfDsFormSubmitButton text="Submit Complete Form" />
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

      <div>
        <h3>Form Context Benefits</h3>
        <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
          <li>Components automatically sync with form state</li>
          <li>No need to pass value/onChange to each field</li>
          <li>Form-level validation and error handling</li>
          <li>Centralized form submission logic</li>
          <li>
            Support for all input types: text, select, checkbox, radio, toggle
          </li>
          <li>TypeScript-safe form data with proper type inference</li>
        </ul>
      </div>
    </div>
  );
};
