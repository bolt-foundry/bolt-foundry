import { Nav } from "./Nav.tsx";
import { BfDsDemo } from "@bfmono/apps/bfDs/demo/Demo.tsx";

export function UIDemo(_props: unknown) {
  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <Nav page="ui" />
      <BfDsDemo />
    </div>
  );
}
