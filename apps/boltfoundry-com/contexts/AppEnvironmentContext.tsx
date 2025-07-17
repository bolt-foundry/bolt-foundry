import type React, { createContext, useContext } from "react";
import {
  type IsographEnvironment,
  IsographEnvironmentProvider,
} from "@isograph/react";
import { RouterProvider } from "@bfmono/apps/boltfoundry-com/contexts/RouterContext.tsx";
import { getEnvironment } from "@bfmono/apps/boltfoundry-com/isographEnvironment.ts";

export interface AppEnvironmentProps {
  initialPath: string;
  queryParams: Record<string, string>;
  routeParams: Record<string, string>;
  path: string;
}

export interface RouterProviderProps {
  // Add any router-specific props here if needed
}

export interface ServerProps extends AppEnvironmentProps, RouterProviderProps {
  IS_SERVER_RENDERING: boolean;
  isographServerEnvironment: IsographEnvironment;
}

const AppEnvironmentContext = createContext<AppEnvironmentProps | undefined>(
  undefined,
);

export function useAppEnvironment(): AppEnvironmentProps {
  const context = useContext(AppEnvironmentContext);
  if (!context) {
    throw new Error(
      "useAppEnvironment must be used within an AppEnvironmentProvider",
    );
  }
  return context;
}

export function AppEnvironmentProvider({
  children,
  isographServerEnvironment,
  IS_SERVER_RENDERING,
  ...appEnvironmentProps
}: ServerProps & { children: React.ReactNode }) {
  // Don't try to use serialized isograph environment from server
  // Always create a fresh client-side environment to ensure consistency
  const isographEnvironment = IS_SERVER_RENDERING
    ? isographServerEnvironment
    : getEnvironment();

  return (
    <AppEnvironmentContext.Provider value={appEnvironmentProps}>
      <IsographEnvironmentProvider environment={isographEnvironment}>
        <RouterProvider
          initialPath={appEnvironmentProps.initialPath}
          queryParams={appEnvironmentProps.queryParams}
          routeParams={appEnvironmentProps.routeParams}
        >
          {children}
        </RouterProvider>
      </IsographEnvironmentProvider>
    </AppEnvironmentContext.Provider>
  );
}
