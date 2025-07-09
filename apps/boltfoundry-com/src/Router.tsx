import { createContext, useContext, useEffect, useState } from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export function Router(
  { children, initialPath }: {
    children: React.ReactNode;
    initialPath?: string;
  },
) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (initialPath) {
      logger.debug("Router: Using initialPath:", initialPath);
      return initialPath;
    }
    if (typeof window !== "undefined") {
      logger.debug(
        "Router: Using window.location.pathname:",
        globalThis.location.pathname,
      );
      return globalThis.location.pathname;
    }
    // During SSR, get the current path from the server environment
    // @ts-expect-error - Server-side global variable
    const envPath = globalThis.__ENVIRONMENT__?.currentPath || "/";
    logger.debug("Router: Using environment path:", envPath);
    return envPath;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(globalThis.location.pathname);
    };

    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    globalThis.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

type Route = {
  path: string;
  component: React.ComponentType;
};

type RoutesProps = {
  routes: Array<Route>;
};

export function Routes({ routes }: RoutesProps) {
  const { currentPath } = useRouter();

  logger.debug("Routes: currentPath =", currentPath);
  logger.debug("Routes: available routes =", routes.map((r) => r.path));

  const matchedRoute = routes.find((route) => route.path === currentPath);

  logger.debug("Routes: matched route =", matchedRoute?.path);

  if (matchedRoute) {
    const Component = matchedRoute.component;
    return <Component />;
  }

  return <div>404 - Page not found</div>;
}
