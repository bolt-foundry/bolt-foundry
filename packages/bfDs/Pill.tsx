import type { BfDsIconType } from "packages/bfDs/BfDsIcon.tsx";
import { BfDsIcon } from "packages/bfDs/BfDsIcon.tsx";

type Props = {
  label?: string;
  text?: string | number | undefined;
  icon?: BfDsIconType | undefined;
  color?: string;
};

export function Pill(
  { label, text, color = "fourtharyColor", icon }: Props,
) {
  return (
    <div className="ds-pill" style={{ background: `var(--${color}015)` }}>
      {label && (
        <div className="ds-pillLabel" style={{ color: `var(--${color})` }}>
          {label}
        </div>
      )}
      <div
        className="ds-pillContent"
        style={{ borderColor: `var(--${color}015)` }}
      >
        {text}
        {icon && <BfDsIcon color={`var(--${color})`} name={icon} size={12} />}
      </div>
    </div>
  );
}
