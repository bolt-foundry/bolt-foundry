import { Nav } from "./Nav.tsx";
import { BfDsDemo } from "@bfmono/apps/bfDs/demo/Demo.tsx";

export function UIDemo() {
  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <Nav page="ui" />
      <BfDsDemo />
    </div>
  );
}
