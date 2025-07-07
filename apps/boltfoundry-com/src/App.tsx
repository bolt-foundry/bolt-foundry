import "./App.css";
import { IsographEnvironmentProvider, useResult } from "@isograph/react";
import { getEnvironment } from "./isographEnvironment.ts";
import { EntrypointHello } from "./components/Hello.tsx";

function HelloSection() {
  const result = useResult(EntrypointHello, {});

  if (result.kind === "PendingOrFailed") {
    return <div>Loading...</div>;
  }

  const { Body } = result.data;
  return <Body />;
}

function App() {
  return (
    <IsographEnvironmentProvider environment={getEnvironment()}>
      <div className="app">
        <header className="app-header">
          <h1>Bolt Foundry</h1>
          <p>Coming Soon</p>
        </header>
        <main className="app-main">
          <section className="hello-world">
            <h2>Hello World!</h2>
            <p>
              This is the Phase 1 implementation of the Bolt Foundry landing
              page.
            </p>
            <p>Architecture foundation established with Vite + Deno + React.</p>
          </section>
          <section className="isograph-demo">
            <HelloSection />
          </section>
        </main>
        <footer className="app-footer">
          <p>&copy; 2025 Bolt Foundry. All rights reserved.</p>
        </footer>
      </div>
    </IsographEnvironmentProvider>
  );
}

export default App;
