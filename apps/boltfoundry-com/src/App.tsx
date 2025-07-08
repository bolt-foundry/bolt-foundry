import "./App.css";
import { IsographEnvironmentProvider, useLazyReference, useResult } from "@isograph/react";
import { getEnvironment } from "./isographEnvironment.ts";
import { EntrypointHome } from "../entrypoints/EntrypointHome.ts";

function AppContent() {
  const { fragmentReference } = useLazyReference(EntrypointHome, {});
  const Component = useResult(fragmentReference);
  
  return Component || <div>Loading...</div>;
}

function App() {
  const environment = getEnvironment();
  
  return (
    <IsographEnvironmentProvider environment={environment}>
      <AppContent />
    </IsographEnvironmentProvider>
  );
}

export default App;
