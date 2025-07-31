import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsInput,
  type InputBaseProps,
} from "@bfmono/apps/cfDs/components/CfDsInput.tsx";

export function CfDsFormTextInput(
  { id, title, ...props }: CfDsFormElementProps & InputBaseProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsInput
      {...props}
      label={title}
      type="text"
      name={id}
      id={`bfDsFormInput-${id}`}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.({ ...data, [id]: e.target.value })}
    />
  );
}
