import { React } from "deps.ts";
import { IBfFrame } from "infra/internalbf.com/client/components/IBfFrame.tsx";

export function IBfDashboardPage() {
  const name = "Justin";

  return (
    <IBfFrame header={`Welcome ${name}!`} headerAction={"button here"}>
      {Array.from({ length: 100 }).map((_, i) => {
        return <div>Coming soon.</div>;
      })}
    </IBfFrame>
  );
}
