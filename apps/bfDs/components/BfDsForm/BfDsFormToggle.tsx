import {
  type BfDsFormElementProps,
  useBfDsFormContext,
} from "@bfmono/apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import {
  BfDsToggle,
  type ToggleBaseProps,
} from "@bfmono/apps/bfDs/components/BfDsToggle.tsx";

export function BfDsFormToggle(
  { id, title, ...props }: BfDsFormElementProps & ToggleBaseProps,
) {
  const { data, onChange } = useBfDsFormContext();
  if (!data) return null;
  return (
    <BfDsToggle
      {...props}
      label={title}
      name={id}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] === true}
      onChange={(checked) => onChange?.({ ...data, [id]: checked })}
    />
  );
}
