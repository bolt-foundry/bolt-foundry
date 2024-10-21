import { IBfFrame } from "infra/internalbf.com/client/components/IBfFrame.tsx";

export function IBfDashboardPage() {
  const name = "Justin";

  return (
    <IBfFrame header={`Welcome ${name}!`} headerAction={"button here"}>
      Hi.
    </IBfFrame>
  );
}
