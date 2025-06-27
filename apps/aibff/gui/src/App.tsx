import { IsographEnvironmentProvider } from "@isograph/react";
import { Router, RouterProvider } from "./contexts/RouterContext.tsx";
import { GraderProvider } from "./contexts/GraderContext.tsx";
import { getEnvironment } from "./isographEnvironment.ts";
import "./App.css";

function App() {
  const environment = getEnvironment();

  return (
    <IsographEnvironmentProvider environment={environment}>
      <RouterProvider>
        <GraderProvider>
          <Router />
        </GraderProvider>
      </RouterProvider>
    </IsographEnvironmentProvider>
  );
}

export default App;
