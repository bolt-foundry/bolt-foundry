import { useCfDsFormContext } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsTagInput,
  type TagInputProps,
} from "@bfmono/apps/cfDs/components/CfDsTagInput.tsx";

type Props = { id: string; title: string } & TagInputProps;

export function CfDsFormTagInput(
  { id, title, ...props }: Props,
) {
  const { data, onChange } = useCfDsFormContext();
  if (!data) return null;
  return (
    <CfDsTagInput
      {...props}
      // @ts-ignore: TODO @george, need to figure out typing
      value={data[id] ?? []}
      onChange={(tags) => onChange?.({ ...data, [id]: tags })}
      label={title}
      name={id}
    />
  );
}
