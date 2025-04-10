import type { BfDsIconType } from "apps/bfDs/components/BfDsIcon.tsx";
import { BfDsIcon } from "apps/bfDs/components/BfDsIcon.tsx";
import { classnames } from "lib/classnames.ts";

type Props = {
  label?: string;
  text?: string | number | undefined;
  icon?: BfDsIconType | undefined;
  color?: string;
  action?: React.ReactNode | undefined;
};

export function BfDsPill(
  { action, label, text, color = "fourtharyColor", icon }: Props,
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
        <div className={labelClass} style={{ color: `var(--${color})` }}>
          {label}
        </div>
      )}
      {(text || icon || action) && (
        <div
          className="ds-pillContent"
          style={{ borderColor: `var(--${color}015)` }}
        >
          {text}
          {icon && <BfDsIcon color={`var(--${color})`} name={icon} size={12} />}
          {action}
        </div>
      )}
    </div>
  );
}

export function Example() {
  return (
    <div className="ui-group">
      <BfDsPill
        label="Info"
        text="This is a boring pill"
        color="textSecondary"
      />

      <BfDsPill
        label="Warning"
        color="alert"
        icon="exclamationTriangle"
      />

      <BfDsPill
        text="Just text"
        color="secondaryColor"
      />

      <BfDsPill
        label="Just label"
        color="secondaryColor"
      />
    </div>
  );
}
