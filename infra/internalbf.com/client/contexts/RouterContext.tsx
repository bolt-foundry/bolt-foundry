import { getLogger, React } from "deps.ts";
import { useAppEnvironment } from "infra/internalbf.com/client/contexts/AppEnvironmentContext.tsx";
import { routes } from "infra/internalbf.com/client/components/App.tsx";
const logger = getLogger(import.meta);

const { createContext, useContext, useState, useCallback } = React;
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

export function matchRouteWithParams(path = "", pathTemplate?: string) {
  const defaultParams = { match: false, params: {} };
  const pathsToMatch = pathTemplate ? [pathTemplate] : Array(...dynamicRoutes);
  logger.info(
    `matchRouteWithParams: path: ${path}, pathsToMatch: ${pathsToMatch}`,
  );
  const match = pathsToMatch.map((pathTemplate) => {
    logger.debug(`matchRouteWithParams: pathTemplate: ${pathTemplate}`);
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

    logger.debug("params before", params);
    // check if the path matches the template
    for (let i = 0; i < pathTemplateParts.length; i++) {
      // Skip if part is a parameter
      if (pathTemplateParts[i].startsWith(":")) {
        logger.debug(
          "debug",
          "part is a parameter",
          pathTemplateParts[i],
          currentPathParts[i] ?? "undefined",
        );
      } else if (pathTemplateParts[i] !== currentPathParts[i]) {
        logger.debug(
          "part is not a parameter",
          pathTemplateParts[i],
          currentPathParts[i],
        );
        return defaultParams;
      }
    }

    return { match: true, params };
  }).find((route) => route.match === true);
  logger.info("match", match);
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
  const initialState = {
    currentPath: initialPath,
    routeParams,
    queryParams,
  };

  const [state, setState] = useState(initialState);

  const updateState = useCallback((path: string, search: string) => {
    const nextMatch = matchRouteWithParams(path);
    const nextQueryParams = Object.fromEntries(new URLSearchParams(search));
    setState({
      currentPath: path,
      routeParams: nextMatch.params,
      queryParams: nextQueryParams,
    });
  }, [setState]);

  React.useEffect(() => {
    const handlePopState = () => {
      updateState(globalThis.location.pathname, globalThis.location.search);
    };
    globalThis.addEventListener("popstate", handlePopState);
    return () => {
      globalThis.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (path: string, search = "") => {
    globalThis.history.pushState(null, "", path);
    updateState(path, search);
  };

  // add all routes to the router context
  addAllRoutes();

  return (
    <RouterContext.Provider
      value={{
        ...state,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
