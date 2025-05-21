import * as React from "react";
import type {
  BfDsTooltipJustification,
  BfDsTooltipPosition,
} from "apps/bfDs/components/BfDsTooltip.tsx";
import type { BfDsTooltipMenuType } from "apps/bfDs/components/BfDsTooltipMenu.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
const { useEffect, useState } = React;

export type DropdownSelectorProps = {
  disabled?: boolean;
  position?: BfDsTooltipPosition;
  justification?: BfDsTooltipJustification;
  // Options are a map of option name to value
  // e.g. { "Option 1": "option1", "Option 2": "option2" }
  options: Record<string, string>;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  showSpinner?: boolean;
  testId?: string;
};

export function BfDsDropdownSelector(
  {
    disabled,
    options,
    onChange,
    value,
    placeholder,
    position = "bottom",
    justification = "end",
    showSpinner,
    testId,
  }: DropdownSelectorProps,
) {
  const [menu, setMenu] = useState<Array<BfDsTooltipMenuType>>([]);

  useEffect(() => {
    const newMenu = Object.entries(options).map(([option, optionValue]) => {
      return {
        label: option,
        onClick: () => {
          onChange?.(optionValue);
        },
        selected: optionValue === value,
      };
    });
    setMenu(newMenu);
  }, [options]);

  const menuLabel = value
    ? Object.entries(options).find(
      ([_, optionValue]) => optionValue === value,
    )?.[0]
    : placeholder;

  const testIdValue = testId ? `${testId}-${!value}` : undefined;

  return (
    <BfDsButton
      disabled={disabled}
      kind="outline"
      text={menuLabel}
      tooltipMenuDropdown={menu}
      tooltipPosition={position}
      tooltipJustification={justification}
      showSpinner={showSpinner}
      testId={testIdValue}
    />
  );
}

export function Example() {
  const [value, setValue] = useState("");
  const options = { "Option 1": "option1", "Option 2": "option2" };

  return (
    <BfDsDropdownSelector
      options={options}
      onChange={setValue}
      value={value}
      placeholder="Choose..."
    />
  );
}
