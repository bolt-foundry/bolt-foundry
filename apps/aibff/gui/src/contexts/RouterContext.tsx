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
  params: Record<string, string>;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  navigate: () => {},
  params: {},
});

export const useRouter = () => useContext(RouterContext);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(() => {
    // In GUI mode, we'll use hash routing for simplicity
    return globalThis.location.hash.slice(1) || "/";
  });
  const [params, setParams] = useState<Record<string, string>>({});

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

  // Extract params whenever currentPath changes
  useEffect(() => {
    let newParams: Record<string, string> = {};

    for (const route of routes) {
      const patternPath = route.path.replace(/:(\w+)/g, ":$1");
      const pattern = new URLPattern({ pathname: patternPath });
      const result = pattern.exec({ pathname: currentPath });

      if (result) {
        // Ensure all values are defined strings
        const groups = result.pathname.groups || {};
        newParams = Object.entries(groups).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {},
        );
        break;
      }
    }

    // Only update if params have changed
    setParams((prevParams) => {
      const hasChanged =
        Object.keys(newParams).length !== Object.keys(prevParams).length ||
        Object.keys(newParams).some((key) =>
          newParams[key] !== prevParams[key]
        );

      return hasChanged ? newParams : prevParams;
    });
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Router() {
  const { currentPath } = useRouter();

  // Find matching route using URLPattern
  let matchedRoute = null;

  for (const route of routes) {
    // Convert :param syntax to URLPattern syntax
    const patternPath = route.path.replace(/:(\w+)/g, ":$1");
    const pattern = new URLPattern({ pathname: patternPath });

    // Test against a dummy URL with our path
    const result = pattern.exec({ pathname: currentPath });

    if (result) {
      matchedRoute = route;
      break;
    }
  }

  if (!matchedRoute) {
    return <div>404 - Page not found</div>;
  }

  const Component = matchedRoute.Component;

  // Render the component without params (it gets them from context)
  return <Component />;
}
