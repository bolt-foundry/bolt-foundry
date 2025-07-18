import { hydrateRoot } from "react-dom/client";
import { getLogger } from "@bolt-foundry/logger";
import {
  AppEnvironmentProvider,
  type ServerProps,
} from "./contexts/AppEnvironmentContext.tsx";
import { AppRoot } from "./src/AppRoot.tsx";
import "./src/index.css";
import "../../static/bfDsStyle.css";

const logger = getLogger(import.meta);

export interface ClientRootProps extends ServerProps {
  children?: React.ReactNode;
}

export function ClientRoot({ children, ...props }: ClientRootProps) {
  return (
    <AppEnvironmentProvider {...props}>
      {children}
    </AppEnvironmentProvider>
  );
}

export function rehydrate(props: ServerProps) {
  const root = document.querySelector("#root");
  if (root) {
    logger.debug("🔧 rehydrating root", root, props);
    try {
      hydrateRoot(
        root,
        <ClientRoot {...props}>
          <AppRoot />
        </ClientRoot>,
      );
      logger.debug("🔧 rehydrated root successfully");
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
