import { createContext, useContext, useEffect, useState } from "react";

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export function Router({ children, initialPath }: { children: React.ReactNode; initialPath?: string }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (initialPath) {
      console.log("Router: Using initialPath:", initialPath);
      return initialPath;
    }
    if (typeof window !== "undefined") {
      console.log("Router: Using window.location.pathname:", window.location.pathname);
      return window.location.pathname;
    }
    // During SSR, get the current path from the server environment
    // @ts-expect-error - Server-side global variable
    const envPath = globalThis.__ENVIRONMENT__?.currentPath || "/";
    console.log("Router: Using environment path:", envPath);
    return envPath;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
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
  
  console.log("Routes: currentPath =", currentPath);
  console.log("Routes: available routes =", routes.map(r => r.path));
  
  const matchedRoute = routes.find(route => route.path === currentPath);
  
  console.log("Routes: matched route =", matchedRoute?.path);
  
  if (matchedRoute) {
    const Component = matchedRoute.component;
    return <Component />;
  }
  
  return <div>404 - Page not found</div>;
}