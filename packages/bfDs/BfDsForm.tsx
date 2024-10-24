import * as React from "react";
import { getLogger } from "packages/logger/logger.ts";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import type { BfDsToggle } from "packages/bfDs/BfDsToggle.tsx";
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

type BfDsFormValue<T = Record<string, string | number | boolean | null>> = {
  errors: BfDsFormErrorRecord<T>;
  data: T;
} & BfDsFormCallbacks<T>;

const BfDsFormContext = createContext<BfDsFormValue<unknown>>({});

type BfDsFormProps<T = Record<string, string | number | boolean | null>> =
  & React.PropsWithChildren<BfDsFormValue<T> & BfDsFormCallbacks<T>>
  & {
    initialData: T;
  };

export function BfDsForm<T>(
  { initialData, children, ...bfDsFormCallbacks }: BfDsFormProps<T>,
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<BfDsFormErrorRecord<T>>({});

  function onChange(value: T) {
    setData(value);
    bfDsFormCallbacks.onChange?.(value);
  }

  function onError(errors: BfDsFormErrorRecord<T>) {
    setErrors(errors);
    bfDsFormCallbacks.onError?.(errors);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    logger.info("hi", bfDsFormCallbacks);
    e.preventDefault();
    bfDsFormCallbacks.onSubmit?.(data);
  }

  return (
    <BfDsFormContext.Provider
      value={{ data, errors, onChange, onError, onSubmit }}
    >
      <form onSubmit={onSubmit}>{children}</form>
    </BfDsFormContext.Provider>
  );
}

function useBfDsFormContext<T>() {
  const context = useContext<T>(BfDsFormContext);
  if (!context) {
    throw new Error("useBfDsForm must be used within a BfDsFormProvider");
  }
  return context;
}

type BfDsFormElementProps<
  TAdditionalFormElementProps = Record<string, unknown>,
> = TAdditionalFormElementProps & {
  id: string;
  title: string;
};

export function BfDsFormTextInput({ id, title }: BfDsFormElementProps) {
  const { data, onChange } = useBfDsFormContext();
  return (
    <BfDsInput
      label={title}
      type="text"
      name={id}
      value={data[id]}
      onChange={(e) => onChange({ ...data, [id]: e.target.value })}
    />
  );
}

export function BfDsFormNumberInput(
  { id, title }: { id: string; title: string },
) {
  const { data, onChange } = useBfDsFormContext();
  return (
    <BfDsInput
      label={title}
      type="number"
      name={id}
      value={data[id]}
      onChange={(e) => onChange({ ...data, [id]: e.target.value })}
    />
  );
}

// function BfDsFormToggle(
//   { id, title }: { id: string; title: string },
// ) {
//   const { data, onChange } = useBfDsFormContext();
//   return (
//     <BfDsToggle
//       label={title}
//       name={id}
//       checked={data[id]}
//       onChange={(e) => onChange({ ...data, [id]: e.target.checked })}
//     />
//   );
// }

export function BfDsFormSubmitButton(
  { text, showSpinner }: { text: string; showSpinner: boolean },
) {
  logger.info("loggering");
  return <BfDsButton type="submit" text={text} showSpinner={showSpinner} />;
}

/**
 * Example usage of BfDsForm and subsequent fields
 */
type ExampleFormData = {
  name: string;
  email: string;
  number: number;
  checkbox: boolean;
};

const exampleInitialFormData: ExampleFormData = {
  name: "Randall",
  email: "rdlnk@example.com",
  number: 42,
  checkbox: true,
};

function exampleOnSubmit(value: BfDsFormValue<ExampleFormData>) {
  logger.info(value);
}

export function Example() {
  return (
    <BfDsForm onSubmit={exampleOnSubmit} initialData={exampleInitialFormData}>
      <BfDsFormTextInput id="name" title="What is your name?" />
      <BfDsFormTextInput id="email" title="What is your email?" />
      <BfDsFormNumberInput id="number" title="What is your favorite number?" />
      {/* <BfDsFormToggle id="checkbox" title="Do you like cheese?" /> */}
      {/* <BfDsSubmitButton text="Submit" /> */}
    </BfDsForm>
  );
}
