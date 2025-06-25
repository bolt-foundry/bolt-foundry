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
    borderBottom: "1px solid #e0e0e0",
    marginBottom: "1rem",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  };

  return (
    <nav style={navStyle}>
      {routes.map((route) => (
        <a
          key={route.path}
          href={`#${route.path}`}
          style={linkStyle}
          onMouseOver={(
            e,
          ) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseOut={(
            e,
          ) => (e.currentTarget.style.backgroundColor = "transparent")}
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
          }}
        >
          <header>
            <h1 style={{ margin: "1rem" }}>aibff GUI</h1>
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
