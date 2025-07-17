import { hydrateRoot } from "react-dom/client";
import { getLogger } from "@bolt-foundry/logger";
import App from "./src/App.tsx";
import "./src/index.css";
import "../../static/bfDsStyle.css";
import { createClientEnvironment } from "./clientIsographEnvironment.ts";

const logger = getLogger(import.meta);

export interface ClientRootProps {
  environment: Record<string, unknown>;
}

export function ClientRoot({ environment }: ClientRootProps) {
  const clientIsographEnvironment = createClientEnvironment();
  return <App initialPath={environment.currentPath as string} isographEnvironment={clientIsographEnvironment} />;
}

export function rehydrate(environment: Record<string, unknown>) {
  logger.debug("🔧 rehydrate() called with environment:", environment);
  const root = document.querySelector("#root");
  if (root) {
    logger.debug("🔧 Found #root element, calling hydrateRoot");
    try {
      hydrateRoot(
        root,
        <ClientRoot environment={environment} />,
      );
      logger.debug("🔧 hydrateRoot completed successfully");
    } catch (error) {
      logger.error("🔧 hydrateRoot failed:", error);
    }
  } else {
    logger.error("🔧 Could not find #root element");
  }
}

// @ts-expect-error Not typed on the window yet
if (globalThis.__ENVIRONMENT__) {
  // @ts-expect-error Not typed on the window yet
  rehydrate(globalThis.__ENVIRONMENT__);
} else {
  // @ts-expect-error Not typed on the window yet
  globalThis.__REHYDRATE__ = rehydrate;
}
