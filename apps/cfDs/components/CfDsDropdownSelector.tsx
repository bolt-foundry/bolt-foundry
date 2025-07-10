import * as React from "react";
import type {
  CfDsTooltipJustification,
  CfDsTooltipPosition,
} from "@bfmono/apps/cfDs/components/CfDsTooltip.tsx";
import type { CfDsTooltipMenuType } from "@bfmono/apps/cfDs/components/CfDsTooltipMenu.tsx";
import {
  type ButtonKind,
  type ButtonXStyle,
  CfDsButton,
} from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
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
  meta: {
    color: "var(--textSecondary)",
    marginTop: 4,
    fontSize: "0.8em",
  },
};

export type DropdownSelectorProps = {
  disabled?: boolean;
  meta?: string | React.ReactNode;
  position?: CfDsTooltipPosition;
  justification?: CfDsTooltipJustification;
  // Options are a map of option name to value
  // e.g. { "Option 1": "option1", "Option 2": "option2" }
  options: Record<string, string>;
  actions?: Array<CfDsTooltipMenuType>;
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

export function CfDsDropdownSelector(
  {
    disabled,
    options,
    actions,
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
  const [menu, setMenu] = useState<Array<CfDsTooltipMenuType>>([]);

  useEffect(() => {
    const menuOptions = Object.entries(options).map(([option, optionValue]) => {
      return {
        label: option,
        onClick: () => {
          onChange?.(optionValue);
        },
        selected: optionValue === value,
      };
    });
    const menuActions = actions ?? [];
    if (menuActions.length > 0) {
      menuActions.unshift({
        kind: "separator",
      });
    }
    const newMenu = [...menuOptions, ...menuActions];
    setMenu(newMenu);
  }, [options]);

  const menuLabel = value === "" ? placeholder : (Object.entries(options).find(
    ([_, optionValue]) => optionValue === value,
  )?.[0] ?? placeholder);

  const testIdValue = testId ? `${testId}-${!value}` : undefined;

  const dropdown = (
    <CfDsButton
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
    <CfDsDropdownSelector
      options={options}
      onChange={setValue}
      value={value}
      placeholder="Choose..."
    />
  );
}
