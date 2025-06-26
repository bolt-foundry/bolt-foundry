import { IsographEnvironmentProvider } from "@isograph/react";
import { Router, RouterProvider } from "./contexts/RouterContext.tsx";
import { routes } from "./routes.tsx";
import { getEnvironment } from "./isographEnvironment.ts";
import "./App.css";

function Navigation() {
  const navStyle = {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    borderBottom: "1px solid var(--bfds-border)",
    marginBottom: "1rem",
    backgroundColor: "#1a1b1c",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "var(--bfds-text-secondary)",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "all 0.2s",
    border: "1px solid transparent",
  };

  return (
    <nav style={navStyle}>
      {routes.map((route) => (
        <a
          key={route.path}
          href={`#${route.path}`}
          style={linkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--bfds-background-hover)";
            e.currentTarget.style.color = "var(--bfds-text)";
            e.currentTarget.style.borderColor = "var(--bfds-border)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--bfds-text-secondary)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          {route.title}
        </a>
      ))}
    </nav>
  );
}

function App() {
  const environment = getEnvironment();

  return (
    <IsographEnvironmentProvider environment={environment}>
      <RouterProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bfds-background)",
            color: "var(--bfds-text)",
          }}
        >
          <header style={{ backgroundColor: "#0f1011" }}>
            <h1 style={{ margin: "1rem", color: "var(--bfds-text)" }}>
              aibff GUI
            </h1>
            <Navigation />
          </header>
          <main style={{ flex: 1, padding: "1rem" }}>
            <Router />
          </main>
        </div>
      </RouterProvider>
    </IsographEnvironmentProvider>
  );
}

export default App;
