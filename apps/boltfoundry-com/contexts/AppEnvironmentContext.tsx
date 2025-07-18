import * as React from "react";
import {
  type IsographEnvironment,
  IsographEnvironmentProvider,
} from "@isograph/react";
import {
  RouterProvider,
} from "../contexts/RouterContext.tsx";
import { getEnvironment, getRealEnvironment } from "../isographEnvironment.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export type AppEnvironmentProps = {
  // Add any app-specific environment props here
};

export type ServerProps = 
  & AppEnvironmentProps
  & {
    initialPath?: string;
    IS_SERVER_RENDERING?: boolean;
    isographServerEnvironment?: IsographEnvironment;
  };

const AppEnvironmentContext = React.createContext<AppEnvironmentProps>({});

export function useAppEnvironment() {
  return React.useContext<AppEnvironmentProps>(AppEnvironmentContext);
}

export function AppEnvironmentProvider({
  children,
  initialPath,
  isographServerEnvironment,
  ...appEnvironment
}: React.PropsWithChildren<ServerProps>) {
  // Use real environment in production, mock in development
  const isProduction = typeof window !== "undefined" && 
    // @ts-expect-error - accessing global environment
    globalThis.__ENVIRONMENT__?.mode === "production";
  
  const isographEnvironment = isographServerEnvironment ?? 
    (isProduction ? getRealEnvironment() : getEnvironment());

  logger.debug("AppEnvironmentProvider: props", initialPath);
  logger.debug("isographEnvironment", isographEnvironment);

  return (
    <AppEnvironmentContext.Provider value={appEnvironment}>
      <IsographEnvironmentProvider environment={isographEnvironment}>
        <RouterProvider initialPath={initialPath}>
          {children}
        </RouterProvider>
      </IsographEnvironmentProvider>
    </AppEnvironmentContext.Provider>
  );
}