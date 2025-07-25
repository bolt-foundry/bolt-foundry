import { Nav } from "@bfmono//home/runner/workspace/apps/boltfoundry-com/components/Nav.tsx";
import { useEvalContext } from "@bfmono//home/runner/workspace/apps/boltfoundry-com/contexts/EvalContext.tsx";

export function Header() {
  const { setLeftSidebarOpen, leftSidebarOpen } = useEvalContext();

  return (
    <Nav
      page="eval"
      onSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
      sidebarOpen={leftSidebarOpen}
    />
  );
}
