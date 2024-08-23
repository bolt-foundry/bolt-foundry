/*
 * @deprecated
 * We should push all of this into local relay stores asap.
 */

import { React } from "deps.ts";
import { useLocalStorage } from "packages/client/hooks/useLocalStorage.ts";

const { useEffect, useState } = React;

type ValueType = {
  settingsOpen: boolean;
  setSettingsOpen: (settingsOpen: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (loginOpen: boolean) => void;
};

const AppStateContext = React.createContext<ValueType>({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen: boolean) => {},
  loginOpen: false,
  setLoginOpen: (loginOpen: boolean) => {},
});

export function useAppState(): ValueType {
  return React.useContext(AppStateContext);
}

export default function AppStateProvider(
  { children }: React.PropsWithChildren,
) {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  return (
    <AppStateContext.Provider
      value={{
        settingsOpen,
        setSettingsOpen,
        loginOpen,
        setLoginOpen,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
