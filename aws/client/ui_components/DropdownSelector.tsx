import { React } from "aws/client/deps.ts";
import { TooltipMenu } from "aws/client/ui_components/Tooltip.tsx";
import Button from "aws/client/ui_components/Button.tsx";
const { useEffect, useState } = React;

type Props = {
  disabled?: boolean;
  // Options are a map of option name to value
  // e.g. { "Option 1": "option1", "Option 2": "option2" }
  options: Record<string, string>;
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  showSpinner?: boolean;
  testId?: string;
};

export default function DropdownSelector(
  { disabled, options, onChange, value, placeholder, showSpinner, testId }:
    Props,
) {
  const [menu, setMenu] = useState<Array<TooltipMenu>>([]);

  useEffect(() => {
    const newMenu = Object.entries(options).map(([option, optionValue]) => {
      return {
        label: option,
        onClick: () => {
          onChange(optionValue);
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
    <Button
      disabled={disabled}
      kind="outline"
      text={menuLabel}
      tooltipMenuDropdown={menu}
      tooltipPosition="bottom"
      tooltipJustification="end"
      showSpinner={showSpinner}
      testId={testIdValue}
    />
  );
}
