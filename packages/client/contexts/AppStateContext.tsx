import * as React from "react";
const { useState } = React;

type FeatureFlags = Record<string, boolean>;

type ValueType = {
  featureFlags: FeatureFlags;
  setFeatureFlag: (name: string) => void;
  getFeatureFlag: (name: string) => boolean;
};

const AppStateContext = React.createContext<ValueType>({
  featureFlags: {},
  getFeatureFlag: () => false,
  setFeatureFlag: () => void null,
});

export function useAppState(): ValueType {
  return React.useContext(AppStateContext);
}

export default function AppStateProvider(
  { children }: React.PropsWithChildren,
) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    placeholder: false,
  });
  const getFeatureFlag = (name: string) => featureFlags[name];
  const setFeatureFlag = (name: string) => {
    setFeatureFlags({ ...featureFlags, [name]: !featureFlags[name] });
  };

  return (
    <AppStateContext.Provider
      value={{ featureFlags, getFeatureFlag, setFeatureFlag }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
