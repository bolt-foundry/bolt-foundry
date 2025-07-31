import { useState } from "react";

import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsInput } from "@bfmono/apps/cfDs/components/CfDsInput.tsx";
import { CfDsSpinner } from "@bfmono/apps/cfDs/components/CfDsSpinner.tsx";

export function KitchenSink() {
  const [percent, setPercent] = useState<string>("65");
  return (
    <div className="ui-section">
      <h2>Random</h2>
      <div>
        <CfDsSpinner waitIcon />
        {/* <WorkflowStatusIndicator percent={Number(percent)} /> */}
        <div>
          <CfDsButton
            text="Progress button"
            kind="primary"
            progress={Number(percent)}
          />
          <CfDsButton
            iconLeft="download"
            kind="primary"
            progress={Number(percent)}
          />
        </div>
        <CfDsInput
          label="Percent"
          value={percent}
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPercent(e.target.value)}
          style={{ width: 100 }}
        />
      </div>
    </div>
  );
}
