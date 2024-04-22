/*
 * @deprecated
 * We should push all of this into local relay stores asap.
 */

import { React } from "deps.ts";
import { useLocalStorage } from "packages/client/hooks/useLocalStorage.tsx";

const { useEffect, useState } = React;

type ValueType = {
  settingsOpen: boolean;
  setSettingsOpen: (settingsOpen: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (loginOpen: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const AppStateContext = React.createContext<ValueType>({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen: boolean) => {},
  loginOpen: false,
  setLoginOpen: (loginOpen: boolean) => {},
  darkMode: false,
  setDarkMode: (darkMode: boolean) => {},
});

export function useAppState(): ValueType {
  return React.useContext(AppStateContext);
}

export default function AppStateProvider(
  { children }: React.PropsWithChildren,
) {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  useEffect(() => {
    // TODO add setting to follow system theme
    // const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  return (
    <AppStateContext.Provider
      value={{
        settingsOpen,
        setSettingsOpen,
        loginOpen,
        setLoginOpen,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
