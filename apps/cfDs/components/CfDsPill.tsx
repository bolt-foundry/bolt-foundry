import type { CfDsIconType } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { CfDsIcon } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { classnames } from "@bfmono/lib/classnames.ts";

type Props = {
  label?: string;
  labelColor?: string;
  text?: string | number | undefined;
  icon?: CfDsIconType | undefined;
  color?: string;
  action?: React.ReactNode | undefined;
};

export function CfDsPill(
  { action, label, labelColor, text, color = "fourtharyColor", icon }: Props,
) {
  const labelClass = classnames([
    "ds-pillLabel",
    {
      noText: !text && !icon && !action,
    },
  ]);
  return (
    <div className="ds-pill" style={{ background: `var(--${color}015)` }}>
      {label && (
        <div
          className={labelClass}
          style={{ color: `var(--${labelColor ?? color})` }}
        >
          {label}
        </div>
      )}
      {(text || icon || action) && (
        <div
          className="ds-pillContent"
          style={{ borderColor: `var(--${color}005)` }}
        >
          {text}
          {icon && <CfDsIcon color={`var(--${color})`} name={icon} size={12} />}
          {action}
        </div>
      )}
    </div>
  );
}

export function Example() {
  return (
    <div className="ui-group">
      <CfDsPill
        label="Info"
        text="This is a boring pill"
        color="textSecondary"
      />

      <CfDsPill
        label="Warning"
        color="alert"
        icon="exclamationTriangle"
      />

      <CfDsPill
        text="Just text"
        color="secondaryColor"
      />

      <CfDsPill
        label="Just label"
        color="secondaryColor"
      />
    </div>
  );
}
