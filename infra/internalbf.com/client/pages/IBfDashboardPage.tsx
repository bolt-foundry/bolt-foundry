import { React } from "deps.ts";
import { IBfFrame } from "infra/internalbf.com/client/components/IBfFrame.tsx";

export function IBfDashboardPage() {
  const name = "Randall";
  
  return (
    <IBfFrame header={`Welcome ${name}!`}>
      Coming soon.
    </IBfFrame>
  );
}
