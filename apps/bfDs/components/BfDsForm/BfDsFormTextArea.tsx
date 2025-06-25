import {
  type BfDsFormElementProps,
  useBfDsFormContext,
} from "@bfmono/apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import {
  BfDsTextArea,
  type TextAreaProps,
} from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";

export function BfDsFormTextArea(
  { id, title, ...props }: BfDsFormElementProps & TextAreaProps,
) {
  const { data, onChange } = useBfDsFormContext();
  if (!data) return null;
  return (
    <BfDsTextArea
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
