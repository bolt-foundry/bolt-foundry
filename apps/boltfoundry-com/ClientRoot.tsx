import { hydrateRoot } from "react-dom/client";
import App from "./src/App.tsx";
import "./src/index.css";

export interface ClientRootProps {
  environment: Record<string, unknown>;
}

export function ClientRoot({ environment }: ClientRootProps) {
  return <App initialPath={environment.currentPath as string} />;
}

export function rehydrate(environment: Record<string, unknown>) {
  console.log("🔧 rehydrate() called with environment:", environment);
  const root = document.querySelector("#root");
  if (root) {
    console.log("🔧 Found #root element, calling hydrateRoot");
    try {
      hydrateRoot(
        root,
        <ClientRoot environment={environment} />,
      );
      console.log("🔧 hydrateRoot completed successfully");
    } catch (error) {
      console.error("🔧 hydrateRoot failed:", error);
    }
  } else {
    console.error("🔧 Could not find #root element");
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
