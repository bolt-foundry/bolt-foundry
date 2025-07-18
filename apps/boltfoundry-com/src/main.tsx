import "./index.css";
import "@bfmono/static/bfDsStyle.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClientRoot } from "../ClientRoot.tsx";
import { AppRoot } from "./AppRoot.tsx";

// Flag to control StrictMode - disable it to avoid react-disposable-state issues
const ENABLE_STRICT_MODE = false; // Set to true to enable StrictMode

// For development mode when not doing SSR hydration
const environment = {
  currentPath: globalThis.location.pathname,
  IS_SERVER_RENDERING: false,
};

const AppWrapper = ENABLE_STRICT_MODE
  ? (
    <StrictMode>
      <ClientRoot
        initialPath={environment.currentPath}
        IS_SERVER_RENDERING={false}
      >
        <AppRoot />
      </ClientRoot>
    </StrictMode>
  )
  : (
    <ClientRoot
      initialPath={environment.currentPath}
      IS_SERVER_RENDERING={false}
    >
      <AppRoot />
    </ClientRoot>
  );

createRoot(document.getElementById("root") as HTMLElement).render(AppWrapper);
