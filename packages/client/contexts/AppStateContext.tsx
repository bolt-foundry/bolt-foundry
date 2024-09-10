import * as React from "react";
const { useEffect, useState } = React;

type FeatureFlags = Record<string, boolean>;

type ValueType = {
  showHud: boolean;
  featureFlags: FeatureFlags;
};

const AppStateContext = React.createContext<ValueType>({
  showHud: false,
  featureFlags: {
    placeholder: false,
  },
});

export function useAppState(): ValueType {
  return React.useContext(AppStateContext);
}

export default function AppStateProvider(
  { children }: React.PropsWithChildren,
) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({});
  const getFeatureFlag = (name: string) => featureFlags[name];
  const setFeatureFlag = (name: string) => {
    setFeatureFlags({ ...featureFlags, [name]: !featureFlags[name] });
  };

  let showHud = false;
  useEffect(() => {
    if (false) {
      showHud = true;
    }
  }, []);

  return (
    <AppStateContext.Provider
      value={{ showHud, getFeatureFlag, setFeatureFlag }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
