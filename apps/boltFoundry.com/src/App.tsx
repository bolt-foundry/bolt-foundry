import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";

function App() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#333",
        }}
      >
        Bolt Foundry
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          maxWidth: "600px",
        }}
      >
        Open-source platform for reliable LLM systems
      </p>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        <p style={{ margin: 0, color: "#888" }}>
          Phase 1: Hello World ✨
        </p>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <BfDsButton 
          variant="primary"
          onClick={() => alert("BfDs integration working!")}
        >
          Test bfDs Button
        </BfDsButton>
      </div>
    </div>
  );
}

export default App;
