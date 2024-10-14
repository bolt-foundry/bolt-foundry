import * as React from "react";
import { useLocalStorage } from "packages/client/hooks/useLocalStorage.ts";

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
  const [featureFlags, setFeatureFlags] = useLocalStorage<FeatureFlags>(
    "featureFlags",
    {
      placeholder: false,
    },
  );
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
