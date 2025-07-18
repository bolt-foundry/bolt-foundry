import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import { useRouter } from "../contexts/RouterContext.tsx";

export const Home = iso(`
  field Query.Home @component {
    __typename
    currentViewer {
      LogInOrOutButton
    }
  }
`)(function Home({ data }) {
  const { navigate } = useRouter();

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Bolt Foundry</h1>
      <p>Coming Soon</p>

      <div style={{ marginTop: "2rem" }}>
        <p>
          This is the Phase 1 implementation of the Bolt Foundry landing page.
        </p>
        <p>Architecture foundation established with Vite + Deno + React.</p>

        <div style={{ marginTop: "2rem" }}>
          <BfDsButton
            onClick={() => navigate("/ui")}
            variant="primary"
            size="medium"
          >
            View UI Demo
          </BfDsButton>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>Authentication</h3>
          {data.currentViewer ? (
            <data.currentViewer.LogInOrOutButton />
          ) : (
            <p>Loading authentication state...</p>
          )}
        </div>
      </div>

      <footer
        style={{
          marginTop: "4rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        © 2025 Bolt Foundry. All rights reserved.
      </footer>
    </div>
  );
});
