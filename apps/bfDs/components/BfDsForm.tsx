import * as React from "react";

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
