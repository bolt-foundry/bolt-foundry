import { useState } from "react";

import { classnames } from "@bfmono/lib/classnames.ts";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

type Props = {
  active: boolean;
  Component: React.ComponentType;
  onClose: () => void;
};

export function BfDsSheet({ active, Component, onClose }: Props) {
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
        <BfDsButton kind="overlay" iconLeft="cross" onClick={handleClose} />
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
            <BfDsButton
              text={active ? "Close sheet" : "Open sheet"}
              onClick={() => setActive(!active)}
            />
          </div>
        </div>
      </div>
      <BfDsSheet
        active={active}
        Component={ExampleSheet}
        onClose={() => setActive(false)}
      />
    </div>
  );
}
