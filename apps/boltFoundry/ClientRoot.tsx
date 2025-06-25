import {
  AppEnvironmentProvider,
  type ServerProps,
} from "@bfmono/apps/boltFoundry/contexts/AppEnvironmentContext.tsx";
import { AppRoot } from "@bfmono/apps/boltFoundry/AppRoot.tsx";
import { hydrateRoot } from "react-dom/client";
import { CfDsProvider } from "@bfmono/apps/cfDs/contexts/CfDsContext.tsx";
import { ErrorBoundary } from "@bfmono/apps/boltFoundry/components/ErrorBoundary.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { AppSidebar } from "@bfmono/apps/boltFoundry/components/AppSidebar.tsx";

const logger = getLogger(import.meta);

export interface ClientRootProps extends ServerProps {
  children?: React.ReactNode;
}

export function ClientRoot({
  children,
  ...props
}: ClientRootProps) {
  return (
    <CfDsProvider>
      <ErrorBoundary>
        <AppEnvironmentProvider {...props}>
          <AppSidebar>
            {children}
          </AppSidebar>
        </AppEnvironmentProvider>
      </ErrorBoundary>
    </CfDsProvider>
  );
}

export function rehydrate(props: ServerProps) {
  const root = document.querySelector("#root");
  if (root) {
    logger.debug("rehydrating root", root, props);
    hydrateRoot(
      root,
      <ClientRoot {...props}>
        <AppRoot />
      </ClientRoot>,
    );
    logger.debug("rehydrated root?", root);
  } else {
    logger.error("couldn't rehydrate, root not found");
  }
}
logger.debug("AppRoot loaded");
// @ts-expect-error Not typed on the window yet
if (globalThis.__ENVIRONMENT__) {
  logger.debug("found environment, rehydrating root");
  // @ts-expect-error Not typed on the window yet
  rehydrate(globalThis.__ENVIRONMENT__);
} else {
  logger.debug("Setting rehydration callback");
  // @ts-expect-error Not typed on the window yet
  globalThis.__REHYDRATE__ = rehydrate;
}
