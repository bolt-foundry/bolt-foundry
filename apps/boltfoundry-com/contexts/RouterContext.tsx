import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type MatchedRoute = {
  match: boolean;
  params: Record<string, string>;
  queryParams: Record<string, string>;
};

export function matchRouteWithParams(
  pathRaw = "",
  pathTemplate?: string,
): MatchedRoute {
  const [rawPath, search] = pathRaw.split("?");
  const searchParams = new URLSearchParams(search || "");
  const queryParams = Object.fromEntries(searchParams.entries());

  if (!pathTemplate) {
    return {
      match: false,
      params: {},
      queryParams,
    };
  }

  // Simple exact match for now
  const match = rawPath === pathTemplate;

  return {
    match,
    params: {},
    queryParams,
  };
}

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
  routeParams: Record<string, string>;
  queryParams: Record<string, string>;
};

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath?: string;
}) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === "undefined") {
      return initialPath || "/";
    }
    // During hydration, use initialPath to match server
    return initialPath || globalThis.location.pathname;
  });

  const [routeParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== "undefined") {
      globalThis.history.pushState({}, "", path);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(globalThis.location.pathname);
      const searchParams = new URLSearchParams(globalThis.location.search);
      setQueryParams(Object.fromEntries(searchParams.entries()));
    };

    if (typeof window !== "undefined") {
      globalThis.addEventListener("popstate", handlePopState);
      return () => globalThis.removeEventListener("popstate", handlePopState);
    }
  }, []);

  const contextValue: RouterContextType = {
    currentPath,
    navigate,
    routeParams,
    queryParams,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}
