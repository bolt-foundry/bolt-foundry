import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsDropdownSelector,
  type DropdownSelectorProps,
} from "@bfmono/apps/cfDs/components/CfDsDropdownSelector.tsx";

export function CfDsFormDropdownSelector(
  { id, title, onChange: onValueChange, ...props }:
    & CfDsFormElementProps
    & DropdownSelectorProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsDropdownSelector
      {...props}
      key={id}
      kind="input"
      label={title}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] ?? ""}
      onChange={(value: string) => {
        onValueChange?.(value);
        onChange?.({ ...data, [id]: value });
      }}
    />
  );
}
