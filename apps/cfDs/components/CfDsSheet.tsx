import { useState } from "react";

import { classnames } from "@bfmono/lib/classnames.ts";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";

type Props = {
  active: boolean;
  Component: React.ComponentType;
  onClose: () => void;
};

export function CfDsSheet({ active, Component, onClose }: Props) {
  const handleClose = () => {
    onClose();
  };
  const sheetClasses = classnames([
    "sheet",
    { active },
  ]);
  return (
    <div className={sheetClasses}>
      <div className="sheetX">
        <CfDsButton kind="overlay" iconLeft="cross" onClick={handleClose} />
      </div>
      <div className="sheetContents">
        <Component />
      </div>
    </div>
  );
}

function ExampleSheet() {
  return <h2>Example sheet</h2>;
}

export function Example() {
  const [active, setActive] = useState(false);
  return (
    <div className="flexRow gapLarge ui-anti-content">
      <div style={{ flex: 1, padding: 20 }}>
        <div>
          <div className="ui-section">
            <h2>Sheet</h2>
            <CfDsButton
              text={active ? "Close sheet" : "Open sheet"}
              onClick={() => setActive(!active)}
            />
          </div>
        </div>
      </div>
      <CfDsSheet
        active={active}
        Component={ExampleSheet}
        onClose={() => setActive(false)}
      />
    </div>
  );
}
