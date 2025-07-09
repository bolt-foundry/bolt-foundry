import { BfDsButton } from "@bfmono/apps/bfds/index.ts";
import { useRouter } from "../Router.tsx";

export function Home() {
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
      </div>
    </div>
  );
}
