import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { routes } from "../routes.tsx";

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(() => {
    // In GUI mode, we'll use hash routing for simplicity
    return globalThis.location.hash.slice(1) || "/";
  });

  const navigate = useCallback((path: string) => {
    globalThis.location.hash = path;
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(globalThis.location.hash.slice(1) || "/");
    };

    globalThis.addEventListener("hashchange", handleHashChange);
    return () => globalThis.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Router() {
  const { currentPath } = useRouter();

  const route = routes.find((r) => r.path === currentPath);
  const Component = route?.Component;

  if (!Component) {
    return <div>404 - Page not found</div>;
  }

  return <Component />;
}
