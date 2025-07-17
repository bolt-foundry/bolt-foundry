import { hydrateRoot } from "react-dom/client";
import { getLogger } from "@bolt-foundry/logger";
import App from "./src/App.tsx";
import {
  AppEnvironmentProvider,
  type ServerProps,
} from "@bfmono/apps/boltfoundry-com/contexts/AppEnvironmentContext.tsx";

const logger = getLogger(import.meta);

export interface ClientRootProps extends ServerProps {
  children?: React.ReactNode;
}

export function ClientRoot({
  children,
  ...props
}: ClientRootProps) {
  return (
    <AppEnvironmentProvider {...props}>
      {children}
    </AppEnvironmentProvider>
  );
}

export function rehydrate(props: ServerProps) {
  logger.debug("🔧 rehydrate() called with props:", props);
  const root = document.querySelector("#root");
  if (root) {
    logger.debug("🔧 Found #root element, calling hydrateRoot");
    try {
      hydrateRoot(
        root,
        <ClientRoot {...props}>
          <App />
        </ClientRoot>,
      );
      logger.debug("🔧 hydrateRoot completed successfully");
    } catch (error) {
      logger.error("🔧 hydrateRoot failed:", error);
    }
  } else {
    logger.error("🔧 Could not find #root element");
  }
}

logger.debug("ClientRoot loaded");
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
