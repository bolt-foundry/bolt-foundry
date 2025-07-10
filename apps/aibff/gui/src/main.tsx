import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Add error handler for debugging
globalThis.addEventListener("error", (event) => {
  // deno-lint-ignore no-console
  console.error("Global error:", event.error);
});

globalThis.addEventListener("unhandledrejection", (event) => {
  // deno-lint-ignore no-console
  console.error("Unhandled promise rejection:", event.reason);
});

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element not found");
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  // deno-lint-ignore no-console
  console.error("Failed to render app:", error);
  document.body.innerHTML = `<h1>Error</h1><pre>${error}</pre>`;
}
