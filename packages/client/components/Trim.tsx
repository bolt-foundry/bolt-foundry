import { type Maybe, React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";

export type TrimmingType = {
  currentValue: Maybe<number>;
  startTime: number;
  endTime: number;
  onClose: () => void;
  onSave: (newEndTime: number) => void;
};

export function Trim(
  { currentValue, startTime, endTime, onClose, onSave }: TrimmingType,
) {
  const [value, setValue] = React.useState(
    currentValue && currentValue > -1 ? currentValue : endTime,
  );
  return (
    <div className="miniModalBackground">
      <div className="miniModal">
        <form onSubmit={() => onSave(value)}>
          <div
            style={{
              color: "var(--secondaryColor)",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {value}
          </div>
          <input
            min={startTime}
            max={endTime}
            step={0.01}
            type="range"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
          <div style={{ display: "flex", flexDirection: "row", fontSize: 12 }}>
            <div style={{ flex: 1, textAlign: "left" }}>{startTime}</div>
            <div>{endTime}</div>
          </div>
          <div className="miniModalButtons">
            <Button kind="outline" onClick={onClose} text="Cancel" />
            <Button
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
