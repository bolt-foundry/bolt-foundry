import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfds/index.ts";

function App() {
  const [count, setCount] = useState(5);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bolt Foundry</h1>
        <p>Coming Soon</p>
      </header>
      <main className="app-main">
        <section className="hello-world">
          <h2>Hello World!</h2>
          <p>
            This is the Phase 1 implementation of the Bolt Foundry landing page.
          </p>
          <p>Architecture foundation established with Vite + Deno + React.</p>
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <p>Counter: {count}</p>
            <BfDsButton
              onClick={() => setCount(count + 1)}
              variant="primary"
              size="medium"
            >
              Click to increment
            </BfDsButton>
          </div>
        </section>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Bolt Foundry. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
