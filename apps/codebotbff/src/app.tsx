// This file runs directly in the embedded Deno runtime!
// No bundling needed - we can import from the monorepo directly

import { BfDsProvider } from "@bfmono/apps/bfDs/components/BfDsProvider.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsCard } from "@bfmono/apps/bfDs/components/BfDsCard.tsx";
import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
import { BfDsSpinner } from "@bfmono/apps/bfDs/components/BfDsSpinner.tsx";
import { BfDsEmptyState } from "@bfmono/apps/bfDs/components/BfDsEmptyState.tsx";
import { Terminal } from "xterm";
import React from "react";
import ReactDOM from "react-dom/client";

// Direct access to codebotbff global
const { invoke, projectRoot } = globalThis.__CODEBOTBFF__;

interface Workspace {
  name: string;
  running: boolean;
}

function CodebotApp() {
  const [workspaces, setWorkspaces] = React.useState<Array<Workspace>>([]);
  const [loading, setLoading] = React.useState(false);
  const [currentWorkspace, setCurrentWorkspace] = React.useState<string | null>(
    null,
  );
  const [terminal, setTerminal] = React.useState<Terminal | null>(null);

  React.useEffect(() => {
    loadWorkspaces();
    initTerminal();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const result = await invoke("list_workspaces", {});
      setWorkspaces(result);
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const initTerminal = () => {
    const term = new Terminal({
      theme: {
        background: "#000000",
        foreground: "#ffffff",
      },
    });

    const container = document.getElementById("terminal-container");
    if (container) {
      term.open(container);
      term.writeln("Welcome to Codebot BFF!");
      term.writeln("Using BfDs components from the monorepo 🎉");
      setTerminal(term);
    }
  };

  const createWorkspace = async () => {
    try {
      setLoading(true);
      const workspace = await invoke("create_new_workspace", {});
      terminal?.writeln(`Created workspace: ${workspace}`);
      await loadWorkspaces();
      setCurrentWorkspace(workspace);
    } catch (error) {
      terminal?.writeln(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const startContainer = async (workspace: string) => {
    try {
      setLoading(true);
      await invoke("start_container", { workspace });
      terminal?.writeln(`Started container for ${workspace}`);
      await loadWorkspaces();
    } catch (error) {
      terminal?.writeln(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BfDsProvider>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>Codebot BFF</h1>
          <BfDsButton onClick={createWorkspace} disabled={loading}>
            New Workspace
          </BfDsButton>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Workspaces Panel */}
          <div
            style={{
              width: "300px",
              borderRight: "1px solid #333",
              overflow: "auto",
            }}
          >
            <BfDsCard title="Workspaces" style={{ margin: "1rem" }}>
              {loading && <BfDsSpinner />}
              {!loading && workspaces.length === 0 && (
                <BfDsEmptyState
                  title="No workspaces"
                  description="Create a new workspace to get started"
                />
              )}
              {!loading && workspaces.length > 0 && (
                <BfDsList>
                  {workspaces.map((ws) => (
                    <BfDsListItem
                      key={ws.name}
                      onClick={() => setCurrentWorkspace(ws.name)}
                      selected={currentWorkspace === ws.name}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{ws.name}</span>
                        <span
                          style={{
                            color: ws.running ? "#4ade80" : "#666",
                            fontSize: "0.875rem",
                          }}
                        >
                          {ws.running ? "Running" : "Stopped"}
                        </span>
                      </div>
                    </BfDsListItem>
                  ))}
                </BfDsList>
              )}
            </BfDsCard>
          </div>

          {/* Terminal Panel */}
          <div style={{ flex: 1, background: "#000", padding: "1rem" }}>
            <div id="terminal-container" style={{ height: "100%" }}></div>
          </div>
        </div>

        {/* Status Bar */}
        <div
          style={{
            padding: "0.5rem 1rem",
            borderTop: "1px solid #333",
            fontSize: "0.875rem",
            color: "#999",
          }}
        >
          Current workspace: {currentWorkspace || "None"} | Project root:{" "}
          {projectRoot}
        </div>
      </div>
    </BfDsProvider>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<CodebotApp />);
