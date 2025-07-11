import "./index.css";
import "@bfmono/static/bfDsStyle.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Flag to control StrictMode - disable it to avoid react-disposable-state issues
const ENABLE_STRICT_MODE = false; // Set to true to enable StrictMode

const AppWrapper = ENABLE_STRICT_MODE
  ? (
    <StrictMode>
      <App />
    </StrictMode>
  )
  : <App />;

createRoot(document.getElementById("root") as HTMLElement).render(AppWrapper);
