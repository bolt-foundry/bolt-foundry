import * as React from "react";
import { getLogger } from "deps.ts";

const { useState, createContext, useContext } = React;

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

function BfDsForm<T>(
  { initialData, bfDsFormCallbacks = {}, children }: BfDsFormProps<T>,
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

function BfDsTextInput({ id, title }: BfDsFormElementProps) {
  const { data, onChange } = useBfDsFormContext();
  return (
    <div>
      <label htmlFor={id}>{title}</label>
      <input
        type="text"
        id={id}
        name={id}
        value={data[id]}
        onChange={(e) => onChange({ ...data, [id]: e.target.value })}
      />
    </div>
  );
}

function BfDsNumberInput({ id, title }: { id: string; title: string }) {
  const { data, onChange } = useBfDsFormContext();
  return (
    <div>
      <label htmlFor={id}>{title}</label>
      <input
        type="number"
        id={id}
        name={id}
        value={data[id]}
        onChange={(e) => onChange({ ...data, [id]: e.target.value })}
      />
    </div>
  );
}

function BfDsCheckboxInput({ id, title }: { id: string; title: string }) {
  const { data, onChange } = useBfDsFormContext();
  return (
    <div>
      <label htmlFor={id}>{title}</label>
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={data[id]}
        onChange={(e) => onChange({ ...data, [id]: e.target.checked })}
      />
    </div>
  );
}

function BfDsSubmitButton({ text }: { text: string }) {
  return <button type="submit">{text}</button>;
}

const logger = getLogger(import.meta);

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
      <BfDsTextInput id="name" title="What is your name?" />
      <BfDsTextInput id="email" title="What is your email?" />
      <BfDsNumberInput id="number" title="What is your favorite number?" />
      <BfDsCheckboxInput id="checkbox" title="Do you like cheese?" />
      <BfDsSubmitButton text="Submit" />
    </BfDsForm>
  );
}
