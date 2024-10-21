import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { useState } from "react";
import type { Maybe } from "packages/maybe.ts";

export type TrimmingType = {
  currentValue: Maybe<number>;
  startTime: number;
  endTime: number;
  onClose: () => void;
  onSave: (newEndTime: number) => void;
};

export function TrimMenu(
  { currentValue, startTime, endTime, onClose, onSave }: TrimmingType,
) {
  const [value, setValue] = useState(
    currentValue && currentValue > -1 ? currentValue : endTime,
  );
  return (
    <div className="miniModalBackground">
      <div className="miniModal">
        <form onSubmit={() => onSave(value)}>
          {
            /* <Input
            type="number"
            value={value}
            onChange={(e) => {
              setValue(parseInt(e.target.value));
            }}
          /> */
          }
          <div
            style={{
              color: "var(--secondaryColor)",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {value}
          </div>
          <BfDsInput
            numberAttributes={{
              min: startTime,
              max: endTime,
              step: 0.01,
            }}
            type="range"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
          <div style={{ display: "flex", flexDirection: "row", fontSize: 12 }}>
            <div style={{ flex: 1, textAlign: "left" }}>{startTime}</div>
            <div>{endTime}</div>
          </div>
          <div className="miniModalButtons">
            <BfDsButton kind="outline" onClick={onClose} text="Cancel" />
            <BfDsButton
              kind="primary"
              type="submit"
              text="Trim end"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
