import * as React from "react";
import type {
  BfDsTooltipJustification,
  BfDsTooltipPosition,
} from "apps/bfDs/components/BfDsTooltip.tsx";
import type { BfDsTooltipMenuType } from "apps/bfDs/components/BfDsTooltipMenu.tsx";
import {
  BfDsButton,
  type ButtonKind,
  type ButtonXStyle,
} from "apps/bfDs/components/BfDsButton.tsx";
const { useEffect, useState } = React;

const styles: Record<string, React.CSSProperties> = {
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  label: {
    display: "flex",
    flexDirection: "column",
  },
};

export type DropdownSelectorProps = {
  disabled?: boolean;
  meta?: string | React.ReactNode;
  position?: BfDsTooltipPosition;
  justification?: BfDsTooltipJustification;
  // Options are a map of option name to value
  // e.g. { "Option 1": "option1", "Option 2": "option2" }
  options: Record<string, string>;
  onChange?: (value: string) => void;
  label?: string;
  kind?: ButtonKind;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  showSpinner?: boolean;
  testId?: string;
  xstyle?: ButtonXStyle;
};

export function BfDsDropdownSelector(
  {
    disabled,
    options,
    onChange,
    label,
    kind = "outline",
    meta,
    value,
    name,
    placeholder = "Select...",
    position = "bottom",
    required,
    justification = "end",
    showSpinner,
    testId,
    xstyle,
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

  const menuLabel = value === "" ? placeholder : (Object.keys(options).find(
    (keyValue) => keyValue === value,
  )?.[0] ?? placeholder);

  const testIdValue = testId ? `${testId}-${!value}` : undefined;

  const dropdown = (
    <BfDsButton
      disabled={disabled}
      kind={kind}
      text={menuLabel}
      tooltipMenuDropdown={menu}
      tooltipPosition={position}
      tooltipJustification={justification}
      showSpinner={showSpinner}
      testId={testIdValue}
      xstyle={xstyle}
    />
  );

  if (label) {
    return (
      <label htmlFor={name} style={styles.label}>
        {label}
        {required && " *"}
        <div style={styles.inputContainer}>
          {dropdown}
        </div>
        {meta && <div style={styles.meta}>{meta}</div>}
      </label>
    );
  }
  return (
    <div>
      <div style={styles.inputContainer}>
        {dropdown}
        {required && " *"}
      </div>
      {meta && <div style={styles.meta}>{meta}</div>}
    </div>
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
