import * as React from "react";
import { CfDsFormNumberInput } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormNumberInput.tsx";
import { CfDsFormTextInput } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormTextInput.tsx";
import { CfDsFormSubmitButton } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormSubmitButton.tsx";
import { CfDsFormToggle } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormToggle.tsx";
import { CfDsFormTextArea } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormTextArea.tsx";
const { useState, createContext, useContext } = React;

import { getLogger } from "@bfmono/packages/logger/logger.ts";
const logger = getLogger(import.meta);

type FormError = {
  message: string;
  field: string;
  type: "error" | "warn" | "info";
};

type CfDsFormErrorRecord<T> = {
  [key in keyof T]: FormError;
};

type CfDsFormCallbacks<T> = {
  onSubmit?: (value: T) => void;
  onChange?: (value: T) => void;
  onError?: (errors: CfDsFormErrorRecord<T>) => void;
};

export type CfDsFormValue<T = Record<string, string | number>> = {
  errors?: CfDsFormErrorRecord<T>;
  data?: T;
} & CfDsFormCallbacks<T>;

// deno-lint-ignore no-explicit-any
const CfDsFormContext = createContext<CfDsFormValue<any>>({});

type CfDsFormProps<T = Record<string, string | number | boolean | null>> =
  & React.PropsWithChildren<CfDsFormCallbacks<T>>
  & {
    initialData: T;
    xstyle?: React.CSSProperties;
    testId?: string;
  };

export function CfDsForm<T>(
  { initialData, xstyle, children, testId, ...bfDsFormCallbacks }:
    CfDsFormProps<T>,
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<CfDsFormErrorRecord<T>>(
    {} as CfDsFormErrorRecord<T>,
  );

  function onChange(value: T) {
    setData(value);
    bfDsFormCallbacks.onChange?.(value);
  }

  function onError(errors: CfDsFormErrorRecord<T>) {
    setErrors(errors);
    bfDsFormCallbacks.onError?.(errors);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    logger.debug("form callbacks", bfDsFormCallbacks);
    e.preventDefault();
    bfDsFormCallbacks.onSubmit?.(data);
  }

  return (
    <CfDsFormContext.Provider
      value={{ data, errors, onChange, onError, onSubmit }}
    >
      <form data-testid={testId} onSubmit={onSubmit} style={xstyle}>
        {children}
      </form>
    </CfDsFormContext.Provider>
  );
}

export function useCfDsFormContext<T>() {
  const context = useContext(CfDsFormContext) as CfDsFormValue<T>;
  if (!context) {
    throw new Error("useCfDsForm must be used within a CfDsFormProvider");
  }
  return context;
}

export type CfDsFormElementProps<
  TAdditionalFormElementProps = Record<string, unknown>,
> = TAdditionalFormElementProps & {
  id: string;
  title?: string;
};

/**
 * Example usage of CfDsForm and subsequent fields
 */
type ExampleFormData = {
  name: string;
  email: string;
  number: number;
  checkbox: boolean;
  bio: string;
};

const exampleInitialFormData = {
  name: "Randall",
  email: "rdlnk@example.com",
  number: 42,
  checkbox: true,
  bio: "I am a random person",
};

function exampleOnSubmit(value: ExampleFormData) {
  logger.info(value);
}

export function Example() {
  return (
    <CfDsForm<ExampleFormData>
      onSubmit={exampleOnSubmit}
      initialData={exampleInitialFormData}
    >
      <CfDsFormTextInput id="name" title="What is your name?" />
      <CfDsFormTextInput id="email" title="What is your email?" />
      <CfDsFormNumberInput id="number" title="What is your favorite number?" />
      <CfDsFormToggle id="checkbox" title="Do you like cheese?" />
      <CfDsFormTextArea id="bio" rows={2} title="Tell us about yourself" />
      <CfDsFormSubmitButton text="Submit" />
    </CfDsForm>
  );
}
