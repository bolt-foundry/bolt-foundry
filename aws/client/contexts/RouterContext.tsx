// RouterContext.tsx
import { React } from "aws/client/deps.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { createLogger } from "aws/logs/mod.ts";
import { routes } from "aws/client/components/App.tsx";
const log = createLogger("RouterContext.tsx", "debug");

const { createContext, useContext, useState } = React;
export const registeredRoutes = new Set<string>();
export const dynamicRoutes = new Set<string>();

/**
 * @example
 * addRoute("/projects/:projectId?");
 * addRoute("/projects");
 * addRoute("/")
 * addRoute("/signup/:plan?")
 */
function addRoute(path: string) {
  let routePath = path;
  if (routePath.includes(":")) {
    dynamicRoutes.add(path);
    routePath = routePath.split(":")[0];
  }
  if (routePath.endsWith("/")) {
    routePath = routePath.slice(0, -1);
  }
  registeredRoutes.add(routePath);
}

export function addAllRoutes() {
  routes.forEach((_value, key) => {
    addRoute(key);
  });
}

export function matchRouteWithParams(path: string, pathTemplate?: string) {
  // log("matching route", path);
  // log("registered routes", dynamicRoutes);
  const defaultParams = { match: false, params: {} };
  const pathsToMatch = pathTemplate ? [pathTemplate] : Array(...dynamicRoutes);
  const match = pathsToMatch.map((pathTemplate) => {
    const pathTemplateParts = pathTemplate.split("/");
    const currentPathParts = path.split("/");

    // find any templated fields
    const params = pathTemplateParts.reduce((acc, part, i) => {
      if (part.startsWith(":")) {
        const paramName = part.endsWith("?")
          ? part.slice(1, -1)
          : part.slice(1);
        acc[paramName] = currentPathParts[i] || null;
      }
      return acc;
    }, {} as Record<string, string | null>);

    log("params before", params);
    // check if the path matches the template
    for (let i = 0; i < pathTemplateParts.length; i++) {
      // Skip if part is a parameter
      if (pathTemplateParts[i].startsWith(":")) {
        log(
          "debug",
          "part is a parameter",
          pathTemplateParts[i],
          currentPathParts[i] ?? "undefined",
        );
      } else if (pathTemplateParts[i] !== currentPathParts[i]) {
        log(
          "debug",
          "parts do not match",
          pathTemplateParts[i],
          currentPathParts[i],
        );
        return defaultParams;
      }
    }

    return { match: true, params };
  }).find((route) => route.match === true);
  log("match", match);
  return match ?? defaultParams;
}
type RouterContextType = {
  currentPath: string;
  routeParams: Record<string, string | null>;
  queryParams: Record<string, string | null>;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  routeParams: {},
  queryParams: {},
  navigate: () => {},
});

export const useRouter = () => {
  return useContext(RouterContext);
};

export type RouterProviderProps = {
  routeParams: Record<string, string | null>;
  queryParams: Record<string, string | null>;
};

export function RouterProvider(
  { routeParams, queryParams, children }: React.PropsWithChildren<
    RouterProviderProps
  >,
) {
  const { initialPath } = useAppEnvironment();
  const [currentRouteParams, setRouteParams] = useState(routeParams ?? {});
  const [currentQueryParams, setQueryParams] = useState(queryParams ?? {});
  const [currentPath, setCurrentPath] = useState(initialPath);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(globalThis.location.pathname);
    };
    globalThis.addEventListener("popstate", handlePopState);
    return () => {
      globalThis.removeEventListener("popstate", handlePopState);
    };
  }, []);

  React.useEffect(() => {
    const nextMatch = matchRouteWithParams(currentPath);
    setRouteParams(nextMatch.params);
    setQueryParams(Object.fromEntries(new URLSearchParams(location.search)));
  }, [currentPath]);

  const navigate = (path: string) => {
    globalThis.history.pushState(null, "", path);
    // @ts-expect-error #techdebt
    if (globalThis.Intercom) {
      // @ts-expect-error #techdebt
      globalThis.Intercom("update");
    }
    setCurrentPath(path);
  };

  // add all routes to the router context
  addAllRoutes();

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        routeParams: currentRouteParams,
        queryParams: currentQueryParams,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
