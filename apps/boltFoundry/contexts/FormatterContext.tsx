
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types for our context
export type ModelProps = {
  provider: "openai" | "anthropic";
  model: string | null;
  key: string | null;
};

export type FormatterContextType = {
  iterations: number;
  setIterations: (iterations: number) => void;
  model: ModelProps;
  setModel: (model: ModelProps) => void;
  validationType: string;
  setValidationType: (validationType: string) => void;
  variableValues: Record<string, string>;
  setVariableValue: (name: string, value: string) => void;
  compareBolt: string | null;
  setCompareBolt: (boltId: string | null) => void;
};

// Default values
const defaultModel: ModelProps = {
  provider: "openai",
  model: "gpt-4",
  key: null,
};

// Create the context
const FormatterContext = createContext<FormatterContextType>({
  iterations: 1,
  setIterations: () => {},
  model: defaultModel,
  setModel: () => {},
  validationType: "concise",
  setValidationType: () => {},
  variableValues: {},
  setVariableValue: () => {},
  compareBolt: null,
  setCompareBolt: () => {},
});

// Provider component
export const FormatterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [iterations, setIterations] = useState<number>(1);
  const [model, setModel] = useState<ModelProps>(defaultModel);
  const [validationType, setValidationType] = useState<string>("concise");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [compareBolt, setCompareBolt] = useState<string | null>(null);

  const setVariableValue = (name: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormatterContext.Provider
      value={{
        iterations,
        setIterations,
        model,
        setModel,
        validationType,
        setValidationType,
        variableValues,
        setVariableValue,
        compareBolt,
        setCompareBolt,
      }}
    >
      {children}
    </FormatterContext.Provider>
  );
};

// Hook to use the context
export const useFormatter = () => useContext(FormatterContext);
