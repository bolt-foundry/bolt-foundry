import {
  RouterProvider,
  type RouterProviderProps,
} from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

import * as React from "react";
import {
  type IsographEnvironment,
  IsographEnvironmentProvider,
} from "@isograph/react";
import { getEnvironment } from "@bfmono/apps/boltFoundry/isographEnvironment.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type {
  ClientEnvironment,
} from "@bfmono/apps/boltFoundry/__generated__/configKeys.ts";

const logger = getLogger(import.meta);

const AppEnvironmentContext = React.createContext<AppEnvironmentProps>({});

export type AppEnvironmentProps = ClientEnvironment & {
  personBfGid?: string;
  featureFlags?: Record<string, string | boolean>;
};

export type ServerProps =
  & AppEnvironmentProps
  & RouterProviderProps
  & {
    IS_SERVER_RENDERING: boolean;
    isographServerEnvironment: IsographEnvironment;
  };

export function useAppEnvironment() {
  return React.useContext<AppEnvironmentProps>(AppEnvironmentContext);
}

export function AppEnvironmentProvider(
  {
    children,
    routeParams,
    queryParams,
    initialPath,
    isographServerEnvironment,
    ...appEnvironment
  }: React.PropsWithChildren<ServerProps>,
) {
  const isographEnvironment = isographServerEnvironment ?? getEnvironment();

  logger.debug("AppEnvironmentProvider: props", routeParams, queryParams);
  logger.debug(
    isographEnvironment,
    isographServerEnvironment,
    IsographEnvironmentProvider,
  );

  return (
    <AppEnvironmentContext.Provider value={appEnvironment}>
      <IsographEnvironmentProvider environment={isographEnvironment}>
        <RouterProvider
          routeParams={routeParams}
          queryParams={queryParams}
          initialPath={initialPath}
        >
          {children}
        </RouterProvider>
      </IsographEnvironmentProvider>
    </AppEnvironmentContext.Provider>
  );
}
