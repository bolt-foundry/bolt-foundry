import "./App.css";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { BfDsLiteButton } from "@bfmono/apps/bfDsLite/index.ts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <img src="/vite-deno.svg" alt="Vite with Deno" />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <BfDsLiteButton
          variant="primary"
          onClick={() => setCount((count) => count + 1)}
          style={{ marginLeft: "1rem" }}
        >
          BfDs count is {count}
        </BfDsLiteButton>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
