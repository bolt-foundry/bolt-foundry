import * as React from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

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
    initialData: T;
    className?: string;
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
  // Import components dynamically to avoid circular dependencies
  const BfDsInput = React.lazy(() =>
    import("./BfDsInput.tsx").then((m) => ({ default: m.BfDsInput }))
  );
  const BfDsTextArea = React.lazy(() =>
    import("./BfDsTextArea.tsx").then((m) => ({ default: m.BfDsTextArea }))
  );
  const BfDsFormSubmitButton = React.lazy(() =>
    import("./BfDsFormSubmitButton.tsx").then((m) => ({
      default: m.BfDsFormSubmitButton,
    }))
  );

  type ExampleFormData = {
    name: string;
    email: string;
    message: string;
  };

  const exampleInitialFormData: ExampleFormData = {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello world!",
  };

  function exampleOnSubmit(value: ExampleFormData) {
    logger.info("Form submitted:", value);
    alert(`Form submitted with: ${JSON.stringify(value, null, 2)}`);
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
        <React.Suspense fallback={<div>Loading form components...</div>}>
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
                helpText="This input gets its value from form context"
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
                helpText="This textarea also uses form context"
              />
              <BfDsFormSubmitButton text="Submit Form" />
            </div>
          </BfDsForm>
        </React.Suspense>
      </div>

      <div>
        <h3>Form Context Benefits</h3>
        <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
          <li>Components automatically sync with form state</li>
          <li>No need to pass value/onChange to each field</li>
          <li>Form-level validation and error handling</li>
          <li>Centralized form submission logic</li>
        </ul>
      </div>
    </div>
  );
};
