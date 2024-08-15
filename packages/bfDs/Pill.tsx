import { React } from "deps.ts";

type Props = {
  label?: string;
  text: string | number;
};

export function Pill({ label, text }: Props) {
  return (
    <div className="ds-pill">
      {label && <div className="ds-pillLabel">{label}</div>}
      <div className="ds-pillContent">{text}</div>
    </div>
  );
}
