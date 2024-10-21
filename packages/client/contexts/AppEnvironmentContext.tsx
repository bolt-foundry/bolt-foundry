import { getLogger } from "packages/logger/logger.ts";
// import { identifyPerson } from "packages/events/mod.ts";
// import { Path } from "lib/types/Path.ts";

import {
  RouterProvider,
  type RouterProviderProps,
} from "packages/client/contexts/RouterContext.tsx";
import clientEnvironment from "packages/client/relay/relayEnvironment.ts";
import AppStateProvider from "packages/client/contexts/AppStateContext.tsx";
import { featureFlags, featureVariants } from "packages/features/list.ts";

import { RelayEnvironmentProvider } from "react-relay";
import * as React from "react";
import type { Environment } from "relay-runtime";

const logger = getLogger(import.meta);

const AppEnvironmentContext = React.createContext<AppEnvironmentProps>({
  content: "",
  featureFlags,
  featureVariants,
  GOOGLE_OAUTH_CLIENT_ID: "",
  initialPath: globalThis.location?.pathname ?? "/",
  phBootstrap: {},
  BF_ENV: "PRODUCTION",
});

export type AppEnvironmentProps = {
  CONTACT_FORM_ID?: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  HUBSPOT_PORTAL_ID?: string;
  HYPERDX_API_KEY?: string;
  POSTHOG_API_KEY?: string;
  content: string;
  featureFlags: typeof featureFlags;
  featureVariants: typeof featureVariants;
  initialPath: string;
  phBootstrap: unknown;
  serverRelayEnvironment?: Environment;
  BF_ENV?: string;
  LIVEKIT_TEST_TOKEN?: string;
  LIVEKIT_URL?: string;
};

export type ServerProps = AppEnvironmentProps & RouterProviderProps & {
  IS_SERVER_RENDERING: boolean;
};
type PropsWithChildren = React.PropsWithChildren<ServerProps>;

export function useAppEnvironment() {
  return React.useContext<AppEnvironmentProps>(AppEnvironmentContext);
}

export default function AppEnvironmentProvider(props: PropsWithChildren) {
  const { children, routeParams, queryParams, ...appEnvironment } = props;
  const environment = props.serverRelayEnvironment ?? clientEnvironment;
  // const currentViewerId = props.currentViewer?.id;
  // React.useEffect(() => {
  //   if (currentViewerId) {
  //     identifyPerson(currentViewerId);
  //   }
  // }, [currentViewerId]);
  logger.debug("AppEnvironmentProvider: props", routeParams, queryParams);

  return (
    <AppEnvironmentContext.Provider value={appEnvironment}>
      <RouterProvider routeParams={routeParams} queryParams={queryParams}>
        <AppStateProvider>
          <RelayEnvironmentProvider environment={environment}>
            {children}
          </RelayEnvironmentProvider>
        </AppStateProvider>
      </RouterProvider>
    </AppEnvironmentContext.Provider>
  );
}
