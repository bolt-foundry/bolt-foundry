import {
  type BfDsFormElementProps,
  useBfDsFormContext,
} from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import {
  BfDsDropdownSelector,
  type DropdownSelectorProps,
} from "apps/bfDs/components/BfDsDropdownSelector.tsx";

export function BfDsFormDropdownSelector(
  { id, title, ...props }: BfDsFormElementProps & DropdownSelectorProps,
) {
  const { data, onChange } = useBfDsFormContext();
  if (!data) return null;
  // @ts-ignore: TODO @george, need to figure out typing
  console.log("title", title, data[id])
  return (
    <BfDsDropdownSelector
      {...props}
      key={id}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] ?? ""}
      onChange={(value: string) =>
        onChange?.({ ...data, [id]: value })}
      placeholder={title}
    />
  );
}
