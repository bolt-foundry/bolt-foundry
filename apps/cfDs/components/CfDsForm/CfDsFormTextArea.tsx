import {
  type CfDsFormElementProps,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsTextArea,
  type TextAreaProps,
} from "@bfmono/apps/cfDs/components/CfDsTextArea.tsx";

export function CfDsFormTextArea(
  { id, title, ...props }: CfDsFormElementProps & TextAreaProps,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsTextArea
      {...props}
      key={id}
      label={title}
      name={id}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] ?? ""}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange?.({ ...data, [id]: event.target.value })}
    />
  );
}
