import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsToggle,
  type ToggleBaseProps,
} from "@bfmono/apps/cfDs/components/CfDsToggle.tsx";

export function CfDsFormToggle(
  { id, title, ...props }: CfDsFormElementProps & ToggleBaseProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsToggle
      {...props}
      label={title}
      name={id}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] === true}
      onChange={(checked) => onChange?.({ ...data, [id]: checked })}
    />
  );
}
