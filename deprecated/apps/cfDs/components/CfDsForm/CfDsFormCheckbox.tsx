import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsCheckbox,
  type CheckboxBaseProps,
} from "@bfmono/apps/cfDs/components/CfDsCheckbox.tsx";

export function CfDsFormCheckbox(
  { id, title, ...props }: CfDsFormElementProps & CheckboxBaseProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsCheckbox
      {...props}
      label={title}
      name={id}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] === true}
      onChange={(checked) => onChange?.({ ...data, [id]: checked })}
    />
  );
}
