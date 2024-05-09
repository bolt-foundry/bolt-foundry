import { React } from "deps.ts";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
// import { captureEvent } from "packages/events/mod.ts";

type Props = {
  onChange: (newRatio: number) => void;
  value: number | null;
};

export function RatioSelector({ onChange, value }: Props) {
  function updateRatio(newRatio: string) {
    let ratio = 16 / 9;
    if (newRatio === "tall") {
      ratio = 9 / 16;
    }
    onChange(ratio);
  }

  let currentRatio = "wide";
  if (value === 9 / 16) {
    currentRatio = "tall";
  }

  return (
    <DropdownSelector
      options={{ "Wide": "wide", "Tall": "tall" }}
      onChange={updateRatio}
      value={currentRatio}
      placeholder={currentRatio}
      testId="ratioSelector"
    />
  );
}

