import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsRange,
  type RangeBaseProps,
} from "@bfmono/apps/cfDs/components/CfDsRange.tsx";

export function CfDsFormRange(
  { id, title, min = 0, max = 100, step = 1, ...props }:
    & CfDsFormElementProps
    & RangeBaseProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsRange
      {...props}
      label={title}
      name={id}
      min={min}
      max={max}
      step={step}
      value={Number(data[id as keyof typeof data]) || 0}
      onChange={(value) => onChange?.({ ...data, [id]: value })}
    />
  );
}
