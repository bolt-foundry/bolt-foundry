import type { BfDsIconType } from "packages/bfDs/BfDsIcon.tsx";
import { BfDsIcon } from "packages/bfDs/BfDsIcon.tsx";

type Props = {
  label?: string;
  text?: string | number;
  textIcon?: BfDsIconType;
  color?: string;
};

export function Pill(
  { label, text, color = "fourtharyColor", textIcon }: Props,
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
        {textIcon && (
          <BfDsIcon color={`var(--${color})`} name={textIcon} size={12} />
        )}
      </div>
    </div>
  );
}
