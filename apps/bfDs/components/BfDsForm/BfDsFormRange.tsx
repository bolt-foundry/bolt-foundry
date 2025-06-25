import {
  type BfDsFormElementProps,
  useBfDsFormContext,
} from "@bfmono/apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import {
  BfDsRange,
  type RangeBaseProps,
} from "@bfmono/apps/bfDs/components/BfDsRange.tsx";

export function BfDsFormRange(
  { id, title, min = 0, max = 100, step = 1, ...props }:
    & BfDsFormElementProps
    & RangeBaseProps,
) {
  const { data, onChange } = useBfDsFormContext();
  if (!data) return null;
  return (
    <BfDsRange
      {...props}
      label={title}
      name={id}
      min={min}
      max={max}
      step={step}
      value={Number(data[id]) || 0}
      onChange={(value) => onChange?.({ ...data, [id]: value })}
    />
  );
}
