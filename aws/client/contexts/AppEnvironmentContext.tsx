// AppEnvironmentContext.tsx
// This is a standard react provider which tells the app which path its on, and exposes environemnt variables to the app.

import { React, ReactRelay, RelayRuntime } from "aws/client/deps.ts";
import { identifyPerson } from "aws/events/mod.ts";
import {
  RouterProvider,
  RouterProviderProps,
} from "aws/client/contexts/RouterContext.tsx";
import clientEnvironment from "aws/client/relay/environment.ts";
import AppStateProvider from "aws/client/contexts/AppStateContext.tsx";
import { featureFlags, featureVariants } from "aws/features/list.ts";

const { RelayEnvironmentProvider } = ReactRelay;

const AppEnvironmentContext = React.createContext<AppEnvironmentProps>({
  content: "",
  currentViewer: {},
  featureFlags,
  featureVariants,
  GOOGLE_DEVELOPER_API_KEY: "",
  GOOGLE_OAUTH_CLIENT_ID: "",
  initialPath: globalThis.location?.pathname ?? "/",
  phBootstrap: {},
});

export type AppEnvironmentProps = {
  CONTACT_FORM_ID?: string;
  GOOGLE_DEVELOPER_API_KEY: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  HUBSPOT_PORTAL_ID?: string;
  HYPERDX_API_KEY?: string;
  POSTHOG_API_KEY?: string;
  content: string;
  currentViewer: {
    email?: string;
    id?: string;
    name?: string;
  };
  featureFlags: typeof featureFlags;
  featureVariants: typeof featureVariants;
  initialPath: string;
  phBootstrap: unknown;
  serverRelayEnvironment?: RelayRuntime.Environment;
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
  const currentViewerId = props.currentViewer?.id;
  React.useEffect(() => {
    if (currentViewerId) {
      identifyPerson(currentViewerId);
    }
  }, [currentViewerId]);

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
